import React from "react";

// Bọc quanh <App /> để khi 1 page lỗi render, chỉ khu vực đó báo lỗi
// thay vì làm trắng toàn bộ trang admin.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Lỗi render admin panel:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFAF5] flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#FFD6E0]/50 shadow-sm text-center">
            <span className="text-4xl">😵</span>
            <h1 className="text-lg font-semibold text-[#4A4A6A] mt-3">
              Đã có lỗi xảy ra
            </h1>
            <p className="text-sm text-[#4A4A6A]/50 mt-2">
              Trang quản trị gặp sự cố khi hiển thị. Vui lòng tải lại trang;
              nếu lỗi vẫn tiếp diễn, hãy báo cho đội kỹ thuật.
            </p>
            <button
              onClick={this.handleReload}
              className="mt-5 bg-[#b8deff] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
