// import React, { useState, useEffect } from "react";
// import { MONTHS } from "../constansts/mailClubData";
// import LoadingFlower from "../components/LoadingFlower";

// const MailClubCollections = () => {
//   const [collections, setCollections] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [selectedCollection, setSelectedCollection] = useState(null);
//   const [imageFiles, setImageFiles] = useState([]);
//   const [previews, setPreviews] = useState([]);
//   const [addImageFiles, setAddImageFiles] = useState([]);
//   const [addPreviews, setAddPreviews] = useState([]);
//   const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);

//   const currentYear = new Date().getFullYear();

//   const [form, setForm] = useState({
//     title: "",
//     month: new Date().getMonth() + 1,
//     year: currentYear,
//     description: "",
//   });

//   const [editForm, setEditForm] = useState({
//     title: "",
//     month: 1,
//     year: currentYear,
//     description: "",
//   });

//   const fetchCollections = async () => {
//     try {
//       const res = await fetch(
//         "http://localhost:4000/api/mail-club-collections/admin",
//         {
//           credentials: "include",
//         },
//       );
//       const data = await res.json();
//       if (data.success) setCollections(data.collections);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCollections();
//   }, []);

//   const handleImageSelect = (e) => {
//     const files = Array.from(e.target.files);
//     setImageFiles(files);
//     setPreviews(files.map((f) => URL.createObjectURL(f)));
//   };

//   const handleAddImageSelect = (e) => {
//     const files = Array.from(e.target.files);
//     setAddImageFiles(files);
//     setAddPreviews(files.map((f) => URL.createObjectURL(f)));
//   };

//   const handleCreate = async () => {
//     if (!form.title || imageFiles.length === 0) {
//       alert("Vui lòng điền tiêu đề và thêm ít nhất 1 ảnh!");
//       return;
//     }

//     const formData = new FormData();
//     Object.entries(form).forEach(([k, v]) => formData.append(k, v));
//     imageFiles.forEach((f) => formData.append("images", f));

