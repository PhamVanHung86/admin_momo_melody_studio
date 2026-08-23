import React from "react";

const NewCyclePreviewModal = ({
  isOpen,
  onClose,
  loading,
  data, // { eligible, alreadyProcessed, pastOpenDate, cycleKey, total, recipients, subject, message }
  form, // { subject, message, excludeIds }
  setForm,
  confirming,
  confirmResult,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const recipients = data?.recipients || [];
  const activeCount = recipients.length - (form?.excludeIds?.length || 0);

  const toggleExclude = (id) => {
    setForm((prev) => ({
      ...prev,
      excludeIds: prev.excludeIds.includes(id)
        ? prev.excludeIds.filter((x) => x !== id)
        : [...prev.excludeIds, id],
    }));
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl px-4 max-h-[90vh]">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#CBD1F2]/50 flex items-center justify-between flex-shrink-0">
            <h3 className="text-lg font-semibold text-[#4A4A6A]">
              🌸 Xem trước — Mở Mail Club tháng mới
            </h3>
            <button
              onClick={onClose}
              className="text-[#4A4A6A]/30 hover:text-[#8B98E3] text-2xl"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
            {loading && (
              <p className="text-sm text-[#4A4A6A]/60 text-center py-6">
                Đang tải dữ liệu...
              </p>
            )}

            {!loading && data && (
              <>
                {confirmResult && (
                  <div
                    className={`text-sm px-4 py-3 rounded-xl text-center ${
                      confirmResult.includes("Lỗi") ||
                      confirmResult.includes("lỗi")
                        ? "bg-red-50 text-red-500"
                        : "bg-[#D4F4DD] text-green-700"
                    }`}
                  >
                    {confirmResult}
                  </div>
                )}

                {data.alreadyProcessed && (
                  <div className="text-sm px-4 py-3 rounded-xl text-center bg-orange-50 text-orange-600">
                    Kỳ tháng này ({data.cycleKey}) đã được xử lý rồi — không thể
                    gửi lại.
                  </div>
                )}

                {!data.pastOpenDate && (
                  <div className="text-sm px-4 py-3 rounded-xl text-center bg-orange-50 text-orange-600">
                    Chưa tới ngày 15 hàng tháng nên chưa thể mở kỳ mới.
                  </div>
                )}

                {/* Tiêu đề */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                    Tiêu đề email
                  </label>
                  <input
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    className="border border-[#CBD1F2] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#8B98E3]"
                  />
                </div>

                {/* Nội dung */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                    Nội dung
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    rows={5}
                    className="border border-[#CBD1F2] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#8B98E3] resize-none"
                  />
                  <p className="text-[11px] text-[#4A4A6A]/40">
                    Thông tin chuyển khoản &amp; nút bấm ở cuối mail sẽ được giữ
                    nguyên như mẫu.
                  </p>
                </div>

                {/* Người nhận */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                    Người nhận ({activeCount}/{recipients.length})
                  </label>
                  {recipients.length === 0 ? (
                    <p className="text-sm text-[#4A4A6A]/50">
                      Không có subscriber nào hết lượt để gửi nhắc.
                    </p>
                  ) : (
                    <div className="border border-[#CBD1F2] rounded-2xl p-3 max-h-48 overflow-y-auto flex flex-col gap-1">
                      {recipients.map((sub) => {
                        const excluded = form.excludeIds.includes(sub._id);
                        return (
                          <label
                            key={sub._id}
                            className="flex items-center gap-3 py-1.5 px-2 rounded-xl hover:bg-[#FFFAF5] cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={!excluded}
                              onChange={() => toggleExclude(sub._id)}
                              className="accent-[#8B98E3]"
                            />
                            <div className={excluded ? "opacity-40" : ""}>
                              <p className="text-sm text-[#4A4A6A]">
                                {sub.name}
                              </p>
                              <p className="text-xs text-[#4A4A6A]/40">
                                {sub.email}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Tóm tắt */}
                <div className="bg-[#FFFAF5] rounded-2xl p-4 border border-[#CBD1F2]/50">
                  <p className="text-xs text-[#4A4A6A]/50 mb-2">📋 Tóm tắt:</p>
                  <p className="text-xs text-[#4A4A6A]">
                    Sẽ gửi tới: <strong>{activeCount} người</strong>
                  </p>
                  <p className="text-xs text-[#4A4A6A] mt-1">
                    Tiêu đề: <strong>{form.subject}</strong>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#CBD1F2]/50 flex gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-[#CBD1F2] text-sm text-[#4A4A6A] hover:bg-[#E8EAF9]"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              disabled={
                loading ||
                confirming ||
                !data ||
                !data.eligible ||
                activeCount === 0
              }
              className="flex-1 py-3 rounded-2xl bg-[#8B98E3] text-white text-sm font-semibold hover:bg-[#8B98E3] disabled:opacity-50"
            >
              {confirming
                ? "Đang gửi..."
                : `✅ Xác nhận & gửi (${activeCount})`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCyclePreviewModal;
