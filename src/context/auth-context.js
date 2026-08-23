import { createContext } from "react";

// Chỉ chứa context object thuần — tách riêng để file AuthContext.jsx chỉ
// export component (AuthProvider) + hook (useAuth), giúp React Fast Refresh
// hoạt động đúng (react-refresh/only-export-components).
export const AuthContext = createContext();
