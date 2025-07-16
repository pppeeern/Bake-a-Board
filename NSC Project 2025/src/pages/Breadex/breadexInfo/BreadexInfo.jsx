import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./BreadexInfo.css";
import CloseButton from "../../../components/closeButton/CloseButton";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";

function BreadexInfo() {
  const location = useLocation();
  const { id } = useParams();
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    if (location.state?.itemData) {
      setItemData(location.state.itemData);
    } else {
      console.log("No item data in state, ID:", id);
    }
  }, [location.state, id]);

  if (!itemData) {
    return (
      <div className="wrapper-m">
        <CloseButton />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="wrapper-m">
      <CloseButton />
      <div id="info_container" className="flex-row">
        <div id="info_img">
          <img
            src={`/assets/img/${itemData.category}/${itemData.image}`}
            alt={itemData.englishName}
          />
        </div>
        <div id="info_text_container" className="flex-col">
          <div className="flex-row" style={{ gap: "10px" }}>
            <div className="info_text_name">{itemData.englishName}</div>
            <div>...</div>
          </div>
          <div className="dashed"></div>
          <div>{itemData.description || "No description available"}</div>

          {/* {itemData.category && (
            <div>
              <strong>Category:</strong> {itemData.category}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default BreadexInfo;
