# Cineflexx App

App xem phim viết bằng **Expo + React Native**, chuyển từ bản web `moviecine-next`.
Giao diện style bằng **NativeWind** nên `className` viết giống Tailwind bên web.

## Chạy dự án

```bash
npm install
npx expo start
```

Quét mã QR bằng app **Expo Go** (SDK 57) trên điện thoại, hoặc bấm `a` (Android emulator) / `i` (iOS simulator).

Đổi nguồn API (không bắt buộc): tạo file `.env.local` theo mẫu `.env.example`.

Kiểm tra code trước khi commit:

```bash
npx tsc --noEmit
npx expo lint
```

## Cấu trúc thư mục

```
src/
  app/                     Màn hình. Mỗi file = 1 đường dẫn (expo-router, giống app/ của Next.js)
    _layout.tsx            Khung ngoài cùng: font, giao diện tối, Stack điều hướng
    (tabs)/                4 tab dưới cùng
      index.tsx            Trang chủ: banner, Tiếp tục xem, các hàng phim
      browse.tsx           Khám phá: danh sách, thể loại, quốc gia
      search.tsx           Tìm kiếm
      favorites.tsx        Phim yêu thích
    phim/[name].tsx              Chi tiết phim        (web: /phim/[name])
    phim/xem/[name].tsx          Xem phim             (web: /phim/xem/[name])
    phim/list/[catg].tsx         Danh sách / thể loại (web: /phim/list/[catg])
    phim/list/country/[ctry].tsx Quốc gia             (web: /phim/list/country/[ctry])
  components/              Component dùng chung (FilmCard, FilmSlider, VideoPlayer...)
  hooks/useApi.ts          Gọi API trong màn hình: data / loading / error / reload
  lib/
    api.ts                 Các hàm gọi API (có cache trong bộ nhớ)
    apiPath.ts             Đường dẫn API
    movieAdapter.ts        Chuyển JSON của API thành kiểu trong types/movie.ts
    localStore.ts          Lưu lịch sử xem, yêu thích vào máy (AsyncStorage)
    lists.ts               Tên các danh sách phim (Phim lẻ, Phim bộ...)
    utils.ts               Hàm tiện ích nhỏ
    config.ts              Cấu hình chung
    nativewind.ts          Cho phép dùng className với Image, LinearGradient, WebView
  types/movie.ts           Kiểu dữ liệu (giống bản web)
```

## Khác biệt so với bản web

| Web (Next.js)                 | App (React Native)                           |
| ----------------------------- | -------------------------------------------- |
| `<div>`, `<p>`, `<img>`       | `<View>`, `<Text>`, `<Image>` (expo-image)   |
| `<Link>` của next/link        | `<Link>` của expo-router                     |
| `localStorage`                | `AsyncStorage` (lib/localStore.ts)           |
| `<iframe>` phát phim          | `<WebView>` (react-native-webview)           |
| Swiper                        | `FlatList` ngang                             |
| Server Component + Suspense   | Hook `useApi` + Skeleton                     |
| `hover:`                      | `active:` (khi đang bấm)                     |
| Menu Header                   | Thanh tab dưới cùng                          |

## Ghi chú khi viết code

- Chữ phải nằm trong `<Text>`, không đặt chữ trực tiếp trong `<View>`.
- Màu và font riêng khai báo trong `tailwind.config.js`: `bg-page`, `bg-card`, `bg-bar`, `bg-brand`, `bg-steel`, `font-display`, `font-semibold`.
- Thêm màn hình mới: tạo file trong `src/app/`, tên file chính là đường dẫn.
- Thêm API mới: viết đường dẫn ở `lib/apiPath.ts`, hàm gọi ở `lib/api.ts`, chuyển dữ liệu ở `lib/movieAdapter.ts`.
