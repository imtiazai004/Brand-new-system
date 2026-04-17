import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/auth.hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSchool?: boolean;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, requireSchool = true, allowedRoles }: ProtectedRouteProps) {
  const { user, schoolId, loading, isAuthenticated, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If school is required but missing, redirect to onboarding
  if (requireSchool && !schoolId) {
    return <Navigate to="/onboarding" replace />;
  }

  // Role check
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user has school but tries to go to onboarding, send to dashboard
  if (!requireSchool && schoolId && location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
