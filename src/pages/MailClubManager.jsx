import React, { useState, useEffect } from "react";
import { apiFetch } from "../api/client";
import toast from "react-hot-toast";
import { handleApiError } from "../utils/handleError";

// Import 7 Sub-components
import SettingsPanel from "../components/mailclub/SettingsPanel";
import SubscriptionToolbar from "../components/mailclub/SubscriptionToolbar";
import SubscriptionTable from "../components/mailclub/SubscriptionTable";
import SubscriptionDetailModal from "../components/mailclub/SubscriptionDetailModal";
import AddSubscriberModal from "../components/mailclub/AddSubscriberModal";
import EditSubscriberModal from "../components/mailclub/EditSubscriberModal";
import CustomEmailModal from "../components/mailclub/CustomEmailModal";

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
  const [settings, setSettings] = useState(null);

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
  const [settingsForm, setSettingsForm] = useState({
    isOpen: false,
    closeAt: "",
    openMessage: "",
    closedMessage: "",
  });

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    recipientType: "active",
    specificIds: [],
    subject: "",
    message: "",
    buttonText: "",
    buttonLink: "",
  });
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult] = useState("");

  const fetchSettings = async () => {
    try {
      const res = await apiFetch("/api/mail-club-settings", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setSettingsForm({
          isOpen: data.settings.isOpen,
          closeAt: data.settings.closeAt
            ? new Date(data.settings.closeAt).toISOString().slice(0, 16)
            : "",
          openMessage: data.settings.openMessage,
          closedMessage: data.settings.closedMessage,
        });
      }
    } catch (err) {
      handleApiError(err, "Không thể tải cài đặt Mail Club");
    }
  };

  const fetchSubs = async (status = "all") => {
    try {
      const res = await apiFetch(`/api/mail-club?status=${status}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setSubscriptions(data.subscriptions);
    } catch (err) {
      handleApiError(err, "Không thể tải danh sách thành viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs(statusFilter);
    fetchSettings();
    const handleSync = () => fetchSubs(statusFilter);
    window.addEventListener("mailclub-updated", handleSync);

    return () => window.removeEventListener("mailclub-updated", handleSync);
  }, [statusFilter]);

  const updateSettings = async () => {
    try {
      const res = await apiFetch("/api/mail-club-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...settingsForm,
          closeAt: settingsForm.closeAt || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setActionResult("✅ Đã cập nhật cài đặt!");

        setTimeout(() => setActionResult(""), 3000);
      }
    } catch (err) {
      handleApiError(err, "Lưu cài đặt thất bại");
    }
  };

  const confirmPayment = async (id) => {
    try {
      const res = await apiFetch(`/api/mail-club/${id}/confirm`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ note: adminNote }),
      });
      const data = await res.json();
      if (data.success) {
        setActionResult("✅ Đã xác nhận thanh toán!");
        fetchSubs(statusFilter);
        setSelectedSub(data.subscription);
        window.dispatchEvent(new Event("mailclub-updated"));
        setTimeout(() => setActionResult(""), 3000);
      }
    } catch (err) {
      handleApiError(err, "Xác nhận thanh toán thất bại");
    }
  };

  const renewSub = async (id) => {
    try {
      const res = await apiFetch(`/api/mail-club/${id}/renew`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan: renewPlan, note: adminNote }),
      });
      const data = await res.json();
      if (data.success) {
        setActionResult("✅ Đã gia hạn thành công!");
        fetchSubs(statusFilter);
        setSelectedSub(data.subscription);
        window.dispatchEvent(new Event("mailclub-updated"));
        setTimeout(() => setActionResult(""), 3000);
      }
    } catch (err) {
      handleApiError(err, "Gia hạn gói thất bại");
    }
  };

  const cancelSub = async (id) => {
    if (!confirm("Hủy subscription này?")) return;
    try {
      await apiFetch(`/api/mail-club/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "cancelled" }),
      });
      fetchSubs(statusFilter);
      setShowModal(false);
    } catch (err) {
      handleApiError(err, "Huỷ gói thất bại");
    }
  };

  const sendReminders = async () => {
    setSending(true);
    try {
      const res = await apiFetch("/api/mail-club/send-reminders", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      setActionResult(data.message);
      setTimeout(() => setActionResult(""), 4000);
    } catch (err) {
      handleApiError(err, "Gửi email nhắc gia hạn thất bại");
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

  const adminCreate = async () => {
    if (!addForm.name || !addForm.email || !addForm.phone) {
      toast.error("Vui lòng điền đủ tên, email, SĐT!");
      return;
    }
    try {
      const res = await apiFetch("/api/mail-club/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(addForm),
      });
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
      handleApiError(err, "Tạo thành viên thất bại");
    }
  };

  const adminUpdateTime = async (id) => {
    try {
      const res = await apiFetch(`/api/mail-club/admin/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...selectedSub,
          ...editTimeForm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowEditTime(false);
        fetchSubs(statusFilter);
        setSelectedSub(data.subscription);
        setActionResult("✅ Đã cập nhật thông tin!");
        setTimeout(() => setActionResult(""), 3000);
      }
    } catch (err) {
      handleApiError(err, "Cập nhật thời gian gói thất bại");
    }
  };

  const sendCustomEmail = async () => {
    if (!emailForm.subject || !emailForm.message) {
      toast.error("Vui lòng điền tiêu đề và nội dung!");
      return;
    }
    setEmailSending(true);
    try {
      const res = await apiFetch("/api/mail-club/send-custom-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(emailForm),
      });
      const data = await res.json();
      setEmailResult(data.message);
      if (data.success) {
        setTimeout(() => {
          setShowEmailModal(false);
          setEmailForm({
            recipientType: "active",
            specificIds: [],
            subject: "",
            message: "",
            buttonText: "",
            buttonLink: "",
          });
          setEmailResult("");
        }, 2500);
      }
    } catch (err) {
      handleApiError(err, "Gửi email thất bại");
      setEmailResult("Lỗi gửi email");
    } finally {
      setEmailSending(false);
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
      {/* Thông báo kết quả hành động */}
      {actionResult && (
        <div className="bg-[#D4F4DD] text-green-700 text-sm px-4 py-3 rounded-xl text-center">
          {actionResult}
        </div>
      )}

      {/* 1. Panel Cài đặt Mở/Đóng form */}
      <SettingsPanel
        settings={settings}
        settingsForm={settingsForm}
        setSettingsForm={setSettingsForm}
        onSaveSettings={updateSettings}
      />

      {/* 2. Thanh công cụ & Nút hành động */}
      <SubscriptionToolbar
        counts={counts}
        search={search}
        setSearch={setSearch}
        onOpenAddForm={() => setShowAddForm(true)}
        onSendReminders={sendReminders}
        sending={sending}
        onOpenEmailModal={() => setShowEmailModal(true)}
      />

      {/* 3. Bảng dữ liệu & Lọc tab trạng thái */}
      <SubscriptionTable
        filteredSubscriptions={filtered}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        getDaysLeft={getDaysLeft}
        onSelectSub={(sub) => {
          setSelectedSub(sub);
          setRenewPlan(sub.plan);
          setAdminNote(sub.adminNote || "");
          setShowModal(true);
        }}
      />

      {/* 4. Modal Chi tiết Subscriber */}
      {showModal && (
        <SubscriptionDetailModal
          selectedSub={selectedSub}
          onClose={() => setShowModal(false)}
          actionResult={actionResult}
          adminNote={adminNote}
          setAdminNote={setAdminNote}
          renewPlan={renewPlan}
          setRenewPlan={setRenewPlan}
          onConfirmPayment={confirmPayment}
          onRenewSub={renewSub}
          onCancelSub={cancelSub}
          onOpenEditTime={() => {
            setEditTimeForm({
              name: selectedSub.name,
              email: selectedSub.email,
              phone: selectedSub.phone,
              address: selectedSub.address,
              plan: selectedSub.plan,
              status: selectedSub.status,
              startDate: selectedSub.startDate
                ? new Date(selectedSub.startDate).toISOString().slice(0, 10)
                : "",
              endDate: selectedSub.endDate
                ? new Date(selectedSub.endDate).toISOString().slice(0, 10)
                : "",
              adminNote: selectedSub.adminNote || "",
            });
            setShowEditTime(true);
          }}
        />
      )}

      {/* 5. Modal Thêm Subscriber */}
      <AddSubscriberModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        addForm={addForm}
        setAddForm={setAddForm}
        onSubmit={adminCreate}
      />

      {/* 6. Modal Sửa thông tin & Thời gian */}
      <EditSubscriberModal
        isOpen={showEditTime}
        onClose={() => setShowEditTime(false)}
        selectedSub={selectedSub}
        editTimeForm={editTimeForm}
        setEditTimeForm={setEditTimeForm}
        onSubmit={adminUpdateTime}
      />

      {/* 7. Modal Soạn Email gửi khách */}
      <CustomEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        emailForm={emailForm}
        setEmailForm={setEmailForm}
        emailSending={emailSending}
        emailResult={emailResult}
        subscriptions={subscriptions}
        onSubmit={sendCustomEmail}
      />
    </div>
  );
};

export default MailClubManager;
