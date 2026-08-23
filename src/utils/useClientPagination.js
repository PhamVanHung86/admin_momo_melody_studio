import { useState, useMemo, useEffect } from "react";

/**
 * Phân trang phía client cho một mảng đã lọc/sắp xếp sẵn.
 * Dùng cho các trang mà filter/sort/search đang xử lý ở client (Customers,
 * tìm kiếm mã đơn ở Orders...) — nơi chưa có (hoặc chưa cần) phân trang
 * server-side tương ứng.
 *
 * Tự động nhảy về trang 1 mỗi khi độ dài danh sách nguồn thay đổi (VD: đổi
 * bộ lọc/search) để tránh đứng ở một trang trống.
 */
export function useClientPagination(items, pageSize = 20) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [items.length]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return {
    page,
    setPage,
    totalPages,
    total: items.length,
    pageSize,
    pageItems,
  };
}
