// Hook gọi API cho màn hình: tự quản lý trạng thái đang tải, lỗi, dữ liệu
// VD: const { data, loading, error, reload } = useApi(() => getDetailFilm(slug), [slug]);

import { useCallback, useEffect, useState } from "react";

interface ApiResult<T> {
  key: string; // kết quả này thuộc về lần gọi nào (deps + số lần bấm Thử lại)
  data: T | null;
  error: string;
}

export function useApi<T>(load: () => Promise<T>, deps: unknown[]) {
  const [reloadCount, setReloadCount] = useState(0);
  const key = JSON.stringify([...deps, reloadCount]);
  const [result, setResult] = useState<ApiResult<T>>({ key: "", data: null, error: "" });

  useEffect(() => {
    // Màn hình đã đóng hoặc tham số đã đổi thì bỏ qua kết quả cũ
    let active = true;

    load()
      .then((data) => {
        if (active) setResult({ key, data, error: "" });
      })
      .catch((err: Error) => {
        if (active) setResult({ key, data: null, error: err.message || "Có lỗi xảy ra" });
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  // Kết quả chưa khớp key hiện tại => đang tải
  // Vẫn trả dữ liệu cũ trong lúc tải (VD: chuyển sang trang 2) để màn hình không bị trắng
  const loading = result.key !== key;

  return { data: result.data, loading, error: loading ? "" : result.error, reload };
}
