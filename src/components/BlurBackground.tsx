// Nền blur dùng chung cho toàn app: một ảnh tĩnh, blur native một lần, không re-render.
// Đặt ở root layout (src/app/_layout.tsx); các màn tự bỏ bg-page để nền này lộ qua.
// Muốn đổi ảnh thì sửa source bên dưới. Scrim càng đậm thì chữ càng dễ đọc.

import { Image } from "expo-image";
import { View } from "react-native";

export default function BlurBackground() {
  return (
    <View pointerEvents="none" className="absolute inset-0 overflow-hidden">
      <Image
        source={require("@/assets/images/logo-ultra.png")}
        contentFit="cover"
        blurRadius={90}
        className="absolute inset-0"
      />
      <View className="absolute inset-0 bg-black/88" />
    </View>
  );
}
