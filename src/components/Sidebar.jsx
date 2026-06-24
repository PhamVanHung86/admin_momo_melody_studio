import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard", emoji: "📊" },
  { label: "Sản phẩm", path: "/products", emoji: "📦" },
  { label: "Thêm sản phẩm", path: "/products/add", emoji: "➕" },
  { label: "Đơn hàng", path: "/orders", emoji: "🛍️" },
  { label: "Khách hàng", path: "/customers", emoji: "👥" },
  { label: "Flash Sale", path: "/flash-sale", emoji: "⚡" },
  { label: "Banner", path: "/banner", emoji: "🖼️" },
];

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-white border-r border-[#b8deff] flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#b8deff]">
        <h1
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-xl text-[#4A4A6A]"
        >
          momo's melody
        </h1>
        <p className="text-xs text-[#4A4A6A]/40 mt-0.5">Admin Dashboard</p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all ${
                isActive
                  ? "bg-[#b8deff] text-[#4A4A6A] font-medium"
                  : "text-[#4A4A6A]/60 hover:bg-[#aacae7] hover:text-[#4A4A6A]"
              }`
            }
          >
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#b8deff]">
        <p className="text-xs text-[#4A4A6A]/40">© 2025 momo's melody studio</p>
      </div>
    </div>
  );
};

export default Sidebar;
