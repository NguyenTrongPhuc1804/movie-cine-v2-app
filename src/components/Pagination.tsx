// Phân trang: ‹ 1 ... 4 [5] 6 ... 20 ›
// Bản web dùng link ?page=, app gọi onChange(page) để màn hình tự đổi trang

import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

// Số trang hiển thị mỗi bên trang hiện tại, VD = 1: ... 4 [5] 6 ...
const PAGE_RANGE = 1;

function PageButton({ label, active = false, onPress }: { label: React.ReactNode; active?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`min-w-10 items-center rounded border px-3 py-2 active:border-red-600 ${
        active ? "border-red-600 bg-red-600" : "border-gray-500"
      }`}
    >
      {typeof label === "number" ? <Text className="text-white">{label}</Text> : label}
    </Pressable>
  );
}

const Dots = () => <Text className="px-1 py-2 text-white">...</Text>;

export default function Pagination({ currentPage, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, currentPage - PAGE_RANGE);
  const end = Math.min(totalPages, currentPage + PAGE_RANGE);
  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <View className="mt-8 flex-row flex-wrap justify-center gap-2">
      {currentPage > 1 && (
        <PageButton label={<Ionicons name="chevron-back" size={16} color="white" />} onPress={() => onChange(currentPage - 1)} />
      )}

      {start > 1 && <PageButton label={1} onPress={() => onChange(1)} />}
      {start > 2 && <Dots />}

      {pages.map((page) => (
        <PageButton key={page} label={page} active={page === currentPage} onPress={() => onChange(page)} />
      ))}

      {end < totalPages - 1 && <Dots />}
      {end < totalPages && <PageButton label={totalPages} onPress={() => onChange(totalPages)} />}

      {currentPage < totalPages && (
        <PageButton label={<Ionicons name="chevron-forward" size={16} color="white" />} onPress={() => onChange(currentPage + 1)} />
      )}
    </View>
  );
}
