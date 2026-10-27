import { Ionicons } from "@expo/vector-icons";
import { Link, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";

interface SectionTitleProps {
  title: string;
  viewAllHref?: Href; // có link thì hiện nút "Xem tất cả"
}

export default function SectionTitle({
  title,
  viewAllHref,
}: SectionTitleProps) {
  return (
    <View className="my-4 flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center">
        <View className="mr-3 h-7 w-1 bg-brand" />
        <Text
          className="flex-1 font-display text-xl uppercase text-white"
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      {viewAllHref && (
        <Link href={viewAllHref} asChild>
          <Pressable className="ml-2 flex-row items-center border-2 border-white px-2 py-1 active:bg-white/20">
            <Text className="text-xs font-bold text-white">Xem tất cả</Text>
            <Ionicons name="caret-forward" size={12} color="white" />
          </Pressable>
        </Link>
      )}
    </View>
  );
}
