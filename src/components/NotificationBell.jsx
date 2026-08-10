import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

// Khoảng thời gian giữa mỗi lần polling (ms)
const POLL_INTERVAL = 20000;

const NotificationBell = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const fetchPendingCount = useCallback(async () => {
    try {
      const res = await apiFetch("/api/orders/pending-count", {
      });
      const data = await res.json();
      if (data.success) setPendingCount(data.count);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchPendingCount]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToOrders = () => {
    setOpen(false);
    navigate("/orders");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 rounded-full bg-[#FFFAF5] hover:bg-[#FFF0F5] flex items-center justify-center transition-colors"
        aria-label="Thông báo"
      >
        <span className="text-base">🔔</span>
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-400 text-white text-[10px] font-semibold flex items-center justify-center">
            {pendingCount > 99 ? "99+" : pendingCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#FFD6E0]/50 shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-[#FFD6E0]/50">
            <p className="text-sm font-semibold text-[#4A4A6A]">Thông báo</p>
          </div>
          <div className="px-4 py-4">
            {pendingCount > 0 ? (
              <>
                <p className="text-sm text-[#4A4A6A]">
                  Có{" "}
                  <span className="font-semibold text-[#448ecf]">
                    {pendingCount}
                  </span>{" "}
                  đơn hàng mới đang chờ xác nhận.
                </p>
                <button
                  type="button"
                  onClick={goToOrders}
                  className="mt-3 w-full text-xs font-medium text-white bg-[#b8deff] hover:bg-[#aacae7] rounded-full py-2 transition-colors"
                >
                  Xem đơn hàng
                </button>
              </>
            ) : (
              <p className="text-sm text-[#4A4A6A]/50">
                Không có đơn hàng nào cần xác nhận 🎀
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
