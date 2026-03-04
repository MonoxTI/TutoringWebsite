// ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";

/**
 * 🔐 Generic Protected Route
 * - Checks if user is logged in
 * - Optionally checks user role
 * - Redirects to login or pending page as needed
 */
export default function ProtectedRoute({ children, requiredRole = null }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  // 🔴 Not logged in? → Send to login
  if (!token || !userStr) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const user = JSON.parse(userStr);

  // 🟡 Pending user trying to access protected area? → Send to pending page
  if (user.role === "pending" && requiredRole !== "pending") {
    return <Navigate to="/pending" state={{ email: user.email }} replace />;
  }

  // 🔴 Wrong role? (e.g., regular user trying to access /admin)
  if (requiredRole && user.role !== requiredRole) {
    // Admins and users both get redirected to dashboard if they lack permission
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ All checks passed → Render the protected page
  return children;
}