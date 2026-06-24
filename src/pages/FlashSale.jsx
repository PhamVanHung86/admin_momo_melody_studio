import React, { useState, useEffect } from "react";

const FlashSale = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    discountPercent: "",
    products: [],
    startTime: "",
    endTime: "",
  });

  const fetchData = async () => {
    try {
      const [salesRes, productsRes] = await Promise.all([
        fetch("http://localhost:4000/api/flash-sales", {
          credentials: "include",
        }),
        fetch("http://localhost:4000/api/products"),
      ]);
      const salesData = await salesRes.json();
      const productsData = await productsRes.json();
      if (salesData.success) setFlashSales(salesData.flashSales);
      if (productsData.success) setProducts(productsData.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleProduct = (id) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.includes(id)
        ? prev.products.filter((p) => p !== id)
        : [...prev.products, id],
    }));
  };

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.discountPercent ||
      form.products.length === 0 ||
      !form.startTime ||
      !form.endTime
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/flash-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setForm({
          title: "",
          discountPercent: "",
          products: [],
          startTime: "",
          endTime: "",
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa flash sale này?")) return;
    try {
      await fetch(`http://localhost:4000/api/flash-sales/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (sale) => {
    const now = new Date();
    return (
      sale.active &&
      new Date(sale.startTime) <= now &&
      new Date(sale.endTime) >= now
    );
  };

  const isExpired = (sale) => new Date(sale.endTime) < new Date();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[#4A4A6A]/40 text-sm">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#4A4A6A]/60">
          Tổng{" "}
          <span className="font-semibold text-[#4A4A6A]">
            {flashSales.length}
          </span>{" "}
          chiến dịch
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#b8deff] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#aacae7] transition-colors"
        >
          ⚡ Tạo Flash Sale
        </button>
      </div>

      {/* Danh sách */}
      <div className="flex flex-col gap-4">
        {flashSales.map((sale) => (
          <div
            key={sale._id}
            className="bg-white rounded-3xl p-6 border border-[#FFD6E0]/50"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-semibold text-[#4A4A6A]">
                  {sale.title}
                </h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    isExpired(sale)
                      ? "bg-gray-100 text-gray-400"
                      : isActive(sale)
                        ? "bg-[#D4F4DD] text-green-600"
                        : "bg-[#FFF0A0] text-[#4A4A6A]"
                  }`}
                >
                  {isExpired(sale)
                    ? "Đã kết thúc"
                    : isActive(sale)
                      ? "🔥 Đang diễn ra"
                      : "Sắp diễn ra"}
                </span>
              </div>
              <button
                onClick={() => handleDelete(sale._id)}
                className="text-xs px-3 py-1.5 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
              >
                Xóa
              </button>
            </div>

            <p className="text-2xl font-bold text-[#FFB7C5] mb-3">
              -{sale.discountPercent}%
            </p>

            <div className="flex items-center gap-2 text-xs text-[#4A4A6A]/50 mb-3">
              <span>{new Date(sale.startTime).toLocaleString("vi-VN")}</span>
              <span>→</span>
              <span>{new Date(sale.endTime).toLocaleString("vi-VN")}</span>
            </div>

            <div className="flex gap-2 flex-wrap">
              {sale.products.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center gap-2 bg-[#FFFAF5] rounded-xl px-3 py-1.5"
                >
                  <img
                    src={p.images?.[0]}
                    className="w-6 h-6 rounded-lg object-cover"
                    alt={p.name}
                  />
                  <span className="text-xs text-[#4A4A6A]">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {flashSales.length === 0 && (
          <div className="bg-white rounded-3xl border border-[#FFD6E0]/50 text-center py-16">
            <span className="text-4xl">⚡</span>
            <p className="text-sm text-[#4A4A6A]/40 mt-3">
              Chưa có flash sale nào
            </p>
          </div>
        )}
      </div>

      {/* Modal tạo flash sale */}
      {showForm && (
        <>
          <div
            onClick={() => setShowForm(false)}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg px-4 max-h-[85vh]">
            <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
              <h3 className="text-lg font-semibold text-[#4A4A6A] mb-5">
                Tạo Flash Sale ⚡
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">
                    Tên chiến dịch
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="VD: Sale 6.6 — Giảm sốc!"
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">
                    % Giảm giá
                  </label>
                  <input
                    type="number"
                    value={form.discountPercent}
                    onChange={(e) =>
                      setForm({ ...form, discountPercent: e.target.value })
                    }
                    placeholder="20"
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">Bắt đầu</label>
                    <input
                      type="datetime-local"
                      value={form.startTime}
                      onChange={(e) =>
                        setForm({ ...form, startTime: e.target.value })
                      }
                      className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">
                      Kết thúc
                    </label>
                    <input
                      type="datetime-local"
                      value={form.endTime}
                      onChange={(e) =>
                        setForm({ ...form, endTime: e.target.value })
                      }
                      className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">
                    Chọn sản phẩm áp dụng ({form.products.length} đã chọn)
                  </label>
                  <div className="border border-[#FFD6E0] rounded-xl p-3 max-h-48 overflow-y-auto flex flex-col gap-1">
                    {products.map((p) => (
                      <label
                        key={p._id}
                        className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[#FFFAF5] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={form.products.includes(p._id)}
                          onChange={() => toggleProduct(p._id)}
                          className="accent-[#FFB7C5]"
                        />
                        <img
                          src={p.images?.[0]}
                          className="w-8 h-8 rounded-lg object-cover"
                          alt={p.name}
                        />
                        <div className="flex-1">
                          <p className="text-sm text-[#4A4A6A]">{p.name}</p>
                          <p className="text-xs text-[#FFB7C5]">
                            {p.price.toLocaleString()} đ
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-2xl border border-[#FFD6E0] text-sm text-[#4A4A6A] hover:bg-[#FFF0F5] transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold hover:bg-[#ff9db5] transition-colors"
                >
                  Tạo chiến dịch ⚡
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FlashSale;
