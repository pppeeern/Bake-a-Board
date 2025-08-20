import { useLocation, useNavigate } from "react-router-dom";
import "./LessonCard.css";
import { useEffect, useState, useRef } from "react";
import { useUserData } from "../../../services/UserDataContext";
import * as lessonIcon from "./lessonIcon";

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
        <img src={lessonIcon["Locked"]} alt="Locked" draggable={false} />
      ) : !isCompleted ? (
        <>
          <img src={lessonIcon["Full"]} alt="Finished" draggable={false} />
          <div className="lesson_card_badge">{index + 1}</div>
        </>
      ) : (
        <>
          {/* <img src={lessonIcon["full"]} alt="Finished" /> */}
          {/* {<div className="lesson_completed_badge">✓</div>}
          {showProgressUpdate && (
            <div className="progress_update_notification">Progress +1!</div>
          )} */}
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
