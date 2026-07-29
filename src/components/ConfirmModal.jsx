import React, { useState, useEffect } from "react";

/**
 * Modal xác nhận dùng chung.
 *
 * Props:
 * - open: bool — có hiển thị modal hay không
 * - title: string
 * - message: string | ReactNode
 * - confirmLabel / cancelLabel: string
 * - danger: bool — đổi màu nút xác nhận sang đỏ (dùng cho hành động huỷ/xoá)
 * - checkbox: { label, defaultChecked } — nếu có, hiển thị thêm 1 checkbox
 *   (ví dụ: "Gửi email thông báo cho khách"), giá trị của nó sẽ được truyền
 *   vào onConfirm(checked)
 * - loading: bool — vô hiệu hoá nút trong lúc đang xử lý
 * - onConfirm(checked): gọi khi bấm xác nhận
 * - onCancel(): gọi khi bấm huỷ / đóng modal
 */
const ConfirmModal = ({
  open,
  title = "Xác nhận",
  message = "",
  confirmLabel = "Xác nhận",
  cancelLabel = "Huỷ",
  danger = false,
  checkbox = null,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const [checked, setChecked] = useState(checkbox?.defaultChecked ?? true);

  // Reset lại giá trị checkbox mỗi lần modal được mở
  useEffect(() => {
    if (open) setChecked(checkbox?.defaultChecked ?? true);
  }, [open, checkbox?.defaultChecked]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3 className="text-base font-semibold text-[#4A4A6A]">{title}</h3>
          {message && (
            <p className="text-sm text-[#4A4A6A]/60 mt-2">{message}</p>
          )}
        </div>

        {checkbox && (
          <label className="flex items-center gap-2 text-sm text-[#4A4A6A] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="w-4 h-4 rounded accent-[#b8deff] cursor-pointer"
            />
            {checkbox.label}
          </label>
        )}

        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-full text-xs font-medium text-[#4A4A6A]/60 border border-[#b8deff] hover:border-[#e6f0ff] transition-all disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => onConfirm(checked)}
            disabled={loading}
            className={`px-4 py-2 rounded-full text-xs font-medium text-white transition-all disabled:opacity-50 ${
              danger
                ? "bg-red-400 hover:bg-red-500"
                : "bg-[#b8deff] hover:bg-[#aacae7]"
            }`}
          >
            {loading ? "Đang xử lý..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
