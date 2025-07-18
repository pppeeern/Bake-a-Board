import ProfileIcon from "../../components/profileIcon/ProfileIcon";
import { renderBreadexItems } from "../Breadex/breadexUtils";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";
import BreadexCard from "../Breadex/breadexCard/BreadexCard";
import "./Bakery.css";
import { useState, useEffect } from "react";

function Bakery() {
  const [bdxItems, setBdxItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="wrapper-m">
      <ProfileIcon />
      <div className="bakery_header">Bakery</div>
      <div className="bakery_baking_container">
        <div className="bakery_items_container">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            bdxItems
              .filter((item) => item.category === "electronics")
              .map((item) => (
                <div className="bakery_items">
                  <img
                    src={`/assets/img/${item.category}/${item.image}`}
                    alt={item.englishName}
                  />
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Bakery;
