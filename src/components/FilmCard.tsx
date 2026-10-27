// Thẻ phim dạng ảnh dọc: tên tiếng Việt, tên gốc, điểm, năm, nút ❤
// className: chiều rộng do nơi dùng quyết định, VD "w-36" trong slider hoặc "flex-1" trong lưới

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import FavoriteButton from "./FavoriteButton";
import { hasOriginName } from "@/lib/movieAdapter";
import { imageSource } from "@/lib/utils";
import type { Film } from "@/types/movie";

interface FilmCardProps {
  film: Film;
  className?: string;
}

export default function FilmCard({ film, className = "" }: FilmCardProps) {
  return (
    <View className={`aspect-[2/3] overflow-hidden rounded-md ${className}`}>
      <Link href={`/phim/${film.slug}`} asChild>
        <Pressable className="flex-1 active:opacity-80">
          <Image source={imageSource(film.thumb_url)} contentFit="cover" transition={200} className="absolute inset-0" />
          <LinearGradient colors={["transparent", "rgba(17,24,39,0.95)"]} className="absolute inset-0" />

          <View className="absolute bottom-0 w-full p-2">
            <Text className="font-display text-sm text-white" numberOfLines={2}>
              {film.name}
            </Text>
            {hasOriginName(film) && (
              <Text className="text-[11px] text-gray-300" numberOfLines={1}>
                {film.origin_name}
              </Text>
            )}

            <View className="mt-1 flex-row items-center gap-3">
              {film.rating > 0 && (
                <View className="flex-row items-center gap-1">
                  <Ionicons name="star" size={11} color="#ef4444" />
                  <Text className="text-[11px] text-white">{film.rating.toFixed(1)}</Text>
                </View>
              )}
              {film.year ? (
                <View className="flex-row items-center gap-1">
                  <Ionicons name="calendar" size={11} color="#ef4444" />
                  <Text className="text-[11px] text-white">{film.year}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </Pressable>
      </Link>

      <FavoriteButton film={film} />
    </View>
  );
}
