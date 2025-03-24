import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useUser();

  useEffect(() => {
    const checkUser = () => {
      if (!user) {
        // If the user is not logged in, redirect to login
        return <Navigate to="/login" replace />;
      }
    }
    checkUser();
  }, [user])

  // If user is logged in, render the children (the private route)
  return <>{children}</>;
};

export default ProtectedRoute;
