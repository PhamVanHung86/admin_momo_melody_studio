import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const data = await login(form.email, form.password);
    if (data.success) {
      navigate("/dashboard");
    } else {
      setError(data.message || "Đăng nhập thất bại");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 border border-[#FFD6E0]/50 shadow-sm">
        <h1
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-3xl text-[#4A4A6A] text-center mb-1"
        >
          Admin Login
        </h1>
        <p className="text-xs text-[#4A4A6A]/40 text-center mb-6">
          momo's melody studio
        </p>

        {error && (
          <div className="bg-red-50 text-red-500 text-xs px-4 py-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FFB7C5]"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="border border-[#FFD6E0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FFB7C5]"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#FFB7C5] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#ff9db5] transition-colors disabled:opacity-50"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
