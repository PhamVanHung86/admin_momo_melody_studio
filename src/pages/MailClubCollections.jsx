import React, { useState, useEffect } from "react";

const MONTHS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

const MailClubCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [addImageFiles, setAddImageFiles] = useState([]);
  const [addPreviews, setAddPreviews] = useState([]);

  const currentYear = new Date().getFullYear();
  const [form, setForm] = useState({
    title: "",
    month: new Date().getMonth() + 1,
    year: currentYear,
    description: "",
  });

  const fetchCollections = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/mail-club-collections/admin",
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      if (data.success) setCollections(data.collections);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleAddImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setAddImageFiles(files);
    setAddPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleCreate = async () => {
    if (!form.title || imageFiles.length === 0) {
      alert("Vui lòng điền tiêu đề và thêm ít nhất 1 ảnh!");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    imageFiles.forEach((f) => formData.append("images", f));

    try {
      const res = await fetch(
        "http://localhost:4000/api/mail-club-collections",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );
      const data = await res.json();
      if (data.success) {
        setShowAddForm(false);
        setImageFiles([]);
        setPreviews([]);
        setForm({
          title: "",
          month: new Date().getMonth() + 1,
          year: currentYear,
          description: "",
        });
        fetchCollections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddImages = async (id) => {
    if (addImageFiles.length === 0) return;

    const formData = new FormData();
    addImageFiles.forEach((f) => formData.append("images", f));

    try {
      const res = await fetch(
        `http://localhost:4000/api/mail-club-collections/${id}/images`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );
      const data = await res.json();
      if (data.success) {
        setSelectedCollection(data.collection);
        setAddImageFiles([]);
        setAddPreviews([]);
        fetchCollections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveImage = async (collectionId, imageUrl) => {
    if (!confirm("Xóa ảnh này?")) return;
    try {
      const res = await fetch(
        `http://localhost:4000/api/mail-club-collections/${collectionId}/images`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ imageUrl }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setSelectedCollection(data.collection);
        fetchCollections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (id, current) => {
    try {
      await fetch(`http://localhost:4000/api/mail-club-collections/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ active: !current }),
      });
      fetchCollections();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa collection này và toàn bộ ảnh?")) return;
    try {
      await fetch(`http://localhost:4000/api/mail-club-collections/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setSelectedCollection(null);
      fetchCollections();
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
          <span className="font-semibold text-[#4A4A6A]">
            {collections.length}
          </span>{" "}
          bộ sưu tập
        </p>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#FFB7C5] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#ff9db5] transition-colors"
        >
          🌸 Tạo bộ sưu tập mới
        </button>
      </div>

      {/* Danh sách collections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map((col) => (
          <div
            key={col._id}
            className="bg-white rounded-3xl border border-[#FFD6E0]/50 overflow-hidden"
          >
            {/* Preview ảnh */}
            <div className="grid grid-cols-3 gap-1 p-2 bg-[#FFFAF5]">
              {col.images.slice(0, 6).map((img, i) => (
                <div
                  key={i}
                  className="aspect-square overflow-hidden rounded-xl"
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt=""
                  />
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
                <h3 className="text-sm font-semibold text-[#4A4A6A]">
                  {col.title}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(col._id, col.active)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      col.active
                        ? "bg-[#D4F4DD] text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {col.active ? "Hiện" : "Ẩn"}
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#4A4A6A]/50 mb-3">
                {MONTHS[col.month - 1]} {col.year} · {col.images.length} ảnh
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedCollection(col);
                    setAddImageFiles([]);
                    setAddPreviews([]);
                  }}
                  className="flex-1 text-xs py-2 rounded-xl border border-[#FFD6E0] text-[#4A4A6A] hover:bg-[#FFF0F5] transition-colors"
                >
                  ✏️ Quản lý ảnh
                </button>
                <button
                  onClick={() => handleDelete(col._id)}
                  className="text-xs px-3 py-2 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}

        {collections.length === 0 && (
          <div className="col-span-2 bg-white rounded-3xl border border-[#FFD6E0]/50 text-center py-16">
            <span className="text-4xl">🌸</span>
            <p className="text-sm text-[#4A4A6A]/40 mt-3">
              Chưa có bộ sưu tập nào
            </p>
          </div>
        )}
      </div>

      {/* Modal tạo collection mới */}
      {showAddForm && (
        <>
          <div
            onClick={() => setShowAddForm(false)}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg px-4 max-h-[85vh]">
            <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
              <h3 className="text-lg font-semibold text-[#4A4A6A] mb-5">
                🌸 Tạo bộ sưu tập mới
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">Tiêu đề</label>
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="VD: Bộ sưu tập Tháng 6 🌸"
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">Tháng</label>
                    <select
                      value={form.month}
                      onChange={(e) =>
                        setForm({ ...form, month: e.target.value })
                      }
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
                      onChange={(e) =>
                        setForm({ ...form, year: e.target.value })
                      }
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
                  onClick={() => setShowAddForm(false)}
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
      )}

      {/* Modal quản lý ảnh */}
      {selectedCollection && (
        <>
          <div
            onClick={() => setSelectedCollection(null)}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl px-4 max-h-[85vh]">
            <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-[#4A4A6A]">
                    {selectedCollection.title}
                  </h3>
                  <p className="text-xs text-[#4A4A6A]/50">
                    {selectedCollection.images.length} ảnh
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCollection(null)}
                  className="text-[#4A4A6A]/30 hover:text-[#FFB7C5] text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Grid ảnh hiện có */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {selectedCollection.images.map((img, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img
                      src={img}
                      className="w-full h-full object-cover rounded-2xl"
                      alt=""
                    />
                    <button
                      onClick={() =>
                        handleRemoveImage(selectedCollection._id, img)
                      }
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-400 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {selectedCollection.images.length === 0 && (
                  <div className="col-span-3 text-center py-8 text-[#4A4A6A]/30 text-sm">
                    Chưa có ảnh nào
                  </div>
                )}
              </div>

              {/* Thêm ảnh mới */}
              <div className="border-t border-[#FFD6E0]/50 pt-5">
                <p className="text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider mb-3">
                  Thêm ảnh mới
                </p>
                <label className="border-2 border-dashed border-[#FFD6E0] hover:border-[#FFB7C5] rounded-2xl p-4 cursor-pointer text-center transition-colors block">
                  <span className="text-2xl">🖼️</span>
                  <p className="text-xs text-[#4A4A6A]/50 mt-1">
                    Click để chọn ảnh
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
                    onClick={() => handleAddImages(selectedCollection._id)}
                    className="w-full mt-3 py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold hover:bg-[#ff9db5]"
                  >
                    Tải lên {addImageFiles.length} ảnh 🌸
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MailClubCollections;
