// Ô tìm kiếm: gõ từ 2 ký tự sẽ hiện tối đa 5 phim gợi ý, bấm "Tìm" để xem toàn bộ kết quả

import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";
import { searchFilms } from "@/lib/api";
import { hasOriginName } from "@/lib/movieAdapter";
import { imageSource } from "@/lib/utils";
import type { Film } from "@/types/movie";

const MIN_LENGTH = 2;
const MAX_SUGGESTIONS = 5;
const DEBOUNCE_MS = 400; // gõ xong 0.4 giây mới gọi API, tránh gọi liên tục mỗi phím

interface SearchBoxProps {
  initialKeyword?: string; // đang xem kết quả thì điền sẵn từ khoá
  onSubmit: (keyword: string) => void;
}

export default function SearchBox({ initialKeyword = "", onSubmit }: SearchBoxProps) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [suggestions, setSuggestions] = useState<Film[]>([]);
  const [open, setOpen] = useState(false);
  const text = keyword.trim();

  useEffect(() => {
    if (text.length < MIN_LENGTH) return;

    // Gõ phím mới thì bỏ kết quả của lần gọi cũ
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const data = await searchFilms(text);
        if (active) setSuggestions(data.items.slice(0, MAX_SUGGESTIONS));
      } catch {
        // Lỗi mạng khi đang gõ: bỏ qua, không cần báo
      }
    }, DEBOUNCE_MS);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [text]);

  const visibleSuggestions = open && text.length >= MIN_LENGTH ? suggestions : [];

  const submit = () => {
    if (!text) return;
    setOpen(false);
    Keyboard.dismiss();
    onSubmit(text);
  };

  const openFilm = (slug: string) => {
    setOpen(false);
    Keyboard.dismiss();
    router.push(`/phim/${slug}`);
  };

  return (
    <View>
      <View className="flex-row items-center rounded-lg border border-gray-600 bg-gray-700 pl-3">
        <Ionicons name="search" size={18} color="#9ca3af" />
        <TextInput
          value={keyword}
          onChangeText={(value) => {
            setKeyword(value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onSubmitEditing={submit}
          returnKeyType="search"
          placeholder="VD: Nàng tiên cá"
          placeholderTextColor="#9ca3af"
          className="flex-1 px-2 py-3 text-sm text-white"
        />
        <Pressable onPress={submit} className="m-1.5 rounded-lg bg-red-700 px-4 py-2 active:bg-red-800">
          <Text className="text-sm font-medium text-white">Tìm</Text>
        </Pressable>
      </View>

      {visibleSuggestions.length > 0 && (
        <View className="mt-2 overflow-hidden rounded-lg bg-[#2a2727]">
          {visibleSuggestions.map((film) => (
            <Pressable
              key={film.slug}
              onPress={() => openFilm(film.slug)}
              className="flex-row items-center gap-3 p-2 active:bg-white/10"
            >
              <Image source={imageSource(film.thumb_url)} contentFit="cover" className="h-[60px] w-[40px] rounded" />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-white" numberOfLines={1}>
                  {film.name}
                </Text>
                {hasOriginName(film) && (
                  <Text className="text-xs text-gray-300" numberOfLines={1}>
                    {film.origin_name}
                  </Text>
                )}
                <Text className="text-xs text-gray-400">{film.year}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
