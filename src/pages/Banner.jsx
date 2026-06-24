import React, { useState, useEffect } from "react";

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    launchDate: "",
    linkTo: "",
    badge: "Sắp ra mắt",
    order: 0,
  });

  const fetchBanners = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/banners", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setBanners(data.banners);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.title || !imageFile) {
      alert("Vui lòng điền tên và thêm ảnh!");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      formData.append("image", imageFile);

      const res = await fetch("http://localhost:4000/api/banners", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setForm({
          title: "",
          description: "",
          launchDate: "",
          linkTo: "",
          badge: "Sắp ra mắt",
          order: 0,
        });
        setImageFile(null);
        setPreview(null);
        fetchBanners();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleActive = async (id, current) => {
    try {
      await fetch(`http://localhost:4000/api/banners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ active: !current }),
      });
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa banner này?")) return;
    try {
      await fetch(`http://localhost:4000/api/banners/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

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
          <span className="font-semibold text-[#4A4A6A]">{banners.length}</span>{" "}
          banner
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#b8deff] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#aacae7] transition-colors"
        >
          🎨 Tạo Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((b) => (
          <div
            key={b._id}
            className="bg-white rounded-3xl border border-[#FFD6E0]/50 overflow-hidden"
          >
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={b.image}
                className="w-full h-full object-cover"
                alt={b.title}
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-3 py-1 rounded-full bg-[#FFD6E0] text-[#4A4A6A]">
                  {b.badge}
                </span>
                <button
                  onClick={() => toggleActive(b._id, b.active)}
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    b.active
                      ? "bg-[#D4F4DD] text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {b.active ? "Đang hiện" : "Đã ẩn"}
                </button>
              </div>
              <h3 className="text-base font-semibold text-[#4A4A6A] mb-1">
                {b.title}
              </h3>
              <p className="text-xs text-[#4A4A6A]/50 mb-3">{b.description}</p>
              {b.launchDate && (
                <p className="text-xs text-[#FFB7C5] mb-3">
                  📅 Ra mắt:{" "}
                  {new Date(b.launchDate).toLocaleDateString("vi-VN")}
                </p>
              )}
              <button
                onClick={() => handleDelete(b._id)}
                className="text-xs px-3 py-1.5 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors w-full"
              >
                Xóa banner
              </button>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="col-span-2 bg-white rounded-3xl border border-[#FFD6E0]/50 text-center py-16">
            <span className="text-4xl">🎨</span>
            <p className="text-sm text-[#4A4A6A]/40 mt-3">Chưa có banner nào</p>
          </div>
        )}
      </div>

      {/* Modal tạo banner */}
      {showForm && (
        <>
          <div
            onClick={() => setShowForm(false)}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg px-4 max-h-[85vh]">
            <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
              <h3 className="text-lg font-semibold text-[#4A4A6A] mb-5">
                Tạo Banner mới 🎨
              </h3>

              <div className="flex flex-col gap-4">
                {/* Ảnh */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">
                    Ảnh banner (khuyến nghị 16:9)
                  </label>
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        className="w-full aspect-[16/9] object-cover rounded-2xl"
                      />
                      <button
                        onClick={() => {
                          setPreview(null);
                          setImageFile(null);
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-400 text-white rounded-full text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="aspect-[16/9] rounded-2xl border-2 border-dashed border-[#FFD6E0] hover:border-[#FFB7C5] flex items-center justify-center cursor-pointer bg-[#FFFAF5]">
                      <span className="text-2xl text-[#4A4A6A]/30">
                        + Thêm ảnh
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImage}
                      />
                    </label>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">Tiêu đề</label>
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="VD: Bộ sưu tập Hè 2026 sắp ra mắt!"
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">Mô tả</label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={3}
                    placeholder="Giới thiệu ngắn về chương trình/sản phẩm..."
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">
                      Ngày ra mắt (tùy chọn)
                    </label>
                    <input
                      type="date"
                      value={form.launchDate}
                      onChange={(e) =>
                        setForm({ ...form, launchDate: e.target.value })
                      }
                      className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">
                      Nhãn (badge)
                    </label>
                    <input
                      value={form.badge}
                      onChange={(e) =>
                        setForm({ ...form, badge: e.target.value })
                      }
                      placeholder="Sắp ra mắt"
                      className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">
                    Link khi click (tùy chọn)
                  </label>
                  <input
                    value={form.linkTo}
                    onChange={(e) =>
                      setForm({ ...form, linkTo: e.target.value })
                    }
                    placeholder="VD: /collection hoặc /phone-charms"
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                  />
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
                  Tạo banner 🎨
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Banners;
