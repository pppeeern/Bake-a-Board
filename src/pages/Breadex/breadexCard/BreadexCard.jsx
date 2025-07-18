import { Link } from "react-router-dom";
import "./BreadexCard.css";

function BreadexCard({ item }) {
  return (
    <Link
      to={`/breadex/i/${item.id}`}
      className="breadex_item"
      title={item.englishName}
      state={{ itemData: item }}
    >
      <div className="breadex_item_img">
        <img
          src={`/assets/img/${item.category}/${item.image}`}
          alt={item.englishName}
        />
      </div>
      <div className="breadex_item_des">
        <div className="breadex_item_des_title">{item.englishName}</div>
        {/* <div className="breadex_item_des_save">...</div> */}
      </div>
    </Link>
  );
}

export default BreadexCard;
