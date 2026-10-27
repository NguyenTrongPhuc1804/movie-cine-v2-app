// Nút ❤ thêm/bỏ phim yêu thích, lưu trong máy (xem lib/localStore.ts)

import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { FAVORITE_KEY, toggleFavorite, useStoredList } from "@/lib/localStore";
import type { Film } from "@/types/movie";

interface FavoriteButtonProps {
  film: Film;
  showText?: boolean; // true: nút to có chữ (màn chi tiết), false: chỉ icon (FilmCard)
}

export default function FavoriteButton({ film, showText = false }: FavoriteButtonProps) {
  const favorites = useStoredList<Film>(FAVORITE_KEY);
  const isFavorite = favorites.some((item) => item.slug === film.slug);
  const label = isFavorite ? "Bỏ yêu thích" : "Yêu thích";
  const icon = (
    <Ionicons
      name={isFavorite ? "heart" : "heart-outline"}
      size={showText ? 16 : 18}
      color={isFavorite ? "#ef4444" : "white"}
    />
  );

  if (!showText) {
    return (
      <Pressable
        onPress={() => toggleFavorite(film)}
        accessibilityLabel={label}
        hitSlop={8}
        className="absolute right-2 top-2 z-20 rounded-full bg-black/60 p-2 active:bg-black/90"
      >
        {icon}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => toggleFavorite(film)}
      accessibilityLabel={label}
      className="flex-row items-center gap-2 border-2 border-white px-5 py-[10px] active:bg-white/20"
    >
      {icon}
      <Text className="text-sm font-bold uppercase text-white">{label}</Text>
    </Pressable>
  );
}
