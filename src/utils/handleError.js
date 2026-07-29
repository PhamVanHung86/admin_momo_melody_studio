import toast from "react-hot-toast";

/**
 * Xử lý lỗi API đồng nhất cho toàn admin panel:
 * - vẫn log ra console để dev debug
 * - đồng thời hiện toast để admin biết ngay có lỗi, thay vì im lặng
 *
 * @param {unknown} err - lỗi bắt được trong catch, hoặc message string từ data.message
 * @param {string} fallbackMessage - hiển thị khi không có message cụ thể
 */
export function handleApiError(
  err,
  fallbackMessage = "Đã có lỗi xảy ra, vui lòng thử lại",
) {
  console.error(err);
  const raw = typeof err === "string" ? err : err?.message;
  const message = raw && raw !== "Failed to fetch" ? raw : fallbackMessage;
  toast.error(message);
}
