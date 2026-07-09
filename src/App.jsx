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

const App = () => {
  const { user, loading } = useAuth();

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
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 px-8 py-6">
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
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
