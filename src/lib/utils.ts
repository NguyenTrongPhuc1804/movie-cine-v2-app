import type { ImageSource } from "expo-image";
import { NO_IMAGE } from "./config";

// Giữ số trong khoảng [min, max], VD: clamp(15, 1, 10) => 10
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), Math.max(min, max));
};

// Expo Router trả tham số dạng string hoặc string[]. Hàm này luôn lấy về 1 string
export const getParam = (value: string | string[] | undefined): string => {
  return (Array.isArray(value) ? value[0] : value) || "";
};

// Đọc số trang, VD: "3" => 3. Sai hoặc không có thì trả về 1
export const getPageNumber = (page: string | string[] | undefined): number => {
  const value = Number(getParam(page));
  return Number.isInteger(value) && value > 0 ? value : 1;
};

export const FILM_STATUSES = [
  { value: "ongoing", label: "Đang chiếu" },
  { value: "completed", label: "Hoàn thành" },
  { value: "trailer", label: "Trailer" },
];

export const getFilmYear = (year: string | string[] | undefined): string => {
  const value = Number(getParam(year));
  return Number.isInteger(value) && value >= 1970 && value <= 2100 ? String(value) : "";
};

export const getFilmStatus = (status: string | string[] | undefined): string => {
  const raw = getParam(status);
  return FILM_STATUSES.some((item) => item.value === raw) ? raw : "";
};

// Ảnh từ API là link, không có link thì dùng ảnh NO_IMAGE trong assets
export const imageSource = (url: string): ImageSource | number => {
  return url ? { uri: url } : NO_IMAGE;
};
