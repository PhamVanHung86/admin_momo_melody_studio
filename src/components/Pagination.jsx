// Thanh phân trang dùng chung cho các trang danh sách dài (Products, Orders,
// Customers...). Chỉ nhận state từ ngoài truyền vào (controlled component),
// không tự fetch dữ liệu — nơi gọi tự quyết định phân trang server-side hay
// client-side.
const Pagination = ({ page, totalPages, total, pageSize, onPageChange }) => {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Danh sách số trang hiển thị, rút gọn bằng "..." khi có nhiều trang
  const getPageNumbers = () => {
    const pages = [];
    const windowSize = 1; // số trang hiển thị mỗi bên của trang hiện tại

    const addPage = (p) => pages.push(p);

    addPage(1);
    if (page - windowSize > 2) addPage("...");
    for (
      let p = Math.max(2, page - windowSize);
      p <= Math.min(totalPages - 1, page + windowSize);
      p++
    ) {
      addPage(p);
    }
    if (page + windowSize < totalPages - 1) addPage("...");
    if (totalPages > 1) addPage(totalPages);

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-4">
      <p className="text-xs text-[#4A4A6A]/50">
        Hiển thị <span className="font-medium text-[#4A4A6A]">{from}</span>–
        <span className="font-medium text-[#4A4A6A]">{to}</span> trong tổng số{" "}
        <span className="font-medium text-[#4A4A6A]">{total}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-[#4A4A6A] border border-[#CBD1F2]/60 hover:bg-[#FFFAF5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Trang trước"
        >
          ‹
        </button>

        {getPageNumbers().map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-8 h-8 flex items-center justify-center text-sm text-[#4A4A6A]/40"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? "bg-[#b8deff] text-white"
                  : "text-[#4A4A6A] border border-[#CBD1F2]/60 hover:bg-[#FFFAF5]"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-[#4A4A6A] border border-[#CBD1F2]/60 hover:bg-[#FFFAF5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Trang sau"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Pagination;
