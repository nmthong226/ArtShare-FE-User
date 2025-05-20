import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserProvider";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loading, isAuthenticated } = useUser();

  if (loading) return <div>Loading…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
