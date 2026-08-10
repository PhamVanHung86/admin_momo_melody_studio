import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "./ConfirmModal";

const navItems = [
  { label: "Dashboard", path: "/dashboard", emoji: "📊" },
  { label: "Sản phẩm", path: "/products", emoji: "📦" },
  { label: "Thêm sản phẩm", path: "/products/add", emoji: "➕" },
  { label: "Đơn hàng", path: "/orders", emoji: "🛍️" },
  { label: "Khách hàng", path: "/customers", emoji: "👥" },
  { label: "Mail Club", path: "/mail-club", emoji: "✉️" },
  { label: "BST Mail Club", path: "/mail-club-collections", emoji: "🖼️" },
  { label: "Flash Sale", path: "/flash-sale", emoji: "⚡" },
  { label: "Banner", path: "/banner", emoji: "🖼️" },
  { label: "Message", path: "/message", emoji: "📩" },
];

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  return (
    <>
      {/* Overlay - chỉ hiện khi sidebar mở trên tablet/mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-[#b8deff] flex flex-col z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#b8deff] flex items-center justify-between">
          <div>
            <h1
              style={{ fontFamily: "'Dancing Script', cursive" }}
              className="text-xl text-[#4A4A6A]"
            >
              momo's melody
            </h1>
            <p className="text-xs text-[#4A4A6A]/40 mt-0.5">Admin Dashboard</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng menu"
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full text-[#4A4A6A]/60 hover:bg-[#FFFAF5]"
          >
            ✕
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={onClose}
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
        <div className="px-6 py-4 border-t border-[#b8deff] flex flex-col gap-3">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-[#4A4A6A]/60 hover:bg-red-50 hover:text-red-500 transition-all w-full"
          >
            <span>🚪</span>
            <span>Đăng xuất</span>
          </button>
          <p className="text-xs text-[#4A4A6A]/40">© 2025 momo's melody studio</p>
        </div>
      </div>

      <ConfirmModal
        open={showLogoutConfirm}
        title="Đăng xuất"
        message="Bạn có chắc muốn đăng xuất?"
        confirmLabel="Đăng xuất"
        cancelLabel="Huỷ"
        danger
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};

export default Sidebar;
