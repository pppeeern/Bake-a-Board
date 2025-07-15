import React, { useEffect } from "react";
import "./LoginAlert.css";

const LoginAlert = ({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`login-alert login-alert-${type}`}>
      <div className="login-alert-content">
        <span className="login-alert-message">{message}</span>
        <button className="login-alert-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default LoginAlert;
