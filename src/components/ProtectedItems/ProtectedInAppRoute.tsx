import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useUser(); // Access `loading` from context
  // Show a loading state while authentication is in progress
  if (loading) {
    return; // Replace with a spinner or skeleton UI
  }
  // If user is null after loading, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // If user exists, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;