//     try {
//       const res = await fetch(
//         "http://localhost:4000/api/mail-club-collections",
//         {
//           method: "POST",
//           credentials: "include",
//           body: formData,
//         },
//       );
//       const data = await res.json();
//       if (data.success) {
//         setShowAddForm(false);
//         setImageFiles([]);
//         setPreviews([]);
//         setForm({
//           title: "",
//           month: new Date().getMonth() + 1,
//           year: currentYear,
//           description: "",
//         });
//         fetchCollections();
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleUpdateInfo = async () => {
//     if (!editForm.title.trim()) {
//       alert("Tiêu đề không được để trống!");
//       return;
//     }
//     setIsUpdatingInfo(true);
//     try {
//       const res = await fetch(
//         `http://localhost:4000/api/mail-club-collections/${selectedCollection._id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             title: editForm.title,
//             month: Number(editForm.month),
//             year: Number(editForm.year),
//             description: editForm.description,
//             active: selectedCollection.active,
//           }),
//         },
//       );
//       const data = await res.json();
//       if (data.success) {
//         alert("Cập nhật thông tin thành công! ✨");
//         setSelectedCollection(
//           data.collection || { ...selectedCollection, ...editForm },
//         );
//         fetchCollections();
//       } else {
//         alert(data.message || "Có lỗi xảy ra");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Lỗi kết nối đến server");
//     } finally {
//       setIsUpdatingInfo(false);
//     }
//   };

//   const handleAddImages = async (id) => {
//     if (addImageFiles.length === 0) return;

//     const formData = new FormData();
//     addImageFiles.forEach((f) => formData.append("images", f));

//     try {
//       const res = await fetch(
//         `http://localhost:4000/api/mail-club-collections/${id}/images`,
//         {
//           method: "POST",
//           credentials: "include",
//           body: formData,
//         },
//       );
//       const data = await res.json();
//       if (data.success) {
//         setSelectedCollection(data.collection);
//         setAddImageFiles([]);
//         setAddPreviews([]);
//         fetchCollections();
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleRemoveImage = async (collectionId, imageUrl) => {
//     if (!confirm("Xóa ảnh này?")) return;
//     try {
//       const res = await fetch(
//         `http://localhost:4000/api/mail-club-collections/${collectionId}/images`,
//         {
//           method: "DELETE",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({ imageUrl }),
//         },
//       );
//       const data = await res.json();
//       if (data.success) {
//         setSelectedCollection(data.collection);
//         fetchCollections();
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleToggleActive = async (id, current) => {
//     try {
//       await fetch(`http://localhost:4000/api/mail-club-collections/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ active: !current }),
//       });
//       fetchCollections();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Xóa collection này và toàn bộ ảnh?")) return;
//     try {
//       await fetch(`http://localhost:4000/api/mail-club-collections/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       setSelectedCollection(null);
//       fetchCollections();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) {
//     return <div className="flex items-center justify-center py-20"></div>;
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex items-center justify-between">
//         <p className="text-sm text-[#4A4A6A]/60">
//           Tổng{" "}
//           <span className="font-semibold text-[#4A4A6A]">
//             {collections.length}
//           </span>{" "}
//           bộ sưu tập
//         </p>
//         <button
//           onClick={() => setShowAddForm(true)}
//           className="bg-[#FFB7C5] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#ff9db5] transition-colors"
//         >
//           🌸 Tạo bộ sưu tập mới
//         </button>
//       </div>

//       {/* Danh sách collections */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {collections.map((col) => (
//           <div
//             key={col._id}
//             className="bg-white rounded-3xl border border-[#FFD6E0]/50 overflow-hidden"
//           >
//             {/* Preview ảnh */}
//             <div className="grid grid-cols-3 gap-1 p-2 bg-[#FFFAF5]">
//               {col.images.slice(0, 6).map((img, i) => (
//                 <div
//                   key={i}
//                   className="aspect-square overflow-hidden rounded-xl"
//                 >
//                   <img
//                     src={img}
//                     className="w-full h-full object-cover"
//                     alt=""
//                   />
//                 </div>
//               ))}
//               {col.images.length === 0 && (
//                 <div className="col-span-3 aspect-[3/1] flex items-center justify-center text-[#4A4A6A]/30 text-sm">
//                   Chưa có ảnh
//                 </div>
//               )}
//             </div>

//             <div className="p-4">
//               <div className="flex items-center justify-between mb-1">
//                 <h3 className="text-sm font-semibold text-[#4A4A6A]">
//                   {col.title}
//                 </h3>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => handleToggleActive(col._id, col.active)}
//                     className={`text-xs px-2.5 py-1 rounded-full font-medium ${
//                       col.active
//                         ? "bg-[#D4F4DD] text-green-600"
//                         : "bg-gray-100 text-gray-400"
//                     }`}
//                   >
//                     {col.active ? "Hiện" : "Ẩn"}
//                   </button>
//                 </div>
//               </div>

//               <p className="text-xs text-[#4A4A6A]/50 mb-3">
//                 {MONTHS[col.month - 1]} {col.year} · {col.images.length} ảnh
//               </p>

//               <div className="flex gap-2">
//                 <button
//                   onClick={() => {
//                     setSelectedCollection(col);
//                     // ĐỒNG BỘ DỮ LIỆU CŨ VÀO FORM SỬA (Đã bổ sung đồng bộ ngày mở/đóng)
//                     setEditForm({
//                       title: col.title,
//                       month: col.month,
//                       year: col.year,
//                       description: col.description || "",
//                     });
//                     setAddImageFiles([]);
//                     setAddPreviews([]);
//                   }}
//                   className="flex-1 text-xs py-2 rounded-xl border border-[#FFD6E0] text-[#4A4A6A] hover:bg-[#FFF0F5] transition-colors"
//                 >
//                   ✏️ Quản lý & Sửa thông tin
//                 </button>
//                 <button
//                   onClick={() => handleDelete(col._id)}
//                   className="text-xs px-3 py-2 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
//                 >
//                   Xóa
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}

//         {collections.length === 0 && (
//           <div className="col-span-2 bg-white rounded-3xl border border-[#FFD6E0]/50 text-center py-16">
//             <span className="text-4xl">🌸</span>
//             <p className="text-sm text-[#4A4A6A]/40 mt-3">
//               Chưa có bộ sưu tập nào
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Modal tạo collection mới */}
//       {showAddForm && (
//         <>
//           <div
//             onClick={() => setShowAddForm(false)}
//             className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
//           />
//           <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg px-4 max-h-[85vh]">
//             <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
//               <h3 className="text-lg font-semibold text-[#4A4A6A] mb-5">
//                 🌸 Tạo bộ sưu tập mới
//               </h3>

//               <div className="flex flex-col gap-4">
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-xs text-[#4A4A6A]/60">Tiêu đề</label>
//                   <input
//                     value={form.title}
//                     onChange={(e) =>
//                       setForm({ ...form, title: e.target.value })
//                     }
//                     placeholder="VD: Bộ sưu tập Tháng 6 🌸"
//                     className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-xs text-[#4A4A6A]/60">Tháng</label>
//                     <select
//                       value={form.month}
//                       onChange={(e) =>
//                         setForm({ ...form, month: e.target.value })
//                       }
//                       className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
//                     >
//                       {MONTHS.map((m, i) => (
//                         <option key={i} value={i + 1}>
//                           {m}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-xs text-[#4A4A6A]/60">Năm</label>
//                     <input
//                       type="number"
//                       value={form.year}
//                       onChange={(e) =>
//                         setForm({ ...form, year: e.target.value })
//                       }
//                       className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-xs text-[#4A4A6A]/60">
//                     Mô tả (tùy chọn)
//                   </label>
//                   <textarea
//                     value={form.description}
//                     onChange={(e) =>
//                       setForm({ ...form, description: e.target.value })
//                     }
//                     rows={2}
//                     placeholder="Giới thiệu về bộ sưu tập tháng này..."
//                     className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] resize-none"
//                   />
//                 </div>

//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-xs text-[#4A4A6A]/60">
//                     Ảnh sản phẩm (tối đa 10 ảnh)
//                   </label>
//                   <label className="border-2 border-dashed border-[#FFD6E0] hover:border-[#FFB7C5] rounded-2xl p-4 cursor-pointer text-center transition-colors">
//                     <span className="text-2xl">🖼️</span>
//                     <p className="text-xs text-[#4A4A6A]/50 mt-1">
//                       Click để chọn nhiều ảnh
//                     </p>
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       className="hidden"
//                       onChange={handleImageSelect}
//                     />
//                   </label>
//                   {previews.length > 0 && (
//                     <div className="grid grid-cols-4 gap-2 mt-2">
//                       {previews.map((p, i) => (
//                         <img
//                           key={i}
//                           src={p}
//                           className="aspect-square object-cover rounded-xl"
//                           alt=""
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex gap-3 mt-6">
//                 <button
//                   onClick={() => setShowAddForm(false)}
//                   className="flex-1 py-3 rounded-2xl border border-[#FFD6E0] text-sm text-[#4A4A6A] hover:bg-[#FFF0F5]"
//                 >
//                   Hủy
//                 </button>
//                 <button
//                   onClick={handleCreate}
//                   className="flex-1 py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold hover:bg-[#ff9db5]"
//                 >
//                   Tạo bộ sưu tập 🌸
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Modal QUẢN LÝ ẢNH & SỬA THÔNG TIN */}
//       {selectedCollection && (
//         <>
//           <div
//             onClick={() => setSelectedCollection(null)}
//             className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
//           />
//           <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl px-4 max-h-[85vh]">
//             <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
//               <div className="flex items-center justify-between mb-5 border-b border-[#FFD6E0]/40 pb-3">
//                 <div>
//                   <h3 className="text-base font-bold text-[#4A4A6A]">
//                     ⚙️ Chỉnh sửa: {selectedCollection.title}
//                   </h3>
//                   <p className="text-xs text-[#4A4A6A]/50">
//                     Thay đổi thông tin và danh sách hình ảnh bộ sưu tập
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setSelectedCollection(null)}
//                   className="text-[#4A4A6A]/30 hover:text-[#FFB7C5] text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>

