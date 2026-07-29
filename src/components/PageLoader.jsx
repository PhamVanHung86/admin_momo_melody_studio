import React from "react";

export default function PageLoader({ message = "Đang chuẩn bị trang..." }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FFFAF5]/90 backdrop-blur-sm transition-opacity duration-300">
      {/* Cụm hiệu ứng trung tâm */}
      <div className="relative flex items-center justify-center mb-5">
        {/* Vòng tròn hiệu ứng sóng lan (Ping effect) */}
        <div className="absolute w-20 h-20 bg-[#FFB7C5]/30 rounded-full animate-ping" />

        {/* Vòng xoay Pastel Spinner */}
        <div className="w-16 h-16 border-4 border-t-[#8B98E3] border-r-[#FFB7C5] border-b-[#FFD6E0] border-l-transparent rounded-full animate-spin" />

        {/* Icon hoa/trái tim nhún nhảy ở giữa */}
        <span className="absolute text-2xl select-none animate-bounce">🌸</span>
      </div>

      {/* Tên thương hiệu */}
      <h2
        style={{ fontFamily: "'Dancing Script', cursive" }}
        className="text-2xl text-[#4A4A6A] font-semibold mb-2 tracking-wide"
      >
        momo's melody studio
      </h2>

      {/* Dòng chữ Loading & 3 chấm nảy */}
      <div className="flex items-center gap-2 text-xs font-medium text-[#4A4A6A]/60">
        <span>{message}</span>
        <div className="flex gap-1 items-center">
          <span className="w-1.5 h-1.5 bg-[#8B98E3] rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 bg-[#FFB7C5] rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 bg-[#8B98E3] rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
