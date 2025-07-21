import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const roleRedirectMap: Record<string, string> = {
  admin: '/users',
  customer: '/appointments',
  doctor: '/clients',
  barber: '/clients',
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  console.log("-----ProtectedRoute-------", user);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const fallback = roleRedirectMap[user.role] || '/dashboard';
    console.log("Redirecting due to role mismatch:", user.role);
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
