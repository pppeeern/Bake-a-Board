import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Breadex.css";
import { renderBreadexItems } from "./breadexUtils";
import BreadexCard from "./breadexCard/BreadexCard";
import ProfileIcon from "../../components/profileIcon/ProfileIcon";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";

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

  // const handleItemClick = (item) => {
  //   navigate(`/breadex/i/${item.id}`, {
  //     state: { itemData: item },
  //   });
  // };

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
            <LoadingSpinner />
          ) : (
            bdxItems
              .filter(
                (item) =>
                  item.category === breadexMenu[smenu].text.toLowerCase()
              )
              .map((item) => (
                <BreadexCard
                  key={item.id}
                  item={item}
                  // onClick={() => handleItemClick(item)}
                />
              ))
          )}
        </div>
      </div>
      <div id="breadex_scan_container">
        <button
          id="breadex_scan_button"
          title="Breadex Scanner"
          onClick={() => navigate(`/breadex/scanner`)}
        >
          Breadex
          <br />
          Scanner
        </button>
      </div>
    </div>
  );
}

export default Breadex;
