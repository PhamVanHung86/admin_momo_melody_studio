import React from "react";
import { useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const titles = {
  "/dashboard": "Dashboard",
  "/products": "Quản lý sản phẩm",
  "/products/add": "Thêm sản phẩm mới",
  "/orders": "Quản lý đơn hàng",
  "/customers": "Khách hàng",
};

const Header = ({ onMenuClick = () => {} }) => {
  const { pathname } = useLocation();

  return (
    <div className="bg-white border-b border-[#b8deff] px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Mở menu"
          className="lg:hidden w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full text-[#4A4A6A] hover:bg-[#FFFAF5]"
        >
          <span className="text-xl leading-none">☰</span>
        </button>
        <h2 className="text-base md:text-lg font-semibold text-[#4A4A6A] truncate">
          {titles[pathname] || "Admin"}
        </h2>
      </div>
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <NotificationBell />

        {/* 🖼️ THAY THẾ AVATAR TẠI ĐÂY */}
        <img
          src="/logo_blue.png"
          alt="Admin Avatar"
          className="w-8 h-8 rounded-full object-cover ring-2 ring-[#b8deff]"
        />

        <div className="hidden sm:block">
          <p className="text-xs font-medium text-[#4A4A6A]">Admin</p>
          <p className="text-[10px] text-[#4A4A6A]/40">momo's melody studio</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
