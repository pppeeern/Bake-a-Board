import { useNavigate } from "react-router-dom";
import "./ChaptersCard.css";

function ChaptersCard({ chapter, onSelect }) {
  const navigate = useNavigate();

  const handleClick = () => {
    onSelect(chapter);
    navigate("/");
  };

  return (
    <div onClick={handleClick} className="chapters_card">
      <div className="chapters_card_title">{chapter.name}</div>
      <div className="chapters_card_thumb">
        <img src={chapter.thumb} alt={chapter.name} />
      </div>
      <div className="chapters_card_detail">{chapter.detail}</div>
    </div>
  );
}

export default ChaptersCard;
