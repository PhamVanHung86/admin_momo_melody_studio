import React, { useState, useEffect } from "react";
import CustomerDetailModal from "../components/CustomerDetailModal";
import { ALL_COLUMNS, SORT_OPTIONS } from "../constansts/mailClubData";
import { apiFetch } from "../api/client";
import TableSkeleton from "../components/TableSkeleton";
import { handleApiError } from "../utils/handleError";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [nicknameInput, setNicknameInput] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    ALL_COLUMNS.filter((c) => c.default).map((c) => c.key),
  );
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [mailClubFilter, setMailClubFilter] = useState("all");

  const fetchCustomers = async () => {
    try {
      const res = await apiFetch("/api/users", {
      });
      const data = await res.json();
      if (data.success) setCustomers(data.customers);
    } catch (err) {
      handleApiError(err, "Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const startEdit = (e, customer) => {
    e.stopPropagation();
    setEditingId(customer._id);
    setNicknameInput(customer.nickname || "");
  };

  const saveNickname = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await apiFetch(`/api/users/${id}/nickname`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nicknameInput }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomers((prev) =>
          prev.map((c) =>
            c._id === id ? { ...c, nickname: nicknameInput } : c,
          ),
        );
      }
    } catch (err) {
      handleApiError(err, "Lưu biệt danh thất bại");
    } finally {
      setEditingId(null);
    }
  };

  const toggleColumn = (key) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  let filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.nickname?.toLowerCase().includes(search.toLowerCase()),
  );

  if (mailClubFilter === "subscribed") {
    filtered = filtered.filter((c) => c.mailClubSubscribed);
  } else if (mailClubFilter === "not") {
    filtered = filtered.filter((c) => !c.mailClubSubscribed);
  }

  // Sort
  const [sortField, sortDir] = sortBy.split("-");
  filtered = [...filtered].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortField === "createdAt") {
      valA = new Date(valA);
      valB = new Date(valB);
    }
    if (sortField === "name") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  if (loading) {
    return <TableSkeleton rows={12} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-[#4A4A6A]/60">
          Tổng{" "}
          <span className="font-semibold text-[#4A4A6A]">
            {filtered.length}
          </span>{" "}
          khách hàng
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mail Club filter */}
          <select
            value={mailClubFilter}
            onChange={(e) => setMailClubFilter(e.target.value)}
            className="text-xs border border-[#b8deff] rounded-xl px-3 py-2 text-[#4A4A6A] outline-none focus:border-[#b8deff] bg-white cursor-pointer"
          >
            <option value="all">Tất cả</option>
            <option value="subscribed">✓ Đã đăng ký Mail Club</option>
            <option value="not">Chưa đăng ký</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs border border-[#b8deff] rounded-xl px-3 py-2 text-[#4A4A6A] outline-none focus:border-[#b8deff] bg-white cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Column picker */}
          <div className="relative">
            <button
              onClick={() => setShowColumnPicker(!showColumnPicker)}
              className="text-xs px-4 py-2 rounded-xl border border-[#b8deff] text-[#4A4A6A] hover:bg-[#b8deff] transition-colors"
            >
              ⚙️ Cột hiển thị
            </button>
            {showColumnPicker && (
              <>
                <div
                  onClick={() => setShowColumnPicker(false)}
                  className="fixed inset-0 z-10"
                />
                <div className="absolute right-0 top-full mt-2 z-20 bg-white rounded-2xl shadow-lg border border-[#b8deff] p-3 w-48">
                  {ALL_COLUMNS.map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-[#4A4A6A]"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col.key)}
                        onChange={() => toggleColumn(col.key)}
                        className="accent-[#b8deff]"
                      />
                      {col.label}
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm khách hàng..."
            className="border border-[#b8deff] rounded-xl px-4 py-2 text-sm text-[#4A4A6A] outline-none focus:border-[#b8deff] bg-white w-44"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#FFD6E0]/50 overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#FFD6E0]/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider">
                Khách hàng
              </th>
              {ALL_COLUMNS.filter((c) => visibleColumns.includes(c.key)).map(
                (col) => (
                  <th
                    key={col.key}
                    className="text-left px-6 py-4 text-xs font-semibold text-[#4A4A6A]/50 uppercase tracking-wider whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c._id}
                onClick={() => setSelectedCustomerId(c._id)}
                className="border-b border-[#FFD6E0]/30 last:border-0 hover:bg-[#FFFAF5] transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {c.avatar ? (
                      <img
                        src={c.avatar}
                        className="w-9 h-9 rounded-full object-cover"
                        alt={c.name}
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#FFD6E0] flex items-center justify-center text-sm font-medium text-[#4A4A6A]">
                        {c.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <p className="text-sm font-medium text-[#4A4A6A]">
                      {c.name}
                    </p>
                  </div>
                </td>

                {visibleColumns.includes("nickname") && (
                  <td className="px-6 py-4">
                    {editingId === c._id ? (
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          value={nicknameInput}
                          onChange={(e) => setNicknameInput(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && saveNickname(e, c._id)
                          }
                          autoFocus
                          className="border border-[#b8deff] rounded-lg px-2 py-1 text-sm text-[#4A4A6A] outline-none w-28"
                        />
                        <button
                          onClick={(e) => saveNickname(e, c._id)}
                          className="text-xs text-[#b8deff] hover:underline"
                        >
                          Lưu
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => startEdit(e, c)}
                        className="text-sm"
                      >
                        {c.nickname ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#F5E6FF] text-[#8B98E3] text-xs">
                            {c.nickname}
                          </span>
                        ) : (
                          <span className="text-[#4A4A6A]/30 text-xs italic">
                            + Thêm
                          </span>
                        )}
                      </button>
                    )}
                  </td>
                )}

                {visibleColumns.includes("email") && (
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#4A4A6A]/70">{c.email}</p>
                  </td>
                )}

                {visibleColumns.includes("phone") && (
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#4A4A6A]/70">
                      {c.phone || (
                        <span className="text-[#4A4A6A]/30 italic text-xs">
                          Chưa có
                        </span>
                      )}
                    </p>
                  </td>
                )}

                {visibleColumns.includes("address") && (
                  <td className="px-6 py-4 max-w-[180px]">
                    <p className="text-sm text-[#4A4A6A]/70 truncate">
                      {c.address || (
                        <span className="text-[#4A4A6A]/30 italic text-xs">
                          Chưa có
                        </span>
                      )}
                    </p>
                  </td>
                )}

                {visibleColumns.includes("createdAt") && (
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#4A4A6A]/60">
                      {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </td>
                )}

                {visibleColumns.includes("totalOrders") && (
                  <td className="px-6 py-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-[#FFF0A0] text-[#4A4A6A]">
                      {c.totalOrders} đơn
                    </span>
                  </td>
                )}

                {visibleColumns.includes("totalSpent") && (
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[#448ecf]">
                      {c.totalSpent.toLocaleString()} đ
                    </p>
                  </td>
                )}

                {visibleColumns.includes("mailClubSubscribed") && (
                  <td className="px-6 py-4">
                    {c.mailClubSubscribed ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs px-3 py-1 rounded-full font-medium bg-[#FFB7C5] text-white w-fit">
                          ✓{" "}
                          {c.mailClubPlan === "monthly"
                            ? "Gói Tháng"
                            : "Gói Quý"}
                        </span>
                        {c.mailClubEndDate && (
                          <span className="text-[10px] text-[#4A4A6A]/40 pl-1">
                            Hết:{" "}
                            {new Date(c.mailClubEndDate).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-400">
                        Chưa đăng ký
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="text-4xl">👥</span>
            <p className="text-sm text-[#4A4A6A]/40 mt-3">
              Không tìm thấy khách hàng
            </p>
          </div>
        )}
      </div>

      {/* Modal chi tiết */}
      {selectedCustomerId && (
        <CustomerDetailModal
          customerId={selectedCustomerId}
          onClose={() => setSelectedCustomerId(null)}
        />
      )}
    </div>
  );
};

export default Customers;
