import LogoutButton from "../../components/logoutButton/LogoutButton";
import "./Profile.css";

function Profile() {
  return (
    <div className="wrapper-m">
      <div id="profile_container">
        <div id="profile_avatar_display">
          <img src="" alt="avatar" />
        </div>
        <div id="profile_detail_container">
          <div id="profile_detail_user" className="profile_detail_box">
            <div className="profile_detail_head">
              <span id="profile_detail_username">User</span>
              <LogoutButton />
            </div>
            <div className="profile_detail_body">
              <div id="profile_detail_level" className="profile_detail_subbox">
                <div className="flex-row" style={{ gap: "8px", width: "100%" }}>
                  <div id="profile_level_value">1</div>
                  <div
                    id="profile_level_bar"
                    className="profile_detail_level_bar"
                  >
                    <div
                      id="profile_exp_value"
                      className="profile_detail_exp_value"
                    >
                      exp
                    </div>
                    <div
                      id="profile_level_bar_value"
                      className="profile_detail_level_bar_value"
                    ></div>
                  </div>
                </div>
                <div className="profile_detail_subbox_label">Level</div>
              </div>
              <div id="profile_detail_cookie" className="profile_detail_subbox">
                <div
                  className="flex-row"
                  style={{ gap: "12px", width: "100%" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    fill="rgb(100,100,100)"
                    viewBox="0 0 825 800"
                  >
                    <path
                      class="cls-1"
                      d="M947.86,502.29q-5.54,1.77-11.3,3.12A149.77,149.77,0,0,1,752.78,357,149.66,149.66,0,0,1,563.62,131.07,407.44,407.44,0,0,0,448.9,141.32C229.7,192.65,89.52,384.64,133.39,633.85c39,221.72,278.26,335.8,497.46,284.47C830.88,871.48,965,698.73,947.86,502.29ZM310,684.44A72.06,72.06,0,1,1,382,612.38,72.06,72.06,0,0,1,310,684.44Zm84-240.91a60.31,60.31,0,1,1,60.31-60.31A60.31,60.31,0,0,1,394,443.53Zm148.09,89.23a38.53,38.53,0,1,1,38.53,38.53A38.53,38.53,0,0,1,542.05,532.76Zm104.7,273a72.06,72.06,0,1,1,72.06-72.06A72.06,72.06,0,0,1,646.75,805.72Z"
                      transform="translate(-125.36 -130.5)"
                    />
                  </svg>
                  <div id="profile_cookie_value">50</div>
                </div>
                <div className="profile_detail_subbox_label">Cookies</div>
              </div>
            </div>
          </div>
          <div id="profile_detail_stat" className="profile_detail_box">
            <div className="profile_detail_head">Statistics</div>
            <div className="profile_detail_body">
              <div className="profile_detail_subbox">Graph</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
