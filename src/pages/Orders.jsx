import React, { useState, useEffect } from "react";

const statusOptions = ["Đang xử lý", "Đang giao", "Đã giao", "Đã hủy"];

const statusColor = {
  "Đang xử lý": "bg-[#FFD6E0] text-[#4A4A6A]",
  "Đang giao": "bg-[#FFF0A0] text-[#4A4A6A]",
  "Đã giao": "bg-[#B8DEFF] text-[#4A4A6A]",
  "Đã hủy": "bg-gray-100 text-gray-400",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/orders", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:4000/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, status } : o)),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = orders.filter(
    (o) => filterStatus === "Tất cả" || o.status === filterStatus,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[#4A4A6A]/40 text-sm">Đang tải đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
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
              className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-[#FFFAF5] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#4A4A6A]">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-[#4A4A6A]/50">
                    {order.user?.name} •{" "}
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold text-[#448ecf]">
                  {order.total.toLocaleString()} đ
                </p>

                <select
                  value={order.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium outline-none cursor-pointer ${statusColor[order.status]}`}
                >
                  {statusOptions.map((s) => (
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
              Không có đơn hàng nào
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
