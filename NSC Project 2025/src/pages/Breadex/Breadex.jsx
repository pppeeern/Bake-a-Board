import { useState } from "react";
import "./Breadex.css";
import BreadexCard from "../../components/breadexCard/BreadexCard";
import ProfileIcon from "../../components/profileIcon/profileIcon";

const breadexMenu = [
  { text: "Electronics", path: "" },
  { text: "Tools", path: "" },
  { text: "Symbols", path: "" },
];

function Breadex() {
  const [smenu, setMenu] = useState(0); // menu = variable, setMenu = function that set menu variable

  return (
    <div className="wrapper">
      <ProfileIcon />
      <div id="breadex_container" className="wrapper-m">
        <div id="breadex_menu_container">
          {breadexMenu.map((menu, index) => (
            <div
              key={index}
              className={`breadex_menu ${smenu === index ? "active" : ""}`} // set .active to menu
              onClick={() => {
                setMenu(index);
              }}
              title={menu.text}
            >
              {menu.text}
            </div>
          ))}
        </div>
        <button id="breadex_quiz">Quiz</button>
        <div id="breadex_item_container"></div>
      </div>
    </div>
  );
}

export default Breadex;
