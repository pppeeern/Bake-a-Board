import { useNavigate } from "react-router-dom";
import "./LessonCard.css";

function LessonCard({ lesson }) {
  const navigate = useNavigate();

  return (
    <div className="lesson_card">
      <div className="lesson_hover flex-col">
        <div className="lesson_hover_title flex-row dashed">
          <div id="lesson_name">{lesson.name}</div>
          <span id="lesson_progress">
            {lesson.progress.completed}/{lesson.progress.total}
          </span>
        </div>
        <div className="lesson_hover_detail">{lesson.detail}</div>
        <button
          className="lesson_hover_button"
          onClick={() => navigate(`/quiz/`)}
        >
          <span>Start</span>
        </button>
      </div>
    </div>
  );
}

export default LessonCard;
