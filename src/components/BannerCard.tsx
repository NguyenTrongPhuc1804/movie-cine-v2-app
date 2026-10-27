// Poster triple slider: card giữa nổi, info nằm trong poster

import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { imageSource } from "@/lib/utils";
import type { FilmDetail } from "@/types/movie";

interface BannerCardProps {
  film: FilmDetail;
  index: number;
  scrollX: SharedValue<number>;
  cardWidth: number;
  cardHeight: number;
  active: boolean;
}

export default function BannerCard({ film, index, scrollX, cardWidth, cardHeight, active }: BannerCardProps) {
  const infoOpacity = useSharedValue(0);
  const infoY = useSharedValue(12);

  useEffect(() => {
    if (active) {
      infoOpacity.value = 0;
      infoY.value = 12;
      infoOpacity.value = withDelay(60, withTiming(1, { duration: 320 }));
      infoY.value = withDelay(60, withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) }));
    } else {
      infoOpacity.value = withTiming(0, { duration: 160 });
      infoY.value = withTiming(12, { duration: 160 });
    }
  }, [active, infoOpacity, infoY]);

  const cardStyle = useAnimatedStyle(() => {
    const range = [(index - 1) * cardWidth, index * cardWidth, (index + 1) * cardWidth];
    const scale = interpolate(scrollX.value, range, [0.8, 1, 0.8], Extrapolation.CLAMP);
    // Kéo sát vào giữa: ~50% bề rộng card bên bị che dưới card giữa
    const translateX = interpolate(scrollX.value, range, [-cardWidth * 0.54, 0, cardWidth * 0.54], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, range, [0.85, 1, 0.85], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateX }, { scale }],
    };
  });

  const dimStyle = useAnimatedStyle(() => {
    const range = [(index - 1) * cardWidth, index * cardWidth, (index + 1) * cardWidth];
    return {
      opacity: interpolate(scrollX.value, range, [0.45, 0, 0.45], Extrapolation.CLAMP),
    };
  });

  const infoStyle = useAnimatedStyle(() => ({
    opacity: infoOpacity.value,
    transform: [{ translateY: infoY.value }],
  }));

  const meta = [film.time, film.quality, film.lang].filter(Boolean).join(" · ");

  return (
    <View
      style={{
        width: cardWidth,
        height: cardHeight,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={[
          {
            width: cardWidth * 0.92,
            height: cardHeight,
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: "#221f1f",
            shadowColor: "#000",
            shadowOpacity: 0.45,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 10 },
          },
          cardStyle,
        ]}
      >
        <Image source={imageSource(film.thumb_url)} contentFit="cover" style={{ width: "100%", height: "100%" }} />

        <Animated.View
          pointerEvents="none"
          style={[{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "#000" }, dimStyle]}
        />

        {/* Info chỉ hiện trên card đang active, nằm trong poster */}
        <Animated.View
          pointerEvents={active ? "box-none" : "none"}
          style={[{ position: "absolute", left: 0, right: 0, bottom: 0 }, infoStyle]}
        >
          <LinearGradient colors={["transparent", "rgba(0,0,0,0.85)"]} className="px-3.5 pb-3.5 pt-16">
            <View className="flex-row items-center gap-2">
              <Text className="flex-1 font-display text-base leading-tight text-white" numberOfLines={2}>
                {film.name}
              </Text>
              {film.rating > 0 && (
                <View className="flex-row items-center gap-1 rounded-full bg-white/15 px-2 py-1">
                  <Ionicons name="star" size={11} color="#facc15" />
                  <Text className="text-xs font-semibold text-white">{film.rating.toFixed(1)}</Text>
                </View>
              )}
            </View>

            <View className="mt-2 flex-row items-center justify-between gap-2">
              <Text className="flex-1 text-[11px] text-gray-300" numberOfLines={1}>
                {meta || (film.year ? String(film.year) : "")}
              </Text>
              <Pressable
                onPress={() => router.push(`/phim/xem/${film.slug}`)}
                className="flex-row items-center gap-1 rounded-full bg-brand px-3 py-1.5 active:opacity-80"
              >
                <Ionicons name="play" size={11} color="white" />
                <Text className="text-[11px] font-bold uppercase text-white">Xem</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
