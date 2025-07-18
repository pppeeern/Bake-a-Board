import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../pages/Account/AuthContext";
import { useUserData } from "../../services/UserDataContext";
import "./ProfileIcon.css";
import LogoutButton from "../logoutButton/LogoutButton";

function ProfileIcon() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userData, loading } = useUserData();

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const userInitial = displayName.charAt(0).toUpperCase();

  if (loading) {
    return (
      <div id="profile_icon_container">
        <div id="profile_icon" title="Loading...">
          <div id="profile_level_value" className="icon">
            ...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="profile_icon_container">
      <div id="profile_icon" title={user?.email || "User"}>
        <div id="profile_level_value" className="icon">
          {userData?.level || 1}
        </div>
        <div id="profile_box">
          <div id="profile_box_container" className="flex-col">
            <div id="profile_user_container" className="flex-row dashed">
              <div id="profile_user" onClick={() => navigate(`/profile/`)}>
                {displayName}
              </div>
              <LogoutButton />
            </div>
            <div
              id="profile_status"
              className="flex-col"
              onClick={() => navigate(`/profile/`)}
            >
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
                    {userData?.exp || 0}
                  </div>
                  <div
                    className="profile_status_level_bar_value"
                    id="profile_level_bar_value"
                    style={{
                      width: `${(userData?.exp || 0) % 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div id="profile_status_cookies" className="flex-row">
                <div className="profile_status_label">Cookies</div>
                <div className="profile_status_value">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={15}
                    height={15}
                    fill="rgb(100,100,100)"
                    viewBox="0 0 825 800"
                    style={{ marginLeft: "5px" }}
                  >
                    <path
                      className="cls-1"
                      d="M947.86,502.29q-5.54,1.77-11.3,3.12A149.77,149.77,0,0,1,752.78,357A149.66,149.66,0,0,1,563.62,131.07A407.44,407.44,0,0,0,448.9,141.32C229.7,192.65,89.52,384.64,133.39,633.85c39,221.72,278.26,335.8,497.46,284.47C830.88,871.48,965,698.73,947.86,502.29ZM310,684.44A72.06,72.06,0,1,1,382,612.38,72.06,72.06,0,0,1,310,684.44Zm84-240.91a60.31,60.31,0,1,1,60.31-60.31A60.31,60.31,0,0,1,394,443.53Zm148.09,89.23a38.53,38.53,0,1,1,38.53,38.53A38.53,38.53,0,0,1,542.05,532.76Zm104.7,273a72.06,72.06,0,1,1,72.06-72.06A72.06,72.06,0,0,1,646.75,805.72Z"
                      transform="translate(-125.36 -130.5)"
                    />
                  </svg>
                  <div id="profile_cookie_value">{userData?.cookies || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileIcon;
