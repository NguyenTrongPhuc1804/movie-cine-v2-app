// Tab bar nổi: thanh đặc bo góc, chỉ icon, scale nhẹ khi active

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const BRAND = "#b91c1c";
const INACTIVE = "#9ca3af";
// Đổi thành "#ffffff" nếu muốn thanh trắng giống hệt mẫu
const BAR_BG = "#1f1d1d";
const TAB_H = 64;
const SIDE_PAD = 16;
const BAR_MARGIN = 20;

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

export default function FloatingTabBar({
  state,
  descriptors,
  navigation,
  insets,
}: {
  state: {
    index: number;
    routes: { key: string; name: string; params?: object }[];
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descriptors: Record<
    string,
    { options: { title?: string; tabBarLabel?: any } }
  >;
  navigation: {
    emit: (event: {
      type: string;
      target: string;
      canPreventDefault?: boolean;
    }) => { defaultPrevented: boolean };
    navigate: (name: string, params?: object) => void;
  };
  insets: { bottom: number };
}) {
  const routes = state.routes;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: BAR_MARGIN,
        right: BAR_MARGIN,
        bottom: Math.max(insets.bottom, 12),
      }}
    >
      <View
        style={{
          height: TAB_H,
          borderRadius: 24,
          backgroundColor: BAR_BG,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
          elevation: 10,
        }}
      >
        <View
          className="flex-1 flex-row items-center"
          style={{ paddingHorizontal: SIDE_PAD }}
        >
          {routes.map((route, index) => {
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
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                  () => undefined,
                );
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <TabItem
                key={route.key}
                label={label}
                focused={focused}
                icon={focused ? icons.active : icons.idle}
                onPress={onPress}
                onLongPress={() =>
                  navigation.emit({ type: "tabLongPress", target: route.key })
                }
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

function TabItem({
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
  const scale = useSharedValue(focused ? 1.15 : 1);

  useEffect(() => {
    scale.value = withTiming(focused ? 1.15 : 1, {
      duration: 140,
      easing: Easing.out(Easing.cubic),
    });
  }, [focused, scale]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={label}
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center justify-center gap-1"
    >
      <Animated.View style={iconStyle}>
        <Ionicons name={icon} size={22} color={focused ? BRAND : INACTIVE} />
      </Animated.View>
      <Text
        className="text-[10px] font-semibold"
        style={{ color: focused ? BRAND : INACTIVE }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}
