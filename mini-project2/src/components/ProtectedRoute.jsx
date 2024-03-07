import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Use the useAuth hook to access the current user

  if (!user) {
    // If there is no user logged in, redirect to the landing page
    return <Navigate to="/" />;
  }

  // If the user is logged in, allow access to the child component
  return children;
};

export default ProtectedRoute;
