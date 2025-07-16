import { Link } from "react-router-dom";
import "./ProfileIcon.css";
import LogoutButton from "../logoutButton/LogoutButton";

function ProfileIcon() {
  return (
    <div id="profile_icon_container">
      <Link to={"/profile/"}>
        <button id="profile_icon" title="User">
          <div id="profile_level_value" className="icon">
            1
          </div>
          <div id="profile_box">
            <div id="profile_box_container" className="flex-col">
              <div id="profile_user_container" className="flex-row dashed">
                <div id="profile_user">User</div>
                <LogoutButton />
              </div>
              <div id="profile_status" className="flex-col">
                <div id="profile_status_level" className="flex-row">
                  <div className="profile_status_label">Level</div>
                  <div
                    className="profile_status_value profile_status_level_bar"
                    id="profile_level_bar"
                  >
                    <div
                      className="profile_status_exp_value"
                      id="profile_exp_value"
                    >
                      exp
                    </div>
                    <div
                      className="profile_status_level_bar_value"
                      id="profile_level_bar_value"
                    ></div>
                  </div>
                </div>
                <div id="profile_status_cookies" className="flex-row">
                  <div className="profile_status_label">Cookies</div>
                  <div
                    id="profile_cookie_value"
                    className="profile_status_value"
                  >
                    50 C
                  </div>
                </div>
              </div>
            </div>
          </div>
        </button>
      </Link>
    </div>
  );
}

export default ProfileIcon;
