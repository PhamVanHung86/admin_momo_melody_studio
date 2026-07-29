import React, { useState, useEffect } from "react";
import { apiFetch } from "../api/client";
import { handleApiError } from "../utils/handleError";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // State quản lý Modal Xóa Tin Nhắn
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await apiFetch("/api/contact", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (err) {
      handleApiError(err, "Không thể tải tin nhắn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markRead = async (id) => {
    try {
      await apiFetch(`/api/contact/${id}/read`, {
        method: "PUT",
        credentials: "include",
      });
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, read: true } : m)),
      );
    } catch (err) {
      handleApiError(err, "Đánh dấu đã đọc thất bại");
    }
  };

  // 1. Mở modal xác nhận xóa
  const openDeleteModal = (message) => {
    setDeleteTarget(message);
    setDeleteModalOpen(true);
  };

  // 2. Đóng modal xóa
  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  // 3. Xử lý gọi API xóa tin nhắn
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await apiFetch(`/api/contact/${deleteTarget._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setMessages((prev) => prev.filter((m) => m._id !== deleteTarget._id));
      toast.success("Đã xóa tin nhắn! 🗑️");
      closeDeleteModal();
    } catch (err) {
      handleApiError(err, "Xoá tin nhắn thất bại");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[#4A4A6A]/40 text-sm">Đang tải...</p>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-[#4A4A6A]/60">
        Tổng{" "}
        <span className="font-semibold text-[#4A4A6A]">{messages.length}</span>{" "}
        tin nhắn
        {unreadCount > 0 && (
          <span className="ml-2 text-xs bg-[#FFB7C5] text-white px-2 py-0.5 rounded-full">
            {unreadCount} chưa đọc
          </span>
        )}
      </p>

      <div className="flex flex-col gap-3">
        {messages.map((m) => (
          <div
            key={m._id}
            onClick={() => !m.read && markRead(m._id)}
            className={`bg-white rounded-3xl p-5 border cursor-pointer transition-colors ${
              m.read ? "border-[#FFD6E0]/50" : "border-[#FFB7C5] bg-[#FFF0F5]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {!m.read && (
                  <span className="w-2 h-2 rounded-full bg-[#FFB7C5]" />
                )}
                <p className="text-sm font-semibold text-[#4A4A6A]">{m.name}</p>
                <span className="text-xs text-[#4A4A6A]/40">{m.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#4A4A6A]/40">
                  {new Date(m.createdAt).toLocaleString("vi-VN")}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(m);
                  }}
                  className="text-xs text-red-400 hover:underline"
                >
                  Xóa
                </button>
              </div>
            </div>
            <p className="text-sm text-[#4A4A6A]/70">{m.message}</p>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="bg-white rounded-3xl border border-[#FFD6E0]/50 text-center py-16">
            <span className="text-4xl">📩</span>
            <p className="text-sm text-[#4A4A6A]/40 mt-3">
              Chưa có tin nhắn nào
            </p>
          </div>
        )}
      </div>

      {/* Modal Xác nhận xóa Tin nhắn */}
      <ConfirmModal
        open={deleteModalOpen}
        title="Xác nhận xóa tin nhắn"
        message={
          deleteTarget ? (
            <span>
              Bạn có chắc chắn muốn xóa tin nhắn từ{" "}
              <strong className="font-semibold text-[#4A4A6A]">
                "{deleteTarget.name}"
              </strong>{" "}
              không? Hành động này không thể hoàn tác.
            </span>
          ) : (
            "Bạn có chắc chắn muốn xóa tin nhắn này?"
          )
        }
        confirmLabel="Xóa tin nhắn"
        cancelLabel="Hủy"
        danger={true}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
};

export default Messages;
