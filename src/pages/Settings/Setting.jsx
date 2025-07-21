import { useRef, useState, useEffect } from "react";
import { useAuth } from "../Account/AuthContext";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import "./Setting.css";

function Setting() {
  const { user, logout } = useAuth();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "system";
  });
  useEffect(() => {
    const body = document.body;

    const applyTheme = (theme) => {
      body.classList.remove("light", "dark");
      if (theme === "light" || theme === "dark") {
        body.classList.add(theme);
      } else if (theme === "system") {
        // Use matchMedia to check system preference
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        body.classList.add(isDark ? "dark" : "light");
      }
    };

    applyTheme(theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = (e) => {
        body.classList.remove("light", "dark");
        body.classList.add(e.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", listener);

      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, [theme]);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (!confirmLogout) return;

    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const curPasRef = useRef(null);
  const newPasRef = useRef(null);
  const conPasRef = useRef(null);

  const handleShowPass = () => {
    const input = curPasRef.current;
    if (input.type === "password") input.type = "text";
    else input.type = "password";
  };

  const handleShowNewPass = () => {
    const input = newPasRef.current;
    if (input.type === "password") input.type = "text";
    else input.type = "password";
  };

  const handleShowConPass = () => {
    const input = conPasRef.current;
    if (input.type === "password") input.type = "text";
    else input.type = "password";
  };

  const [curPas, setCurPas] = useState("");
  const [newPas, setNewPas] = useState("");
  const [conPas, setConPas] = useState("");
  const [changePas, setChangePas] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isEditingName, setIsEditingName] = useState(false);

  // Check if user signed in with Google
  const isGoogleUser = user?.providerData?.some(
    (provider) => provider.providerId === "google.com"
  );

  const handleChangePass = () => {
    if (curPas.trim()) {
      setChangePas(true);
    } else {
      alert("Enter your current password first!");
    }
  };

  const handleSaveUsername = async () => {
    if (!user) return;

    try {
      await updateProfile(user, { displayName });
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { displayName });
      setIsEditingName(false);
      alert("Username updated successfully!");
    } catch (error) {
      console.error("Failed to update username:", error);
      alert("Failed to update username: " + error.message);
    }
  };

  const handleSavePassword = async () => {
    if (!user) return;

    if (newPas !== conPas) {
      alert("New passwords don't match!");
      return;
    }
    if (newPas.length < 6) {
      alert("New password must be at least 6 characters!");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, curPas);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPas);

      setCurPas("");
      setNewPas("");
      setConPas("");
      setChangePas(false);
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Password change failed:", error);
      alert("Password change failed: " + error.message);
    }
  };

  const handleExplodeAccount = async () => {
    if (!user) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to explode your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    // For Google users, just confirm deletion
    if (isGoogleUser) {
      try {
        const userRef = doc(db, "users", user.uid);
        await deleteDoc(userRef);
        await deleteUser(user);
        alert("Account exploded successfully!");
      } catch (error) {
        console.error("Account explosion failed:", error);
        alert("Account explosion failed: " + error.message);
      }
      return;
    }

    // For email users, require password
    const password = window.prompt(
      "Enter your current password to confirm account deletion:"
    );

    if (!password) return;

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      const userRef = doc(db, "users", user.uid);
      await deleteDoc(userRef);

      await deleteUser(user);
      alert("Account exploded successfully!");
    } catch (error) {
      console.error("Account explosion failed:", error);
      alert("Account explosion failed: " + error.message);
    }
  };

  return (
    <div className="wrapper">
      <div className="setting_container">
        <div className="setting_content">
          <div className="setting_content_head dashed">Account</div>
          <div className="setting_content_body">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onClick={() => setIsEditingName(true)}
              readOnly={!isEditingName}
            />
            {isEditingName && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => {
                    setIsEditingName(false);
                    setDisplayName(user?.displayName || "");
                  }}
                >
                  Cancel
                </button>
                <button onClick={handleSaveUsername}>Save</button>
              </div>
            )}
          </div>
          <div className="setting_content_body">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              placeholder="Email@email.com"
              value={user?.email || ""}
              readOnly
            />
          </div>

          {/* Only show password section for non-Google users */}
          {!isGoogleUser && (
            <>
              <div className="setting_content_body">
                <label htmlFor="curpas">Current Password</label>
                <div style={{ display: "flex", gap: "20px" }}>
                  <input
                    id="curPas"
                    type="password"
                    placeholder="Current Password"
                    value={curPas}
                    onChange={(e) => setCurPas(e.target.value)}
                    ref={curPasRef}
                  />
                  <input
                    type="checkbox"
                    className="show_password"
                    onClick={handleShowPass}
                  />
                  <button onClick={handleChangePass}>Change</button>
                </div>
              </div>

              {changePas && (
                <>
                  <div className="setting_content_body">
                    <label htmlFor="newpas">New Password</label>
                    <div style={{ display: "flex", gap: "20px" }}>
                      <input
                        type="password"
                        placeholder="New Password (min 6 characters)"
                        value={newPas}
                        onChange={(e) => setNewPas(e.target.value)}
                        ref={newPasRef}
                      />
                      <input
                        type="checkbox"
                        className="show_password"
                        onClick={handleShowNewPass}
                      />
                    </div>
                  </div>
                  <div className="setting_content_body">
                    <label htmlFor="conpas">Confirm Password</label>
                    <div style={{ display: "flex", gap: "20px" }}>
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={conPas}
                        onChange={(e) => setConPas(e.target.value)}
                        ref={conPasRef}
                      />
                      <input
                        type="checkbox"
                        className="show_password"
                        onClick={handleShowConPass}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "10px",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={() => {
                        setChangePas(false);
                        setCurPas("");
                        setNewPas("");
                        setConPas("");
                      }}
                    >
                      Cancel
                    </button>
                    <button onClick={handleSavePassword}>Save Password</button>
                  </div>
                </>
              )}
            </>
          )}

          {isGoogleUser && (
            <div className="setting_content_body">
              <p style={{ color: "#666", fontStyle: "italic" }}>
                Password changes not available for Google accounts
              </p>
            </div>
          )}

          <div className="setting_button_container">
            <button className="danger-secondary" onClick={handleLogout}>
              Log out
            </button>
            <button className="danger" onClick={handleExplodeAccount}>
              Explode account
            </button>
          </div>
        </div>
        <div className="setting_content">
          <div className="setting_content_head dashed">Preferences</div>
          <div className="setting_content_body">
            <label>Appearance</label>
            <select
              name="appearance"
              id="sel_apr"
              value={theme}
              onChange={(e) => {
                const selectedTheme = e.target.value;
                setTheme(selectedTheme);
                localStorage.setItem("theme", selectedTheme);
              }}
            >
              <option value="system">System Default</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="setting_content_body">
            <label>Language</label>
            <select name="language" id="sel_lan">
              <option value="eng">English</option>
              {/* <option value="tha">Thai</option> */}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
