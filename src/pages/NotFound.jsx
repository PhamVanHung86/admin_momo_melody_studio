import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="text-5xl">🔍</span>
      <h1 className="text-lg font-semibold text-[#4A4A6A] mt-4">
        Không tìm thấy trang
      </h1>
      <p className="text-sm text-[#4A4A6A]/50 mt-2">
        Đường dẫn bạn truy cập không tồn tại trong trang quản trị.
      </p>
      <Link
        to="/dashboard"
        className="mt-5 bg-[#FFB7C5] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#ff9db5] transition-colors"
      >
        Về Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