//               {/* PHẦN 1: ĐIỀU CHỈNH THÔNG TIN CHỮ (ĐÃ THÊM EDIT NGÀY MỞ / ĐÓNG) */}
//               <div className="flex flex-col gap-3 mb-6 bg-[#FFFAF5] p-4 rounded-2xl border border-[#FFD6E0]/40">
//                 <p className="text-xs font-semibold text-[#4A4A6A]/70 uppercase tracking-wider">
//                   📝 Thông tin cơ bản
//                 </p>

//                 <div className="flex flex-col gap-1">
//                   <label className="text-[11px] text-[#4A4A6A]/60">
//                     Tiêu đề bộ sưu tập
//                   </label>
//                   <input
//                     value={editForm.title}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, title: e.target.value })
//                     }
//                     className="border border-[#FFD6E0] bg-white rounded-xl px-3 py-2 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[11px] text-[#4A4A6A]/60">
//                       Tháng
//                     </label>
//                     <select
//                       value={editForm.month}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, month: e.target.value })
//                       }
//                       className="border border-[#FFD6E0] bg-white rounded-xl px-2 py-2 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
//                     >
//                       {MONTHS.map((m, i) => (
//                         <option key={i} value={i + 1}>
//                           {m}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="flex flex-col gap-1">
//                     <label className="text-[11px] text-[#4A4A6A]/60">Năm</label>
//                     <input
//                       type="number"
//                       value={editForm.year}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, year: e.target.value })
//                       }
//                       className="border border-[#FFD6E0] bg-white rounded-xl px-2 py-2 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-1">
//                   <label className="text-[11px] text-[#4A4A6A]/60">
//                     Mô tả ngắn
//                   </label>
//                   <textarea
//                     value={editForm.description}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, description: e.target.value })
//                     }
//                     rows={2}
//                     className="border border-[#FFD6E0] bg-white rounded-xl px-3 py-2 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] resize-none"
//                   />
//                 </div>

