import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES_NAME, bgColor } from "../constansts/mailClubData";
import { apiFetch } from "../api/client";
import TableSkeleton from "../components/TableSkeleton";
import { handleApiError } from "../utils/handleError";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");

  // State quản lý Modal Xóa Sản phẩm
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await apiFetch("/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      handleApiError(err, "Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 1. Mở modal xác nhận xóa
  const openDeleteModal = (product) => {
    setDeleteTarget(product);
    setDeleteModalOpen(true);
  };

  // 2. Đóng modal xóa
  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  // 3. Xử lý gọi API xóa sản phẩm
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await apiFetch(`/api/products/${deleteTarget._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
        toast.success("Đã xoá sản phẩm 🗑️");
        closeDeleteModal();
      }
    } catch (err) {
      handleApiError(err, "Xoá sản phẩm thất bại");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "Tất cả" || p.category === category;
    return matchSearch && matchCategory;
  });

  if (loading) {
    return <TableSkeleton rows={12} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          {CATEGORIES_NAME.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                category === cat
                  ? "bg-[#b8deff] text-white"
                  : "bg-white text-[#4A4A6A]/60 border border-[#b8deff] hover:border-[#FFB7C5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="border border-[#FFD6E0] rounded-xl px-4 py-2 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] bg-white"
          />
          <Link
            to="/products/add"
            className="bg-[#FFB7C5] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#ff9db5] transition-colors whitespace-nowrap"
          >
            + Thêm mới
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#FFD6E0]/50 overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-[#FFD6E0]/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Giá
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Bestseller
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Tồn kho
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p._id}
                className="border-b border-[#FFD6E0]/30 last:border-0 hover:bg-[#FFFAF5] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] overflow-hidden flex-shrink-0">
                      {p.images?.[0] && (
                        <img
                          src={p.images[0]}
                          className="w-full h-full object-cover"
                          alt={p.name}
                        />
                      )}
                    </div>
                    <p className="text-sm font-medium text-[#4A4A6A] truncate max-w-[180px]">
                      {p.name}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${bgColor[p.category] || "bg-gray-100"} text-[#4A4A6A]`}
                  >
                    {p.category}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-[#448ecf]">
                    {p.price.toLocaleString()} đ
                  </p>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${p.bestseller ? "bg-[#FFF0A0] text-[#4A4A6A]" : "bg-gray-100 text-gray-400"}`}
                  >
                    {p.bestseller ? "⭐ Có" : "Không"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-medium ${p.stock <= 5 ? "text-red-400" : "text-[#4A4A6A]"}`}
                    >
                      {p.stock} còn lại
                    </span>
                    <span className="text-xs text-[#4A4A6A]/40">
                      {p.sold || 0} đã bán
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link
                      to={`/products/edit/${p._id}`}
                      className="text-xs px-3 py-1.5 rounded-xl border border-[#b8deff] text-[#4A4A6A] hover:bg-[#FFD6E0] transition-colors"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => openDeleteModal(p)}
                      className="text-xs px-3 py-1.5 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="text-4xl">📦</span>
            <p className="text-sm text-[#4A4A6A]/40 mt-3">
              Không tìm thấy sản phẩm
            </p>
          </div>
        )}
      </div>

      {/* Modal Xác nhận xóa Sản phẩm */}
      <ConfirmModal
        open={deleteModalOpen}
        title="Xác nhận xóa sản phẩm"
        message={
          deleteTarget ? (
            <span>
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <strong className="font-semibold text-[#4A4A6A]">
                "{deleteTarget.name}"
              </strong>{" "}
              không? Hành động này không thể hoàn tác.
            </span>
          ) : (
            "Bạn có chắc chắn muốn xóa sản phẩm này?"
          )
        }
        confirmLabel="Xóa sản phẩm"
        cancelLabel="Hủy"
        danger={true}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
};

export default Products;
