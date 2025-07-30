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

  const handleHostQuiz = async () => {
    if (!user) {
      alert("You must be logged in to host a quiz");
      return;
    }

    if (!selectedLesson) {
      alert("Please select a lesson to host");
      return;
    }

    setIsCreating(true);

    try {
      const roomCode = Math.floor(100000 + Math.random() * 900000);

      const lessonQuestions = quizData[selectedLesson] || [];

      if (lessonQuestions.length === 0) {
        alert("No quiz found for this lesson");
        setIsCreating(false);
        return;
      }

      const lessonDetails = allLessons.find((l) => l.id === selectedLesson);

      const roomData = {
        code: roomCode,
        hostId: user.uid,
        lessonId: selectedLesson,
        lessonName: lessonDetails?.name || "Unknown Lesson",
        questions: lessonQuestions,
        participants: [],
        status: "waiting",
        createdAt: serverTimestamp(),
        maxParticipants: 50,
      };

      const roomsRef = collection(db, "quizRooms");
      const roomDoc = await addDoc(roomsRef, roomData);

      console.log("Room created with ID:", roomDoc.id, "Code:", roomCode);

      navigate(`/host-room/${roomDoc.id}`, {
        state: {
          roomData: {
            id: roomDoc.id,
            ...roomData,
          },
        },
      });
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="host_quiz_overlay">
      <div className="host_quiz_modal">
        <div className="host_quiz_header">
          <h2>🎯 Host Quiz Room</h2>
          <CloseButton onClick={handleClose} />
        </div>

        <div className="host_quiz_content">
          <div className="info_section">
            <div className="info_card">
              <h3>How it works:</h3>
              <ul>
                <li>🎯 Choose any lesson from the curriculum</li>
                <li>🔗 Get a 6-digit room code to share</li>
                <li>👥 Up to 50 players can join</li>
                <li>📊 See live results and leaderboard</li>
              </ul>
            </div>
          </div>

          <div className="form_section">
            <label>Select Any Lesson to Host:</label>
            <select
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              className="lesson_select"
            >
              <option value="">Choose a lesson...</option>
              {allLessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.name}
                </option>
              ))}
            </select>

            {selectedLesson && (
              <div className="lesson_preview">
                <div className="preview_title">Quiz Preview:</div>
                <div className="preview_info">
                  📝 {quizData[selectedLesson]?.length || 0} questions available
                </div>
                <div className="lesson_details">
                  📚{" "}
                  {allLessons.find((l) => l.id === selectedLesson)?.detail ||
                    "No description"}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="host_quiz_footer">
          <button onClick={handleClose} className="cancel_btn">
            Cancel
          </button>
          <button
            onClick={handleHostQuiz}
            disabled={isCreating || !selectedLesson}
            className="host_btn"
          >
            {isCreating ? "Creating Room..." : "Host Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HostQuizModal;
