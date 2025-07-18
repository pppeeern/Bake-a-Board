import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./pages/Account/AuthContext";
import LoadingSpinner from "./components/loadingSpinner/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return user ? children : <Navigate to="/welcome/" replace />;
};

export default ProtectedRoute;
