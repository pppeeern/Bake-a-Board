import { useState } from "react";

// Form validation utility
export const validateForm = (formData, isLogin) => {
  const errors = {};

  if (!isLogin && !formData.username.trim()) {
    errors.username = "Username is required";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Invalid email";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (!isLogin && formData.password.length < 6) {
    errors.password = "Password too short (6+ chars)";
  }

  if (!isLogin && formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords don't match";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const handleAuthError = (error, setErrors) => {
  if (error.code === "auth/user-not-found") {
    setErrors({ email: "No account found" });
  } else if (error.code === "auth/wrong-password") {
    setErrors({ password: "Wrong password" });
  } else if (error.code === "auth/email-already-in-use") {
    setErrors({ email: "Email already registered" });
  } else {
    alert("Error: " + error.message);
  }
};

export const INITIAL_FORM_DATA = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};
