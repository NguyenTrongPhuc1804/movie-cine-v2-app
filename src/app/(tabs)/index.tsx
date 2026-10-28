// Trang chủ: banner phim mới, Tiếp tục xem, các hàng phim
// Banner và các hàng phim tải riêng => banner có là hiện ngay, không chờ hết danh sách (giống Suspense bên web)

import BannerSlider from "@/components/BannerSlider";
import ContinueWatching from "@/components/ContinueWatching";
import ErrorView from "@/components/ErrorView";
import FilmSlider from "@/components/FilmSlider";
import SectionTitle from "@/components/SectionTitle";
import { BannerSkeleton, RowSkeleton } from "@/components/Skeletons";
import { useApi } from "@/hooks/useApi";
import { getDetailFilm, getListFilm, getNewFilms } from "@/lib/api";
import type { FilmDetail } from "@/types/movie";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Số phim mới nhất đưa lên banner
const BANNER_COUNT = 5;

// Banner cần nội dung, thời lượng... nên phải lấy chi tiết từng phim
async function loadBannerFilms() {
  const newFilms = await getNewFilms();
  const slugs = newFilms.items.slice(0, BANNER_COUNT).map((film) => film.slug);
  const details = await Promise.all(slugs.map((slug) => getDetailFilm(slug)));
  return details.filter((film): film is FilmDetail => film !== null);
}

async function loadSections() {
  const [newFilms, phimLe, phimBo, hoatHinh] = await Promise.all([
    getNewFilms(),
    getListFilm("phim-le"),
    getListFilm("phim-bo"),
    getListFilm("hoat-hinh"),
  ]);
  return [
    // Phim đã lên banner thì không lặp lại ở hàng "Phim mới"
    {
      title: "Phim Mới Cập Nhật",
      href: "/phim/list/phim-moi",
      films: newFilms.items.slice(BANNER_COUNT),
    },
    { title: "Phim Lẻ", href: "/phim/list/phim-le", films: phimLe.items },
    { title: "Phim Bộ", href: "/phim/list/phim-bo", films: phimBo.items },
    {
      title: "Phim Hoạt Hình",
      href: "/phim/list/hoat-hinh",
      films: hoatHinh.items,
    },
  ] as const;
}

// Header trong suốt trên banner, kéo xuống thì nền đặc để logo vẫn rõ
function HomeHeader({ solid }: { solid: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: insets.top }}
      className={`absolute inset-x-0 top-0 ${solid ? "bg-bar" : ""}`}
    >
      {!solid && (
        <LinearGradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          className="absolute inset-0"
        />
      )}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Image
          source={require("@/assets/images/logo-ultra.png")}
          contentFit="contain"
          className="h-12 w-12 rounded-xl"
        />
        <Link href="/search" asChild>
          <Pressable hitSlop={10} accessibilityLabel="Tìm kiếm">
            <Ionicons name="search" size={24} color="white" />
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [scrolled, setScrolled] = useState(false);
  const banner = useApi(loadBannerFilms, []);
  const sections = useApi(loadSections, []);
  const refreshing = banner.loading || sections.loading;

  const onRefresh = () => {
    banner.reload();
    sections.reload();
  };

  return (
    <View className="flex-1">
      <ScrollView
        scrollEventThrottle={16}
        onScroll={(event) =>
          setScrolled(event.nativeEvent.contentOffset.y > 24)
        }
        // Kéo xuống khi đang ở đầu trang để tải lại banner + danh sách
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ef4444"
            colors={["#ef4444"]}
            progressBackgroundColor="#141212"
          />
        }
      >
        {banner.data ? (
          banner.data.length > 0 && <BannerSlider films={banner.data} />
        ) : banner.error ? (
          <ErrorView message={banner.error} onRetry={banner.reload} />
        ) : (
          <BannerSkeleton />
        )}

        <View className="px-4 pb-28">
          <ContinueWatching />

          {sections.data ? (
            sections.data.map((section) => (
              <View key={section.href} className="mt-6">
                <SectionTitle
                  title={section.title}
                  viewAllHref={section.href}
                />
                <FilmSlider films={section.films} />
              </View>
            ))
          ) : sections.error ? (
            <ErrorView message={sections.error} onRetry={sections.reload} />
          ) : (
            <View className="mt-6 gap-6">
              <RowSkeleton />
              <RowSkeleton />
            </View>
          )}
        </View>
      </ScrollView>

      <HomeHeader solid={scrolled} />
    </View>
  );
}
