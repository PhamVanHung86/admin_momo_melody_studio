import React, { useState, useEffect } from "react";
import { statusColor_order } from "../constansts/mailClubData";

const CustomerDetailModal = ({ customerId, onClose }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/users/${customerId}`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();
        if (data.success) setCustomer(data.customer);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [customerId]);

  const latestOrder = customer?.orders?.[0];

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[85vh] px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
          {loading ? (
            <div className="p-12 text-center">
              <p className="text-[#4A4A6A]/40 text-sm">Đang tải...</p>
            </div>
          ) : customer ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-[#FFD6E0]/50 flex items-start justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                  {customer.avatar ? (
                    <img
                      src={customer.avatar}
                      className="w-14 h-14 rounded-full object-cover"
                      alt={customer.name}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#FFD6E0] flex items-center justify-center text-lg font-medium text-[#4A4A6A]">
                      {customer.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-[#4A4A6A]">
                        {customer.name}
                      </p>
                      {customer.nickname && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5E6FF] text-[#8B98E3]">
                          {customer.nickname}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#4A4A6A]/50">
                      {customer.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-[#4A4A6A]/30 hover:text-[#FFB7C5] text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Body — scrollable */}
              <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#FFD6E0]/30 rounded-2xl p-4 text-center">
                    <p className="text-xs text-[#4A4A6A]/50 mb-1">
                      Tổng đơn hàng
                    </p>
                    <p className="text-xl font-semibold text-[#4A4A6A]">
                      {customer.totalOrders}
                    </p>
                  </div>
                  <div className="bg-[#FFF0A0]/30 rounded-2xl p-4 text-center">
                    <p className="text-xs text-[#4A4A6A]/50 mb-1">
                      Tổng chi tiêu
                    </p>
                    <p className="text-lg font-semibold text-[#FFB7C5]">
                      {customer.totalSpent.toLocaleString()} đ
                    </p>
                  </div>
                  <div className="bg-[#B8DEFF]/30 rounded-2xl p-4 text-center">
                    <p className="text-xs text-[#4A4A6A]/50 mb-1">Tham gia</p>
                    <p className="text-sm font-medium text-[#4A4A6A]">
                      {new Date(customer.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>

                {/* Thông tin liên hệ */}
                <div>
                  <p className="text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider mb-3">
                    Thông tin liên hệ
                  </p>
                  <div className="bg-[#FFFAF5] rounded-2xl p-4 flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#4A4A6A]/50">Số điện thoại</span>
                      <span className="text-[#4A4A6A] font-medium">
                        {latestOrder?.shippingInfo?.phone || "Chưa có"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4A4A6A]/50">Địa chỉ</span>
                      <span className="text-[#4A4A6A] font-medium text-right max-w-[60%]">
                        {latestOrder?.shippingInfo?.address || "Chưa có"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4A4A6A]/50">Mail Club</span>
                      <span
                        className={`font-medium ${customer.mailClubSubscribed ? "text-[#FFB7C5]" : "text-[#4A4A6A]/40"}`}
                      >
                        {customer.mailClubSubscribed
                          ? "✓ Đã đăng ký"
                          : "Chưa đăng ký"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lịch sử đơn hàng */}
                <div>
                  <p className="text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider mb-3">
                    Lịch sử đơn hàng ({customer.orders.length})
                  </p>
                  {customer.orders.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {customer.orders.map((order) => (
                        <div
                          key={order._id}
                          className="border border-[#FFD6E0]/50 rounded-2xl p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-[#4A4A6A]">
                              #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#4A4A6A]/40">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${statusColor_order[order.status]}`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            {order.items.map((item, i) => (
                              <p key={i} className="text-xs text-[#4A4A6A]/60">
                                {item.name} x{item.quantity}
                              </p>
                            ))}
                          </div>
                          <p className="text-sm font-semibold text-[#FFB7C5] text-right mt-2">
                            {order.total.toLocaleString()} đ
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#4A4A6A]/40 text-center py-6">
                      Chưa có đơn hàng nào
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <p className="text-[#4A4A6A]/40 text-sm">
                Không tìm thấy thông tin
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerDetailModal;
