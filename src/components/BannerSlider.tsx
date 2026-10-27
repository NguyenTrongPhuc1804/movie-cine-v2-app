// Banner triple slider: poster dọc giữa nổi, info trong card + progress + autoplay

import type { FilmDetail } from "@/types/movie";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BannerCard from "./BannerCard";

const AUTOPLAY_DELAY = 8000;
const CARD_RATIO = 0.55;
const CARD_ASPECT = 1.5;

function ProgressSegment({
  segmentIndex,
  activeIndex,
  progress,
  onPress,
}: {
  segmentIndex: number;
  activeIndex: number;
  progress: SharedValue<number>;
  onPress: () => void;
}) {
  const fillStyle = useAnimatedStyle(() => {
    let fill = 0;
    if (segmentIndex < activeIndex) fill = 1;
    else if (segmentIndex === activeIndex) fill = progress.value;
    return { width: `${fill * 100}%` };
  });

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
    >
      <Animated.View
        className="h-full rounded-full bg-brand"
        style={fillStyle}
      />
    </Pressable>
  );
}

export default function BannerSlider({ films }: { films: FilmDetail[] }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef<Animated.FlatList<FilmDetail>>(null);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  // Card đang ở tâm, đổi ngay khi vuốt qua nửa đường để card giữa luôn nằm trên
  const [centerIndex, setCenterIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const centerShared = useSharedValue(0);
  const progress = useSharedValue(0);

  const cardWidth = width * CARD_RATIO;
  const cardHeight = cardWidth * CARD_ASPECT;
  const sidePad = (width - cardWidth) / 2;

  const goTo = useCallback(
    (next: number) => {
      listRef.current?.scrollToOffset({
        offset: next * cardWidth,
        animated: true,
      });
      indexRef.current = next;
      setIndex(next);
    },
    [cardWidth],
  );

  const advance = useCallback(() => {
    const next =
      indexRef.current + 1 >= films.length ? 0 : indexRef.current + 1;
    goTo(next);
  }, [films.length, goTo]);

  useEffect(() => {
    if (films.length <= 1) return;
    cancelAnimation(progress);
    progress.value = 0;
    progress.value = withTiming(
      1,
      { duration: AUTOPLAY_DELAY, easing: Easing.linear },
      (finished) => {
        if (finished) runOnJS(advance)();
      },
    );
    return () => cancelAnimation(progress);
  }, [index, films.length, progress, advance]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const center = Math.round(event.contentOffset.x / cardWidth);
      if (center !== centerShared.value) {
        centerShared.value = center;
        runOnJS(setCenterIndex)(center);
      }
    },
  });

  return (
    <View style={{ paddingTop: insets.top + 56, paddingBottom: 20 }}>
      {/* Nền blur đã chuyển lên HomeScreen (một ảnh tĩnh dùng cho cả màn),
          ở đây để trong suốt cho nền đó lộ qua -> banner và phần dưới cùng một hệ nền. */}

      <Text className="mb-5 px-6 text-center font-display text-2xl uppercase tracking-wide text-white">
        Phim <Text className="text-brand">Mới</Text>
      </Text>

      <Animated.FlatList
        ref={listRef}
        horizontal
        data={films}
        keyExtractor={(film) => film.slug}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth}
        decelerationRate="fast"
        disableIntervalMomentum
        bounces={false}
        removeClippedSubviews={false}
        style={{ overflow: "visible" }}
        contentContainerStyle={{ paddingHorizontal: sidePad }}
        scrollEventThrottle={16}
        onScroll={onScroll}
        getItemLayout={(_, i) => ({
          length: cardWidth,
          offset: cardWidth * i,
          index: i,
        })}
        onMomentumScrollEnd={(event) => {
          const next = Math.round(
            event.nativeEvent.contentOffset.x / cardWidth,
          );
          const clamped = Math.max(0, Math.min(next, films.length - 1));
          indexRef.current = clamped;
          setIndex(clamped);
        }}
        renderItem={({ item, index: itemIndex }) => (
          <BannerCard
            film={item}
            index={itemIndex}
            scrollX={scrollX}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            active={itemIndex === index}
          />
        )}
        extraData={centerIndex}
        // Thứ tự lớp phải đặt trên cell; elevation cần cho Android
        CellRendererComponentStyle={({ index: cellIndex }) => {
          const layer =
            cellIndex === centerIndex
              ? 100
              : 10 - Math.abs(cellIndex - centerIndex);
          return { zIndex: layer, elevation: layer };
        }}
      />

      {/* <View className="mt-5 flex-row gap-1.5 px-8">
        {films.map((film, segmentIndex) => (
          <ProgressSegment
            key={film.slug}
            segmentIndex={segmentIndex}
            activeIndex={index}
            progress={progress}
            onPress={() => goTo(segmentIndex)}
          />
        ))}
      </View> */}
    </View>
  );
}
