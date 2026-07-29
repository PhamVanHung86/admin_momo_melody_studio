import React from "react";
import { MONTHS } from "../../constansts/mailClubData";
import CuteLoadingModal from "../CuteLoadingModal"; // TODO: chỉnh lại đường dẫn cho đúng vị trí thật của file này trong project

const CreateCollectionModal = ({
  show,
  onClose,
  form,
  setForm,
  previews,
  handleImageSelect,
  handleCreate,
  isUploading,
  setIsUploading,
}) => {
  if (!show) return null;

  return (
    <>
      <div
        onClick={() => !isUploading && onClose()}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg px-4 max-h-[85vh]">
        <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh] relative">
          {isUploading && (
            <div className="absolute inset-0 z-50 rounded-3xl overflow-hidden bg-white/85 backdrop-blur-sm flex items-center justify-center">
              <CuteLoadingModal
                isLoading={isUploading}
                text="Đang tạo bộ sưu tập và tải ảnh lên... Chờ chút nhé!!!"
                fullScreen={false}
              />
            </div>
          )}

          <h3 className="text-lg font-semibold text-[#4A4A6A] mb-5">
            🌸 Tạo bộ sưu tập mới
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">Tiêu đề</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="VD: Bộ sưu tập Tháng 6 🌸"
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#4A4A6A]/60">Tháng</label>
                <select
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: e.target.value })}
                  className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                >
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#4A4A6A]/60">Năm</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">
                Mô tả (tùy chọn)
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                placeholder="Giới thiệu về bộ sưu tập tháng này..."
                className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#4A4A6A]/60">
                Ảnh sản phẩm (tối đa 10 ảnh)
              </label>
              <label className="border-2 border-dashed border-[#FFD6E0] hover:border-[#FFB7C5] rounded-2xl p-4 cursor-pointer text-center transition-colors">
                <span className="text-2xl">🖼️</span>
                <p className="text-xs text-[#4A4A6A]/50 mt-1">
                  Click để chọn nhiều ảnh
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </label>
              {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {previews.map((p, i) => (
                    <img
                      key={i}
                      src={p}
                      className="aspect-square object-cover rounded-xl"
                      alt=""
                    />
                  ))}
                </div>
              )}
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
              onClick={handleCreate}
              className="flex-1 py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold hover:bg-[#ff9db5]"
            >
              Tạo bộ sưu tập 🌸
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCollectionModal;
