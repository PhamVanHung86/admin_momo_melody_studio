import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import { useAuth } from "./context/AuthContext";
import AdminLogin from "./pages/AdminLogin";
import EditProduct from "./pages/EditProduct";
import FlashSale from "./pages/FlashSale";
import Banner from "./pages/Banner";
import Messages from "./pages/Messages";
import MailClubManager from "./pages/MailClubManager";
import MailClubCollections from "./pages/MailClubCollections";
import NotFound from "./pages/NotFound";

const App = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFAF5]">
        <p className="text-[#4A4A6A]/40">Đang tải...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<AdminLogin />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FFFAF5]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 md:px-8 py-6 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
            <Route path="/flash-sale" element={<FlashSale />} />
            <Route path="/banner" element={<Banner />} />
            <Route path="/message" element={<Messages />} />
            <Route path="/mail-club" element={<MailClubManager />} />
            <Route
              path="/mail-club-collections"
              element={<MailClubCollections />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
