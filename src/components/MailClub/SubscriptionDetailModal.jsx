import React from "react";
import { statusColor, statusLabel } from "../../constansts/mailClubData";

const SubscriptionDetailModal = ({
  selectedSub,
  onClose,
  actionResult,
  adminNote,
  setAdminNote,
  renewPlan,
  setRenewPlan,
  onConfirmPayment,
  onRenewSub,
  onCancelSub,
  onOpenEditTime,
}) => {
  if (!selectedSub) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg px-4 max-h-[85vh]">
        <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
          {actionResult && (
            <div className="bg-[#D4F4DD] text-green-700 text-sm px-4 py-3 rounded-xl mb-4 text-center">
              {actionResult}
            </div>
          )}

          {/* Info */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-[#4A4A6A]">
                {selectedSub.name}
              </h3>
              <p className="text-sm text-[#4A4A6A]/50">{selectedSub.email}</p>
              <p className="text-sm text-[#4A4A6A]/50">{selectedSub.phone}</p>
            </div>
            <button
              onClick={onClose}
              className="text-[#4A4A6A]/30 hover:text-[#FFB7C5] text-2xl"
            >
              ×
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-[#FFF0F5] rounded-2xl p-3 text-center">
              <p className="text-xs text-[#4A4A6A]/50 mb-1">Gói</p>
              <p className="text-sm font-semibold text-[#4A4A6A]">
                {selectedSub.plan === "monthly" ? "Tháng" : "Quý"}
              </p>
            </div>
            <div className="bg-[#FFF0F5] rounded-2xl p-3 text-center">
              <p className="text-xs text-[#4A4A6A]/50 mb-1">Trạng thái</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${statusColor[selectedSub.status]}`}
              >
                {statusLabel[selectedSub.status]}
              </span>
            </div>
            <div className="bg-[#FFF0F5] rounded-2xl p-3 text-center">
              <p className="text-xs text-[#4A4A6A]/50 mb-1">Gia hạn</p>
              <p className="text-sm font-semibold text-[#4A4A6A]">
                {selectedSub.renewalHistory?.length || 0} lần
              </p>
            </div>
          </div>

          {/* Thời gian */}
          {selectedSub.startDate && (
            <div className="bg-[#FFFAF5] rounded-2xl p-4 mb-5 text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-[#4A4A6A]/50">Bắt đầu</span>
                <span className="text-[#4A4A6A]">
                  {new Date(selectedSub.startDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A4A6A]/50">Hết hạn</span>
                <span className="text-[#FFB7C5] font-semibold">
                  {new Date(selectedSub.endDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          )}

          {/* Lịch sử gia hạn */}
          {selectedSub.renewalHistory?.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider mb-2">
                Lịch sử gia hạn
              </p>
              <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
                {selectedSub.renewalHistory.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs bg-[#FFFAF5] rounded-xl px-3 py-2"
                  >
                    <span className="text-[#4A4A6A]/60">{h.note}</span>
                    <span className="text-[#4A4A6A]/40">
                      {new Date(h.renewedAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ghi chú admin */}
          <div className="mb-5">
            <label className="text-xs text-[#4A4A6A]/60 mb-1 block">
              Ghi chú admin
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={2}
              className="w-full border border-[#FFD6E0] rounded-xl px-3 py-2 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] resize-none"
            />
          </div>

          <button
            onClick={onOpenEditTime}
            className="w-full py-2.5 mb-3 rounded-xl border border-[#FFD6E0] text-[#4A4A6A] text-sm hover:bg-[#FFF0F5] transition-colors"
          >
            ✏️ Sửa thông tin & thời gian
          </button>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {selectedSub.status === "pending" && (
              <button
                onClick={() => onConfirmPayment(selectedSub._id)}
                className="w-full py-3 rounded-2xl bg-[#D4F4DD] text-green-700 text-sm font-semibold hover:bg-green-100 transition-colors"
              >
                ✅ Xác nhận đã thanh toán
              </button>
            )}

            {(selectedSub.status === "active" ||
              selectedSub.status === "expired") && (
              <div className="flex gap-2">
                <select
                  value={renewPlan}
                  onChange={(e) => setRenewPlan(e.target.value)}
                  className="border border-[#FFD6E0] rounded-xl px-3 py-2 text-sm text-[#4A4A6A] outline-none flex-1"
                >
                  <option value="monthly">🌸 Gia hạn Tháng</option>
                  <option value="quarterly">🎀 Gia hạn Quý</option>
                </select>
                <button
                  onClick={() => onRenewSub(selectedSub._id)}
                  className="flex-1 py-2 rounded-xl bg-[#B8DEFF] text-[#4A4A6A] text-sm font-semibold hover:bg-[#9ed0ff] transition-colors"
                >
                  🔄 Gia hạn
                </button>
              </div>
            )}

            {selectedSub.status !== "cancelled" && (
              <button
                onClick={() => onCancelSub(selectedSub._id)}
                className="w-full py-2.5 rounded-xl border border-red-200 text-red-400 text-sm hover:bg-red-50 transition-colors"
              >
                Hủy subscription
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionDetailModal;
