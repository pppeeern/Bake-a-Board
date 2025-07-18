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
        {/* <button id="breadex_quiz">Quiz</button> */}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={54}
            height={54}
            viewBox="0 0 875 700"
          >
            <path
              className="cls-1"
              d="M420.73,190H225.52A35.55,35.55,0,0,0,190,225.52V420.73A29.3,29.3,0,0,0,219.27,450h6a29.3,29.3,0,0,0,29.27-29.27V254.52H420.73A29.3,29.3,0,0,0,450,225.25v-6A29.3,29.3,0,0,0,420.73,190Z"
              transform="translate(-102.5 -190)"
            />
            <path
              class="cls-1"
              d="M854.48,190H659.27A29.3,29.3,0,0,0,630,219.27v6a29.3,29.3,0,0,0,29.27,29.27H825.48V420.73A29.3,29.3,0,0,0,854.75,450h6A29.3,29.3,0,0,0,890,420.73V225.52A35.55,35.55,0,0,0,854.48,190Z"
              transform="translate(-102.5 -190)"
            />
            <path
              class="cls-1"
              d="M420.73,825.48H254.52V659.27A29.3,29.3,0,0,0,225.25,630h-6A29.3,29.3,0,0,0,190,659.27V854.48A35.55,35.55,0,0,0,225.52,890H420.73A29.3,29.3,0,0,0,450,860.73v-6A29.3,29.3,0,0,0,420.73,825.48Z"
              transform="translate(-102.5 -190)"
            />
            <path
              class="cls-1"
              d="M860.73,630h-6a29.3,29.3,0,0,0-29.27,29.27V825.48H659.27A29.3,29.3,0,0,0,630,854.75v6A29.3,29.3,0,0,0,659.27,890H854.48A35.55,35.55,0,0,0,890,854.48V659.27A29.3,29.3,0,0,0,860.73,630Z"
              transform="translate(-102.5 -190)"
            />
            <rect class="cls-1" y="317.5" width="875" height="65" rx="28" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Breadex;
