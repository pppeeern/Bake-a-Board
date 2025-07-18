import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "./authService";
import { validateForm, handleAuthError, INITIAL_FORM_DATA } from "./authUtils";
import { useAuth } from "./AuthContext";

export const useAccountForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const field = id.replace("in_", "");

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm(formData, isLogin);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      let result;

      if (isLogin) {
        result = await authService.signInWithEmail(
          formData.email,
          formData.password
        );
      } else {
        result = await authService.registerWithEmail(
          formData.email,
          formData.password,
          formData.username
        );
      }

      if (result.success) {
        showToast(result.message);
        setFormData(INITIAL_FORM_DATA);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        showToast(result.message || "Authentication failed", "error");
        handleAuthError(
          { code: result.error, message: result.message },
          setErrors
        );
      }
    } catch (error) {
      handleAuthError(error, setErrors);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await authService.signInWithGoogle();

      if (result.success) {
        showToast(result.message);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        showToast(result.message || "Google sign-in failed", "error");
      }
    } catch (error) {
      showToast("Google sign-in failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData(INITIAL_FORM_DATA);
  };

  return {
    isLogin,
    loading,
    formData,
    errors,
    toast,
    handleInputChange,
    handleSubmit,
    handleGoogleSignIn,
    toggleMode,
    hideToast,
  };
};
