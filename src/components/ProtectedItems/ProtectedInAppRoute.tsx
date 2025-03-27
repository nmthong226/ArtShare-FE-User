import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useUser();
  // If user is not logged in, redirect immediately
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // If user is logged in, allow access to the route
  return <>{children}</>;
};

export default ProtectedRoute;
