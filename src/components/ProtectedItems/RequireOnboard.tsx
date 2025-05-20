import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserProvider";

interface Props {
  children: React.ReactNode;
}

export default function RequireOnboard({ children }: Props) {
  const { loading, isAuthenticated, isOnboard } = useUser();

  if (loading) return <div>Checking authentication…</div>;

  // signed-in but not onboarded → force to onboarding
  if (isAuthenticated && !isOnboard) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
