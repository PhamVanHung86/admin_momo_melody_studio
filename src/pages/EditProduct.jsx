import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CATEGORIES } from "../constansts/mailClubData";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([null, null, null, null]);
  const [newPreviews, setNewPreviews] = useState([null, null, null, null]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "phone-charms",
    bestseller: false,
    stock: "",
  });

  // Load sản phẩm hiện tại
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/products/${id}`);
        const data = await res.json();
        if (data.success) {
          const p = data.product;
          setForm({
            name: p.name,
            description: p.description || "",
            price: p.price,
            category: p.category,
            bestseller: p.bestseller,
            stock: p.stock || 0,
          });
          setExistingImages(p.images || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNewImage = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedImages = [...newImages];
    updatedImages[index] = file;
    setNewImages(updatedImages);

    const updatedPreviews = [...newPreviews];
    updatedPreviews[index] = URL.createObjectURL(file);
    setNewPreviews(updatedPreviews);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("bestseller", form.bestseller);
      formData.append("stock", form.stock);

      newImages.forEach((img) => {
        if (img) formData.append("images", img);
      });

      const res = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: "PUT",
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

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[#4A4A6A]/40 text-sm">Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">🎀</span>
        <p
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-3xl text-[#4A4A6A]"
        >
          Cập nhật thành công!
        </p>
        <p className="text-sm text-[#4A4A6A]/50">Đang chuyển về danh sách...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      {/* Ảnh hiện tại */}
      <div className="bg-white rounded-3xl p-6 border border-[#FFD6E0]/50">
        <h3 className="text-sm font-semibold text-[#4A4A6A] mb-5">
          Ảnh hiện tại
        </h3>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {existingImages.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img}
                className="w-full aspect-square object-cover rounded-2xl"
                alt=""
              />
              <button
                onClick={() => removeExistingImage(index)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-400 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-[#4A4A6A] mb-5">
          Thêm ảnh mới (tùy chọn)
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {newImages.map((_, index) => (
            <div key={index}>
              {newPreviews[index] ? (
                <img
                  src={newPreviews[index]}
                  className="w-full aspect-square object-cover rounded-2xl border-2 border-[#b8deff]"
                  alt=""
                />
              ) : (
                <label className="w-full aspect-square rounded-2xl border-2 border-dashed border-[#b8deff] hover:border-[#b8deff] flex items-center justify-center cursor-pointer transition-colors bg-[#FFFAF5]">
                  <span className="text-2xl text-[#4A4A6A]/30">+</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleNewImage(e, index)}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Thông tin */}
      <div className="bg-white rounded-3xl p-6 border border-[#FFD6E0]/50 flex flex-col gap-5">
        <h3 className="text-sm font-semibold text-[#4A4A6A]">
          Thông tin sản phẩm
        </h3>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#4A4A6A]/60">Tên sản phẩm</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border border-[#b8deff] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#b8deff] bg-[#FFFAF5]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#4A4A6A]/60">Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="border border-[#b8deff] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#b8deff] bg-[#FFFAF5] resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#4A4A6A]/60">Giá (VND)</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="border border-[#b8deff] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#b8deff] bg-[#FFFAF5]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#4A4A6A]/60">Danh mục</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border border-[#b8deff] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#b8deff] bg-[#FFFAF5] cursor-pointer"
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
            Số lượng trong kho
          </label>
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            className="border border-[#b8deff] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#b8deff] bg-[#FFFAF5]"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
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

      <div className="flex gap-3">
        <button
          onClick={() => navigate("/products")}
          className="flex-1 py-3 rounded-2xl border border-[#FFD6E0] text-sm text-[#4A4A6A] hover:bg-[#FFF0F5] transition-colors"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-3 rounded-2xl bg-[#b8deff] text-white text-sm font-semibold hover:bg-[#ff9db5] transition-colors disabled:opacity-50"
        >
          {loading ? "Đang lưu..." : "Cập nhật sản phẩm 🌸"}
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
