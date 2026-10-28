// Trình phát phim. Server và tập đang xem nằm trên tham số màn hình: /phim/xem/ten-phim?server=0&tap=5
// => mở từ "Tiếp tục xem" vẫn vào đúng tập

import { saveHistory } from "@/lib/localStore";
import { clamp, getParam } from "@/lib/utils";
import type { Film, Server } from "@/types/movie";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { WebView, type WebViewNavigation } from "react-native-webview";

const EPISODE_LIMIT = 30;

interface VideoPlayerProps {
  film: Pick<Film, "slug" | "name" | "thumb_url">;
  servers: Server[];
}

export default function VideoPlayer({ film, servers }: VideoPlayerProps) {
  const params = useLocalSearchParams<{ server?: string; tap?: string }>();
  // Trạng thái "xem tất cả" gắn với server hiện tại: đổi server thì tự thu gọn
  const [expandState, setExpandState] = useState({
    server: -1,
    all: false,
  });

  // Tham số sai (VD tap=999) thì tự đưa về giới hạn hợp lệ
  const serverIndex = clamp(
    Number(getParam(params.server)) || 0,
    0,
    servers.length - 1,
  );
  const episodes = servers[serverIndex]?.server_data || [];
  const tap = clamp(Number(getParam(params.tap)) || 1, 1, episodes.length);
  const currentEpisode = episodes[tap - 1];

  const goTo = (server: number, newTap: number) => {
    router.setParams({ server: String(server), tap: String(newTap) });
  };

  // Lưu lại tập đang xem cho mục "Tiếp tục xem" ở trang chủ
  useEffect(() => {
    if (!currentEpisode) return;
    saveHistory({
      slug: film.slug,
      name: film.name,
      thumb_url: film.thumb_url,
      server: serverIndex,
      tap,
      episodeName: currentEpisode.name,
    });
  }, [film.slug, film.name, film.thumb_url, serverIndex, tap, currentEpisode]);

  // Đổi server thì danh sách tự thu gọn (state gắn theo server, không cần effect)
  const showAll = expandState.server === serverIndex && expandState.all;
  const toggleShowAll = () =>
    setExpandState({ server: serverIndex, all: !showAll });

  const indexedEpisodes = episodes.map((episode, index) => ({
    episode,
    index,
  }));
  const isLongList = episodes.length > EPISODE_LIMIT;
  let visibleEpisodes = indexedEpisodes;
  if (isLongList && !showAll) {
    visibleEpisodes = indexedEpisodes.slice(0, EPISODE_LIMIT);
    // Luôn hiện tập đang xem dù nằm ngoài phần thu gọn
    if (tap > EPISODE_LIMIT) visibleEpisodes.push(indexedEpisodes[tap - 1]);
  }

  if (!currentEpisode) {
    return (
      <Text className="py-20 text-center font-display text-xl text-white">
        Phim hiện chưa có tập nào, vui lòng quay lại sau !!
      </Text>
    );
  }

  // Trang nhúng phim hay có quảng cáo tự chuyển sang trang khác.
  // Chỉ cho khung chính mở link cùng tên miền với link phim
  const embedOrigin = new URL(currentEpisode.link_embed).origin;
  const allowNavigation = (
    request: WebViewNavigation & { isTopFrame?: boolean },
  ) => {
    return (
      request.isTopFrame === false ||
      request.url === "about:blank" ||
      request.url.startsWith(embedOrigin)
    );
  };

  const navButtonClass =
    "flex-row items-center gap-2 rounded bg-gray-700 px-4 py-2 active:bg-red-700";

  return (
    <View>
      {/* key: đổi tập thì tạo WebView mới. Rời màn hình thì WebView bị huỷ nên phim tự tắt tiếng */}
      <WebView
        key={currentEpisode.link_embed}
        source={{ uri: currentEpisode.link_embed }}
        className="w-full bg-black"
        style={{ minHeight: 400 }}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={allowNavigation}
      />

      <View className="mt-3 flex-row items-center justify-between gap-2 px-4">
        <Pressable
          onPress={() => goTo(serverIndex, tap - 1)}
          disabled={tap <= 1}
          className={`${navButtonClass} ${tap <= 1 ? "opacity-40" : ""}`}
        >
          <Ionicons name="play-skip-back" size={14} color="white" />
          <Text className="text-sm font-bold text-white">Tập trước</Text>
        </Pressable>
        <Text
          className="flex-1 text-center text-sm font-bold text-white"
          numberOfLines={1}
        >
          Tập {currentEpisode.name}
        </Text>
        <Pressable
          onPress={() => goTo(serverIndex, tap + 1)}
          disabled={tap >= episodes.length}
          className={`${navButtonClass} ${tap >= episodes.length ? "opacity-40" : ""}`}
        >
          <Text className="text-sm font-bold text-white">Tập tiếp</Text>
          <Ionicons name="play-skip-forward" size={14} color="white" />
        </Pressable>
      </View>

      <View className="mx-4 mt-3 border border-white p-3">
        <Text className="text-sm font-bold text-white">Server :</Text>
        <View className="mt-2 flex-row flex-wrap gap-2">
          {servers.map((server, index) => (
            <Pressable
              key={server.server_name}
              onPress={() => goTo(index, 1)}
              className={`px-4 py-1 active:opacity-70 ${index === serverIndex ? "bg-steel" : "bg-gray-700"}`}
            >
              <Text className="text-sm font-bold text-white">
                {server.server_name}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="mt-3 text-sm font-bold text-white">
          Danh sách tập phim ({episodes.length} tập) :
        </Text>
        <View className="mt-2 flex-row flex-wrap gap-2">
          {visibleEpisodes.map(({ episode, index }) => (
            <Pressable
              key={episode.slug}
              onPress={() => goTo(serverIndex, index + 1)}
              className={`rounded-md border-2 border-red-700 px-3 py-1 active:opacity-70 ${index + 1 === tap ? "bg-red-600" : ""}`}
            >
              <Text className="text-xs font-bold text-white">
                Tập {episode.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {isLongList && (
          <Pressable
            onPress={toggleShowAll}
            className="mt-3 flex-row items-center justify-center gap-1 self-center rounded bg-gray-700 px-4 py-2 active:bg-red-700"
          >
            <Text className="text-sm font-bold text-white">
              {showAll
                ? "Thu gọn"
                : `Xem thêm ${episodes.length - EPISODE_LIMIT} tập`}
            </Text>
            <Ionicons
              name={showAll ? "chevron-up" : "chevron-down"}
              size={14}
              color="white"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}
