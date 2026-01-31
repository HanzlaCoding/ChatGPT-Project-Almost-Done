import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  // Check if user is logged in
  const token = localStorage.getItem("token");

  // If token exists, do not let them access Login/Register
  // Redirect them to Dashboard (or Home)
  if (token) {
    return <Navigate to="/" replace />;
  }

  // If no token, return the Login/Register component
  return children;
};

export default PublicRoute;
