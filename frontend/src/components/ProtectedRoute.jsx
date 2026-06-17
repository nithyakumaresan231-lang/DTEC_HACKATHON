import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner message="பயனர் சரிபார்க்கப்படுகிறது... (Verifying User...)" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated user to login page, preserving source path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
