import React, { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const statusColor = {
  "Đang xử lý": "bg-[#FFD6E0] text-[#4A4A6A]",
  "Đang giao": "bg-[#FFF0A0] text-[#4A4A6A]",
  "Đã giao": "bg-[#B8DEFF] text-[#4A4A6A]",
  "Đã hủy": "bg-gray-100 text-gray-400",
};

const PIE_COLORS = [
  "#FFB7C5",
  "#FFD9A0",
  "#B8DEFF",
  "#C9A0FF",
  "#A0E8C8",
  "#FFA0A0",
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");

  const fetchStats = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/orders/dashboard-stats",
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async (selectedPeriod) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/orders/analytics?period=${selectedPeriod}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      if (data.success) setAnalytics(data.analytics);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchStats(), fetchAnalytics(period)]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!loading) fetchAnalytics(period);
  }, [period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[#4A4A6A]/40 text-sm">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!stats || !analytics) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[#4A4A6A]/40 text-sm">Không thể tải dữ liệu</p>
      </div>
    );
  }

  const isGrowthPositive = Number(analytics.growthPercent) >= 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          emoji="💰"
          title="Doanh thu hôm nay"
          value={`${stats.todayRevenue.toLocaleString()} đ`}
          sub={`Tổng: ${stats.totalRevenue.toLocaleString()} đ`}
          bg="bg-[#b8deff]"
        />
        <StatCard
          emoji="🛍️"
          title="Tổng đơn hàng"
          value={stats.totalOrders}
          sub={`${stats.pendingOrders} đang chờ xử lý`}
          bg="bg-[#FFF0A0]"
        />
        <StatCard
          emoji="📦"
          title="Sản phẩm"
          value={stats.totalProducts}
          sub="Đang bán"
          bg="bg-[#e6f0ff]"
        />
        <StatCard
          emoji="👥"
          title="Khách hàng"
          value={stats.totalCustomers}
          sub="Đã từng mua hàng"
          bg="bg-[#FFD6E0]"
        />
      </div>

      {/* So sánh tháng này vs tháng trước */}
      <div className="bg-white rounded-3xl p-6 border border-[#FFD6E0]/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-[#4A4A6A]">
            So sánh doanh thu theo tháng
          </h3>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isGrowthPositive
                ? "bg-[#D4F4DD] text-green-600"
                : "bg-[#FFE0E0] text-red-500"
            }`}
          >
            {isGrowthPositive ? "▲" : "▼"} {Math.abs(analytics.growthPercent)}%
          </span>
        </div>
        <div className="flex items-end gap-8 mt-4">
          <div>
            <p className="text-xs text-[#4A4A6A]/50 mb-1">Tháng này</p>
            <p className="text-2xl font-semibold text-[#4A4A6A]">
              {analytics.thisMonthRevenue.toLocaleString()} đ
            </p>
          </div>
          <div>
            <p className="text-xs text-[#4A4A6A]/50 mb-1">Tháng trước</p>
            <p className="text-lg text-[#4A4A6A]/50">
              {analytics.lastMonthRevenue.toLocaleString()} đ
            </p>
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh thu — có chọn khoảng thời gian */}
      <div className="bg-white rounded-3xl p-6 border border-[#FFD6E0]/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-[#4A4A6A]">
            Biểu đồ doanh thu
          </h3>
          <div className="flex gap-2">
            {[
              { value: "week", label: "7 ngày" },
              { value: "month", label: "Theo tháng" },
              { value: "year", label: "12 tháng" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  period === opt.value
                    ? "bg-[#b8deff] text-white"
                    : "bg-[#FFFAF5] text-[#4A4A6A]/60 hover:bg-[#aacae7]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={analytics.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#b8deff" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#4A4A6A99" }} />
            <YAxis
              tick={{ fontSize: 11, fill: "#4A4A6A99" }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(v) => [`${v.toLocaleString()} đ`, "Doanh thu"]}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#b8deff"
              strokeWidth={2.5}
              dot={{ fill: "#b8deff", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grid: Top sản phẩm + Doanh thu theo danh mục */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top sản phẩm bán chạy */}
        <div className="bg-white rounded-3xl p-6 border border-[#FFD6E0]/50">
          <h3 className="text-sm font-semibold text-[#4A4A6A] mb-5">
            🏆 Top sản phẩm bán chạy
          </h3>
          {analytics.topProducts.length > 0 ? (
            <div className="flex flex-col gap-3">
              {analytics.topProducts.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2 border-b border-[#FFD6E0]/30 last:border-0"
                >
                  <span className="text-xs font-bold text-[#4A4A6A]/30 w-4">
                    {i + 1}
                  </span>
                  <img
                    src={p.image}
                    className="w-9 h-9 rounded-xl object-cover bg-[#FFF0F5]"
                    alt={p.name}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#4A4A6A] truncate">{p.name}</p>
                    <p className="text-xs text-[#4A4A6A]/40">{p.sold} đã bán</p>
                  </div>
                  <p className="text-sm font-semibold text-[#448ecf]">
                    {p.revenue.toLocaleString()} đ
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#4A4A6A]/40 text-center py-8">
              Chưa có dữ liệu
            </p>
          )}
        </div>

        {/* Doanh thu theo danh mục */}
        <div className="bg-white rounded-3xl p-6 border border-[#FFD6E0]/50">
          <h3 className="text-sm font-semibold text-[#4A4A6A] mb-5">
            📊 Doanh thu theo danh mục
          </h3>
          {analytics.categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={analytics.categoryData}
                  dataKey="revenue"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ category, percent }) =>
                    `${category} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                  style={{ fontSize: "10px" }}
                >
                  {analytics.categoryData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v.toLocaleString()} đ`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-[#4A4A6A]/40 text-center py-8">
              Chưa có dữ liệu
            </p>
          )}
        </div>
      </div>

      {/* Đơn hàng gần đây */}
      <div className="bg-white rounded-3xl p-6 border border-[#FFD6E0]/50">
        <h3 className="text-sm font-semibold text-[#4A4A6A] mb-5">
          Đơn hàng gần đây
        </h3>
        {stats.recentOrders.length > 0 ? (
          <div className="flex flex-col gap-3">
            {stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3 border-b border-[#FFD6E0]/40 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-[#4A4A6A]">
                    #{order.id}
                  </p>
                  <p className="text-xs text-[#4A4A6A]/50">{order.customer}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className="text-sm font-semibold text-[#448ecf]">
                    {order.total.toLocaleString()} đ
                  </p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#4A4A6A]/40 text-center py-8">
            Chưa có đơn hàng nào
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
