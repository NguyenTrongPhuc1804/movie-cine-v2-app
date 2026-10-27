// Khám phá: danh sách phim, thể loại, quốc gia (bên web nằm trên menu Header và 2 dropdown)

import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import ErrorView from "@/components/ErrorView";
import SectionTitle from "@/components/SectionTitle";
import { RowSkeleton } from "@/components/Skeletons";
import { useApi } from "@/hooks/useApi";
import { getAllCategories, getAllCountries } from "@/lib/api";
import { LIST_TITLES } from "@/lib/lists";
import type { MenuItem } from "@/types/movie";

const loadMenus = () => Promise.all([getAllCategories(), getAllCountries()]);

function MenuChips({ items, basePath }: { items: MenuItem[]; basePath: string }) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {items.map((item) => (
        <Link key={item.slug} href={`${basePath}/${item.slug}`} asChild>
          <Pressable className="rounded-full border border-gray-500 bg-card px-4 py-2 active:border-red-600 active:bg-red-600">
            <Text className="text-sm font-semibold text-white">{item.name}</Text>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

export default function BrowseScreen() {
  const { data, error, reload } = useApi(loadMenus, []);

  return (
    <ScrollView className="flex-1 bg-page" contentContainerClassName="px-4 pb-28">
      <SectionTitle title="Danh sách phim" />
      <View className="flex-row flex-wrap justify-between gap-y-3">
        {Object.entries(LIST_TITLES).map(([slug, title]) => (
          <Link key={slug} href={`/phim/list/${slug}`} asChild>
            <Pressable className="w-[48.5%] items-center rounded-md bg-brand py-4 active:opacity-80">
              <Text className="font-display text-base text-white">{title}</Text>
            </Pressable>
          </Link>
        ))}
      </View>

      {error ? (
        <ErrorView message={error} onRetry={reload} />
      ) : !data ? (
        <RowSkeleton />
      ) : (
        <>
          <SectionTitle title="Thể loại" />
          <MenuChips items={data[0]} basePath="/phim/list" />

          <SectionTitle title="Quốc gia" />
          <MenuChips items={data[1]} basePath="/phim/list/country" />
        </>
      )}
    </ScrollView>
  );
}
