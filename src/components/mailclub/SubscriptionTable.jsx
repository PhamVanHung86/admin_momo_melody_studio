import React from "react";
import {
  STATUS_FILTERS,
  statusColor,
  statusLabel,
} from "../../constants/mailClubData";

const SubscriptionTable = ({
  filteredSubscriptions,
  statusFilter,
  setStatusFilter,
  onSelectSub,
  onMarkShipped,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`text-xs px-4 py-2 rounded-full font-medium transition-all ${
              statusFilter === f.value
                ? "bg-[#8B98E3] text-white"
                : "bg-white text-[#4A4A6A]/60 border border-[#CBD1F2] hover:border-[#8B98E3]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#CBD1F2]/50 overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-[#CBD1F2]/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Gói
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Mailclub
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Đăng ký
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.map((s) => {
              // 📬 "Sắp cần đăng ký lại": vẫn active nhưng kỳ này là kỳ tự
              // động CUỐI CÙNG (remainingTurns = 0) — kỳ sau phải đăng ký lại
              const isExpiring = s.status === "active" && s.remainingTurns <= 0;

              return (
                <tr
                  key={s._id}
                  className={`border-b border-[#CBD1F2]/30 last:border-0 transition-colors ${
                    isExpiring ? "bg-orange-50" : "hover:bg-[#FFFAF5]"
                  }`}
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-[#4A4A6A]">
                      {s.name}
                    </p>
                    <p className="text-xs text-[#4A4A6A]/50">{s.email}</p>
                    <p className="text-xs text-[#4A4A6A]/50">{s.phone}</p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-[#CBD1F2] text-[#4A4A6A] font-medium">
                      {s.plan === "monthly" ? "🌸 Tháng" : "🎀 Quý"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[s.status]}`}
                    >
                      {statusLabel[s.status]}
                    </span>
                    {s.status === "active" && (
                      <p
                        className={`text-xs mt-1 ${
                          isExpiring ? "text-orange-500" : "text-[#4A4A6A]/50"
                        }`}
                      >
                        {isExpiring
                          ? "⚠️ Mailclub cuối"
                          : `Còn ${s.remainingTurns} Mailclub`}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {s.status === "active" ? (
                      <div className="flex flex-col gap-1">
                        {s.shipped ? (
                          <span className="text-xs px-3 py-1 rounded-full font-medium bg-[#d4e3f4] text-blue-500 w-fit">
                            📬 Đã giao
                          </span>
                        ) : (
                          <>
                            <span className="text-xs px-3 py-1 rounded-full font-medium bg-[#FFF0A0] text-[#4A4A6A] w-fit">
                              🚚 Đang giao hàng
                            </span>
                            {onMarkShipped && (
                              <button
                                onClick={() => onMarkShipped(s)}
                                className="text-[11px] text-[#8B98E3] hover:underline text-left"
                              >
                                Đánh dấu đã giao
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-[#4A4A6A]/30">
                        {s.status === "pending" ? "Chưa kích hoạt" : "—"}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-xs text-[#4A4A6A]/50">
                      {new Date(s.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => onSelectSub(s)}
                      className="text-xs px-3 py-1.5 rounded-xl border border-[#CBD1F2] text-[#4A4A6A] hover:bg-[#CBD1F2] transition-colors"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredSubscriptions.length === 0 && (
          <div className="text-center py-16">
            <span className="text-4xl">✉️</span>
            <p className="text-sm text-[#4A4A6A]/40 mt-3">
              Không có subscription nào
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionTable;
