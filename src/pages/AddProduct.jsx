import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { label: "Phone Charms 🌸", value: "phone-charms" },
  { label: "Keychain 🔑", value: "keychain" },
  { label: "Pins 📌", value: "pins" },
  { label: "Mail Club ✉️", value: "mail-club" },
  { label: "Postcards 🗺️", value: "postcards" },
  { label: "Stickers ⭐", value: "stickers" },
];

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "phone-charms",
    bestseller: false,
    stock: "",
  });

  const [images, setImages] = useState([null, null, null, null]);
  const [previews, setPreviews] = useState([null, null, null, null]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImage = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);

    const newPreviews = [...previews];
    newPreviews[index] = URL.createObjectURL(file);
    setPreviews(newPreviews);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);

    const newPreviews = [...previews];
    newPreviews[index] = null;
    setPreviews(newPreviews);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) return;
    if (!images.some((img) => img !== null)) {
      alert("Vui lòng thêm ít nhất 1 ảnh!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("bestseller", form.bestseller);
      formData.append("stock", form.stock);

      images.forEach((img) => {
        if (img) formData.append("images", img);
      });

      const res = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate("/products"), 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">🎀</span>
        <p
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-3xl text-[#4A4A6A]"
        >
          Thêm sản phẩm thành công!
        </p>
        <p className="text-sm text-[#4A4A6A]/50">Đang chuyển về danh sách...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      {/* Upload ảnh */}
      <div className="bg-white rounded-3xl p-6 border border-[#FFD6E0]/50">
        <h3 className="text-sm font-semibold text-[#4A4A6A] mb-5">
          Ảnh sản phẩm
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {images.map((_, index) => (
            <div key={index} className="relative">
              {previews[index] ? (
                <div className="relative group">
                  <img
                    src={previews[index]}
                    className="w-full aspect-square object-cover rounded-2xl border-2 border-[#b8deff]"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-400 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    ×
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 text-[9px] bg-[#b8deff] text-white px-1.5 py-0.5 rounded-full">
                      Chính
                    </span>
                  )}
                </div>
              ) : (
                <label className="w-full aspect-square rounded-2xl border-2 border-dashed border-[#b8deff] hover:border-[#b8deff] flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#FFFAF5] hover:bg-[#FFF0F5]">
                  <span className="text-2xl">+</span>
                  <span className="text-[10px] text-[#4A4A6A]/40 mt-1">
                    {index === 0 ? "Ảnh chính" : `Ảnh ${index + 1}`}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImage(e, index)}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="bg-white rounded-3xl p-6 border border-[#FFD6E0]/50 flex flex-col gap-5">
        <h3 className="text-sm font-semibold text-[#4A4A6A]">
          Thông tin sản phẩm
        </h3>

        {/* Tên */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#4A4A6A]/60">
            Tên sản phẩm <span className="text-[#b8deff]">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="VD: Mèo lựu đạn 100% cute"
            className="border border-[#b8deff] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#b8deff] transition-colors bg-[#FFFAF5]"
          />
        </div>

        {/* Mô tả */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#4A4A6A]/60">Mô tả sản phẩm</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Mô tả chi tiết về sản phẩm..."
            rows={4}
            className="border border-[#b8deff] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#b8deff] transition-colors bg-[#FFFAF5] resize-none"
          />
        </div>

        {/* Giá + Danh mục */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#4A4A6A]/60">
              Giá (VND) <span className="text-[#b8deff]">*</span>
            </label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="65000"
              className="border border-[#b8deff] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#b8deff] transition-colors bg-[#FFFAF5]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#4A4A6A]/60">
              Danh mục <span className="text-[#b8deff]">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border border-[#b8deff] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#b8deff] transition-colors bg-[#FFFAF5] cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#4A4A6A]/60">
            Số lượng trong kho <span className="text-[#b8deff]">*</span>
          </label>
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="50"
            className="border border-[#b8deff] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#b8deff] bg-[#FFFAF5]"
          />
        </div>

        {/* Bestseller */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
              form.bestseller
                ? "bg-[#b8deff] border-[#b8deff]"
                : "border-[#b8deff]"
            }`}
            onClick={() =>
              setForm((prev) => ({ ...prev, bestseller: !prev.bestseller }))
            }
          >
            {form.bestseller && <span className="text-white text-xs">✓</span>}
          </div>
          <span className="text-sm text-[#4A4A6A]">
            Đánh dấu là Bestseller ⭐
          </span>
        </label>
      </div>

      {/* Nút submit */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/products")}
          className="flex-1 py-3 rounded-2xl border border-[#b8deff] text-sm text-[#4A4A6A] hover:bg-[#b8deff] transition-colors"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || !form.name || !form.price}
          className="flex-1 py-3 rounded-2xl bg-[#b8deff] text-white text-sm font-semibold hover:bg-[#ff9db5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Đang lưu..." : "Thêm sản phẩm 🌸"}
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
