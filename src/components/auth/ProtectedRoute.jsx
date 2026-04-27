import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function dashboardForRole(role) {
  if (role === "admin") return "/admindashboard";
  if (role === "faculty") return "/facultydashboard";
  if (role === "student") return "/studentdashboard";
  return "/login";
}

export default function ProtectedRoute({ roles }) {
  const location = useLocation();
  const token = useSelector((s) => s.auth.token);
  const role = useSelector((s) => s.auth.role);

  if (!token || !role) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(role)) {
    return <Navigate to={dashboardForRole(role)} replace />;
  }

  return <Outlet />;
}
