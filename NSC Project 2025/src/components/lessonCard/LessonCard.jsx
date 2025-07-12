import { Link } from "react-router-dom";
import "./LessonCard.css";

function LessonCard() {
  return (
    <Link className="lesson_card">
      <img src="https://placehold.co/75x75" />
      <div className="lesson_hover flex-col">
        <div className="lesson_hover_title flex-row dashed">
          <div id="lesson_name">Lesson</div>
          <div id="lesson_progress">1/4</div>
        </div>
        <div className="lesson_hover_detail">Detail</div>
        <button className="lesson_hover_button">
          <Link to={`/quiz/`}>Start</Link>
        </button>
      </div>
    </Link>
  );
}

export default LessonCard;
