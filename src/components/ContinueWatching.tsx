// Hàng "Tiếp tục xem" ở trang chủ, lấy từ lịch sử xem lưu trong máy
// Chưa xem phim nào thì không hiện gì

import {
    HISTORY_KEY,
    removeHistory,
    useStoredList,
    type WatchHistoryItem,
} from "@/lib/localStore";
import { imageSource } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import {
    FlatList,
    Pressable,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import SectionTitle from "./SectionTitle";

const CARDS_PER_SCREEN = 2.3;
const GAP = 12;

export default function ContinueWatching() {
  const history = useStoredList<WatchHistoryItem>(HISTORY_KEY);
  const { width } = useWindowDimensions();
  const cardWidth = (width - 16 - GAP * 2) / CARDS_PER_SCREEN;

  if (history.length === 0) return null;

  return (
    <View className="mt-6">
      <SectionTitle title="Tiếp tục xem" />
      <FlatList
        horizontal
        data={history}
        keyExtractor={(item) => item.slug}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: GAP, paddingRight: 16 }}
        renderItem={({ item }) => (
          <View
            style={{ width: cardWidth }}
            className="aspect-[2/3] overflow-hidden rounded-md"
          >
            <Link
              href={`/phim/xem/${item.slug}?server=${item.server}&tap=${item.tap}`}
              asChild
            >
              <Pressable className="flex-1 active:opacity-80">
                <Image
                  source={imageSource(item.thumb_url)}
                  contentFit="cover"
                  className="absolute inset-0"
                />
                <LinearGradient
                  colors={["transparent", "rgba(17,24,39,0.95)"]}
                  className="absolute inset-0"
                />
                <View className="absolute inset-0 items-center justify-center">
                  <View className="rounded-full bg-red-600/90 p-4">
                    <Ionicons name="play" size={18} color="white" />
                  </View>
                </View>
                <View className="absolute bottom-0 w-full p-2">
                  <Text
                    className="font-display text-sm text-white"
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-xs text-red-400">
                    Đang xem: Tập {item.episodeName}
                  </Text>
                </View>
              </Pressable>
            </Link>

            <Pressable
              onPress={() => removeHistory(item.slug)}
              accessibilityLabel={`Xoá ${item.name} khỏi lịch sử`}
              hitSlop={8}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-2 active:bg-black/90"
            >
              <Ionicons name="close" size={16} color="white" />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
