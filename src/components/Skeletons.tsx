// Khung xám nhấp nháy hiện trong lúc chờ API (giống các file *Skeleton.tsx bên web)

import { useEffect, useState } from "react";
import { Animated, useWindowDimensions, View } from "react-native";

// Khối xám cơ bản. Ghép nhiều khối lại thành skeleton của từng màn hình
export function SkeletonBox({ className = "" }: { className?: string }) {
  return <View className={`rounded bg-white/10 ${className}`} />;
}

// Bọc ngoài để cả khung nhấp nháy (thay cho animate-pulse của web)
function Pulse({ children }: { children: React.ReactNode }) {
  // Tạo giá trị animation 1 lần duy nhất khi component xuất hiện
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
}

export function BannerSkeleton() {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.55;
  const cardHeight = cardWidth * 1.5;
  return (
    <Pulse>
      <View className="items-center bg-[#2a2727] pb-5 pt-20">
        <SkeletonBox className="mb-5 h-7 w-40 bg-white/15" />
        <View
          style={{ width: cardWidth * 0.92, height: cardHeight }}
          className="rounded-2xl bg-white/15"
        />
        <SkeletonBox className="mt-5 h-1 w-[80%]" />
      </View>
    </Pulse>
  );
}

export function RowSkeleton() {
  return (
    <Pulse>
      <SkeletonBox className="my-4 h-7 w-48 bg-white/15" />
      <View className="flex-row gap-3 overflow-hidden">
        {[0, 1, 2].map((index) => (
          <SkeletonBox key={index} className="aspect-[2/3] w-36 rounded-2xl" />
        ))}
      </View>
    </Pulse>
  );
}

export function GridSkeleton() {
  return (
    <Pulse>
      <View className="flex-row flex-wrap justify-between gap-y-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <SkeletonBox
            key={index}
            className="aspect-[2/3] w-[48.5%] rounded-2xl"
          />
        ))}
      </View>
    </Pulse>
  );
}

export function DetailSkeleton() {
  const { height } = useWindowDimensions();
  return (
    <Pulse>
      <View
        style={{ paddingTop: height * 0.4 }}
        className="bg-[#2a2727] px-4 pb-8"
      >
        <SkeletonBox className="h-10 w-2/3" />
        <SkeletonBox className="mt-3 h-6 w-1/3" />
        <View className="my-5 flex-row gap-2">
          <SkeletonBox className="h-8 w-24 rounded-full" />
          <SkeletonBox className="h-8 w-28 rounded-full" />
        </View>
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="mt-2 h-4 w-full" />
        <SkeletonBox className="mt-2 h-4 w-2/3" />
        <View className="mt-5 gap-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <SkeletonBox key={index} className="h-4 w-3/5" />
          ))}
        </View>
        <View className="mt-5 flex-row gap-2">
          <SkeletonBox className="h-11 w-32 bg-white/15" />
          <SkeletonBox className="h-11 w-28" />
        </View>
      </View>
    </Pulse>
  );
}

export function WatchSkeleton() {
  return (
    <Pulse>
      <SkeletonBox className="aspect-video w-full rounded-none" />
      <View className="px-4">
        <View className="mt-3 flex-row justify-between">
          <SkeletonBox className="h-10 w-28" />
          <SkeletonBox className="h-10 w-28" />
        </View>
        <SkeletonBox className="mt-5 h-5 w-24" />
        <View className="mt-3 flex-row flex-wrap gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
            <SkeletonBox key={index} className="h-8 w-16" />
          ))}
        </View>
        <SkeletonBox className="mt-6 h-9 w-2/3 bg-white/15" />
        <SkeletonBox className="mt-2 h-5 w-1/3" />
      </View>
    </Pulse>
  );
}
