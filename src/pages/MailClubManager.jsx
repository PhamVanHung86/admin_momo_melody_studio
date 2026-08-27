import React, { useState, useEffect } from "react";
import { apiFetch } from "../api/client";
import toast from "react-hot-toast";
import { handleApiError } from "../utils/handleError";
import Pagination from "../components/Pagination";
import { useClientPagination } from "../utils/useClientPagination";

// Import 7 Sub-components
import SettingsPanel from "../components/mailclub/SettingsPanel";
import SubscriptionToolbar from "../components/mailclub/SubscriptionToolbar";
import SubscriptionTable from "../components/mailclub/SubscriptionTable";
import SubscriptionDetailModal from "../components/mailclub/SubscriptionDetailModal";
import AddSubscriberModal from "../components/mailclub/AddSubscriberModal";
import EditSubscriberModal from "../components/mailclub/EditSubscriberModal";
import CustomEmailModal from "../components/mailclub/CustomEmailModal";
import ConfirmModal from "../components/ConfirmModal";
import NewCyclePreviewModal from "../components/mailclub/NewCyclePreviewModal";

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

  // Xem trước & xác nhận trước khi mở kỳ mail club tháng mới
  const [showNewCycleModal, setShowNewCycleModal] = useState(false);
  const [newCycleLoading, setNewCycleLoading] = useState(false);
  const [newCycleData, setNewCycleData] = useState(null);
  const [newCycleForm, setNewCycleForm] = useState({
    subject: "",
    message: "",
    excludeIds: [],
  });
  const [newCycleConfirming, setNewCycleConfirming] = useState(false);
  const [newCycleResult, setNewCycleResult] = useState("");

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

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
    remainingTurns: "",
  });
  const [editTimeForm, setEditTimeForm] = useState({
    startDate: "",
    endDate: "",
    status: "",
    adminNote: "",
    remainingTurns: "",
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
      const res = await apiFetch("/api/mail-club-settings", {});
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
      const res = await apiFetch(`/api/mail-club?status=${status}`, {});
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

  const markShipped = async (sub) => {
    try {
      await apiFetch(`/api/mail-club/${sub._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipped: true }),
      });
      toast.success("Đã đánh dấu giao hàng!");
      fetchSubs(statusFilter);
    } catch (err) {
      handleApiError(err, "Đánh dấu đã giao thất bại");
    }
  };

  // 1. Mở modal xác nhận huỷ (thay cho window.confirm)
  const cancelSub = (id) => {
    setCancelTargetId(id);
    setCancelModalOpen(true);
  };

  // 2. Đóng modal huỷ
  const closeCancelModal = () => {
    if (isCancelling) return;
    setCancelModalOpen(false);
    setCancelTargetId(null);
  };

  // 3. Thực thi huỷ sau khi bấm nút Xác nhận trên Modal
  const handleConfirmCancel = async () => {
    if (!cancelTargetId) return;

    setIsCancelling(true);
    try {
      await apiFetch(`/api/mail-club/${cancelTargetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      toast.success("Đã huỷ subscription!");
      fetchSubs(statusFilter);
      setShowModal(false);
      closeCancelModal();
    } catch (err) {
      handleApiError(err, "Huỷ gói thất bại");
    } finally {
      setIsCancelling(false);
    }
  };

  // Bước 1: Mở modal xem trước nội dung + danh sách người nhận (chưa gửi gì cả)
  const openNewCyclePreview = async () => {
    setShowNewCycleModal(true);
    setNewCycleLoading(true);
    setNewCycleResult("");
    try {
      const res = await apiFetch("/api/mail-club/new-cycle/preview");
      const data = await res.json();
      setNewCycleData(data);
      setNewCycleForm({
        subject: data.subject || "",
        message: data.message || "",
        excludeIds: [],
      });
    } catch (err) {
      handleApiError(err, "Không tải được nội dung xem trước");
      setShowNewCycleModal(false);
    } finally {
      setNewCycleLoading(false);
    }
  };

  // Bước 2: Admin đã xem/chỉnh sửa xong, bấm xác nhận thì lúc này mới thật sự gửi
  const confirmNewCycle = async () => {
    setNewCycleConfirming(true);
    try {
      const res = await apiFetch("/api/mail-club/new-cycle/confirm", {
        method: "POST",
        body: JSON.stringify({
          subject: newCycleForm.subject,
          message: newCycleForm.message,
          excludeIds: newCycleForm.excludeIds,
        }),
      });
      const data = await res.json();
      setNewCycleResult(data.message);
      setActionResult(data.message);
      fetchSubs(statusFilter);
      setTimeout(() => {
        setShowNewCycleModal(false);
        setNewCycleResult("");
        setActionResult("");
      }, 2500);
    } catch (err) {
      handleApiError(err, "Gửi email nhắc gia hạn thất bại");
      setNewCycleResult("Lỗi: gửi email thất bại");
    } finally {
      setNewCycleConfirming(false);
    }
  };

  const filtered = subscriptions.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search),
  );

  const { page, setPage, totalPages, total, pageSize, pageItems } =
    useClientPagination(filtered, 8);

  const counts = {
    pending: subscriptions.filter((s) => s.status === "pending").length,
    expiring: subscriptions.filter(
      (s) => s.status === "active" && s.remainingTurns <= 0,
    ).length,
  };

  const adminCreate = async () => {
    if (!addForm.name || !addForm.email || !addForm.phone) {
      toast.error("Vui lòng điền đủ tên, email, SĐT!");
      return;
    }
    try {
      // Tạo 1 bản sao của addForm để không sửa trực tiếp state gốc
      const payload = { ...addForm };

      // Nếu ô "Lượt còn lại" đang để trống ("") thì xóa field này
      // khỏi payload — để backend tự tính mặc định theo gói
      if (payload.remainingTurns === "") {
        delete payload.remainingTurns;
      }

      // Gửi payload (đã xử lý) thay vì addForm (dữ liệu gốc chưa xử lý)
      const res = await apiFetch("/api/mail-club/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
          remainingTurns: "",
          adminNote: "",
        });
        toast.success("Đã thêm subscriber!");
        fetchSubs(statusFilter);
      } else {
        toast.error(data.message || "Có lỗi xảy ra");
      }
    } catch {
      toast.error("Lỗi kết nối server");
    }
  };

  const adminUpdateTime = async (id) => {
    try {
      const res = await apiFetch(`/api/mail-club/admin/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
        onSendReminders={openNewCyclePreview}
        sending={newCycleLoading}
        onOpenEmailModal={() => setShowEmailModal(true)}
      />

      {/* 3. Bảng dữ liệu & Lọc tab trạng thái */}
      <SubscriptionTable
        filteredSubscriptions={pageItems}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onSelectSub={(sub) => {
          setSelectedSub(sub);
          setRenewPlan(sub.plan);
          setAdminNote(sub.adminNote || "");
          setShowModal(true);
        }}
        onMarkShipped={markShipped}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={setPage}
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
              remainingTurns: selectedSub.remainingTurns ?? 0,
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

      {/* 8. Modal Xem trước & Xác nhận mở kỳ Mail Club tháng mới */}
      <NewCyclePreviewModal
        isOpen={showNewCycleModal}
        onClose={() => setShowNewCycleModal(false)}
        loading={newCycleLoading}
        data={newCycleData}
        form={newCycleForm}
        setForm={setNewCycleForm}
        confirming={newCycleConfirming}
        confirmResult={newCycleResult}
        onConfirm={confirmNewCycle}
      />

      <ConfirmModal
        open={cancelModalOpen}
        title="Huỷ subscription"
        message="Bạn có chắc chắn muốn huỷ subscription này không? Hành động này không thể hoàn tác."
        confirmLabel="Huỷ subscription"
        cancelLabel="Đóng"
        danger={true}
        loading={isCancelling}
        onConfirm={handleConfirmCancel}
        onCancel={closeCancelModal}
      />
    </div>
  );
};

export default MailClubManager;
