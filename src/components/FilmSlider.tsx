// Hàng phim vuốt ngang (bản web dùng Swiper)

import { FlatList, Text, useWindowDimensions, View } from "react-native";
import FilmCard from "./FilmCard";
import type { Film } from "@/types/movie";

// Số lẻ để card cuối bị cắt ở mép => người dùng biết còn phim để vuốt
const CARDS_PER_SCREEN = 2.3;
const GAP = 12;
// Lề trái của màn hình (px-4 = 16)
const SCREEN_PADDING = 16;

export default function FilmSlider({ films }: { films: Film[] }) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - SCREEN_PADDING - GAP * 2) / CARDS_PER_SCREEN;

  if (films.length === 0) {
    return <Text className="text-white">Chưa có phim.</Text>;
  }

  return (
    <FlatList
      horizontal
      data={films}
      keyExtractor={(film) => film.slug}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: GAP, paddingRight: SCREEN_PADDING }}
      renderItem={({ item }) => (
        <View style={{ width: cardWidth }}>
          <FilmCard film={item} />
        </View>
      )}
    />
  );
}
