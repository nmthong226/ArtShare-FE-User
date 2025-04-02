import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedAuthRouteProps {
  children: React.ReactNode;
}

const ProtectedAuthRoute: React.FC<ProtectedAuthRouteProps> = ({ children }) => {
  const token = localStorage.getItem("user_verify"); 
  // If user is not logged in, redirect immediately
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // If user is logged in, allow access to the route
  return <>{children}</>;
};

export default ProtectedAuthRoute;