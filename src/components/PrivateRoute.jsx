import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    // kalau tidak ada token, redirect ke login
    return <Navigate to="/login" replace />;
  }
  return children;
}
