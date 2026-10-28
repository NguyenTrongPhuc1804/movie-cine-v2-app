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
    <View
      className={`aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-card ${className}`}
    >
      <Link href={`/phim/${film.slug}`} asChild>
        <Pressable className="flex-1 active:opacity-90">
          <Image source={imageSource(film.thumb_url)} contentFit="cover" transition={200} className="absolute inset-0" />
          {/* Gradient đen ấm, bắt đầu thấp hơn để lộ ảnh nhiều hơn */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.72)", "rgba(0,0,0,0.92)"]}
            locations={[0.35, 0.72, 1]}
            className="absolute inset-0"
          />

          <View className="absolute bottom-0 w-full p-2.5">
            <Text className="font-display text-sm leading-tight text-white" numberOfLines={2}>
              {film.name}
            </Text>
            {hasOriginName(film) && (
              <Text className="mt-0.5 text-[11px] text-white/55" numberOfLines={1}>
                {film.origin_name}
              </Text>
            )}

            <View className="mt-1.5 flex-row items-center gap-3">
              {film.rating > 0 && (
                <View className="flex-row items-center gap-1">
                  <Ionicons name="star" size={11} color="#facc15" />
                  <Text className="text-[11px] text-white/80">{film.rating.toFixed(1)}</Text>
                </View>
              )}
              {film.year ? (
                <View className="flex-row items-center gap-1">
                  <Ionicons name="calendar-outline" size={10} color="rgba(255,255,255,0.55)" />
                  <Text className="text-[11px] text-white/60">{film.year}</Text>
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
