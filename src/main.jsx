import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#FFFAF5",
              color: "#4A4A6A",
              border: "1px solid #CBD1F2",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
            },
            success: {
              iconTheme: {
                primary: "#8B98E3",
                secondary: "#FFF",
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>,
);
