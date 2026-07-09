import { useEffect, useState } from "react";

const DEFAULT_MESSAGES = [
  "Đang tải ảnh lên...",
  "Sắp xong rồi, chờ chút nhé...",
  "Đang xử lý dữ liệu...",
  "Gần xong rồi, cảm ơn bạn đã kiên nhẫn...",
];

const PETAL_COLORS = ["fill-orange-400", "fill-amber-400", "fill-rose-400"];

/**
 * Overlay loading hình bông hoa xoay (Tailwind).
 * Cần thêm animation "spin-slow", "bloom", "pulse-center" vào tailwind.config.js
 * (xem tailwind.config.snippet.js).
 *
 * Cách dùng:
 *   <LoadingFlower show={uploading} />
 *   <LoadingFlower show={uploading} progress={45} messages={["Đang nén ảnh..."]} />
 */
export default function LoadingFlower({
  show = false,
  progress = null,
  messages = DEFAULT_MESSAGES,
}) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!show || messages.length < 2) return;
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 2200);
    return () => clearInterval(id);
  }, [show, messages.length]);

  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm"
    >
      <div className="flex max-w-xs flex-col items-center gap-4 rounded-2xl bg-orange-50 px-11 py-9 text-center shadow-xl">
        <svg viewBox="0 0 200 200" className="h-24 w-24">
          <g className="origin-center animate-spin-slow motion-reduce:animate-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <ellipse
                key={i}
                cx="100"
                cy="55"
                rx="18"
                ry="34"
                transform={`rotate(${i * 45} 100 100)`}
                className={`origin-center animate-bloom motion-reduce:animate-none ${PETAL_COLORS[i % PETAL_COLORS.length]}`}
                style={{
                  animationDelay: `${i * 0.09}s`,
                  transformOrigin: "100px 100px",
                }}
              />
            ))}
          </g>
          <circle
            cx="100"
            cy="100"
            r="16"
            className="animate-pulse-center fill-orange-600 motion-reduce:animate-none"
          />
        </svg>

        <p className="min-h-[20px] text-sm font-medium text-stone-600">
          {messages[msgIndex]}
        </p>

        {progress !== null && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-orange-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
