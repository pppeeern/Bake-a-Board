import "./Profile.css";

function Profile() {
  return (
    <div className="wrapper-m">
      <div id="profile_container">
        <div id="avatar_display">
          <img src="" alt="avatar" />
        </div>
        <div id="profile_detail_container">
          <div id="profile_detail_user" className="profile_detail_box">
            <div className="profile_detail_head">
              <span id="profile_detail_username">User</span>
              <button>C-</button>
            </div>
            <div id="profile_detail_level" className="profile_detail_subbox">
              Level
            </div>
            <div id="profile_detail_cookie" className="profile_detail_subbox">
              Cookie
            </div>
          </div>
          <div id="profile_detail_stat" className="profile_detail_box">
            <div className="profile_detail_head">Statistics</div>
            <div className="profile_detail_subbox">Graph</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
