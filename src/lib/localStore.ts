// Lưu "Lịch sử xem" và "Phim yêu thích" trong máy bằng AsyncStorage (không cần backend)
// Bản web dùng localStorage. Tên hàm giữ nguyên: useStoredList, saveHistory, removeHistory, toggleFavorite

import { useEffect, useSyncExternalStore } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Film } from "@/types/movie";

export const HISTORY_KEY = "cineflexx-history";
export const FAVORITE_KEY = "cineflexx-favorites";
const MAX_HISTORY = 20;

export interface WatchHistoryItem {
  slug: string;
  name: string;
  thumb_url: string;
  server: number; // vị trí server, bắt đầu từ 0
  tap: number; // vị trí tập, bắt đầu từ 1
  episodeName: string; // tên tập để hiển thị, VD "5" hoặc "Full"
}

// AsyncStorage đọc chậm (bất đồng bộ) nên dữ liệu được giữ thêm 1 bản trong RAM để vẽ giao diện ngay
const memory: Record<string, unknown[]> = {};
const loading: Record<string, Promise<void>> = {};
const EMPTY: never[] = [];

// Báo cho các component đang dùng useStoredList vẽ lại khi dữ liệu đổi
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((callback) => callback());

const subscribe = (callback: () => void) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};

// Dữ liệu hỏng thì coi như danh sách rỗng
const parseList = (raw: string | null): unknown[] => {
  try {
    const list = JSON.parse(raw || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

// Đọc từ AsyncStorage đúng 1 lần cho mỗi key
const loadList = (key: string): Promise<void> => {
  if (!loading[key]) {
    loading[key] = AsyncStorage.getItem(key)
      .then((raw) => {
        memory[key] = parseList(raw);
      })
      .catch(() => {
        memory[key] = [];
      })
      .finally(notify);
  }
  return loading[key];
};

const readList = <T>(key: string): T[] => (memory[key] as T[] | undefined) || EMPTY;

// Phải đọc xong dữ liệu cũ rồi mới ghi, nếu không sẽ ghi đè mất lịch sử
const writeList = async <T>(key: string, update: (list: T[]) => T[]) => {
  await loadList(key);
  memory[key] = update(readList<T>(key));
  notify();
  await AsyncStorage.setItem(key, JSON.stringify(memory[key]));
};

// Hook đọc danh sách. Lúc đang đọc từ máy thì trả về [] rồi tự cập nhật
export function useStoredList<T>(key: string): T[] {
  useEffect(() => {
    loadList(key);
  }, [key]);
  return useSyncExternalStore(subscribe, () => readList<T>(key));
}

// ===== Lịch sử xem =====

// Phim vừa xem đưa lên đầu, mỗi phim chỉ giữ 1 dòng
export const saveHistory = (item: WatchHistoryItem) => {
  return writeList<WatchHistoryItem>(HISTORY_KEY, (list) =>
    [item, ...list.filter((old) => old.slug !== item.slug)].slice(0, MAX_HISTORY),
  );
};

export const removeHistory = (slug: string) => {
  return writeList<WatchHistoryItem>(HISTORY_KEY, (list) => list.filter((item) => item.slug !== slug));
};

// ===== Phim yêu thích =====

export const toggleFavorite = (film: Film) => {
  return writeList<Film>(FAVORITE_KEY, (list) => {
    const exists = list.some((item) => item.slug === film.slug);
    return exists ? list.filter((item) => item.slug !== film.slug) : [film, ...list];
  });
};
