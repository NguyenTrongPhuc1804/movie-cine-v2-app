// Hiện khi gọi API lỗi (mất mạng, server lỗi...) kèm nút thử lại. Giống app/error.tsx bên web

import { Pressable, Text, View } from "react-native";

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorView({ message = "Đã có lỗi xảy ra", onRetry }: ErrorViewProps) {
  return (
    <View className="flex-1 items-center justify-center bg-page px-6 py-20">
      <Text className="text-center font-display text-2xl text-white">Ối, có lỗi rồi!</Text>
      <Text className="mt-2 text-center text-gray-400">{message}</Text>
      {onRetry && (
        <Pressable onPress={onRetry} className="mt-6 rounded bg-red-700 px-6 py-2 active:bg-red-800">
          <Text className="font-bold text-white">Thử lại</Text>
        </Pressable>
      )}
    </View>
  );
}
