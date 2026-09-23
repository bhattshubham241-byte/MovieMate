/*----- FILE: AdminRoute.jsx | CONTENT: Admin-only route guard. | PURPOSE: Prevents normal users and guests from opening the administration panel. -----*/

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  /*----- ADMIN CHECK: Only an authenticated account with role=admin can continue. -----*/
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
