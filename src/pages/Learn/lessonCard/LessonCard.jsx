import { useLocation, useNavigate } from "react-router-dom";
import "./LessonCard.css";
import { useEffect, useState, useRef } from "react";
import { useUserData } from "../../../services/UserDataContext";

function LessonCard({ index, lesson }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUserData } = useUserData();

  const { id, name, detail, progress, isUnlocked, isCompleted } = lesson;
  const [localCompleted, setLocalCompleted] = useState(progress.completed);
  const [showProgressUpdate, setShowProgressUpdate] = useState(false);

  const handleClick = () => {
    if (isUnlocked) {
      navigate(`/quiz/${id}`, {
        state: {
          lessonData: lesson,
        },
      });
    }
  };

  const updatedOnce = useRef(false);
  const processedLocationKey = useRef(null);

  useEffect(() => {
    if (location.key === processedLocationKey.current) {
      return;
    }

    if (location.state?.completed === id && location.state?.quizResult) {
      const quizResult = location.state.quizResult;

      if (quizResult?.progressIncremented && !updatedOnce.current) {
        setLocalCompleted(quizResult.newProgress);
        setShowProgressUpdate(true);

        setTimeout(() => {
          setShowProgressUpdate(false);
        }, 3000);

        refreshUserData();

        updatedOnce.current = true;
        processedLocationKey.current = location.key;

        navigate(location.pathname, { replace: true });
      }
    }
  }, [location, id, refreshUserData, navigate]);

  useEffect(() => {
    updatedOnce.current = false;
    processedLocationKey.current = null;
  }, [id]);

  useEffect(() => {
    setLocalCompleted(progress.completed);
  }, [progress.completed]);

  const getProgressColor = () => {
    if (isCompleted) return "success";
    if (localCompleted > 0) return "warning";
    return "default";
  };

  const getProgressText = () => {
    if (isCompleted) return "Completed!";
    return `${localCompleted}/${progress.total}`;
  };

  return (
    <div className={`lesson_card ${!isUnlocked ? "locked" : ""}`}>
      {!isUnlocked ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={12}
          height={42}
          viewBox="0 0 296.59 522.41"
          fill="rgb(200, 200, 200)"
        >
          <path
            className="cls-1"
            d="M608.89,558.43a148.29,148.29,0,1,0-137.78,0L397.88,771.22a25,25,0,0,0,24.44,30H657.68a25,25,0,0,0,24.44-30Z"
            transform="translate(-391.71 -278.79)"
          />
        </svg>
      ) : !isCompleted ? (
        <div className="lesson_card_badge">{index + 1}</div>
      ) : (
        <>
          {<div className="lesson_completed_badge">✓</div>}
          {showProgressUpdate && (
            <div className="progress_update_notification">Progress +1!</div>
          )}
        </>
      )}

      <div className="lesson_hover flex-col">
        <div className="lesson_hover_title flex-row dashed">
          <div id="lesson_name">{name}</div>
          <span
            id="lesson_progress"
            className={`progress-${getProgressColor()}`}
          >
            {getProgressText()}
          </span>
        </div>
        <div className="lesson_hover_detail">{detail}</div>

        {isCompleted && (
          <div className="lesson_completion_status">🎉 Lesson Complete! 🎉</div>
        )}

        <button
          className={`lesson_hover_button ${
            isUnlocked ? "primary" : "disable"
          } ${isCompleted ? "completed" : ""}`}
          onClick={handleClick}
        >
          <span>
            {!isUnlocked
              ? "Locked"
              : isCompleted
              ? "Replay"
              : localCompleted >= progress.total
              ? "Replay"
              : "Start"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default LessonCard;
