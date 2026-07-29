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

const Header = () => {
  const { pathname } = useLocation();

  return (
    <div className="bg-white border-b border-[#b8deff] px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      <h2 className="text-lg font-semibold text-[#4A4A6A]">
        {titles[pathname] || "Admin"}
      </h2>
      <div className="flex items-center gap-3">
        <NotificationBell />
        <div className="w-8 h-8 rounded-full bg-[#b8deff] flex items-center justify-center text-sm">
          👤
        </div>
        <div>
          <p className="text-xs font-medium text-[#4A4A6A]">Admin</p>
          <p className="text-[10px] text-[#4A4A6A]/40">momo's melody studio</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
