import { useState } from "react";
import "./SideBar.css";
import { Link } from "react-router-dom";

const navItems = [
  { text: "Learn", icon: "", path: "/" },
  { text: "Breadex", icon: "", path: "/breadex/" },
  { text: "Bakery", icon: "", path: "/bakery/" },
  { text: "Profile", icon: "", path: "/profile/" },
];

function SideBar() {
  const [nav, SetNav] = useState(0);

  return (
    <nav id="sideBar">
      <div id="logoContainer" onClick={() => (location.href = "/")}>
        <div>
          <img src="https://placehold.co/65x65" />
        </div>
        <div className="bake-a-board">
          BAKE-A<br></br>BOARD
        </div>
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
            onClick={() => {
              SetNav(index);
            }}
          >
            <div>
              <img src="https://placehold.co/24x24" />
            </div>
            <div>{item.text}</div>
          </Link>
        ))}
      </aside>
      <div>
        <Link to="/settings" id="setting" className="navItems" title="Settings">
          <div>
            <img src="https://placehold.co/24x24" />
          </div>
          <div>Settings</div>
        </Link>
      </div>
    </nav>
  );
}

export default SideBar;
