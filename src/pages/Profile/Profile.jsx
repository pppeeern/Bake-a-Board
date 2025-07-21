import LogoutButton from "../../components/logoutButton/LogoutButton";
import { useAuth } from "../Account/AuthContext";
import { useUserData } from "../../services/UserDataContext";
import "./Profile.css";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";

function Profile() {
  const { user } = useAuth();
  const { userData, loading } = useUserData();

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <div className="wrapper-m">
      <div id="profile_container">
        <div id="profile_avatar_display">
          {/* <img src="" alt="avatar" /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={340}
            height={400}
            viewBox="0 0 680 860"
            fill="rgb(225, 225, 225)"
          >
            <path
              className="cls-1"
              d="M858.46,421.33A75.12,75.12,0,0,0,805.83,400H663.69c-4.77,0-6.74-4.23-4.54-6.63a163.25,163.25,0,0,0,50.21-114.77C711,186.9,635.05,110.79,541.22,110.14c-147.86-6.09-228.15,185.54-120.32,283.3,2.13,2.41.15,6.58-4.59,6.58H274.17c-64.44-2.18-99.48,81.25-52.63,124.22,27.25,34.63,128.88,17.55,167,21.3a10.18,10.18,0,0,1,10,12.06L337.42,885c-15.84,94.35,127.15,120,146.44,26.14l30.7-141.49c1.67-8.93,6.21-30.21,25.44-30.21s23.77,21.28,25.44,30.21l30.64,141.49c15.26,85.6,148.28,73.85,147.66-13A72.16,72.16,0,0,0,742.52,885L681.35,557.6a10.18,10.18,0,0,1,10-12.06H805.83C870.25,547.83,905.32,464.21,858.46,421.33ZM562.41,641.59c-3.18,29.22-47.65,24.8-44.82-4.59C520.77,607.78,565.23,612.21,562.41,641.59Zm0-87.9c-3.18,29.22-47.65,24.79-44.82-4.6C520.77,519.88,565.23,524.3,562.41,553.69Zm0-87.91c-3.18,29.22-47.65,24.8-44.82-4.59C520.77,432,565.23,436.4,562.41,465.78Z"
              transform="translate(-200 -110)"
            />
          </svg>
        </div>
        <div id="profile_detail_container">
          <div id="profile_detail_user" className="profile_detail_box">
            <div className="profile_detail_head">
              <span id="profile_detail_username">{displayName}</span>{" "}
              <LogoutButton />
            </div>
            <div className="profile_detail_body">
              <div id="profile_detail_level" className="profile_detail_subbox">
                <div className="flex-row" style={{ gap: "8px", width: "100%" }}>
                  <div id="profile_level_value">{userData?.level || 1}</div>{" "}
                  <div
                    id="profile_level_bar"
                    className="profile_detail_level_bar"
                  >
                    <div
                      id="profile_exp_value"
                      className="profile_detail_exp_value profile_detail_value"
                    >
                      {userData?.exp || 0}
                    </div>
                    <div
                      id="profile_level_bar_value"
                      className="profile_detail_level_bar_value"
                      style={{
                        width: `${(userData?.exp || 0) % 100}%`,
                      }}
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
                      className="cls-1"
                      d="M947.86,502.29q-5.54,1.77-11.3,3.12A149.77,149.77,0,0,1,752.78,357A149.66,149.66,0,0,1,563.62,131.07A407.44,407.44,0,0,0,448.9,141.32C229.7,192.65,89.52,384.64,133.39,633.85c39,221.72,278.26,335.8,497.46,284.47C830.88,871.48,965,698.73,947.86,502.29ZM310,684.44A72.06,72.06,0,1,1,382,612.38,72.06,72.06,0,0,1,310,684.44Zm84-240.91a60.31,60.31,0,1,1,60.31-60.31A60.31,60.31,0,0,1,394,443.53Zm148.09,89.23a38.53,38.53,0,1,1,38.53,38.53A38.53,38.53,0,0,1,542.05,532.76Zm104.7,273a72.06,72.06,0,1,1,72.06-72.06A72.06,72.06,0,0,1,646.75,805.72Z"
                      transform="translate(-125.36 -130.5)"
                    />
                  </svg>
                  <div
                    id="profile_cookie_value"
                    className="profile_detail_value"
                  >
                    {userData?.cookies || 0}
                  </div>{" "}
                </div>
                <div className="profile_detail_subbox_label">Cookies</div>
              </div>
            </div>
          </div>
          <div id="profile_detail_stat" className="profile_detail_box">
            <div className="profile_detail_head">Statistics</div>
            <div className="profile_detail_body">
              <div className="profile_detail_subbox">
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <div>
                    <div>📊 Level: {userData?.level || 1}</div>
                    <div>
                      📅 Joined:{" "}
                      {userData?.createdAt
                        ? new Date(
                            userData.createdAt.seconds * 1000
                          ).toLocaleDateString()
                        : "Unknown"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
