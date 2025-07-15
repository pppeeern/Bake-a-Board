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
            {!isLogin && (
              <div className="welcome_form_input">
                <label htmlFor="in_username">Username</label>
                <input
                  id="in_username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                {errors.username && (
                  <div className="welcome_form_error">{errors.username}</div>
                )}
              </div>
            )}

            <div className="welcome_form_input">
              <label htmlFor="in_email">Email</label>
              <input
                id="in_email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <div className="welcome_form_error">{errors.email}</div>
              )}
            </div>

            <div className="welcome_form_input">
              <label htmlFor="in_password">Password</label>
              <input
                id="in_password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <div className="welcome_form_error">{errors.password}</div>
              )}
            </div>

            {!isLogin && (
              <div className="welcome_form_input">
                <label htmlFor="in_confirmPassword">Confirm Password</label>
                <input
                  id="in_confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && (
                  <div className="welcome_form_error">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            )}

            <button id="welcome_form_submit" type="submit" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Login" : "Register"}
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
