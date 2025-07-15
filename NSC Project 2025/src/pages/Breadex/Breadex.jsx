import { useEffect, useState } from "react";
import "./Breadex.css";
import BreadexCard from "./breadexCard/BreadexCard";
import ProfileIcon from "../../components/profileIcon/ProfileIcon";
import { renderBreadexItems } from "./breadexUtils";
import { useNavigate } from "react-router-dom";

const breadexMenu = [
  { text: "Electronics" },
  { text: "Tools" },
  { text: "Symbols" },
];

function Breadex() {
  const [smenu, setMenu] = useState(0); // menu = variable, setMenu = function that set menu variable
  const [bdxItems, setBdxItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      try {
        const items = await renderBreadexItems();
        setBdxItems(items);
      } catch (error) {
        console.error("Error loading items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadItems();
  }, []);

  const handleItemClick = (item) => {
    navigate(`/breadex/i/${item.id}`, {
      state: { itemData: item },
    });
  };

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
        <div id="breadex_item_container">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            // </div>
            bdxItems
              .filter(
                (item) =>
                  item.category === breadexMenu[smenu].text.toLowerCase()
              )
              .map((item) => (
                <BreadexCard
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Breadex;
