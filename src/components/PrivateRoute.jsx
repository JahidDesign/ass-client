// src/components/PrivateRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
