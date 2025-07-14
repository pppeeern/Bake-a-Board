import { Link } from "react-router-dom";
import "./ChaptersCard.css";

function ChaptersCard() {
  return (
    <Link to={`/`} className="chapters_card">
      <div className="chapters_card_title">Chapter Title</div>
      <div className="chapters_card_thumb">
        <img src="#" alt="chapter_thumbnail" />
      </div>
      <div className="chapters_card_detail">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad nam
        excepturi dolorem optio necessitatibus earum itaque nesciunt atque
        voluptatem.
      </div>
    </Link>
  );
}

export default ChaptersCard;
