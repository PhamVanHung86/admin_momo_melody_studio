// Lớp gọi API tập trung cho toàn bộ admin panel.
//
// Toàn bộ URL backend trước đây bị hard-code "http://localhost:4000" rải
// rác ở hơn 40 chỗ trong code. Giờ chỉ cấu hình MỘT nơi duy nhất: biến môi
// trường VITE_API_URL (xem file .env / .env.example).
//
// Cách dùng (giữ nguyên style code cũ để giảm rủi ro khi migrate):
//   import { apiFetch } from "../api/client";
//   const res = await apiFetch("/api/products");
//   const data = await res.json();
//
// apiFetch nhận đúng các tham số như fetch() gốc (path tương đối + options),
// chỉ khác là tự nối thêm base URL. Không thay đổi hành vi credentials/
// headers hiện có của từng lời gọi.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/** Ghép base URL với một đường dẫn API tương đối, ví dụ "/api/products" */
export function apiUrl(path) {
  if (/^https?:\/\//.test(path)) return path; // đã là URL đầy đủ thì giữ nguyên
  return `${BASE_URL}${path}`;
}

/** Thay thế trực tiếp cho fetch(), tự động thêm base URL từ env */
export async function apiFetch(path, options) {
  return fetch(apiUrl(path), options);
}

export default apiFetch;
