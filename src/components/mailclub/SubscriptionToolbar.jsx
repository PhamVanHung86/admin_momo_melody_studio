import React from "react";

const SubscriptionToolbar = ({
  counts = { pending: 0, expiring: 0 }, // Thêm giá trị mặc định tránh undefined
  search = "",
  setSearch,
  onOpenAddForm,
  onSendReminders,
  sending,
  onOpenEmailModal,
}) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        {(counts?.pending || 0) > 0 && (
          <span className="text-xs bg-[#FFF0A0] text-[#4A4A6A] px-3 py-1 rounded-full font-medium">
            {counts.pending} chờ xác nhận
          </span>
        )}
        {counts.expiring > 0 && (
          <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">
            {counts.expiring} sắp hết hạn
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onOpenAddForm}
          className="text-xs px-4 py-2 rounded-xl bg-[#FFB7C5] text-white font-medium hover:bg-[#ff9db5] transition-colors"
        >
          + Thêm subscriber
        </button>
        <button
          onClick={onSendReminders}
          disabled={sending}
          className="text-xs px-4 py-2 rounded-xl bg-[#E8E4F5] text-[#8B98E3] font-medium hover:bg-[#D4D0F0] transition-colors disabled:opacity-50"
        >
          {sending ? "Đang gửi..." : "📧 Gửi nhắc gia hạn"}
        </button>
        <button
          onClick={onOpenEmailModal}
          className="text-xs px-4 py-2 rounded-xl bg-[#E8E4F5] text-[#8B98E3] font-medium hover:bg-[#D4D0F0] transition-colors"
        >
          ✉️ Soạn email
        </button>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm tên, email, SĐT..."
          className="border border-[#FFD6E0] rounded-xl px-4 py-2 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] bg-white w-48"
        />
      </div>
    </div>
  );
};

export default SubscriptionToolbar;
