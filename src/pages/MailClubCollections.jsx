import React, { useState, useEffect } from "react";
import LoadingFlower from "../components/TableSkeleton"; // Sử dụng cho loading đầu trang
import { apiFetch } from "../api/client";
import toast from "react-hot-toast";
import { handleApiError } from "../utils/handleError";

import CollectionCard from "../components/mailclub/CollectionCard";
import CreateCollectionModal from "../components/mailclub/CreateCollectionModal";
import EditCollectionModal from "../components/mailclub/EditCollectionModal";
import ConfirmModal from "../components/ConfirmModal";

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
  const [isUploading, setIsUploading] = useState(false); // Trạng thái đang tạo bộ sưu tập + tải ảnh (dùng cho CreateCollectionModal)
  const [isAddingImages, setIsAddingImages] = useState(false); // Trạng thái đang tải ảnh mới thêm vào (dùng cho EditCollectionModal)

  // State quản lý Modal Xóa Bộ sưu tập
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State quản lý Modal Xóa Ảnh
  const [deleteImageModalOpen, setDeleteImageModalOpen] = useState(false);
  const [deleteImageTarget, setDeleteImageTarget] = useState(null); // { collectionId, imageUrl }
  const [isDeletingImage, setIsDeletingImage] = useState(false);

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
      const res = await apiFetch("/api/mail-club-collections/admin", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setCollections(data.collections);
    } catch (err) {
      handleApiError(err, "Không thể tải danh sách bộ sưu tập");
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
      toast.error("Vui lòng điền tiêu đề và thêm ít nhất 1 ảnh!");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    imageFiles.forEach((f) => formData.append("images", f));

    setIsUploading(true); // Bật trạng thái loading
    try {
      const res = await apiFetch("/api/mail-club-collections", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Tạo bộ sưu tập thành công! 🌸");
        setShowAddForm(false); // 1. Ẩn form modal ngay lập tức
        // 2. Reset form và ảnh
        setImageFiles([]);
        setPreviews([]);
        setForm({
          title: "",
          month: new Date().getMonth() + 1,
          year: currentYear,
          description: "",
        });
        // 3. Load lại danh sách
        fetchCollections();
      } else {
        // ĐÃ SỬA: Chuyển sang toast.error
        toast.error(data.message || "Có lỗi xảy ra khi tạo bộ sưu tập");
      }
    } catch (err) {
      handleApiError(err, "Tạo bộ sưu tập thất bại");
      toast.error("Lỗi kết nối đến server");
    } finally {
      setIsUploading(false); // Tắt trạng thái loading kể cả thành công hay thất bại
    }
  };

  const handleUpdateInfo = async () => {
    if (!editForm.title.trim()) {
      toast.error("Tiêu đề không được để trống!");
      return;
    }
    setIsUpdatingInfo(true);
    try {
      const res = await apiFetch(
        `/api/mail-club-collections/${selectedCollection._id}`,
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
        toast.success("Cập nhật thông tin thành công! ✨");
        setSelectedCollection(
          data.collection || { ...selectedCollection, ...editForm },
        );
        fetchCollections();
      } else {
        toast.error(data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      handleApiError(err, "Cập nhật thông tin thất bại");
      toast.error("Lỗi kết nối đến server");
    } finally {
      setIsUpdatingInfo(false);
    }
  };

  const handleAddImages = async (id) => {
    if (addImageFiles.length === 0) return;

    const formData = new FormData();
    addImageFiles.forEach((f) => formData.append("images", f));

    setIsAddingImages(true); // Bật loading riêng cho việc thêm ảnh (không đụng tới isUploading)
    try {
      const res = await apiFetch(`/api/mail-club-collections/${id}/images`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Thêm ảnh thành công! 🖼️");
        setSelectedCollection(data.collection);
        setAddImageFiles([]);
        setAddPreviews([]);
        fetchCollections();
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi tải ảnh lên");
      }
    } catch (err) {
      handleApiError(err, "Thêm ảnh thất bại");
      toast.error("Lỗi kết nối đến server");
    } finally {
      setIsAddingImages(false);
    }
  };

  // --- QUẢN LÝ XÓA ÁNH ---
  const openDeleteImageModal = (collectionId, imageUrl) => {
    setDeleteImageTarget({ collectionId, imageUrl });
    setDeleteImageModalOpen(true);
  };

  const closeDeleteImageModal = () => {
    if (isDeletingImage) return;
    setDeleteImageModalOpen(false);
    setDeleteImageTarget(null);
  };

  const handleConfirmDeleteImage = async () => {
    if (!deleteImageTarget) return;

    const { collectionId, imageUrl } = deleteImageTarget;
    setIsDeletingImage(true);
    try {
      const res = await apiFetch(
        `/api/mail-club-collections/${collectionId}/images`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ imageUrl }),
        },
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Đã xóa ảnh! 🗑️");
        setSelectedCollection(data.collection);
        closeDeleteImageModal();
        fetchCollections();
      }
    } catch (err) {
      handleApiError(err, "Xoá ảnh thất bại");
    } finally {
      setIsDeletingImage(false);
    }
  };

  const handleToggleActive = async (id, current) => {
    try {
      await apiFetch(`/api/mail-club-collections/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ active: !current }),
      });
      fetchCollections();
    } catch (err) {
      handleApiError(err, "Đổi trạng thái hiển thị thất bại");
    }
  };

  // --- QUẢN LÝ XÓA BỘ SỰ TẬP ---
  const openDeleteModal = (target) => {
    const col =
      typeof target === "object"
        ? target
        : collections.find((c) => c._id === target);
    setDeleteTarget(col || { _id: target, title: "bộ sưu tập" });
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await apiFetch(
        `/api/mail-club-collections/${deleteTarget._id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const data = await res.json();
      if (data?.success || res.ok) {
        toast.success("Đã xóa bộ sưu tập! 🗑️");
        if (selectedCollection?._id === deleteTarget._id) {
          setSelectedCollection(null);
        }
        closeDeleteModal();
        fetchCollections();
      }
    } catch (err) {
      handleApiError(err, "Xoá bộ sưu tập thất bại");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenEdit = (col) => {
    setSelectedCollection(col);
    setEditForm({
      title: col.title,
      month: col.month,
      year: col.year,
      description: col.description || "",
    });
    setAddImageFiles([]);
    setAddPreviews([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingFlower />
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

      {/* Danh sách Collections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map((col) => (
          <CollectionCard
            key={col._id}
            col={col}
            onToggleActive={handleToggleActive}
            onEdit={handleOpenEdit}
            onDelete={openDeleteModal}
          />
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

      {/* Modal Tạo mới */}
      <CreateCollectionModal
        show={showAddForm}
        onClose={() => setShowAddForm(false)}
        form={form}
        setForm={setForm}
        previews={previews}
        handleImageSelect={handleImageSelect}
        handleCreate={handleCreate}
        isUploading={isUploading} // Modal này vẫn dùng để hiển thị spinner trên nút bấm
        setIsUploading={setIsUploading}
      />

      {/* Modal Chỉnh sửa / Quản lý ảnh */}
      <EditCollectionModal
        collection={selectedCollection}
        onClose={() => setSelectedCollection(null)}
        editForm={editForm}
        setEditForm={setEditForm}
        handleUpdateInfo={handleUpdateInfo}
        isUpdatingInfo={isUpdatingInfo}
        handleRemoveImage={openDeleteImageModal}
        handleAddImageSelect={handleAddImageSelect}
        addPreviews={addPreviews}
        addImageFiles={addImageFiles}
        handleAddImages={handleAddImages}
        isAddingImages={isAddingImages}
        setIsAddingImages={setIsAddingImages}
      />

      {/* Modal Xác nhận xóa Bộ sưu tập */}
      <ConfirmModal
        open={deleteModalOpen}
        title="Xác nhận xóa bộ sưu tập"
        message={
          deleteTarget ? (
            <span>
              Bạn có chắc chắn muốn xóa bộ sưu tập{" "}
              <strong className="font-semibold text-[#4A4A6A]">
                "{deleteTarget.title}"
              </strong>{" "}
              và toàn bộ ảnh không? Hành động này không thể hoàn tác.
            </span>
          ) : (
            "Bạn có chắc chắn muốn xóa bộ sưu tập này và toàn bộ ảnh không?"
          )
        }
        confirmLabel="Xóa bộ sưu tập"
        cancelLabel="Hủy"
        danger={true}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />

      {/* Modal Xác nhận xóa Ảnh - ĐÃ SỬA: Thêm phần in đậm cho tên ảnh nếu muốn (giả định tên ảnh có thể biết hoặc chỉ hiện chung chung) */}
      <ConfirmModal
        open={deleteImageModalOpen}
        title="Xác nhận xóa ảnh"
        message={
          <span>
            Bạn có chắc chắn muốn xóa ảnh này khỏi bộ sưu tập không? Hành động
            này không thể hoàn tác.
          </span>
        }
        confirmLabel="Xóa ảnh"
        cancelLabel="Hủy"
        danger={true}
        loading={isDeletingImage}
        onConfirm={handleConfirmDeleteImage}
        onCancel={closeDeleteImageModal}
      />
    </div>
  );
};

export default MailClubCollections;
