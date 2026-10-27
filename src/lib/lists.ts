// Các slug là "danh sách" (gọi getListFilm), slug khác được hiểu là thể loại
// Muốn thêm danh sách mới: thêm 1 dòng ở đây (và trong lib/apiPath.ts nếu đường dẫn API khác)

import { getAllCategories, getAllCountries } from "./api";

export const LIST_TITLES: Record<string, string> = {
  "phim-moi": "Phim Mới",
  "phim-le": "Phim Lẻ",
  "phim-bo": "Phim Bộ",
  "hoat-hinh": "Phim Hoạt Hình",
  "phim-chieu-rap": "Phim Chiếu Rạp",
};

export async function getListTitle(slug: string) {
  if (LIST_TITLES[slug]) return LIST_TITLES[slug];
  const categories = await getAllCategories();
  const category = categories.find((item) => item.slug === slug);
  return `Phim ${category?.name || slug}`;
}

export async function getCountryTitle(slug: string) {
  const countries = await getAllCountries();
  const country = countries.find((item) => item.slug === slug);
  return `Phim ${country?.name || slug}`;
}
