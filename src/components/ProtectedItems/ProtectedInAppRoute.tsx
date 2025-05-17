import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useUser(); // Access `loading` from context
  if (loading) {
    return;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!user.is_onboard) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
