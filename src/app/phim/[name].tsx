// Chi tiết phim: poster, thông tin, nút Xem ngay / Trailer / Yêu thích, trailer và phim liên quan

import Button from "@/components/Button";
import ErrorView from "@/components/ErrorView";
import FavoriteButton from "@/components/FavoriteButton";
import FilmSlider from "@/components/FilmSlider";
import SectionTitle from "@/components/SectionTitle";
import { DetailSkeleton } from "@/components/Skeletons";
import TrailerPlayer from "@/components/TrailerPlayer";
import { useApi } from "@/hooks/useApi";
import { getDetailFilm, getFilmsByCategory } from "@/lib/api";
import {
  getMainCategorySlug,
  getYoutubeId,
  hasOriginName,
  stripHtml,
  toFilmSummary,
} from "@/lib/movieAdapter";
import { getParam, imageSource } from "@/lib/utils";
import type { Film, FilmDetail } from "@/types/movie";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

// Trả null khi không có phim để màn hình hiện "Không tìm thấy phim"
async function loadDetail(slug: string) {
  const film = await getDetailFilm(slug);
  if (!film) return null;
  const relatedFilms = await getFilmsByCategory(getMainCategorySlug(film));
  return { film, relatedFilms: relatedFilms.items };
}

export default function FilmDetailScreen() {
  const params = useLocalSearchParams<{ name: string }>();
  const slug = getParam(params.name);
  const { data, loading, error, reload } = useApi(
    () => loadDetail(slug),
    [slug],
  );

  if (error) return <ErrorView message={error} onRetry={reload} />;
  if (loading && !data) return <DetailSkeleton />;
  if (!data) return <ErrorView message="Không tìm thấy phim" />;

  return (
    <FilmDetailContent film={data.film} relatedFilms={data.relatedFilms} />
  );
}

function FilmDetailContent({
  film,
  relatedFilms,
}: {
  film: FilmDetail;
  relatedFilms: Film[];
}) {
  const { height } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  // Vị trí khu Trailer, dùng cho nút "Trailer" cuộn xuống (thay cho href="#trailer" bên web)
  const [trailerY, setTrailerY] = useState(0);

  const youtubeId = getYoutubeId(film.trailer_url);
  const isTrailer = film.status === "trailer" || film.episodes.length === 0;

  const infoRows = [
    { label: "Trạng thái", value: film.episode_current },
    { label: "Năm sản xuất", value: film.year },
    { label: "Thời lượng", value: film.time },
    { label: "Chất lượng", value: `${film.quality} ${film.lang}` },
    { label: "Đạo diễn", value: film.director.join(", ") },
    { label: "Quốc gia", value: film.country.map((c) => c.name).join(", ") },
    { label: "Lượt xem", value: film.view },
  ];

  return (
    <ScrollView ref={scrollRef} className="flex-1 bg-page">
      <View>
        <Image
          source={imageSource(film.thumb_url)}
          contentFit="cover"
          className="absolute inset-0"
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(24,22,22,0.75)", "#181616"]}
          className="absolute inset-0"
        />

        <View style={{ paddingTop: height * 0.4 }} className="px-4 pb-8">
          <Text className="font-display text-3xl text-white">{film.name}</Text>
          {hasOriginName(film) && (
            <Text className="mt-1 text-lg text-gray-300">
              {film.origin_name}
            </Text>
          )}

          <View className="my-5 flex-row flex-wrap gap-2">
            {film.category.map((category) => (
              <Link
                key={category.slug}
                href={`/phim/list/${category.slug}`}
                asChild
              >
                <Pressable className="rounded-full border-2 border-white px-4 py-1 active:bg-white">
                  <Text className="text-xs font-bold text-white">
                    {category.name}
                  </Text>
                </Pressable>
              </Link>
            ))}
          </View>

          <Text numberOfLines={4} className="mb-4 leading-6 text-white">
            {stripHtml(film.content)}
          </Text>

          <View className="gap-1">
            {infoRows.map((row) => (
              <Text key={row.label} className="font-bold text-white">
                {row.label} :
                <Text className="text-red-500">{`  ${row.value}`}</Text>
              </Text>
            ))}
          </View>

          <Text numberOfLines={1} className="mt-2 text-white">
            <Text className="font-bold">Diễn viên :</Text>{" "}
            {film.actor.slice(0, 4).join(", ")}
          </Text>

          <View className="mt-5 flex-row flex-wrap gap-2">
            {!isTrailer && (
              <Button
                text="Xem ngay"
                icon="play"
                onPress={() => router.push(`/phim/xem/${film.slug}`)}
              />
            )}
            <Button
              text="Trailer"
              color="bg-steel"
              onPress={() =>
                scrollRef.current?.scrollTo({ y: trailerY, animated: true })
              }
            />
            <FavoriteButton film={toFilmSummary(film)} showText />
          </View>
        </View>
      </View>

      <View
        onLayout={(event) => setTrailerY(event.nativeEvent.layout.y)}
        className="px-4 pb-10 pt-6"
      >
        <SectionTitle title="Trailer" />
        {youtubeId ? (
          <TrailerPlayer youtubeId={youtubeId} />
        ) : (
          <Text className="text-xl font-extrabold text-white">
            Phim hiện chưa có trailer. Chúng tôi sẽ thêm trailer sớm nhất có thể
            !!
          </Text>
        )}

        <View className="mt-12">
          <SectionTitle title="Có thể bạn cũng muốn xem" />
          <FilmSlider films={relatedFilms} />
        </View>
      </View>
    </ScrollView>
  );
}
