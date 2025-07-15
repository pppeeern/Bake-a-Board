import React, { useState } from "react";
import "./Account.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../config/firebase";

import { validateForm, handleAuthError, INITIAL_FORM_DATA } from "./authUtils";

function Account() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});

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
      if (isLogin) {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        alert("Login successful!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        await updateProfile(userCredential.user, {
          displayName: formData.username,
        });

        alert("Registration successful!");
      }

      setFormData(INITIAL_FORM_DATA);
    } catch (error) {
      handleAuthError(error, setErrors);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Google sign-in successful!");
    } catch (error) {
      alert("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData(INITIAL_FORM_DATA);
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

            <button id="welcome_form_submit" type="submit" disabled={loading}>
              {loading
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
              disabled={loading}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" />
              Sign in with Google
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