//                 <button
//                   onClick={handleUpdateInfo}
//                   disabled={isUpdatingInfo}
//                   className="mt-1 py-2 rounded-xl bg-[#4A4A6A] text-white text-xs font-medium hover:bg-[#3d3d57] transition-all disabled:opacity-50"
//                 >
//                   {isUpdatingInfo ? "Đang lưu..." : "💾 Lưu thay đổi thông tin"}
//                 </button>
//               </div>

//               {/* PHẦN 2: QUẢN LÝ HÌNH ẢNH HIỆN TẠI */}
//               <p className="text-xs font-semibold text-[#4A4A6A]/70 uppercase tracking-wider mb-2">
//                 🖼️ Ảnh hiện có ({selectedCollection.images.length} ảnh)
//               </p>
//               <div className="grid grid-cols-3 gap-3 mb-5">
//                 {selectedCollection.images.map((img, i) => (
//                   <div key={i} className="relative group aspect-square">
//                     <img
//                       src={img}
//                       className="w-full h-full object-cover rounded-2xl border border-[#FFD6E0]/30"
//                       alt=""
//                     />
//                     <button
//                       onClick={() =>
//                         handleRemoveImage(selectedCollection._id, img)
//                       }
//                       className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-400 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md"
//                     >
//                       ×
//                     </button>
//                     <span className="absolute bottom-1 left-1 bg-black/40 text-white text-[9px] px-1.5 py-0.5 rounded-md">
//                       {i === 0 ? "Poster" : `Item #${i}`}
//                     </span>
//                   </div>
//                 ))}
//                 {selectedCollection.images.length === 0 && (
//                   <div className="col-span-3 text-center py-8 text-[#4A4A6A]/30 text-sm">
//                     Chưa có ảnh nào
//                   </div>
//                 )}
//               </div>

