// Bộ lọc năm và trạng thái cho màn danh sách
// Bản web dùng ô <select>. Điện thoại không có nên dùng hàng nút vuốt ngang

import { Pressable, ScrollView, Text, View } from "react-native";
import { FILM_STATUSES } from "@/lib/utils";

const FIRST_YEAR = 1990;

interface FilmFiltersProps {
  year: string;
  status: string;
  onChange: (year: string, status: string) => void;
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-4 py-1.5 active:opacity-70 ${active ? "border-red-600 bg-red-600" : "border-gray-500 bg-card"}`}
    >
      <Text className="text-sm font-semibold text-white">{label}</Text>
    </Pressable>
  );
}

export default function FilmFilters({ year, status, onChange }: FilmFiltersProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - FIRST_YEAR + 1 }, (_, index) => String(currentYear - index));

  return (
    <View className="mb-5 gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-bold text-white">Năm</Text>
        {(year || status) && (
          <Pressable onPress={() => onChange("", "")} hitSlop={8}>
            <Text className="text-sm font-bold text-red-500">Xóa lọc</Text>
          </Pressable>
        )}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
        <Chip label="Tất cả" active={!year} onPress={() => onChange("", status)} />
        {years.map((item) => (
          <Chip key={item} label={item} active={year === item} onPress={() => onChange(item, status)} />
        ))}
      </ScrollView>

      <Text className="text-sm font-bold text-white">Trạng thái</Text>
      <View className="flex-row flex-wrap gap-2">
        <Chip label="Tất cả" active={!status} onPress={() => onChange(year, "")} />
        {FILM_STATUSES.map((item) => (
          <Chip key={item.value} label={item.label} active={status === item.value} onPress={() => onChange(year, item.value)} />
        ))}
      </View>
    </View>
  );
}
