// Domain API phim. Muốn đổi nguồn phim thì khai báo EXPO_PUBLIC_API_DOMAIN trong file .env
// Tài liệu: https://vsmov.com/api-document
export const API_DOMAIN = process.env.EXPO_PUBLIC_API_DOMAIN || "https://vsmov.com/api";

export const SITE_NAME = "Cineflexx";

// Ảnh dùng khi phim không có ảnh (API đôi khi trả về {} thay vì link)
export const NO_IMAGE = require("@/assets/images/no-image.png");

// Thể loại gợi ý khi phim không có thể loại nào
export const DEFAULT_CATEGORY = "hanh-dong";
