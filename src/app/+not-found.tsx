// Mở đường dẫn không tồn tại (VD từ deep link sai) thì hiện màn này

import { router, Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-page px-6">
      <Stack.Screen options={{ title: "Không tìm thấy" }} />
      <Text className="font-display text-6xl text-red-600">404</Text>
      <Text className="mt-2 text-center text-white">Trang bạn tìm không tồn tại.</Text>
      <Pressable onPress={() => router.replace("/")} className="mt-6 rounded bg-red-700 px-6 py-2 active:bg-red-800">
        <Text className="font-bold text-white">Về trang chủ</Text>
      </Pressable>
    </View>
  );
}
