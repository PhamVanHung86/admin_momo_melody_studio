import React from "react";
import { statusColor, statusLabel } from "../../constansts/mailClubData";

const CustomEmailModal = ({
  isOpen,
  onClose,
  emailForm,
  setEmailForm,
  emailSending,
  emailResult,
  subscriptions,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl px-4 max-h-[90vh]">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#FFD6E0]/50 flex items-center justify-between flex-shrink-0">
            <h3 className="text-lg font-semibold text-[#4A4A6A]">
              ✉️ Soạn email gửi khách
            </h3>
            <button
              onClick={onClose}
              className="text-[#4A4A6A]/30 hover:text-[#FFB7C5] text-2xl"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
            {emailResult && (
              <div
                className={`text-sm px-4 py-3 rounded-xl text-center ${
                  emailResult.includes("Lỗi")
                    ? "bg-red-50 text-red-500"
                    : "bg-[#D4F4DD] text-green-700"
                }`}
              >
                {emailResult}
              </div>
            )}

            {/* Chọn người nhận */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Người nhận
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    value: "active",
                    label: "✅ Đang active",
                    count: subscriptions.filter((s) => s.status === "active")
                      .length,
                  },
                  {
                    value: "all",
                    label: "👥 Tất cả",
                    count: subscriptions.length,
                  },
                  {
                    value: "specific",
                    label: "🎯 Chọn tay",
                    count: emailForm.specificIds.length,
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setEmailForm({ ...emailForm, recipientType: opt.value })
                    }
                    className={`py-3 px-3 rounded-2xl text-xs font-medium transition-all text-center ${
                      emailForm.recipientType === opt.value
                        ? "bg-[#FFB7C5] text-white"
                        : "bg-[#FFFAF5] text-[#4A4A6A]/60 border border-[#FFD6E0] hover:border-[#FFB7C5]"
                    }`}
                  >
                    <p>{opt.label}</p>
                    <p className="text-[10px] mt-0.5 opacity-70">
                      {opt.count} người
                    </p>
                  </button>
                ))}
              </div>

              {/* Chọn từng người */}
              {emailForm.recipientType === "specific" && (
                <div className="border border-[#FFD6E0] rounded-2xl p-3 max-h-40 overflow-y-auto flex flex-col gap-1 mt-2">
                  {subscriptions.map((sub) => (
                    <label
                      key={sub._id}
                      className="flex items-center gap-3 py-1.5 px-2 rounded-xl hover:bg-[#FFFAF5] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={emailForm.specificIds.includes(sub._id)}
                        onChange={() =>
                          setEmailForm((prev) => ({
                            ...prev,
                            specificIds: prev.specificIds.includes(sub._id)
                              ? prev.specificIds.filter((id) => id !== sub._id)
                              : [...prev.specificIds, sub._id],
                          }))
                        }
                        className="accent-[#FFB7C5]"
                      />
                      <div>
                        <p className="text-sm text-[#4A4A6A]">{sub.name}</p>
                        <p className="text-xs text-[#4A4A6A]/40">{sub.email}</p>
                      </div>
                      <span
                        className={`ml-auto text-xs px-2 py-0.5 rounded-full ${statusColor[sub.status]}`}
                      >
                        {statusLabel[sub.status]}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Tiêu đề */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Tiêu đề email
              </label>
              <input
                value={emailForm.subject}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, subject: e.target.value })
                }
                placeholder="VD: 🎀 Bộ sưu tập tháng 7 đã ra mắt!"
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
              />
            </div>

            {/* Nội dung */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Nội dung
              </label>
              <textarea
                value={emailForm.message}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, message: e.target.value })
                }
                rows={6}
                placeholder="Viết nội dung email tại đây...&#10;&#10;VD: Tháng này momo có ra mắt bộ sưu tập mới với chủ đề..."
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] resize-none"
              />
            </div>

            {/* Nút CTA (tùy chọn) */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Nút kêu gọi hành động (tùy chọn)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/40">Text nút</label>
                  <input
                    value={emailForm.buttonText}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, buttonText: e.target.value })
                    }
                    placeholder="VD: Xem ngay 🌸"
                    className="border border-[#FFD6E0] rounded-xl px-4 py-2.5 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/40">Link</label>
                  <input
                    value={emailForm.buttonLink}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, buttonLink: e.target.value })
                    }
                    placeholder="VD: https://momomelody.vn"
                    className="border border-[#FFD6E0] rounded-xl px-4 py-2.5 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                  />
                </div>
              </div>
            </div>

            {/* Preview tóm tắt */}
            <div className="bg-[#FFFAF5] rounded-2xl p-4 border border-[#FFD6E0]/50">
              <p className="text-xs text-[#4A4A6A]/50 mb-2">📋 Tóm tắt:</p>
              <p className="text-xs text-[#4A4A6A]">
                Gửi tới:{" "}
                <strong>
                  {emailForm.recipientType === "active"
                    ? `${subscriptions.filter((s) => s.status === "active").length} subscriber đang active`
                    : emailForm.recipientType === "all"
                      ? `${subscriptions.length} tất cả subscriber`
                      : `${emailForm.specificIds.length} người được chọn`}
                </strong>
              </p>
              {emailForm.subject && (
                <p className="text-xs text-[#4A4A6A] mt-1">
                  Tiêu đề: <strong>{emailForm.subject}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#FFD6E0]/50 flex gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-[#FFD6E0] text-sm text-[#4A4A6A] hover:bg-[#FFF0F5]"
            >
              Hủy
            </button>
            <button
              onClick={onSubmit}
              disabled={
                emailSending || !emailForm.subject || !emailForm.message
              }
              className="flex-1 py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold hover:bg-[#ff9db5] disabled:opacity-50"
            >
              {emailSending ? "Đang gửi..." : `Gửi email ✉️`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomEmailModal;
