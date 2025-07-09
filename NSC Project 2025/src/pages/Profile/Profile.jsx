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
              <button id="profile_logout" title="Log out"></button>
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
                <div className="flex-row" style={{ gap: "8px", width: "100%" }}>
                  <div id="profile_cookie_value">C</div>
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
