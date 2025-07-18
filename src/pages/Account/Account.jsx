import React from "react";
import "./Account.css";
import { useAccountForm } from "./useAccountForm";
import LoginAlert from "../../components/LoginAlert/LoginAlert";

function Account() {
  const {
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
  } = useAccountForm();

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
          // e.id === "in_username" ||
          e.id === "in_email" || e.id === "in_password"
      );

  return (
    <div className="login-wrapper">
      {" "}
      {/* Changed from wrapper-m to login-wrapper */}
      {toast && (
        <LoginAlert
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
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
