// Chuyển JSON gốc của API thành kiểu dữ liệu trong types/movie.ts
// Component chỉ dùng kiểu đã chuyển, nên khi đổi nguồn phim chỉ cần sửa file này

import { DEFAULT_CATEGORY } from "./config";
import type { Film, FilmDetail, FilmList, MenuItem } from "@/types/movie";

// Link ảnh hợp lệ thì giữ, sai thì trả "" để component hiện ảnh NO_IMAGE
export const getImageUrl = (url: unknown): string => {
  if (typeof url === "string" && url !== "") {
    return url;
  }
  return "";
};

const toFilm = (raw: any): Film => ({
  _id: raw?._id,
  name: raw?.name || "",
  origin_name: raw?.origin_name || "",
  slug: raw?.slug || "",
  thumb_url: getImageUrl(raw?.thumb_url),
  poster_url: getImageUrl(raw?.poster_url),
  year: raw?.year,
  rating: Number(raw?.tmdb?.vote_average) || 0,
});

// Danh sách phim (phim lẻ, phim bộ, thể loại, quốc gia, tìm kiếm)
export const normalizeList = (res: any): FilmList => {
  const pagination = res?.pagination || {};
  return {
    items: (res?.items || []).map(toFilm),
    pagination: {
      currentPage: Number(pagination.currentPage) || 1,
      totalPages: Number(pagination.totalPages) || 1,
      totalItems: Number(pagination.totalItems) || 0,
    },
  };
};

// Danh sách thể loại / quốc gia cho màn Khám phá
export const normalizeMenu = (res: any): MenuItem[] => {
  return res?.data?.items || [];
};

// Chi tiết phim: API trả { movie, episodes } nên gộp episodes vào chung 1 object
export const normalizeDetail = (res: any): FilmDetail => {
  const movie = res?.movie || {};
  const episodes = (res?.episodes || []).map((server: any) => ({
    server_name: (server.server_name || "").trim(),
    server_data: server.server_data || [],
  }));
  return {
    ...toFilm(movie),
    content: movie.content || "",
    type: movie.type || "",
    status: movie.status || "",
    trailer_url: movie.trailer_url || "",
    time: movie.time || "",
    episode_current: movie.episode_current || "",
    quality: movie.quality || "",
    lang: movie.lang || "",
    view: movie.view || 0,
    actor: movie.actor || [],
    director: movie.director || [],
    category: movie.category || [],
    country: movie.country || [],
    episodes,
  };
};

// Rút gọn chi tiết phim về dạng Film (lưu yêu thích cho nhẹ, không lưu cả danh sách tập)
export const toFilmSummary = (film: Film): Film => ({
  _id: film._id,
  name: film.name,
  origin_name: film.origin_name,
  slug: film.slug,
  thumb_url: film.thumb_url,
  poster_url: film.poster_url,
  year: film.year,
  rating: film.rating,
});

// Lấy thể loại đầu tiên của phim để gợi ý "Có thể bạn cũng muốn xem"
export const getMainCategorySlug = (film: FilmDetail): string => {
  return film.category[0]?.slug || DEFAULT_CATEGORY;
};

// Bỏ thẻ HTML trong nội dung phim (app không hiển thị HTML như web)
export const stripHtml = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
};

// Lấy id video Youtube từ link trailer, VD: https://www.youtube.com/watch?v=abc => abc
export const getYoutubeId = (url: string): string => {
  return url.split("v=")[1]?.split("&")[0] || "";
};

// Hiện tên gốc khi khác tên tiếng Việt, VD "Đừng cử động" / "Don't Move"
export const hasOriginName = (film: Film): boolean => {
  return Boolean(film.origin_name) && film.origin_name.toLowerCase() !== film.name.toLowerCase();
};