//               {/* PHẦN 3: THÊM ẢNH MỚI VÀO BỘ SƯU TẬP */}
//               <div className="border-t border-[#FFD6E0]/50 pt-4">
//                 <p className="text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider mb-2">
//                   ➕ Tải thêm ảnh mới vào bộ sưu tập
//                 </p>
//                 <label className="border-2 border-dashed border-[#FFD6E0] hover:border-[#FFB7C5] rounded-2xl p-4 cursor-pointer text-center transition-colors block">
//                   <span className="text-xl">🖼️</span>
//                   <p className="text-xs text-[#4A4A6A]/50 mt-1">
//                     Click để chọn thêm ảnh
//                   </p>
//                   <input
//                     type="file"
//                     multiple
//                     accept="image/*"
//                     className="hidden"
//                     onChange={handleAddImageSelect}
//                   />
//                 </label>

//                 {addPreviews.length > 0 && (
//                   <div className="grid grid-cols-4 gap-2 mt-3">
//                     {addPreviews.map((p, i) => (
//                       <img
//                         key={i}
//                         src={p}
//                         className="aspect-square object-cover rounded-xl"
//                         alt=""
//                       />
//                     ))}
//                   </div>
//                 )}

//                 {addImageFiles.length > 0 && (
//                   <button
//                     onClick={() => handleAddImages(selectedCollection._id)}
//                     className="w-full mt-3 py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold hover:bg-[#ff9db5]"
//                   >
//                     Tải lên {addImageFiles.length} ảnh mới 🌸
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default MailClubCollections;

import React, { useState, useEffect } from "react";
import { MONTHS } from "../constansts/mailClubData";
import LoadingFlower from "../components/LoadingFlower";

const MailClubCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [addImageFiles, setAddImageFiles] = useState([]);
  const [addPreviews, setAddPreviews] = useState([]);
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);

  // Thêm trạng thái loading khi đang tải ảnh lên server
  const [isUploading, setIsUploading] = useState(false);

  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState({
    title: "",
    month: new Date().getMonth() + 1,
    year: currentYear,
    description: "",
  });

  const [editForm, setEditForm] = useState({
    title: "",
    month: 1,
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

    setIsUploading(true); // Bật loading khi bắt đầu tạo
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
      } else {
        alert(data.message || "Có lỗi xảy ra khi tạo bộ sưu tập");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối đến server");
    } finally {
      setIsUploading(false); // Tắt loading dù thành công hay thất bại
    }
  };

  const handleUpdateInfo = async () => {
    if (!editForm.title.trim()) {
      alert("Tiêu đề không được để trống!");
      return;
    }
    setIsUpdatingInfo(true);
    try {
      const res = await fetch(
        `http://localhost:4000/api/mail-club-collections/${selectedCollection._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title: editForm.title,
            month: Number(editForm.month),
            year: Number(editForm.year),
            description: editForm.description,
            active: selectedCollection.active,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        alert("Cập nhật thông tin thành công! ✨");
        setSelectedCollection(
          data.collection || { ...selectedCollection, ...editForm },
        );
        fetchCollections();
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối đến server");
    } finally {
      setIsUpdatingInfo(false);
    }
  };

  const handleAddImages = async (id) => {
    if (addImageFiles.length === 0) return;

    const formData = new FormData();
    addImageFiles.forEach((f) => formData.append("images", f));

    setIsUploading(true); // Bật loading khi bắt đầu tải thêm ảnh
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
      } else {
        alert(data.message || "Có lỗi xảy ra khi tải ảnh lên");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối đến server");
    } finally {
      setIsUploading(false); // Tắt loading sau khi xong
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

  // Đưa LoadingFlower vào phần check loading ban đầu cho đồng bộ giao diện
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingFlower
          show={isUploading}
          onClose={() => setIsUploading(false)}
        />
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
                    setEditForm({
                      title: col.title,
                      month: col.month,
                      year: col.year,
                      description: col.description || "",
                    });
                    setAddImageFiles([]);
                    setAddPreviews([]);
                  }}
                  className="flex-1 text-xs py-2 rounded-xl border border-[#FFD6E0] text-[#4A4A6A] hover:bg-[#FFF0F5] transition-colors"
                >
                  ✏️ Quản lý & Sửa thông tin
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
            onClick={() => !isUploading && setShowAddForm(false)} // Khóa tắt modal khi đang upload
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg px-4 max-h-[85vh]">
            {/* Thêm lớp `relative` vào bọc ngoài để làm điểm neo cho overlay loading */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh] relative">
              {/* Lớp phủ Loading khi đang tạo collection mới */}
              {isUploading && (
                <div className="absolute inset-0 bg-white/85 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3 rounded-3xl">
                  <LoadingFlower
                    show={isUploading}
                    onClose={() => setIsUploading(false)}
                  />
                  <p className="text-sm font-medium text-[#4A4A6A]">
                    Đang tạo bộ sưu tập và tải ảnh lên...
                  </p>
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

      {/* Modal QUẢN LÝ ẢNH & SỬA THÔNG TIN */}
      {selectedCollection && (
        <>
          <div
            onClick={() => !isUploading && setSelectedCollection(null)} // Khóa tắt modal khi đang upload
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl px-4 max-h-[85vh]">
            {/* Thêm lớp `relative` vào bọc ngoài để làm điểm neo cho overlay loading */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh] relative">
              {/* Lớp phủ Loading khi bấm nút thêm/tải ảnh mới lên */}
              {isUploading && (
                <div className="absolute inset-0 bg-white/85 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3 rounded-3xl">
                  <LoadingFlower
                    show={isUploading}
                    onClose={() => setIsUploading(false)}
                  />
                  <p className="text-sm font-medium text-[#4A4A6A]">
                    Đang tải các ảnh mới lên hệ thống...
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mb-5 border-b border-[#FFD6E0]/40 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#4A4A6A]">
                    ⚙️ Chỉnh sửa: {selectedCollection.title}
                  </h3>
                  <p className="text-xs text-[#4A4A6A]/50">
                    Thay đổi thông tin và danh sách hình ảnh bộ sưu tập
                  </p>
                </div>
                <button
                  onClick={() => !isUploading && setSelectedCollection(null)}
                  disabled={isUploading}
                  className="text-[#4A4A6A]/30 hover:text-[#FFB7C5] text-2xl disabled:opacity-30"
                >
                  ×
                </button>
              </div>

              {/* PHẦN 1: ĐIỀU CHỈNH THÔNG TIN CHỮ */}
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
                    <label className="text-[11px] text-[#4A4A6A]/60">
                      Tháng
                    </label>
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

              {/* PHẦN 2: QUẢN LÝ HÌNH ẢNH HIỆN TẠI */}
              <p className="text-xs font-semibold text-[#4A4A6A]/70 uppercase tracking-wider mb-2">
                🖼️ Ảnh hiện có ({selectedCollection.images.length} ảnh)
              </p>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {selectedCollection.images.map((img, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img
                      src={img}
                      className="w-full h-full object-cover rounded-2xl border border-[#FFD6E0]/30"
                      alt=""
                    />
                    <button
                      onClick={() =>
                        handleRemoveImage(selectedCollection._id, img)
                      }
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-400 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md"
                    >
                      ×
                    </button>
                    <span className="absolute bottom-1 left-1 bg-black/40 text-white text-[9px] px-1.5 py-0.5 rounded-md">
                      {i === 0 ? "Poster" : `Item #${i}`}
                    </span>
                  </div>
                ))}
                {selectedCollection.images.length === 0 && (
                  <div className="col-span-3 text-center py-8 text-[#4A4A6A]/30 text-sm">
                    Chưa có ảnh nào
                  </div>
                )}
              </div>

              {/* PHẦN 3: THÊM ẢNH MỚI VÀO BỘ SƯU TẬP */}
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
                    onClick={() => handleAddImages(selectedCollection._id)}
                    className="w-full mt-3 py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold hover:bg-[#ff9db5]"
                  >
                    Tải lên {addImageFiles.length} ảnh mới 🌸
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
