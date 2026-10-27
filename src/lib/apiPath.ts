// Tất cả đường dẫn API nằm ở đây (chưa gồm API_DOMAIN)
// Khi nguồn phim đổi đường dẫn chỉ cần sửa file này

// Một số danh sách không có ở /danh-sach nên phải lấy qua đường dẫn khác
// key: slug trong app, value: đường dẫn API thật
const SPECIAL_LIST_PATH: Record<string, string> = {
  "hoat-hinh": "/the-loai/hoat-hinh",
};

// /danh-sach không nhận year, status. Chỉ đường dẫn /the-loai và /quoc-gia lọc được.
export const listSupportsFilter = (slug: string) => Boolean(SPECIAL_LIST_PATH[slug]);

function listQuery(page: number, year = "", status = "") {
  const params = new URLSearchParams({ page: String(page) });
  if (year) params.set("year", year);
  if (status) params.set("status", status);
  return params.toString();
}

export const API_PATH = {
  newFilms: (page = 1) => `/danh-sach/phim-moi-cap-nhat?page=${page}`,
  listFilm: (slug: string, page = 1, year = "", status = "") => {
    const path = SPECIAL_LIST_PATH[slug] || `/danh-sach/${slug}`;
    const canFilter = Boolean(SPECIAL_LIST_PATH[slug]);
    return `${path}?${listQuery(page, canFilter ? year : "", canFilter ? status : "")}`;
  },
  detailFilm: (slug: string) => `/phim/${slug}`,
  search: (keyword: string, page = 1) => `/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`,

  allCategories: () => `/the-loai`,
  filmsByCategory: (slug: string, page = 1, year = "", status = "") =>
    `/the-loai/${slug}?${listQuery(page, year, status)}`,

  allCountries: () => `/quoc-gia`,
  filmsByCountry: (slug: string, page = 1, year = "", status = "") =>
    `/quoc-gia/${slug}?${listQuery(page, year, status)}`,
};
