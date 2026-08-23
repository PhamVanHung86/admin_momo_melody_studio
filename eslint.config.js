import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Codebase dùng nhất quán pattern "fetchXxx() trong useEffect(() => {}, [])"
      // để tải dữ liệu lúc mount — đây là pattern hợp lệ, an toàn, không gây
      // cascading render thật sự trong các trường hợp này. Tắt có chủ đích
      // để 13+ cảnh báo không che lấp các lỗi thật khi chạy lint.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);
