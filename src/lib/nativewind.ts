// NativeWind chỉ tự nhận className trên component gốc của React Native (View, Text, Pressable...)
// Component của thư viện khác phải khai báo ở đây thì mới viết được className

import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { WebView } from "react-native-webview";

cssInterop(Image, { className: "style" });
cssInterop(LinearGradient, { className: "style" });
cssInterop(WebView, { className: "style" });
