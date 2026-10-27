// Nút chữ in hoa dùng chung: Xem ngay, Trailer...
// color: class nền Tailwind, VD "bg-brand" (đỏ) hoặc "bg-steel" (xanh xám)

import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

interface ButtonProps {
  text: string;
  color?: string;
  icon?: keyof typeof Ionicons.glyphMap; // tên icon Ionicons, VD "play"
  onPress?: () => void;
}

export default function Button({ text, color = "bg-brand", icon, onPress }: ButtonProps) {
  return (
    <Pressable onPress={onPress} className={`flex-row items-center gap-2 px-6 py-3 active:opacity-80 ${color}`}>
      {icon && <Ionicons name={icon} size={16} color="white" />}
      <Text className="text-sm font-bold uppercase text-white">{text}</Text>
    </Pressable>
  );
}
