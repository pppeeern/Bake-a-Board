import { useState } from "react";

export const validateForm = (formData, isLogin) => {
  const errors = {};

  if (!isLogin && !formData.username.trim()) {
    errors.username = "Username is required";
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const commonTLDs = [
    "com", "net", "org", "edu", "gov", "mil", "int",
    "th", "co", "io", "ai", "me", "info", "biz", "tv", "dev", "app", 
    "uk", "us", "ca", "au", "de", "fr", "jp", "cn", "in"
  ];

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(formData.email.trim())) {
    errors.email = "Please enter a valid email address";
  } else {
    const domain = formData.email.trim().split("@")[1];
    const tld = domain.split(".").pop().toLowerCase();
    
    if (!commonTLDs.includes(tld)) {
       errors.email = `Email domain .${tld} is not supported. Please use a common provider.`;
    }
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (!isLogin && formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!isLogin && formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
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
