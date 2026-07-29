import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../api/client";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await apiFetch("/api/auth/me", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.user.role === "admin") {
        setUser(data.user);
      } else {
        setUser(null); // Không phải admin thì không cho vào
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success && data.user.role === "admin") {
      setUser(data.user);
    } else if (data.success && data.user.role !== "admin") {
      return { success: false, message: "Tài khoản không có quyền admin" };
    }
    return data;
  };

  const logout = async () => {
    await apiFetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
