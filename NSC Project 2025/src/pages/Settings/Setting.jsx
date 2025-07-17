import { useAuth } from "../Account/AuthContext";
import "./Setting.css";

function Setting() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
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
            <input type="password" placeholder="Current Password" value={""} />
          </div>
          <div className="setting_content_body">
            <label htmlFor="newpas">New Password</label>
            <input type="password" placeholder="New Password" value={""} />
          </div>
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
            <select name="appearance" id="sel_apr">
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
