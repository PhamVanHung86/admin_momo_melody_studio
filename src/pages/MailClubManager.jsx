import React, { useState, useEffect } from "react";

const STATUS_FILTERS = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "⏳ Chờ xác nhận" },
  { value: "active", label: "✅ Đang active" },
  { value: "expiring", label: "⚠️ Sắp hết hạn" },
  { value: "expired", label: "❌ Hết hạn" },
  { value: "cancelled", label: "🚫 Đã hủy" },
];

const statusColor = {
  pending: "bg-[#FFF0A0] text-[#4A4A6A]",
  active: "bg-[#D4F4DD] text-green-700",
  expired: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-50 text-red-400",
};

const statusLabel = {
  pending: "⏳ Chờ xác nhận",
  active: "✅ Active",
  expired: "❌ Hết hạn",
  cancelled: "🚫 Đã hủy",
};

const MailClubManager = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedSub, setSelectedSub] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [renewPlan, setRenewPlan] = useState("monthly");
  const [adminNote, setAdminNote] = useState("");
  const [sending, setSending] = useState(false);
  const [actionResult, setActionResult] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditTime, setShowEditTime] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    plan: "monthly",
    status: "active",
    startDate: "",
    endDate: "",
    adminNote: "",
  });
  const [editTimeForm, setEditTimeForm] = useState({
    startDate: "",
    endDate: "",
    status: "",
    adminNote: "",
  });

  const fetchSubs = async (status = "all") => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/mail-club?status=${status}`,
        { credentials: "include" },
      );
      const data = await res.json();
      if (data.success) setSubscriptions(data.subscriptions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs(statusFilter);
  }, [statusFilter]);

  const confirmPayment = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/mail-club/${id}/confirm`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ note: adminNote }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setActionResult("✅ Đã xác nhận thanh toán!");
        fetchSubs(statusFilter);
        setSelectedSub(data.subscription);
        setTimeout(() => setActionResult(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renewSub = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/mail-club/${id}/renew`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ plan: renewPlan, note: adminNote }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setActionResult("✅ Đã gia hạn thành công!");
        fetchSubs(statusFilter);
        setSelectedSub(data.subscription);
        setTimeout(() => setActionResult(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const cancelSub = async (id) => {
    if (!confirm("Hủy subscription này?")) return;
    try {
      await fetch(`http://localhost:4000/api/mail-club/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "cancelled" }),
      });
      fetchSubs(statusFilter);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const sendReminders = async () => {
    setSending(true);
    try {
      const res = await fetch(
        "http://localhost:4000/api/mail-club/send-reminders",
        {
          method: "POST",
          credentials: "include",
        },
      );
      const data = await res.json();
      setActionResult(data.message);
      setTimeout(() => setActionResult(""), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const getDaysLeft = (endDate) => {
    const diff = new Date(endDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const filtered = subscriptions.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search),
  );

  const counts = {
    pending: subscriptions.filter((s) => s.status === "pending").length,
    expiring: subscriptions.filter(
      (s) =>
        s.status === "active" &&
        getDaysLeft(s.endDate) <= 7 &&
        getDaysLeft(s.endDate) > 0,
    ).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[#4A4A6A]/40 text-sm">Đang tải...</p>
      </div>
    );
  }

  const adminCreate = async () => {
    if (!addForm.name || !addForm.email || !addForm.phone) {
      alert("Vui lòng điền đủ tên, email, SĐT!");
      return;
    }
    try {
      const res = await fetch(
        "http://localhost:4000/api/mail-club/admin/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(addForm),
        },
      );
      const data = await res.json();
      if (data.success) {
        setShowAddForm(false);
        setAddForm({
          name: "",
          email: "",
          phone: "",
          address: "",
          plan: "monthly",
          status: "active",
          startDate: "",
          endDate: "",
          adminNote: "",
        });
        fetchSubs(statusFilter);
        setActionResult("✅ Đã thêm subscriber thành công!");
        setTimeout(() => setActionResult(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const adminUpdateTime = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/mail-club/admin/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...selectedSub,
            ...editTimeForm,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setShowEditTime(false);
        fetchSubs(statusFilter);
        setSelectedSub(data.subscription);
        setActionResult("✅ Đã cập nhật thông tin!");
        setTimeout(() => setActionResult(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Action result */}
      {actionResult && (
        <div className="bg-[#D4F4DD] text-green-700 text-sm px-4 py-3 rounded-xl text-center">
          {actionResult}
        </div>
      )}
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {counts.pending > 0 && (
            <span className="text-xs bg-[#FFF0A0] text-[#4A4A6A] px-3 py-1 rounded-full font-medium">
              {counts.pending} chờ xác nhận
            </span>
          )}
          {counts.expiring > 0 && (
            <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">
              {counts.expiring} sắp hết hạn
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="text-xs px-4 py-2 rounded-xl bg-[#FFB7C5] text-white font-medium hover:bg-[#ff9db5] transition-colors"
          >
            + Thêm subscriber
          </button>
          <button
            onClick={sendReminders}
            disabled={sending}
            className="text-xs px-4 py-2 rounded-xl bg-[#E8E4F5] text-[#8B98E3] font-medium hover:bg-[#D4D0F0] transition-colors disabled:opacity-50"
          >
            {sending ? "Đang gửi..." : "📧 Gửi nhắc gia hạn"}
          </button>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên, email, SĐT..."
            className="border border-[#FFD6E0] rounded-xl px-4 py-2 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] bg-white w-48"
          />
        </div>
      </div>
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`text-xs px-4 py-2 rounded-full font-medium transition-all ${
              statusFilter === f.value
                ? "bg-[#FFB7C5] text-white"
                : "bg-white text-[#4A4A6A]/60 border border-[#FFD6E0] hover:border-[#FFB7C5]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#FFD6E0]/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#FFD6E0]/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Gói
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Hết hạn
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Đăng ký
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const daysLeft = s.endDate ? getDaysLeft(s.endDate) : null;
              const isExpiring =
                s.status === "active" &&
                daysLeft !== null &&
                daysLeft <= 7 &&
                daysLeft > 0;

              return (
                <tr
                  key={s._id}
                  className={`border-b border-[#FFD6E0]/30 last:border-0 transition-colors ${
                    isExpiring ? "bg-orange-50" : "hover:bg-[#FFFAF5]"
                  }`}
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-[#4A4A6A]">
                      {s.name}
                    </p>
                    <p className="text-xs text-[#4A4A6A]/50">{s.email}</p>
                    <p className="text-xs text-[#4A4A6A]/50">{s.phone}</p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-[#FFD6E0] text-[#4A4A6A] font-medium">
                      {s.plan === "monthly" ? "🌸 Tháng" : "🎀 Quý"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[s.status]}`}
                    >
                      {statusLabel[s.status]}
                    </span>
                    {isExpiring && (
                      <p className="text-xs text-orange-500 mt-1">
                        ⚠️ Còn {daysLeft} ngày
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {s.endDate ? (
                      <p
                        className={`text-sm ${daysLeft !== null && daysLeft <= 0 ? "text-red-400" : "text-[#4A4A6A]"}`}
                      >
                        {new Date(s.endDate).toLocaleDateString("vi-VN")}
                      </p>
                    ) : (
                      <p className="text-xs text-[#4A4A6A]/30">
                        Chưa kích hoạt
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-xs text-[#4A4A6A]/50">
                      {new Date(s.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedSub(s);
                        setRenewPlan(s.plan);
                        setAdminNote(s.adminNote || "");
                        setShowModal(true);
                      }}
                      className="text-xs px-3 py-1.5 rounded-xl border border-[#FFD6E0] text-[#4A4A6A] hover:bg-[#FFD6E0] transition-colors"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="text-4xl">✉️</span>
            <p className="text-sm text-[#4A4A6A]/40 mt-3">
              Không có subscription nào
            </p>
          </div>
        )}
      </div>
      {/* Modal chi tiết */}
      {showModal && selectedSub && (
        <>
          <div
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg px-4 max-h-[85vh]">
            <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
              {actionResult && (
                <div className="bg-[#D4F4DD] text-green-700 text-sm px-4 py-3 rounded-xl mb-4 text-center">
                  {actionResult}
                </div>
              )}

              {/* Info */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-[#4A4A6A]">
                    {selectedSub.name}
                  </h3>
                  <p className="text-sm text-[#4A4A6A]/50">
                    {selectedSub.email}
                  </p>
                  <p className="text-sm text-[#4A4A6A]/50">
                    {selectedSub.phone}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#4A4A6A]/30 hover:text-[#FFB7C5] text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-[#FFF0F5] rounded-2xl p-3 text-center">
                  <p className="text-xs text-[#4A4A6A]/50 mb-1">Gói</p>
                  <p className="text-sm font-semibold text-[#4A4A6A]">
                    {selectedSub.plan === "monthly" ? "Tháng" : "Quý"}
                  </p>
                </div>
                <div className="bg-[#FFF0F5] rounded-2xl p-3 text-center">
                  <p className="text-xs text-[#4A4A6A]/50 mb-1">Trạng thái</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${statusColor[selectedSub.status]}`}
                  >
                    {statusLabel[selectedSub.status]}
                  </span>
                </div>
                <div className="bg-[#FFF0F5] rounded-2xl p-3 text-center">
                  <p className="text-xs text-[#4A4A6A]/50 mb-1">Gia hạn</p>
                  <p className="text-sm font-semibold text-[#4A4A6A]">
                    {selectedSub.renewalHistory?.length || 0} lần
                  </p>
                </div>
              </div>

              {/* Thời gian */}
              {selectedSub.startDate && (
                <div className="bg-[#FFFAF5] rounded-2xl p-4 mb-5 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-[#4A4A6A]/50">Bắt đầu</span>
                    <span className="text-[#4A4A6A]">
                      {new Date(selectedSub.startDate).toLocaleDateString(
                        "vi-VN",
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A4A6A]/50">Hết hạn</span>
                    <span className="text-[#FFB7C5] font-semibold">
                      {new Date(selectedSub.endDate).toLocaleDateString(
                        "vi-VN",
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Lịch sử gia hạn */}
              {selectedSub.renewalHistory?.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider mb-2">
                    Lịch sử gia hạn
                  </p>
                  <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
                    {selectedSub.renewalHistory.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs bg-[#FFFAF5] rounded-xl px-3 py-2"
                      >
                        <span className="text-[#4A4A6A]/60">{h.note}</span>
                        <span className="text-[#4A4A6A]/40">
                          {new Date(h.renewedAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ghi chú admin */}
              <div className="mb-5">
                <label className="text-xs text-[#4A4A6A]/60 mb-1 block">
                  Ghi chú admin
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={2}
                  className="w-full border border-[#FFD6E0] rounded-xl px-3 py-2 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] resize-none"
                />
              </div>

              <button
                onClick={() => {
                  setEditTimeForm({
                    name: selectedSub.name,
                    email: selectedSub.email,
                    phone: selectedSub.phone,
                    address: selectedSub.address,
                    plan: selectedSub.plan,
                    status: selectedSub.status,
                    startDate: selectedSub.startDate
                      ? new Date(selectedSub.startDate)
                          .toISOString()
                          .slice(0, 10)
                      : "",
                    endDate: selectedSub.endDate
                      ? new Date(selectedSub.endDate).toISOString().slice(0, 10)
                      : "",
                    adminNote: selectedSub.adminNote || "",
                  });
                  setShowEditTime(true);
                }}
                className="w-full py-2.5 mb-3 rounded-xl border border-[#FFD6E0] text-[#4A4A6A] text-sm hover:bg-[#FFF0F5] transition-colors"
              >
                ✏️ Sửa thông tin & thời gian
              </button>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                {selectedSub.status === "pending" && (
                  <button
                    onClick={() => confirmPayment(selectedSub._id)}
                    className="w-full py-3 rounded-2xl bg-[#D4F4DD] text-green-700 text-sm font-semibold hover:bg-green-100 transition-colors"
                  >
                    ✅ Xác nhận đã thanh toán
                  </button>
                )}

                {(selectedSub.status === "active" ||
                  selectedSub.status === "expired") && (
                  <div className="flex gap-2">
                    <select
                      value={renewPlan}
                      onChange={(e) => setRenewPlan(e.target.value)}
                      className="border border-[#FFD6E0] rounded-xl px-3 py-2 text-sm text-[#4A4A6A] outline-none flex-1"
                    >
                      <option value="monthly">🌸 Gia hạn Tháng</option>
                      <option value="quarterly">🎀 Gia hạn Quý</option>
                    </select>
                    <button
                      onClick={() => renewSub(selectedSub._id)}
                      className="flex-1 py-2 rounded-xl bg-[#B8DEFF] text-[#4A4A6A] text-sm font-semibold hover:bg-[#9ed0ff] transition-colors"
                    >
                      🔄 Gia hạn
                    </button>
                  </div>
                )}

                {selectedSub.status !== "cancelled" && (
                  <button
                    onClick={() => cancelSub(selectedSub._id)}
                    className="w-full py-2.5 rounded-xl border border-red-200 text-red-400 text-sm hover:bg-red-50 transition-colors"
                  >
                    Hủy subscription
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {/* Modal thêm subscriber */}
      {showAddForm && (
        <>
          <div
            onClick={() => setShowAddForm(false)}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4 max-h-[85vh]">
            <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
              <h3 className="text-lg font-semibold text-[#4A4A6A] mb-5">
                + Thêm subscriber thủ công
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">
                    Họ tên <span className="text-[#FFB7C5]">*</span>
                  </label>
                  <input
                    value={addForm.name}
                    onChange={(e) =>
                      setAddForm({ ...addForm, name: e.target.value })
                    }
                    placeholder="Nguyễn Văn A"
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">
                    Email <span className="text-[#FFB7C5]">*</span>
                  </label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={(e) =>
                      setAddForm({ ...addForm, email: e.target.value })
                    }
                    placeholder="example@gmail.com"
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">
                    Số điện thoại <span className="text-[#FFB7C5]">*</span>
                  </label>
                  <input
                    value={addForm.phone}
                    onChange={(e) =>
                      setAddForm({ ...addForm, phone: e.target.value })
                    }
                    placeholder="0901 234 567"
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">Địa chỉ</label>
                  <textarea
                    value={addForm.address}
                    onChange={(e) =>
                      setAddForm({ ...addForm, address: e.target.value })
                    }
                    rows={2}
                    placeholder="Số nhà, đường, phường, quận, tỉnh/thành phố"
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">Gói</label>
                    <select
                      value={addForm.plan}
                      onChange={(e) =>
                        setAddForm({ ...addForm, plan: e.target.value })
                      }
                      className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                    >
                      <option value="monthly">🌸 Tháng</option>
                      <option value="quarterly">🎀 Quý</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">
                      Trạng thái
                    </label>
                    <select
                      value={addForm.status}
                      onChange={(e) =>
                        setAddForm({ ...addForm, status: e.target.value })
                      }
                      className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                    >
                      <option value="active">✅ Active</option>
                      <option value="pending">⏳ Pending</option>
                      <option value="expired">❌ Hết hạn</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">
                      Ngày bắt đầu
                    </label>
                    <input
                      type="date"
                      value={addForm.startDate}
                      onChange={(e) =>
                        setAddForm({ ...addForm, startDate: e.target.value })
                      }
                      className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">
                      Ngày hết hạn
                    </label>
                    <input
                      type="date"
                      value={addForm.endDate}
                      onChange={(e) =>
                        setAddForm({ ...addForm, endDate: e.target.value })
                      }
                      className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">Ghi chú</label>
                  <textarea
                    value={addForm.adminNote}
                    onChange={(e) =>
                      setAddForm({ ...addForm, adminNote: e.target.value })
                    }
                    rows={2}
                    placeholder="VD: Khách nhắn tin Facebook, tháng 5/2025..."
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] resize-none"
                  />
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
                  onClick={adminCreate}
                  className="flex-1 py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold hover:bg-[#ff9db5]"
                >
                  Thêm subscriber ✅
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal sửa thông tin & thời gian */}
      {showEditTime && selectedSub && (
        <>
          <div
            onClick={() => setShowEditTime(false)}
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-md px-4 max-h-[85vh]">
            <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
              <h3 className="text-lg font-semibold text-[#4A4A6A] mb-5">
                ✏️ Sửa thông tin & thời gian
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">Họ tên</label>
                  <input
                    value={editTimeForm.name}
                    onChange={(e) =>
                      setEditTimeForm({ ...editTimeForm, name: e.target.value })
                    }
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">Email</label>
                  <input
                    value={editTimeForm.email}
                    onChange={(e) =>
                      setEditTimeForm({
                        ...editTimeForm,
                        email: e.target.value,
                      })
                    }
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">
                    Số điện thoại
                  </label>
                  <input
                    value={editTimeForm.phone}
                    onChange={(e) =>
                      setEditTimeForm({
                        ...editTimeForm,
                        phone: e.target.value,
                      })
                    }
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">Địa chỉ</label>
                  <textarea
                    value={editTimeForm.address}
                    onChange={(e) =>
                      setEditTimeForm({
                        ...editTimeForm,
                        address: e.target.value,
                      })
                    }
                    rows={2}
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">Gói</label>
                    <select
                      value={editTimeForm.plan}
                      onChange={(e) =>
                        setEditTimeForm({
                          ...editTimeForm,
                          plan: e.target.value,
                        })
                      }
                      className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                    >
                      <option value="monthly">🌸 Tháng</option>
                      <option value="quarterly">🎀 Quý</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">
                      Trạng thái
                    </label>
                    <select
                      value={editTimeForm.status}
                      onChange={(e) =>
                        setEditTimeForm({
                          ...editTimeForm,
                          status: e.target.value,
                        })
                      }
                      className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                    >
                      <option value="active">✅ Active</option>
                      <option value="pending">⏳ Pending</option>
                      <option value="expired">❌ Hết hạn</option>
                      <option value="cancelled">🚫 Đã hủy</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">
                      Ngày bắt đầu
                    </label>
                    <input
                      type="date"
                      value={editTimeForm.startDate}
                      onChange={(e) =>
                        setEditTimeForm({
                          ...editTimeForm,
                          startDate: e.target.value,
                        })
                      }
                      className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#4A4A6A]/60">
                      Ngày hết hạn
                    </label>
                    <input
                      type="date"
                      value={editTimeForm.endDate}
                      onChange={(e) =>
                        setEditTimeForm({
                          ...editTimeForm,
                          endDate: e.target.value,
                        })
                      }
                      className="border border-[#FFD6E0] rounded-xl px-3 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#4A4A6A]/60">Ghi chú</label>
                  <textarea
                    value={editTimeForm.adminNote}
                    onChange={(e) =>
                      setEditTimeForm({
                        ...editTimeForm,
                        adminNote: e.target.value,
                      })
                    }
                    rows={2}
                    className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5] resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditTime(false)}
                  className="flex-1 py-3 rounded-2xl border border-[#FFD6E0] text-sm text-[#4A4A6A] hover:bg-[#FFF0F5]"
                >
                  Hủy
                </button>
                <button
                  onClick={() => adminUpdateTime(selectedSub._id)}
                  className="flex-1 py-3 rounded-2xl bg-[#FFB7C5] text-white text-sm font-semibold hover:bg-[#ff9db5]"
                >
                  Lưu thay đổi 🌸
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MailClubManager;
