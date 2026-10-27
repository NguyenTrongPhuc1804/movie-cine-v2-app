// Xem phim: trình phát, chọn server / tập, nội dung, tags và gợi ý phim
// Rời màn hình này thì WebView bị huỷ nên video tự dừng, không còn tiếng

import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import ErrorView from "@/components/ErrorView";
import ExpandableText from "@/components/ExpandableText";
import FilmSlider from "@/components/FilmSlider";
import SectionTitle from "@/components/SectionTitle";
import { WatchSkeleton } from "@/components/Skeletons";
import VideoPlayer from "@/components/VideoPlayer";
import { useApi } from "@/hooks/useApi";
import { getDetailFilm, getFilmsByCategory, getNewFilms } from "@/lib/api";
import { getMainCategorySlug, hasOriginName, stripHtml } from "@/lib/movieAdapter";
import { getParam } from "@/lib/utils";

async function loadWatch(slug: string) {
  const film = await getDetailFilm(slug);
  if (!film) return null;
  const [relatedFilms, newFilms] = await Promise.all([getFilmsByCategory(getMainCategorySlug(film)), getNewFilms()]);
  return { film, relatedFilms: relatedFilms.items, newFilms: newFilms.items };
}

export default function WatchFilmScreen() {
  const params = useLocalSearchParams<{ name: string }>();
  const slug = getParam(params.name);
  const { data, loading, error, reload } = useApi(() => loadWatch(slug), [slug]);

  if (error) return <ErrorView message={error} onRetry={reload} />;
  if (loading && !data) return <WatchSkeleton />;
  if (!data) return <ErrorView message="Không tìm thấy phim" />;

  const { film, relatedFilms, newFilms } = data;

  return (
    <ScrollView className="flex-1 bg-page">
      <Stack.Screen options={{ title: film.name }} />

      <VideoPlayer film={{ slug: film.slug, name: film.name, thumb_url: film.thumb_url }} servers={film.episodes} />

      <View className="px-4 pb-10">
        <Text className="mt-5 py-2 font-display text-3xl text-white">{film.name}</Text>
        {hasOriginName(film) && <Text className="text-lg font-bold text-red-700">{film.origin_name}</Text>}

        <View className="mt-5 border border-gray-500 p-5">
          <Text className="mb-1 text-lg font-bold text-white">Nội dung phim :</Text>
          <ExpandableText text={stripHtml(film.content)} />

          <Text className="mb-2 mt-5 font-bold text-white">Tags</Text>
          <View className="flex-row flex-wrap gap-2">
            {film.category.map((category) => (
              <Link key={category.slug} href={`/phim/list/${category.slug}`} asChild>
                <Pressable className="bg-black px-3 py-1 active:bg-red-700">
                  <Text className="text-gray-400">{category.name}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        <View className="mt-12">
          <SectionTitle title="Có thể bạn cũng muốn xem" />
          <FilmSlider films={relatedFilms} />
        </View>

        <View className="mt-12">
          <SectionTitle title="Phim mới cập nhật" viewAllHref="/phim/list/phim-moi" />
          <FilmSlider films={newFilms} />
        </View>
      </View>
    </ScrollView>
  );
}
