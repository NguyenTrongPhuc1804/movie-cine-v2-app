// Thanh tab dưới cùng kiểu floating glass + pill trượt

import FloatingTabBar from "@/components/FloatingTabBar";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <FloatingTabBar
          {...(props as unknown as Parameters<typeof FloatingTabBar>[0])}
        />
      )}
      screenOptions={{
        headerStyle: { backgroundColor: "#121212" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontFamily: "BeVietnamPro_700Bold" },
        sceneStyle: { backgroundColor: "#181616" },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      {/* Trang chủ tự vẽ header trong suốt trên banner nên tắt header mặc định */}
      <Tabs.Screen
        name="index"
        options={{ title: "Trang chủ", headerShown: false }}
      />
      <Tabs.Screen name="browse" options={{ title: "Khám phá" }} />
      <Tabs.Screen name="search" options={{ title: "Tìm kiếm" }} />
      <Tabs.Screen name="favorites" options={{ title: "Yêu thích" }} />
    </Tabs>
  );
}
