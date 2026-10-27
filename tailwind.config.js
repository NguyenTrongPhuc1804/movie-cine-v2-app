/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind chỉ tạo style cho class xuất hiện trong các file này
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Màu lấy từ bản web (moviecine-next). Đổi màu toàn app chỉ cần sửa ở đây
      colors: {
        page: "#181616", // nền trang
        card: "#221f1f", // nền khối, footer
        bar: "#121212", // header, tab bar
        brand: "#b91c1c", // đỏ chủ đạo (nút Xem ngay)
        steel: "#537188", // xanh xám (nút Trailer, server đang chọn)
      },
      // Tên font phải trùng tên đã nạp bằng useFonts trong src/app/_layout.tsx
      fontFamily: {
        display: ["BeVietnamPro_700Bold"],
        semibold: ["BeVietnamPro_600SemiBold"],
      },
    },
  },
  plugins: [],
};
