import { useLocation, useNavigate } from "react-router-dom";
import "./LessonCard.css";
import { useEffect, useState, useRef } from "react";

function LessonCard({ lesson }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { id, name, detail, progress, isUnlocked } = lesson;
  const [localCompleted, setLocalCompleted] = useState(progress.completed);

  const handleClick = () => {
    if (isUnlocked) {
      navigate(`/quiz/${id}`, {
        state: {
          lessonData: lesson,
        },
      });
    }
  };

  const updatedOnce = useRef(false); // prevents double update
  useEffect(() => {
    // update lesson progress from id
    if (!updatedOnce.current && location.state?.completed === id) {
      setLocalCompleted((prev) => Math.min(prev + 1, progress.total));
      updatedOnce.current = true; // mark as updated
    }
  }, [location.state, id, progress.total]);

  return (
    <div className={`lesson_card ${!isUnlocked ? "locked" : ""}`}>
      <div className="lesson_hover flex-col">
        <div className="lesson_hover_title flex-row dashed">
          <div id="lesson_name">{name}</div>
          <span id="lesson_progress">
            {localCompleted}/{progress.total}
          </span>
        </div>
        <div className="lesson_hover_detail">{detail}</div>
        <button className="lesson_hover_button" onClick={handleClick}>
          <span>{isUnlocked ? "Start" : "Locked"}</span>
        </button>
      </div>
    </div>
  );
}

export default LessonCard;
