// Kiểu dữ liệu dùng chung cho toàn bộ app (đã qua movieAdapter, không phải JSON gốc của API)
// Giữ giống hệt bản web moviecine-next/types/movie.ts

export interface MenuItem {
  _id: number;
  name: string;
  slug: string;
}

export interface Film {
  _id: number;
  name: string;
  origin_name: string;
  slug: string;
  thumb_url: string; // ảnh dọc, "" nếu không có
  poster_url: string; // ảnh ngang, "" nếu không có
  year: number;
  rating: number; // điểm TMDB, 0 nếu chưa có
}

export interface Episode {
  name: string;
  slug: string;
  link_embed: string;
}

export interface Server {
  server_name: string;
  server_data: Episode[];
}

export interface FilmDetail extends Film {
  content: string;
  type: string; // "single" = phim lẻ, "series" = phim bộ
  status: string; // "trailer" | "ongoing" | "completed"
  trailer_url: string;
  time: string;
  episode_current: string;
  quality: string;
  lang: string;
  view: number;
  actor: string[];
  director: string[];
  category: { id: number; name: string; slug: string }[];
  country: { id: number; name: string; slug: string }[];
  episodes: Server[];
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface FilmList {
  items: Film[];
  pagination: Pagination;
}
