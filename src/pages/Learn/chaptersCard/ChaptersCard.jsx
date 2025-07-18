import { useNavigate } from "react-router-dom";
import "./ChaptersCard.css";

function ChaptersCard({ chapter, selectedChapter, onSelect }) {
  const navigate = useNavigate();

  const { name, isUnlocked, thumb, detail } = chapter;

  const handleClick = () => {
    if (isUnlocked) {
      onSelect(chapter);
      navigate("/");
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`chapters_card
        ${name === selectedChapter.name ? "active" : ""}
        ${!isUnlocked ? "locked" : ""}
      `}
    >
      <div className="chapters_card_title">{name}</div>
      <div className="chapters_card_thumb">
        {/* <img src={thumb} alt={name} /> */}
      </div>
      <div className="chapters_card_detail">{detail}</div>
    </div>
  );
}

export default ChaptersCard;
