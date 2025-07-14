// src/pages/Account/Account.jsx
import React, { useState } from "react";
import "./Account.css";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";
import {
  validateForm,
  handleAuthError,
  useForm,
  useLoading,
  INITIAL_FORM_DATA,
} from "./accountUtils";

function Account() {
  const [isLogin, setIsLogin] = useState(true);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const {
    formData,
    errors,
    handleInputChange,
    setMultipleErrors,
    clearErrors,
    resetForm,
  } = useForm(INITIAL_FORM_DATA);

  // Authentication functions
  const loginUser = async () => {
    startLoading();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("User logged in successfully:", userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error };
    } finally {
      stopLoading();
    }
  };

  const registerUser = async () => {
    startLoading();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.username,
      });

      console.log("User registered successfully:", userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error };
    } finally {
      stopLoading();
    }
  };

  const googleSignIn = async () => {
    startLoading();
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user);
      return { success: true, user: result.user };
    } catch (error) {
      console.error("Google sign-in error:", error);
      return { success: false, error };
    } finally {
      stopLoading();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm(formData, isLogin);
    if (!validation.isValid) {
      setMultipleErrors(validation.errors);
      return;
    }

    const result = isLogin ? await loginUser() : await registerUser();

    if (result.success) {
      alert(`${isLogin ? "Login" : "Registration"} successful!`);
      resetForm();
    } else {
      handleAuthError(result.error, setMultipleErrors);
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await googleSignIn();

    if (result.success) {
      alert("Google sign-in successful!");
    } else {
      handleAuthError(result.error, setMultipleErrors);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearErrors();
    resetForm();
  };

  const welcomeFormElement = [
    {
      input: "Username",
      id: "in_username",
      type: "text",
      value: formData.username,
      error: errors.username,
    },
    {
      input: "Email",
      id: "in_email",
      type: "email",
      value: formData.email,
      error: errors.email,
    },
    {
      input: "Password",
      id: "in_password",
      type: "password",
      value: formData.password,
      error: errors.password,
    },
    {
      input: "Confirm Password",
      id: "in_confirmPassword",
      type: "password",
      value: formData.confirmPassword,
      error: errors.confirmPassword,
    },
  ];

  const welcomeFormRender = !isLogin
    ? welcomeFormElement
    : welcomeFormElement.filter(
        (e) =>
          e.id === "in_username" ||
          // e.id === "in_email" ||
          e.id === "in_password"
      );

  return (
    <div className="wrapper-m">
      <div className="welcome_container">
        <div className="welcome_text_container">
          <h1>
            Let's
            <br />
            Bake a Board!
          </h1>
        </div>
        <div id="welcome_form">
          <form onSubmit={handleSubmit}>
            {welcomeFormRender.map((e) => (
              <div key={e.id} className="welcome_form_input">
                <label htmlFor={e.id}>{e.input}</label>
                <input
                  id={e.id}
                  type={e.type}
                  placeholder={e.input}
                  value={e.value}
                  onChange={handleInputChange}
                />
                {e.error && <div className="welcome_form_error">{e.error}</div>}
              </div>
            ))}

            <button id="welcome_form_submit" type="submit" disabled={isLoading}>
              {isLoading
                ? isLogin
                  ? "Logging in..."
                  : "Registering..."
                : isLogin
                ? "Login"
                : "Register"}
            </button>

            <div className="welcome_form_or">
              <div className="dashed"></div>
              <span>or</span>
              <div className="dashed"></div>
            </div>
            <button
              id="welcome_form_google"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" />
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </button>
          </form>
          <p id="welcome_form_switch">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={toggleMode}>{isLogin ? "Register" : "Login"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Account;
