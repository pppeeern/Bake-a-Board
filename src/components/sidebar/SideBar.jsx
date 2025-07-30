import "./SideBar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SideBarIcon from "./SideBarIcon";
import LogoWordmark from "../logo/LogoWordmark";

const navItems = [
  { text: "Learn", path: "/" },
  { text: "Breadex", path: "/breadex/" },
  { text: "Bakery", path: "/bakery/" },
  { text: "Profile", path: "/profile/" },
];

function SideBar() {
  const location = useLocation();

  return (
    <nav id="sideBar">
      <div className="logo_container">
        <LogoWordmark />
      </div>
      <aside>
        {navItems.map((item, index) => (
          <Link
            key={index}
            className={`navItems ${
              location.pathname === item.path ? "active" : ""
            }`}
            to={item.path}
            title={item.text}
          >
            <SideBarIcon icon={item.text} />
            <div className="navItems_label">{item.text}</div>
          </Link>
        ))}
      </aside>
      <div>
        <Link
          to="/settings/"
          id="setting"
          className={`navItems ${
            location.pathname === "/settings/" ? "active" : ""
          }`}
          title="Settings"
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 820 800"
            >
              <path
                className="cls-1"
                d="M830.88,414.44A120,120,0,0,0,808.7,275.28h0a120.05,120.05,0,0,0-140.28-21.61A130,130,0,0,0,540,144h0A130,130,0,0,0,411.58,253.67,120.05,120.05,0,0,0,271.3,275.28h0a120,120,0,0,0-22.18,139.16A130,130,0,0,0,130,544h0A130,130,0,0,0,249.12,673.52,120,120,0,0,0,271.3,812.68h0a120.05,120.05,0,0,0,140.28,21.61A130,130,0,0,0,540,944h0A130,130,0,0,0,668.42,834.29,120.05,120.05,0,0,0,808.7,812.68h0a120,120,0,0,0,22.18-139.16A130,130,0,0,0,950,544h0A130,130,0,0,0,830.88,414.44ZM390,727a26.89,26.89,0,1,1,26.82-26.89A26.86,26.86,0,0,1,390,727Zm0-150a26.89,26.89,0,1,1,26.82-26.89A26.86,26.86,0,0,1,390,577Zm0-150a26.89,26.89,0,1,1,26.82-26.89A26.86,26.86,0,0,1,390,427ZM540,727a26.89,26.89,0,1,1,26.82-26.89A26.86,26.86,0,0,1,540,727Zm0-150a26.89,26.89,0,1,1,26.82-26.89A26.86,26.86,0,0,1,540,577Zm0-150a26.89,26.89,0,1,1,26.82-26.89A26.86,26.86,0,0,1,540,427ZM690,727a26.89,26.89,0,1,1,26.82-26.89A26.86,26.86,0,0,1,690,727Zm0-150a26.89,26.89,0,1,1,26.82-26.89A26.86,26.86,0,0,1,690,577Zm0-150a26.89,26.89,0,1,1,26.82-26.89A26.86,26.86,0,0,1,690,427Z"
                transform="translate(-130 -143.98)"
              />
            </svg>
          </div>
          <div className="navItems_label">Settings</div>
        </Link>
      </div>
    </nav>
  );
}

export default SideBar;
