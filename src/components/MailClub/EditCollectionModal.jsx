import React from "react";
import { MONTHS } from "../../constansts/mailClubData";
import CuteLoadingModal from "../CuteLoadingModal"; // TODO: chỉnh lại đường dẫn cho đúng vị trí thật của file này trong project

const EditCollectionModal = ({
  collection,
  onClose,
  editForm,
  setEditForm,
  handleUpdateInfo,
  isUpdatingInfo,
  handleRemoveImage,
  handleAddImageSelect,
  addPreviews,
  addImageFiles,
  handleAddImages,
  isAddingImages,
  setIsAddingImages,
}) => {
  if (!collection) return null;

  return (
    <>
      <div
        onClick={() => !isAddingImages && onClose()}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl px-4 max-h-[85vh]">
        <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh] relative">
          {isAddingImages && (
            <div className="absolute inset-0 z-50 rounded-3xl overflow-hidden bg-white/85 backdrop-blur-sm flex items-center justify-center">
              <CuteLoadingModal
                isLoading={isAddingImages}
                text="Đang tải các ảnh mới lên hệ thống..."
                fullScreen={false}
              />
            </div>
          )}

          <div className="flex items-center justify-between mb-5 border-b border-[#FFD6E0]/40 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#4A4A6A]">
                ⚙️ Chỉnh sửa: {collection.title}
              </h3>
              <p className="text-xs text-[#4A4A6A]/50">
                Thay đổi thông tin và danh sách hình ảnh bộ sưu tập
              </p>
            </div>
            <button
              onClick={() => !isAddingImages && onClose()}
              disabled={isAddingImages}
              className="text-[#4A4A6A]/30 hover:text-[#FFB7C5] text-2xl disabled:opacity-30"
            >
              ×
            </button>
          </div>

          {/* PHẦN 1: THÔNG TIN CƠ BẢN */}
          <div className="flex flex-col gap-3 mb-6 bg-[#FFFAF5] p-4 rounded-2xl border border-[#FFD6E0]/40">
            <p className="text-xs font-semibold text-[#4A4A6A]/70 uppercase tracking-wider">
              📝 Thông tin cơ bản
            </p>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-[#4A4A6A]/60">
                Tiêu đề bộ sưu tập
              </label>
              <input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="border border-[#FFD6E0] bg-white rounded-xl px-3 py-2 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-[#4A4A6A]/60">Tháng</label>
                <select
                  value={editForm.month}
                  onChange={(e) =>
                    setEditForm({ ...editForm, month: e.target.value })
                  }
                  className="border border-[#FFD6E0] bg-white rounded-xl px-2 py-2 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                >
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-[#4A4A6A]/60">Năm</label>
                <input
                  type="number"
                  value={editForm.year}
                  onChange={(e) =>
                    setEditForm({ ...editForm, year: e.target.value })
                  }
                  className="border border-[#FFD6E0] bg-white rounded-xl px-2 py-2 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-[#4A4A6A]/60">
                Mô tả ngắn
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                rows={2}
                className="border border-[#FFD6E0] bg-white rounded-xl px-3 py-2 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] resize-none"
              />
            </div>

            <button
              onClick={handleUpdateInfo}
              disabled={isUpdatingInfo}
              className="mt-1 py-2 rounded-xl bg-[#4A4A6A] text-white text-xs font-medium hover:bg-[#3d3d57] transition-all disabled:opacity-50"
            >
              {isUpdatingInfo ? "Đang lưu..." : "💾 Lưu thay đổi thông tin"}
            </button>
          </div>

          {/* PHẦN 2: QUẢN LÝ ẢNH HIỆN CÓ */}
          <p className="text-xs font-semibold text-[#4A4A6A]/70 uppercase tracking-wider mb-2">
            🖼️ Ảnh hiện có ({collection.images.length} ảnh)
          </p>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {collection.images.map((img, i) => (
              <div key={i} className="relative group aspect-square">
                <img
                  src={img}
                  className="w-full h-full object-cover rounded-2xl border border-[#FFD6E0]/30"
                  alt=""
                />
                <button
                  onClick={() => handleRemoveImage(collection._id, img)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-400 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md"
                >
                  ×
                </button>
                <span className="absolute bottom-1 left-1 bg-black/40 text-white text-[9px] px-1.5 py-0.5 rounded-md">
                  {i === 0 ? "Poster" : `Item #${i}`}
                </span>
              </div>
            ))}
            {collection.images.length === 0 && (
              <div className="col-span-3 text-center py-8 text-[#4A4A6A]/30 text-sm">
                Chưa có ảnh nào
              </div>
            )}
          </div>

          {/* PHẦN 3: TẢI THÊM ẢNH */}
          <div className="border-t border-[#FFD6E0]/50 pt-4">
            <p className="text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider mb-2">
              ➕ Tải thêm ảnh mới vào bộ sưu tập
            </p>
            <label className="border-2 border-dashed border-[#FFD6E0] hover:border-[#FFB7C5] rounded-2xl p-4 cursor-pointer text-center transition-colors block">
              <span className="text-xl">🖼️</span>
              <p className="text-xs text-[#4A4A6A]/50 mt-1">
                Click để chọn thêm ảnh
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleAddImageSelect}
              />
            </label>

            {addPreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {addPreviews.map((p, i) => (
                  <img
                    key={i}
                    src={p}
                    className="aspect-square object-cover rounded-xl"
                    alt=""
                  />
                ))}
              </div>
            )}

            {addImageFiles.length > 0 && (
              <button
                onClick={() => handleAddImages(collection._id)}
                className="w-full mt-3 py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold hover:bg-[#ff9db5]"
              >
                Tải lên {addImageFiles.length} ảnh mới 🌸
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCollectionModal;
