import { useAuth } from "../../pages/Account/AuthContext";
import "./LogoutButton.css";

function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      try {
        await logout();
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Logout failed. Please try again.");
      }
    }
  };

  return (
    <div className="logout_button" onClick={handleLogout} title="Log out">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={"100%"}
        height={"100%"}
        viewBox="0 0 765 840"
        fill="#540f5c"
      >
        <path
          className="cls-1"
          d="M653.39,657a45,45,0,0,0-45,45V847.86c0,12.27-4.77,19.9-7.18,22.14H255.58c-2.41-2.24-7.19-9.87-7.19-22.14V232.14c0-12.27,4.78-19.9,7.19-22.14H601.21c2.41,2.24,7.18,9.87,7.18,22.14V378a45,45,0,0,0,90,0V232.14c0-27.61-8.43-54-23.75-74.47C656.69,133.73,630.59,120,603,120H253.75c-27.55,0-53.66,13.73-71.61,37.67-15.31,20.41-23.75,46.87-23.75,74.47V847.86c0,27.6,8.44,54.06,23.75,74.47,18,23.94,44.05,37.67,71.61,37.67H603c27.55,0,53.65-13.73,71.6-37.67,15.32-20.41,23.75-46.87,23.75-74.47V702A45,45,0,0,0,653.39,657Z"
          transform="translate(-158.39 -120)"
        />
        <path
          className="cls-1"
          d="M908.43,508.18l-91.65-91.64a45,45,0,1,0-63.63,63.64L768,495H425.48a45,45,0,0,0,0,90H768l-14.82,14.82a45,45,0,1,0,63.63,63.64l91.65-91.64a45,45,0,0,0,0-63.64Z"
          transform="translate(-158.39 -120)"
        />
      </svg>
    </div>
  );
}

export default LogoutButton;
