import React from "react";

const SettingsPanel = ({
  settings,
  settingsForm,
  setSettingsForm,
  onSaveSettings,
}) => {
  if (!settings) return null;

  return (
    <div
      className={`rounded-3xl p-6 border-2 transition-all ${
        settings.isOpen
          ? "border-[#D4F4DD] bg-[#F0FFF4]"
          : "border-[#FFD6E0] bg-[#FFF0F5]"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              settings.isOpen ? "bg-[#E6FFF5]" : "bg-[#FFE6F0]"
            }`}
          />
          <h3 className="text-sm font-semibold text-[#4A4A6A]">
            Form đăng ký hiện đang {settings.isOpen ? "MỞ" : "ĐÓNG"}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Toggle mở/đóng */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#4A4A6A]/60">Trạng thái form</label>
          <div className="flex gap-2">
            <button
              onClick={() => setSettingsForm({ ...settingsForm, isOpen: true })}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                settingsForm.isOpen
                  ? "bg-[#D4F4DD] text-green-700 border-2 border-green-300"
                  : "bg-white border-2 border-[#FFD6E0] text-[#4A4A6A]/50"
              }`}
            >
              🟢 Mở form
            </button>
            <button
              onClick={() =>
                setSettingsForm({ ...settingsForm, isOpen: false })
              }
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                !settingsForm.isOpen
                  ? "bg-[#FFD6E0] text-red-500 border-2 border-red-300"
                  : "bg-white border-2 border-[#FFD6E0] text-[#4A4A6A]/50"
              }`}
            >
              🔴 Đóng form
            </button>
          </div>
        </div>

        {/* Thời gian đóng tự động */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#4A4A6A]/60">
            Tự động đóng lúc (tùy chọn)
          </label>
          <input
            type="datetime-local"
            value={settingsForm.closeAt}
            onChange={(e) =>
              setSettingsForm({ ...settingsForm, closeAt: e.target.value })
            }
            className="border border-[#FFD6E0] rounded-xl px-4 py-2.5 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
          />
        </div>

        {/* Thông báo khi mở */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#4A4A6A]/60">
            Thông báo khi form mở
          </label>
          <input
            value={settingsForm.openMessage}
            onChange={(e) =>
              setSettingsForm({ ...settingsForm, openMessage: e.target.value })
            }
            className="border border-[#FFD6E0] rounded-xl px-4 py-2.5 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
          />
        </div>

        {/* Thông báo khi đóng */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#4A4A6A]/60">
            Thông báo khi form đóng
          </label>
          <input
            value={settingsForm.closedMessage}
            onChange={(e) =>
              setSettingsForm({
                ...settingsForm,
                closedMessage: e.target.value,
              })
            }
            className="border border-[#FFD6E0] rounded-xl px-4 py-2.5 text-sm text-[#4A4A6A] outline-none focus:border-[#FFB7C5]"
          />
        </div>
      </div>

      <button
        onClick={onSaveSettings}
        className="mt-4 bg-[#FFB7C5] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#ff9db5] transition-colors"
      >
        Lưu cài đặt
      </button>
    </div>
  );
};

export default SettingsPanel;
