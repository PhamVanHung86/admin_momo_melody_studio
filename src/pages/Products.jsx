import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  "Tất cả",
  "phone-charms",
  "keychain",
  "pins",
  "mail-club",
  "postcards",
  "stickers",
];

const bgColor = {
  "phone-charms": "bg-[#FFD6E0]",
  keychain: "bg-[#FFF0A0]",
  pins: "bg-[#B8DEFF]",
  "mail-club": "bg-[#FFD6E0]",
  postcards: "bg-[#FFF0A0]",
  stickers: "bg-[#B8DEFF]",
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "Tất cả" || p.category === category;
    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[#4A4A6A]/40 text-sm">Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          {CATEGORIES.map((cat) => (
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
      <div className="bg-white rounded-3xl border border-[#FFD6E0]/50 overflow-hidden">
        <table className="w-full">
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
                      onClick={() => handleDelete(p._id)}
                      disabled={deletingId === p._id}
                      className="text-xs px-3 py-1.5 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {deletingId === p._id ? "Đang xóa..." : "Xóa"}
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
    </div>
  );
};

export default Products;
