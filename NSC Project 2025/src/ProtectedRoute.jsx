import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./pages/Account/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/welcome/" replace />;
};

export default ProtectedRoute;
