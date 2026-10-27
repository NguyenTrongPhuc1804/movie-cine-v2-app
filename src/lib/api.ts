// Các hàm lấy dữ liệu phim. Dùng trong màn hình qua hook useApi (src/hooks/useApi.ts)
// Kết quả được nhớ tạm trong RAM một lúc (giống "use cache" bên web) => mở lại màn hình không phải chờ

import { API_DOMAIN } from "./config";
import { API_PATH } from "./apiPath";
import { normalizeDetail, normalizeList, normalizeMenu } from "./movieAdapter";
import type { FilmDetail, FilmList, MenuItem } from "@/types/movie";

const MINUTE = 60 * 1000;
const CACHE_TIME = {
  minutes: 5 * MINUTE,
  hours: 60 * MINUTE,
  days: 24 * 60 * MINUTE,
};

// key: đường dẫn API, value: kết quả đang tải hoặc đã tải xong
const cache = new Map<string, { expiresAt: number; result: Promise<unknown> }>();

// Gọi API và trả về JSON, trả null nếu không tìm thấy (404)
async function requestApi(path: string) {
  const res = await fetch(API_DOMAIN + path);
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Gọi API thất bại: ${res.status} ${path}`);
  }
  return res.json();
}

// Giống requestApi nhưng có nhớ tạm. Lỗi thì không nhớ để lần sau gọi lại
function fetchApi(path: string, cacheTime: number) {
  const saved = cache.get(path);
  if (saved && saved.expiresAt > Date.now()) {
    return saved.result;
  }
  const result = requestApi(path).catch((error) => {
    cache.delete(path);
    throw error;
  });
  cache.set(path, { expiresAt: Date.now() + cacheTime, result });
  return result;
}

// ===== Danh sách phim =====

export async function getNewFilms(page = 1): Promise<FilmList> {
  return normalizeList(await fetchApi(API_PATH.newFilms(page), CACHE_TIME.minutes));
}

// slug: phim-le, phim-bo, phim-moi, hoat-hinh, phim-chieu-rap...
export async function getListFilm(slug: string, page = 1, year = "", status = ""): Promise<FilmList> {
  return normalizeList(await fetchApi(API_PATH.listFilm(slug, page, year, status), CACHE_TIME.minutes));
}

export async function getFilmsByCategory(slug: string, page = 1, year = "", status = ""): Promise<FilmList> {
  return normalizeList(await fetchApi(API_PATH.filmsByCategory(slug, page, year, status), CACHE_TIME.hours));
}

export async function getFilmsByCountry(slug: string, page = 1, year = "", status = ""): Promise<FilmList> {
  return normalizeList(await fetchApi(API_PATH.filmsByCountry(slug, page, year, status), CACHE_TIME.hours));
}

export async function searchFilms(keyword: string, page = 1): Promise<FilmList> {
  return normalizeList(await fetchApi(API_PATH.search(keyword, page), CACHE_TIME.hours));
}

// ===== Chi tiết phim =====

// Trả về null nếu phim không tồn tại => màn hình hiện "Không tìm thấy phim"
export async function getDetailFilm(slug: string): Promise<FilmDetail | null> {
  const res = await fetchApi(API_PATH.detailFilm(slug), CACHE_TIME.hours);
  return res ? normalizeDetail(res) : null;
}

// ===== Thể loại, quốc gia =====

export async function getAllCategories(): Promise<MenuItem[]> {
  return normalizeMenu(await fetchApi(API_PATH.allCategories(), CACHE_TIME.days));
}

export async function getAllCountries(): Promise<MenuItem[]> {
  return normalizeMenu(await fetchApi(API_PATH.allCountries(), CACHE_TIME.days));
}
