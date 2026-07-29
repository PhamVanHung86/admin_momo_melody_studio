// import { useEffect, useState } from "react";

// const DEFAULT_MESSAGES = [
//   "Đang tải ảnh lên...",
//   "Sắp xong rồi, chờ chút nhé...",
//   "Đang xử lý dữ liệu...",
//   "Gần xong rồi, cảm ơn bạn đã kiên nhẫn...",
// ];

// const PETAL_COLORS = ["fill-orange-400", "fill-amber-400", "fill-rose-400"];

// export default function LoadingFlower({
//   show = false,
//   onClose,
//   messages = DEFAULT_MESSAGES,
// }) {
//   const [msgIndex, setMsgIndex] = useState(0);
//   const [internalProgress, setInternalProgress] = useState(0); // 👈 Tự quản lý tiến trình bên trong

//   // 1. Tự động đổi thông báo nhanh hơn (mỗi 0.8s) để người dùng kịp đọc trong vòng 3s ngắn ngủi
//   useEffect(() => {
//     if (!show || messages.length < 2) return;
//     const id = setInterval(() => {
//       setMsgIndex((i) => (i + 1) % messages.length);
//     }, 800);
//     return () => clearInterval(id);
//   }, [show, messages.length]);

//   // 2. Bộ đếm thời gian: Chạy progress từ 0% -> 100% trong đúng 3000ms (3 giây)
//   useEffect(() => {
//     if (!show) {
//       setInternalProgress(0);
//       setMsgIndex(0);
//       return;
//     }

//     const totalDuration = 3000; // 3 giây
//     const updateInterval = 30; // Cập nhật mỗi 30ms cho thanh loading mượt mà
//     const step = (100 / totalDuration) * updateInterval;

//     const timer = setInterval(() => {
//       setInternalProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(timer);
//           if (onClose) onClose(); // 🔔 Hết 3 giây -> Tự kích hoạt hàm đóng modal bên ngoài
//           return 100;
//         }
//         return prev + step;
//       });
//     }, updateInterval);

//     return () => clearInterval(timer);
//   }, [show, onClose]);

//   if (!show) return null;

//   return (
//     <div
//       role="status"
//       aria-live="polite"
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm"
//     >
//       <div className="flex max-w-xs w-full flex-col items-center gap-4 rounded-2xl bg-orange-50 px-11 py-9 text-center shadow-xl mx-4">
//         <svg viewBox="0 0 200 200" className="h-24 w-24">
//           <g className="origin-center animate-spin-slow motion-reduce:animate-none">
//             {Array.from({ length: 8 }).map((_, i) => (
//               <ellipse
//                 key={i}
//                 cx="100"
//                 cy="55"
//                 rx="18"
//                 ry="34"
//                 transform={`rotate(${i * 45} 100 100)`}
//                 className={`origin-center animate-bloom motion-reduce:animate-none ${PETAL_COLORS[i % PETAL_COLORS.length]}`}
//                 style={{
//                   animationDelay: `${i * 0.09}s`,
//                   transformOrigin: "100px 100px",
//                 }}
//               />
//             ))}
//           </g>
//           <circle
//             cx="100"
//             cy="100"
//             r="16"
//             className="animate-pulse-center fill-orange-600 motion-reduce:animate-none"
//           />
//         </svg>

//         <p className="min-h-[40px] flex items-center justify-center text-sm font-medium text-stone-600 framework-msg">
//           {messages[msgIndex]}
//         </p>

//         {/* Thanh Progress tự động chạy cực kỳ xịn sò */}
//         <div className="h-1.5 w-full overflow-hidden rounded-full bg-orange-100">
//           <div
//             className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-75 ease-linear"
//             style={{
//               width: `${Math.min(100, Math.max(0, internalProgress))}%`,
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

export default function TableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full bg-white rounded-2xl p-4 border border-brand-border animate-pulse">
      {/* Header Skeleton */}
      <div className="h-8 bg-gray-200 rounded-lg mb-4 w-full"></div>

      {/* Rows Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
