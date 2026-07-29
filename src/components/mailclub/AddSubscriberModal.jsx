import React from "react";

const AddSubscriberModal = ({
  isOpen,
  onClose,
  addForm,
  setAddForm,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4 max-h-[85vh]">
        <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
          <h3 className="text-lg font-semibold text-[#4A4A6A] mb-5">
            + Thêm subscriber thủ công
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">
                Họ tên <span className="text-[#FFB7C5]">*</span>
              </label>
              <input
                value={addForm.name}
                onChange={(e) =>
                  setAddForm({ ...addForm, name: e.target.value })
                }
                placeholder="Nguyễn Văn A"
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">
                Email <span className="text-[#FFB7C5]">*</span>
              </label>
              <input
                type="email"
                value={addForm.email}
                onChange={(e) =>
                  setAddForm({ ...addForm, email: e.target.value })
                }
                placeholder="example@gmail.com"
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">
                Số điện thoại <span className="text-[#FFB7C5]">*</span>
              </label>
              <input
                value={addForm.phone}
                onChange={(e) =>
                  setAddForm({ ...addForm, phone: e.target.value })
                }
                placeholder="0901 234 567"
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">Địa chỉ</label>
              <textarea
                value={addForm.address}
                onChange={(e) =>
                  setAddForm({ ...addForm, address: e.target.value })
                }
                rows={2}
                placeholder="Số nhà, đường, phường, quận, tỉnh/thành phố"
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#4A4A6A]/60">Gói</label>
                <select
                  value={addForm.plan}
                  onChange={(e) =>
                    setAddForm({ ...addForm, plan: e.target.value })
                  }
                  className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                >
                  <option value="monthly">🌸 Tháng</option>
                  <option value="quarterly">🎀 Quý</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#4A4A6A]/60">Trạng thái</label>
                <select
                  value={addForm.status}
                  onChange={(e) =>
                    setAddForm({ ...addForm, status: e.target.value })
                  }
                  className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                >
                  <option value="active">✅ Active</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="expired">❌ Hết hạn</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#4A4A6A]/60">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  value={addForm.startDate}
                  onChange={(e) =>
                    setAddForm({ ...addForm, startDate: e.target.value })
                  }
                  className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#4A4A6A]/60">
                  Ngày hết hạn
                </label>
                <input
                  type="date"
                  value={addForm.endDate}
                  onChange={(e) =>
                    setAddForm({ ...addForm, endDate: e.target.value })
                  }
                  className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">Ghi chú</label>
              <textarea
                value={addForm.adminNote}
                onChange={(e) =>
                  setAddForm({ ...addForm, adminNote: e.target.value })
                }
                rows={2}
                placeholder="VD: Khách nhắn tin Facebook, tháng 5/2025..."
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-[#FFD6E0] text-sm text-[#4A4A6A] hover:bg-[#FFF0F5]"
            >
              Hủy
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold hover:bg-[#ff9db5]"
            >
              Thêm subscriber ✅
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSubscriberModal;
