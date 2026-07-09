import React, { useState, useEffect } from "react";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/contact", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markRead = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/contact/${id}/read`, {
        method: "PUT",
        credentials: "include",
      });
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, read: true } : m)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa tin nhắn này?")) return;
    try {
      await fetch(`http://localhost:4000/api/contact/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setMessages((prev) => prev.filter((m) => m._id !== id));
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
                    handleDelete(m._id);
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
    </div>
  );
};

export default Messages;
