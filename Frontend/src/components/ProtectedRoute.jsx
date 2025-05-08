import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Changed to useAuth

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // Use the useAuth hook

  if (loading) {
    // Optional: Show a loading spinner or similar while auth state is being determined
    // You can replace this with a more sophisticated loading component if you have one
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', backgroundColor: '#181818' }}>
        Loading authentication status...
      </div>
    );
  }

  if (!isAuthenticated) { // Check against isAuthenticated from useAuth
    // User not authenticated, redirect to login page
    return <Navigate to="/admin/login" replace />;
  }

  return children; // User authenticated, render the protected component
};

export default ProtectedRoute;
