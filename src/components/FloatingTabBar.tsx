// Tab bar floating gọn: chỉ icon, không chữ. Thanh co đúng bằng 4 slot cố định và căn giữa.
// Slot rộng cố định nên pill active không đẩy icon khác; chỉ animate opacity + scale.

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const BRAND = "#ef4444";
const ICON_IDLE = "#d4d4d4";
const BAR_BG = "#141212";
const PILL_BG = "rgba(185,28,28,0.22)";
const PILL_BORDER = "rgba(239,68,68,0.35)";
const SLOT_W = 58;
const TAB_H = 56;
const PILL_INSET = 5;
const BAR_PAD = 6;

const ICONS: Record<
  string,
  {
    active: keyof typeof Ionicons.glyphMap;
    idle: keyof typeof Ionicons.glyphMap;
  }
> = {
  index: { active: "home", idle: "home-outline" },
  browse: { active: "compass", idle: "compass-outline" },
  search: { active: "search", idle: "search-outline" },
  favorites: { active: "heart", idle: "heart-outline" },
};

type Props = Pick<
  BottomTabBarProps,
  "state" | "descriptors" | "emitter" | "navigateToTab" | "insets"
>;

export default function FloatingTabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
  insets,
}: Props) {
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: Math.max(insets.bottom, 12),
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          height: TAB_H,
          paddingHorizontal: BAR_PAD,
          borderRadius: TAB_H / 2,
          backgroundColor: BAR_BG,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.08)",
          shadowColor: "#000",
          shadowOpacity: 0.5,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 14,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : typeof options.title === "string"
                ? options.title
                : route.name;
          const focused = state.index === index;
          const icons = ICONS[route.name] ?? {
            active: "ellipse",
            idle: "ellipse-outline",
          };

          const onPress = () => {
            const event = emitter.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              Haptics.selectionAsync().catch(() => undefined);
              navigateToTab(route.key);
            }
          };

          return (
            <TabButton
              key={route.key}
              label={label}
              focused={focused}
              icon={focused ? icons.active : icons.idle}
              onPress={onPress}
              onLongPress={() =>
                emitter.emit({ type: "tabLongPress", target: route.key })
              }
            />
          );
        })}
      </View>
    </View>
  );
}

function TabButton({
  label,
  focused,
  icon,
  onPress,
  onLongPress,
}: {
  label: string;
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const p = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    p.value = withTiming(focused ? 1 : 0, {
      duration: 170,
      easing: Easing.out(Easing.cubic),
    });
  }, [focused, p]);

  // Chỉ đổi opacity + scale trong slot cố định -> không đẩy icon khác, thanh không đổi dài
  const pillStyle = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ scale: 0.9 + p.value * 0.1 }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + p.value * 0.08 }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={label}
      onPress={onPress}
      onLongPress={onLongPress}
      android_ripple={{ color: "rgba(255,255,255,0.06)", borderless: true }}
      style={{
        width: SLOT_W,
        height: TAB_H - PILL_INSET * 2,
        marginVertical: PILL_INSET,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 999,
            backgroundColor: PILL_BG,
            borderWidth: 1,
            borderColor: PILL_BORDER,
          },
          pillStyle,
        ]}
      />
      <Animated.View style={iconStyle}>
        <Ionicons name={icon} size={22} color={focused ? BRAND : ICON_IDLE} />
      </Animated.View>
    </Pressable>
  );
}
