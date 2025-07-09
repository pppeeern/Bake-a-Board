import { useState } from "react";
import "./SideBar.css";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { text: "Learn", icon: "", path: "/" },
  { text: "Breadex", icon: "", path: "/breadex/" },
  { text: "Bakery", icon: "", path: "/bakery/" },
  { text: "Profile", icon: "", path: "/profile/" },
];

function SideBar() {
  const location = useLocation();

  return (
    <nav id="sideBar">
      <Link to={"/"} id="logoContainer">
        <div>
          <img src="https://placehold.co/65x65" />
        </div>
        <div className="bake-a-board">
          BAKE-A<br></br>BOARD
        </div>
      </Link>
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
