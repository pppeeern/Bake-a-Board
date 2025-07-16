import "./Setting.css";

function Setting() {
  return (
    <div className="wrapper">
      <div className="setting_container">
        <div className="setting_content">
          <div className="setting_content_head dashed">Account</div>
          <div className="setting_content_body">
            <label htmlFor="username">Username</label>
            <input type="text" placeholder="Username" value={""} />
          </div>
          <div className="setting_content_body">
            <label htmlFor="email">Email</label>
            <input type="text" placeholder="Email@email.com" value={""} />
          </div>
          <div className="setting_content_body">
            <label htmlFor="curpas">Current Password</label>
            <input type="text" placeholder="Current Password" value={""} />
          </div>
          <div className="setting_content_body">
            <label htmlFor="newpas">New Password</label>
            <input type="text" placeholder="New Password" value={""} />
          </div>
          <div className="setting_button_container">
            <button type="submit">Save Changes</button>
            <button id="logout_button">Log out</button>
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
