// src/pages/Account/accountUtils.js

import { useState } from "react";

// Form validation utility
export const validateForm = (formData, isLogin) => {
  const newErrors = {};

  // Only validate username for registration
  if (!isLogin) {
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 4) {
      newErrors.username =
        "Username too short. This isn't a speedrun! (need 4+ chars)";
    }
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Your email seems to be unreal";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (!isLogin && formData.password.length < 6) {
    // Only validate password length for registration
    newErrors.password =
      "Your password seems easy to bruteforce (needs 6+ chars)";
  }

  // Only validate confirm password for registration
  if (!isLogin) {
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword =
        "These passwords are from different universes (Password does not match)";
    }
  }

  return {
    errors: newErrors,
    isValid: Object.keys(newErrors).length === 0,
  };
};

// Error handler utility
export const handleAuthError = (error, setErrors) => {
  switch (error.code) {
    // Login errors
    case "auth/user-not-found":
      setErrors({ email: "No account found with this email" });
      break;
    case "auth/wrong-password":
      setErrors({ password: "Incorrect password" });
      break;
    case "auth/invalid-email":
      setErrors({ email: "Invalid email address" });
      break;
    case "auth/user-disabled":
      setErrors({ email: "This account has been disabled" });
      break;
    case "auth/too-many-requests":
      alert("Too many failed attempts. Please try again later.");
      break;

    // Registration errors
    case "auth/email-already-in-use":
      setErrors({ email: "This email is already registered" });
      break;
    case "auth/weak-password":
      setErrors({ password: "Password is too weak" });
      break;

    // Google sign-in errors
    case "auth/popup-closed-by-user":
      alert("Sign-in was cancelled");
      break;
    case "auth/popup-blocked":
      alert("Popup was blocked. Please allow popups for this site.");
      break;

    default:
      alert(`Authentication failed: ${error.message}`);
  }
};

// Form state management hook
export const useForm = (initialValues) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let field = id.replace("in_", "");

    // Map the confirm password field correctly
    if (field === "conpassword") {
      field = "confirmPassword";
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const setFieldError = (field, message) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  };

  const setMultipleErrors = (errorObj) => {
    setErrors(errorObj);
  };

  const clearErrors = () => {
    setErrors({});
  };

  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
  };

  return {
    formData,
    errors,
    handleInputChange,
    setFieldError,
    setMultipleErrors,
    clearErrors,
    resetForm,
  };
};

// Loading state hook
export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading,
  };
};

// Form submission utilities
export const createSubmitHandler = (
  formData,
  isLogin,
  validateForm,
  setMultipleErrors,
  authFunction,
  resetForm
) => {
  return async (e) => {
    e.preventDefault();

    const validation = validateForm(formData, isLogin);
    if (!validation.isValid) {
      setMultipleErrors(validation.errors);
      return;
    }

    const result = await authFunction();

    if (result.success) {
      alert(`${isLogin ? "Login" : "Registration"} successful!`);
      resetForm();
    } else {
      handleAuthError(result.error, setMultipleErrors);
    }
  };
};

// Toggle mode utility
export const createToggleMode = (setIsLogin, clearErrors, resetForm) => {
  return () => {
    setIsLogin((prev) => !prev);
    clearErrors();
    resetForm();
  };
};

// Initial form data constant
export const INITIAL_FORM_DATA = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};
