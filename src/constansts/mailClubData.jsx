export const STATUS_FILTERS = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "⏳ Chờ xác nhận" },
  { value: "active", label: "✅ Đang active" },
  { value: "expiring", label: "⚠️ Sắp hết hạn" },
  { value: "expired", label: "❌ Hết hạn" },
  { value: "cancelled", label: "🚫 Đã hủy" },
];

export const statusColor = {
  pending: "bg-[#FFF0A0] text-[#4A4A6A]",
  active: "bg-[#D4F4DD] text-green-700",
  expired: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-50 text-red-400",
};

export const statusLabel = {
  pending: "⏳ Chờ xác nhận",
  active: "✅ Active",
  expired: "❌ Hết hạn",
  cancelled: "🚫 Đã hủy",
};

export const MONTHS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export const CATEGORIES = [
  { label: "Phone Charms 🌸", value: "phone-charms" },
  { label: "Keychain 🔑", value: "keychain" },
  { label: "Pins 📌", value: "pins" },
  { label: "Mail Club ✉️", value: "mail-club" },
  { label: "Postcards 🗺️", value: "postcards" },
  { label: "Stickers ⭐", value: "stickers" },
];

export const ALL_COLUMNS = [
  { key: "nickname", label: "Biệt danh", default: true },
  { key: "email", label: "Email", default: true },
  { key: "phone", label: "SĐT", default: true },
  { key: "address", label: "Địa chỉ", default: false },
  { key: "createdAt", label: "Ngày tham gia", default: true },
  { key: "totalOrders", label: "Số đơn hàng", default: true },
  { key: "totalSpent", label: "Chi tiêu", default: true },
  { key: "mailClubSubscribed", label: "Mail Club", default: true },
];

export const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Mới tham gia nhất" },
  { value: "createdAt-asc", label: "Cũ nhất" },
  { value: "totalSpent-desc", label: "Chi tiêu cao nhất" },
  { value: "totalOrders-desc", label: "Nhiều đơn nhất" },
  { value: "name-asc", label: "Tên A-Z" },
];

export const statusColor_order = {
  "Đang xử lý": "bg-[#FFD6E0] text-[#4A4A6A]",
  "Đang giao": "bg-[#FFF0A0] text-[#4A4A6A]",
  "Đã giao": "bg-[#B8DEFF] text-[#4A4A6A]",
  "Đã hủy": "bg-gray-100 text-gray-400",
};

export const PIE_COLORS = [
  "#FFB7C5",
  "#FFD9A0",
  "#B8DEFF",
  "#C9A0FF",
  "#A0E8C8",
  "#FFA0A0",
];

export const statusOptions = ["Đang xử lý", "Đang giao", "Đã giao", "Đã hủy"];

export const CATEGORIES_NAME = [
  "Tất cả",
  "phone-charms",
  "keychain",
  "pins",
  "mail-club",
  "postcards",
  "stickers",
];

export const bgColor = {
  "phone-charms": "bg-[#FFD6E0]",
  keychain: "bg-[#FFF0A0]",
  pins: "bg-[#B8DEFF]",
  "mail-club": "bg-[#FFD6E0]",
  postcards: "bg-[#FFF0A0]",
  stickers: "bg-[#B8DEFF]",
};
