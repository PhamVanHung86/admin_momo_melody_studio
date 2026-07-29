import React from "react";

const EditSubscriberModal = ({
  isOpen,
  onClose,
  selectedSub,
  editTimeForm,
  setEditTimeForm,
  onSubmit,
}) => {
  if (!isOpen || !selectedSub) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-md px-4 max-h-[85vh]">
        <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
          <h3 className="text-lg font-semibold text-[#4A4A6A] mb-5">
            ✏️ Sửa thông tin & thời gian
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">Họ tên</label>
              <input
                value={editTimeForm.name}
                onChange={(e) =>
                  setEditTimeForm({ ...editTimeForm, name: e.target.value })
                }
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">Email</label>
              <input
                value={editTimeForm.email}
                onChange={(e) =>
                  setEditTimeForm({ ...editTimeForm, email: e.target.value })
                }
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">Số điện thoại</label>
              <input
                value={editTimeForm.phone}
                onChange={(e) =>
                  setEditTimeForm({ ...editTimeForm, phone: e.target.value })
                }
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">Địa chỉ</label>
              <textarea
                value={editTimeForm.address}
                onChange={(e) =>
                  setEditTimeForm({ ...editTimeForm, address: e.target.value })
                }
                rows={2}
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#4A4A6A]/60">Gói</label>
                <select
                  value={editTimeForm.plan}
                  onChange={(e) =>
                    setEditTimeForm({ ...editTimeForm, plan: e.target.value })
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
                  value={editTimeForm.status}
                  onChange={(e) =>
                    setEditTimeForm({ ...editTimeForm, status: e.target.value })
                  }
                  className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                >
                  <option value="active">✅ Active</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="expired">❌ Hết hạn</option>
                  <option value="cancelled">🚫 Đã hủy</option>
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
                  value={editTimeForm.startDate}
                  onChange={(e) =>
                    setEditTimeForm({
                      ...editTimeForm,
                      startDate: e.target.value,
                    })
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
                  value={editTimeForm.endDate}
                  onChange={(e) =>
                    setEditTimeForm({
                      ...editTimeForm,
                      endDate: e.target.value,
                    })
                  }
                  className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">Ghi chú</label>
              <textarea
                value={editTimeForm.adminNote}
                onChange={(e) =>
                  setEditTimeForm({
                    ...editTimeForm,
                    adminNote: e.target.value,
                  })
                }
                rows={2}
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
              onClick={() => onSubmit(selectedSub._id)}
              className="flex-1 py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold hover:bg-[#ff9db5]"
            >
              Lưu thay đổi 🌸
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditSubscriberModal;
