// Danh sách phim yêu thích, đọc từ bộ nhớ máy

import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import FilmCard from "@/components/FilmCard";
import SectionTitle from "@/components/SectionTitle";
import { FAVORITE_KEY, useStoredList } from "@/lib/localStore";
import type { Film } from "@/types/movie";

export default function FavoritesScreen() {
  const favorites = useStoredList<Film>(FAVORITE_KEY);

  return (
    <FlatList
      className="flex-1 bg-page"
      contentContainerClassName="px-4 pb-28"
      contentContainerStyle={{ gap: 12 }}
      columnWrapperClassName="justify-between"
      data={favorites}
      numColumns={2}
      keyExtractor={(film) => film.slug}
      ListHeaderComponent={<SectionTitle title="Phim yêu thích" />}
      renderItem={({ item }) => <FilmCard film={item} className="w-[48.5%]" />}
      ListEmptyComponent={
        <View className="py-10">
          <Text className="font-display text-xl text-white">Bạn chưa có phim yêu thích nào.</Text>
          <Text className="mt-2 text-gray-400">Bấm vào biểu tượng ❤ trên mỗi phim để lưu lại xem sau.</Text>
          <View className="mt-5 flex-row">
            <Pressable onPress={() => router.navigate("/")} className="rounded bg-red-700 px-6 py-2 active:bg-red-800">
              <Text className="font-bold text-white">Khám phá phim</Text>
            </Pressable>
          </View>
        </View>
      }
    />
  );
}
