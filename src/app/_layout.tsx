// Khung ngoài cùng của app: nạp CSS, font, giao diện tối và điều hướng dạng chồng màn hình (Stack)

import "@/global.css";
import "@/lib/nativewind";

import { useEffect } from "react";
import { BeVietnamPro_600SemiBold, BeVietnamPro_700Bold, useFonts } from "@expo-google-fonts/be-vietnam-pro";
import { DarkTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import BlurBackground from "@/components/BlurBackground";

// Giữ màn hình chờ cho tới khi nạp xong font, tránh chữ bị đổi font giữa chừng
SplashScreen.preventAutoHideAsync();

// Màu nền của điều hướng, trùng với màu trong tailwind.config.js
const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: "#181616", card: "#121212", border: "#121212", primary: "#b91c1c" },
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ BeVietnamPro_600SemiBold, BeVietnamPro_700Bold });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="light" />
      {/* Nền blur dùng chung: mọi màn khai báo contentStyle/sceneStyle transparent sẽ lộ nền này.
          Màn hình cần nền đục (chi tiết phim, trình phát) tự giữ bg-page. */}
      <View className="flex-1 bg-page">
        <BlurBackground />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#121212" },
            headerTintColor: "#ffffff",
            headerTitleStyle: { fontFamily: "BeVietnamPro_700Bold" },
            headerBackButtonDisplayMode: "minimal",
            contentStyle: { backgroundColor: "transparent" },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* Màn chi tiết: header trong suốt nằm đè lên poster */}
          <Stack.Screen name="phim/[name]" options={{ headerTransparent: true, title: "" }} />
        </Stack>
      </View>
    </ThemeProvider>
  );
}
