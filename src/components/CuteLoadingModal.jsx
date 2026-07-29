import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * CuteLoadingModal - Component Loading dễ thương tone Xanh Dương Pastel
 *
 * Props:
 * - isLoading (boolean): Bật/Tắt hiệu ứng loading
 * - text (string): Dòng chữ hiển thị khi đang tải
 * - logoSrc (string): Đường dẫn logo trong thư mục public
 * - logoAlt (string): Thẻ alt logo
 * - fullScreen (boolean): true = phủ toàn màn hình (Modal/Overlay), false = nằm gọn trong container hiện tại
 */
export default function CuteLoadingModal({
  isLoading = true,
  text = "Đang tải dữ liệu, chờ chút nha...",
  logoSrc = "/logo_blue.png",
  logoAlt = "Studio Logo",
  fullScreen = true,
}) {
  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative z-10 bg-white/85 backdrop-blur-xl border border-[#93C5FD]/40 rounded-3xl p-8 sm:p-10 max-w-xs w-full text-center shadow-[0_20px_60px_rgba(160,196,255,0.3)] flex flex-col items-center gap-5 selection:bg-[#A0C4FF]"
    >
      {/* ================= LOGO + VÒNG XOAY SPINNER ================= */}
      <div className="relative flex items-center justify-center">
        {/* Vệt sáng phát quang xanh nhè nhẹ */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-24 h-24 bg-[#93C5FD]/40 rounded-full blur-xl"
        />

        {/* Vòng viền Gradient xoay tròn liên tục (Spinning Ring) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-2.5 rounded-3xl bg-gradient-to-tr from-[#93C5FD] via-transparent to-[#60A5FA] p-[2px] opacity-80"
        />

        {/* Khung chứa Logo nhún nhảy nhẹ */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-20 h-20 bg-gradient-to-tr from-[#D0E1FD] via-[#E8F0FE] to-white border-2 border-white rounded-2xl flex items-center justify-center shadow-sm p-3.5 overflow-hidden"
        >
          <img
            src={logoSrc}
            alt={logoAlt}
            className="w-full h-full object-contain filter drop-shadow-sm"
          />
        </motion.div>
      </div>

      {/* ================= DÒNG CHỮ LOADING & CHẤM NHẢY ================= */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-[#2B3A55] tracking-wide flex items-center justify-center gap-1">
          {text}
        </p>

        {/* 3 Chấm nảy nhảy nhót (Bouncing Dots) */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {[0, 1, 2].map((idx) => (
            <motion.span
              key={idx}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.15,
              }}
              className="w-2 h-2 rounded-full bg-[#80B3FF]"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isLoading && (
        <>
          {fullScreen ? (
            /* Layout Phủ Toàn Màn Hinh */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center p-4 overflow-hidden"
            >
              {/* Background Các Icon Bay Lơ Lửng */}
              <div className="absolute inset-0 pointer-events-none">
                {[
                  { char: "☁️", top: "15%", left: "12%", duration: 4 },
                  {
                    char: "🫧",
                    top: "28%",
                    right: "15%",
                    duration: 5,
                    delay: 1,
                  },
                  {
                    char: "✨",
                    bottom: "22%",
                    left: "18%",
                    duration: 3.5,
                    delay: 0.5,
                  },
                  {
                    char: "⭐",
                    bottom: "25%",
                    right: "20%",
                    duration: 4.5,
                    delay: 1.5,
                  },
                ].map((item, idx) => (
                  <motion.span
                    key={idx}
                    style={{
                      position: "absolute",
                      top: item.top,
                      left: item.left,
                      right: item.right,
                      bottom: item.bottom,
                    }}
                    className="text-2xl opacity-40 select-none"
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: item.duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: item.delay || 0,
                    }}
                  >
                    {item.char}
                  </motion.span>
                ))}
              </div>

              {content}
            </motion.div>
          ) : (
            /* Layout Nằm Gọn Trong Container Hàng/Cột */
            <div className="w-full py-12 flex items-center justify-center">
              {content}
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
