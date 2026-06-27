import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false, driverOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ✅ FIX: Auth tekshirilayotgan paytda spinner ko'rsatamiz
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-bold">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin tekshiruv
  if (adminOnly && user.role !== "admin" && user.role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  // Driver tekshiruv
  if (driverOnly && user.role !== "driver") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;