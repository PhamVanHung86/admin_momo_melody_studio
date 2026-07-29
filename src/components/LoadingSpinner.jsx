import React from "react";

/**
 * CuteSpinner - Component Loading linh hoạt & xinh xắn
 *
 * @param {string} size - Kích thước: 'sm' | 'md' | 'lg' | 'xl' (Mặc định: 'md')
 * @param {string} text - Dòng chữ đi kèm bên dưới (Tùy chọn)
 * @param {boolean} fullWidth - Bật true nếu muốn căn giữa toàn bộ khung chứa
 * @param {string} icon - Icon/Emoji ở tâm: '🌸' | '🎀' | '🧸' | '✨' | '🎀'
 */
export default function CuteSpinner({
  size = "md",
  text = "",
  fullWidth = false,
  icon = "🌸",
  className = "",
}) {
  // Cấu hình kích thước vòng quay
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-14 h-14 border-4",
    xl: "w-20 h-20 border-[5px]",
  };

  // Cấu hình kích thước icon ở tâm
  const iconSizeMap = {
    sm: "text-[9px]",
    md: "text-xs",
    lg: "text-base",
    xl: "text-2xl",
  };

  const spinnerCore = (
    <div
      className={`inline-flex flex-col items-center justify-center gap-2.5 ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* 1. Hiệu ứng quầng sáng mờ tỏa ra phía sau (Chỉ dành cho size lg & xl) */}
        {(size === "lg" || size === "xl") && (
          <div className="absolute inset-0 bg-[#FFB7C5]/35 rounded-full blur-md animate-pulse" />
        )}

        {/* 2. Vòng xoay đa sắc Pastel */}
        <div
          className={`${sizeMap[size]} rounded-full border-[#FFD6E0] border-t-[#8B98E3] border-r-[#FFB7C5] animate-spin`}
          style={{ animationDuration: "0.85s" }}
        />

        {/* 3. Icon/Petal nhún nhảy dịu dàng ở tâm */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${iconSizeMap[size]} animate-bounce select-none pointer-events-none`}
          style={{ animationDuration: "1.4s" }}
        >
          {icon}
        </div>

        {/* 4. Dấu sao lấp lánh nhẹ ở góc (Chỉ dành cho size lg & xl) */}
        {(size === "lg" || size === "xl") && (
          <span className="absolute -top-1 -right-1 text-xs animate-ping">
            ✨
          </span>
        )}
      </div>

      {/* Dòng chữ loading bổ sung (Nếu có) */}
      {text && (
        <p className="text-xs font-medium text-[#4A4A6A]/70 tracking-wide animate-pulse flex items-center gap-1">
          {text}
        </p>
      )}
    </div>
  );

  // Nếu bật fullWidth, tự động bọc trong div flex căn giữa
  if (fullWidth) {
    return (
      <div className="w-full py-10 flex items-center justify-center">
        {spinnerCore}
      </div>
    );
  }

  return spinnerCore;
}
