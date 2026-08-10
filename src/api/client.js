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

// 🔑 Quản lý access + refresh token (thay cho cookie httpOnly trước đây).
// Lưu ở localStorage vì admin và server nằm ở domain khác nhau khi deploy
// thật (Vercel/Netlify <-> Render) — cookie cross-site hay bị trình duyệt
// chặn. Access token sống ngắn (30 phút), refresh token sống dài (30 ngày)
// và chỉ dùng để xin access token mới — xem thêm giải thích chi tiết ở
// client/src/api/client.js (logic giống hệt, admin dùng key localStorage
// riêng để không đụng độ khi cùng mở 2 app trên cùng trình duyệt).
const TOKEN_KEY = "adminAuthToken";
const REFRESH_TOKEN_KEY = "adminAuthRefreshToken";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const setRefreshToken = (token) =>
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
export const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) setToken(accessToken);
  if (refreshToken) setRefreshToken(refreshToken);
};
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Gộp nhiều request refresh cùng lúc thành 1 lời gọi /refresh duy nhất.
let refreshPromise = null;
async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error("Không có refresh token");
      const res = await fetch(apiUrl("/api/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        removeToken();
        throw new Error("Refresh token hết hạn, cần đăng nhập lại");
      }
      const data = await res.json();
      setTokens(data);
      return data.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/**
 * Thay thế trực tiếp cho fetch(), tự động thêm base URL từ env, tự gắn
 * header "Authorization: Bearer <token>" VÀ tự làm mới access token khi
 * hết hạn rồi thử lại request 1 lần.
 */
export async function apiFetch(path, options = {}, _retried = false) {
  const token = getToken();
  const { credentials, headers: optHeaders, ...rest } = options; // bỏ credentials cũ nếu còn sót
  const headers = { ...(optHeaders || {}) };

  if (token) headers.Authorization = `Bearer ${token}`;

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  if (options.body && !isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(apiUrl(path), { ...rest, headers });

  if (res.status === 401 && !_retried && getRefreshToken()) {
    let body;
    try {
      body = await res.clone().json();
    } catch {
      body = null;
    }
    if (body?.code === "TOKEN_EXPIRED") {
      try {
        await refreshAccessToken();
        return apiFetch(path, options, true);
      } catch {
        removeToken();
      }
    }
  }

  return res;
}

export default apiFetch;
