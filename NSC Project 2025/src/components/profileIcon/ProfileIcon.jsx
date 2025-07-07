import "./ProfileIcon.css";

function ProfileIcon() {
  return (
    <div id="profile_icon_container">
      <button id="profile_icon">
        <div id="profile_level"></div>
        <div id="profile_box">
          <div id="profile_box_container" className="flex-col">
            <div id="profile_user_container" className="flex-row dashed">
              <div id="profile_user">User</div>
              <div id="profile_logout"></div>
            </div>
            <div id="profile_status" className="flex-col">
              <div id="profile_status_level" className="flex-row">
                <div className="profile_status_label">Level</div>
                <div
                  className="profile_status_value"
                  id="profile_status_level_bar"
                >
                  <div id="profile_status_level_exp_display">exp</div>
                  <div id="profile_status_level_exp_value"></div>
                </div>
              </div>
              <div id="profile_status_cookies" className="flex-row">
                <div className="profile_status_label">Cookies</div>
                <div className="profile_status_value">50 C</div>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export default ProfileIcon;
