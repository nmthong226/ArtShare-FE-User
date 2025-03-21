import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useUser();

  if (!user) {
    // If the user is not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the children (the private route)
  return <>{children}</>;
};

export default ProtectedRoute;
