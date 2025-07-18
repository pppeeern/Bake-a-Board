import { useRef, useState, useEffect } from "react";
import { useAuth } from "../Account/AuthContext";
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
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const curPasRef = useRef(null);
  const handleShowPass = () => {
    const input = curPasRef.current;
    if (input.type === "password") input.type = "text";
    else input.type = "password";
  };

  const [curPas, setCurPas] = useState({});
  const [changePas, setChangePas] = useState(false);
  const handleChangePass = () => {
    if (curPas.trim()) {
      // if (input_password === current_password)
      setChangePas(true);
    } else {
      alert("Enter your current password first!");
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
              value={user?.displayName || ""}
              readOnly
            />
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
          <div className="setting_content_body">
            <label htmlFor="curpas">Current Password</label>
            <div style={{ display: "flex", gap: "20px" }}>
              <input
                id="curPas"
                type="password"
                placeholder="Current Password"
                // value={""}
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
                <input type="password" placeholder="New Password" value={""} />
              </div>
              <div className="setting_content_body">
                <label htmlFor="conpas">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={""}
                />
              </div>
            </>
          )}
          <div className="setting_button_container">
            <button type="submit">Save Changes</button>
            <button id="logout_button" onClick={handleLogout}>
              Log out
            </button>
            <button id="explode_button">Explode account</button>
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
              <option value="tha">Thai</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
