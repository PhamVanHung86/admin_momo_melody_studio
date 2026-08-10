import React, { useState, useEffect } from "react";
import { statusColor_order, statusOptions } from "../constansts/mailClubData";
import { apiFetch } from "../api/client";
import TableSkeleton from "../components/TableSkeleton";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";
import { handleApiError } from "../utils/handleError";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [expandedId, setExpandedId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await apiFetch("/api/orders", {
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      handleApiError(err, "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // 1. Lắng nghe tín hiệu cập nhật từ MailClubManager
    const handleSync = () => fetchOrders();
    window.addEventListener("mailclub-updated", handleSync);

    // Dọn dẹp listener khi unmount
    return () => window.removeEventListener("mailclub-updated", handleSync);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await apiFetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, status } : o)),
        );
        window.dispatchEvent(new Event("mailclub-updated"));
      }
    } catch (err) {
      handleApiError(err, "Cập nhật trạng thái thất bại");
    }
  };

  const handleConfirmOrder = async (sendEmail) => {
    if (!confirmTarget) return;
    setConfirming(true);
    try {
      const res = await apiFetch(`/api/orders/${confirmTarget._id}/confirm`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sendEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === confirmTarget._id ? { ...o, status: "Đã xác nhận" } : o,
          ),
        );
        setConfirmTarget(null);
        toast.success("Đã xác nhận đơn hàng");
        window.dispatchEvent(new Event("mailclub-updated"));
      } else {
        handleApiError(data.message, "Xác nhận đơn hàng thất bại");
      }
    } catch (err) {
      handleApiError(err, "Xác nhận đơn hàng thất bại");
    } finally {
      setConfirming(false);
    }
  };

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === "Tất cả" || o.status === filterStatus;

    const orderCode = o._id.slice(-8).toUpperCase();
    const query = searchQuery.trim().replace("#", "").toUpperCase();
    const matchSearch = query === "" || orderCode.includes(query);

    return matchStatus && matchSearch;
  });

  if (loading) {
    return <TableSkeleton rows={12} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Tìm kiếm theo mã đơn */}
      <div className="relative max-w-xs">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm theo mã đơn (VD: A1B2C3D4)"
          className="w-full px-4 py-2.5 rounded-full text-sm bg-white border border-[#b8deff] outline-none placeholder:text-[#4A4A6A]/30 text-[#4A4A6A] focus:border-[#8B98E3] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A4A6A]/30 hover:text-[#4A4A6A] text-sm"
          >
            ×
          </button>
        )}
      </div>
      {/* Filter */}
      <div className="flex gap-3 flex-wrap">
        {["Tất cả", ...statusOptions].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              filterStatus === status
                ? "bg-[#b8deff] text-white"
                : "bg-white text-[#4A4A6A]/60 border border-[#b8deff] hover:border-[#e6f0ff]"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      <div className="flex flex-col gap-4">
        {filtered.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-3xl border border-[#FFD6E0]/50 overflow-hidden"
          >
            {/* Header — click để mở rộng */}
            <div
              onClick={() =>
                setExpandedId(expandedId === order._id ? null : order._id)
              }
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 sm:justify-between px-4 sm:px-6 py-4 cursor-pointer hover:bg-[#FFFAF5] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#4A4A6A]">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-[#4A4A6A]/50">
                    {order.user?.name || order.guestEmail || "Khách"}
                  </p>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-2 sm:gap-4">
                <p className="text-sm font-semibold text-[#448ecf]">
                  {order.total.toLocaleString()} đ
                </p>

                {order.status === "Đang xử lý" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmTarget(order);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full font-medium bg-[#C9A0FF] text-white hover:bg-[#b98cf0] transition-colors"
                  >
                    ✅ Xác nhận
                  </button>
                )}

                <select
                  value={order.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium outline-none cursor-pointer ${statusColor_order[order.status]}`}
                >
                  {statusOptions
                    .filter(
                      (s) =>
                        s !== "Đã xác nhận" || order.status === "Đã xác nhận",
                    )
                    .map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                </select>

                <span className="text-[#4A4A6A]/30 text-xs">
                  {expandedId === order._id ? "▲" : "▼"}
                </span>
              </div>
            </div>

            {/* Chi tiết — mở rộng */}
            {expandedId === order._id && (
              <div className="px-6 py-4 border-t border-[#FFD6E0]/50 bg-[#FFFAF5] flex flex-col gap-4">
                {/* Thông tin giao hàng */}
                <div>
                  <p className="text-xs font-semibold text-[#4A4A6A]/50 uppercase mb-2">
                    Thông tin giao hàng
                  </p>
                  <p className="text-sm text-[#4A4A6A]">
                    {order.shippingInfo.name} — {order.shippingInfo.phone}
                  </p>
                  <p className="text-sm text-[#4A4A6A]/70">
                    {order.shippingInfo.address}
                  </p>
                  {order.shippingInfo.note && (
                    <p className="text-xs text-[#4A4A6A]/50 mt-1">
                      Ghi chú: {order.shippingInfo.note}
                    </p>
                  )}
                </div>

                {/* Sản phẩm */}
                <div>
                  <p className="text-xs font-semibold text-[#4A4A6A]/50 uppercase mb-2">
                    Sản phẩm
                  </p>
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-2 border-b border-[#FFD6E0]/30 last:border-0"
                    >
                      <img
                        src={item.image}
                        className="w-10 h-10 rounded-xl object-cover"
                        alt={item.name}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-[#4A4A6A]">{item.name}</p>
                        <p className="text-xs text-[#4A4A6A]/50">
                          x{item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-[#448ecf]">
                        {(item.price * item.quantity).toLocaleString()} đ
                      </p>
                    </div>
                  ))}
                </div>

                {/* Tổng tiền */}
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-[#4A4A6A]/60">Phương thức</span>
                  <span className="text-[#4A4A6A] font-medium">
                    {order.paymentMethod === "cod"
                      ? "💵 COD"
                      : "🏦 Chuyển khoản"}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#FFD6E0]/50">
            <span className="text-4xl">📦</span>
            <p className="text-sm text-[#4A4A6A]/40 mt-3">
              {searchQuery
                ? `Không tìm thấy đơn hàng nào khớp "${searchQuery}"`
                : "Không có đơn hàng nào"}
            </p>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!confirmTarget}
        title="Xác nhận đơn hàng"
        message={
          confirmTarget
            ? `Xác nhận đơn #${confirmTarget._id.slice(-8).toUpperCase()} của ${
                confirmTarget.user?.name || confirmTarget.guestEmail || "khách"
              }?`
            : ""
        }
        confirmLabel="Xác nhận"
        cancelLabel="Huỷ"
        loading={confirming}
        checkbox={{
          label: "Gửi email thông báo cho khách",
          defaultChecked: false,
        }}
        onConfirm={handleConfirmOrder}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
};

export default Orders;
