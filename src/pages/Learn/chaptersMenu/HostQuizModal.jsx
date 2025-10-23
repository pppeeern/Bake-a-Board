import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../pages/Account/AuthContext";
import CloseButton from "../../../components/closeButton/CloseButton";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { quizData } from "../data/quizData";
import { lessonData } from "../data/lessonData"; // Import all lessons
import "./HostQuizModal.css";

function HostQuizModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState("");
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [maxQuestions, setMaxQuestions] = useState(10);
  const [isCreating, setIsCreating] = useState(false);

  // Use ALL lessons, not just unlocked ones
  const allLessons = lessonData;

  const handleClose = () => {
    onClose();
    navigate("/chapters");
  };

  if (!isOpen) return null;

  return (
    <div className="host_quiz_overlay">
      <div className="host_quiz_modal">
        <div className="host_quiz_header">
          <h2>Host Quiz Room</h2>
          <CloseButton onClick={handleClose} />
        </div>

        <div className="host_quiz_content">
          <div className="info_section">
            <div className="info_card">
              <h3>Working in progress (coming soon)</h3>
              <img
                src="https://i.redd.it/6grfw2dj0ttd1.jpeg"
                alt="Working in progress"
                width="500"
              />
            </div>
          </div>
        </div>

        <div className="host_quiz_footer">
          <button onClick={handleClose} className="cancel_btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default HostQuizModal;
