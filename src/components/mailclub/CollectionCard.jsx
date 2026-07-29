import React from "react";
import { MONTHS } from "../../constansts/mailClubData";

const CollectionCard = ({ col, onToggleActive, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl border border-[#FFD6E0]/50 overflow-hidden">
      {/* Preview ảnh */}
      <div className="grid grid-cols-3 gap-1 p-2 bg-[#FFFAF5]">
        {col.images.slice(0, 6).map((img, i) => (
          <div key={i} className="aspect-square overflow-hidden rounded-xl">
            <img src={img} className="w-full h-full object-cover" alt="" />
          </div>
        ))}
        {col.images.length === 0 && (
          <div className="col-span-3 aspect-[3/1] flex items-center justify-center text-[#4A4A6A]/30 text-sm">
            Chưa có ảnh
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-[#4A4A6A]">{col.title}</h3>
          <button
            onClick={() => onToggleActive(col._id, col.active)}
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              col.active
                ? "bg-[#D4F4DD] text-green-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {col.active ? "Hiện" : "Ẩn"}
          </button>
        </div>

        <p className="text-xs text-[#4A4A6A]/50 mb-3">
          {MONTHS[col.month - 1]} {col.year} · {col.images.length} ảnh
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(col)}
            className="flex-1 text-xs py-2 rounded-xl border border-[#FFD6E0] text-[#4A4A6A] hover:bg-[#FFF0F5] transition-colors"
          >
            ✏️ Quản lý & Sửa thông tin
          </button>
          <button
            onClick={() => onDelete(col._id)}
            className="text-xs px-3 py-2 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
