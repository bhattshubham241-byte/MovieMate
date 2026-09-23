/*----- FILE: ProtectedRoute.jsx | CONTENT: Normal-user route protection component. | PURPOSE: Prevents guests and administrator accounts from entering ticket-booking pages; administrators are restricted to administration features. -----*/

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  /*----- ADMIN CHECK: Administrators manage the system and do not use the customer booking flow. -----*/
  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  /*----- GUEST CHECK: Guests are redirected to Login instead of accessing protected pages. -----*/
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
