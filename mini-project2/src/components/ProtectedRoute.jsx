import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  console.log("ProtectedRoute checking currentUser:", currentUser); // Log the current user state in ProtectedRoute

  if (!currentUser) {
    console.log("No currentUser found, redirecting to /"); // Log redirection decision
    // User not logged in, redirect to login page
    return <Navigate to="/" />;
  }

  return children;
};


export default ProtectedRoute;