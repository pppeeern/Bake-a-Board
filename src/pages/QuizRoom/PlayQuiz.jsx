import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../pages/Account/AuthContext";
import CloseButton from "../../components/closeButton/CloseButton";
import "./PlayQuiz.css";

function PlayQuiz() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [gameEnded, setGameEnded] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connected");

  // Load initial data
  useEffect(() => {
    const loadRoomData = async () => {
      try {
        if (location.state?.roomData) {
          setRoomData(location.state.roomData);
          setPlayerName(location.state.playerName || "Anonymous");
          setCurrentQuestion(location.state.roomData.currentQuestion || 0);
        } else {
          const roomDoc = await getDoc(doc(db, "quizRooms", roomId));
          if (roomDoc.exists()) {
            const room = { id: roomDoc.id, ...roomDoc.data() };
            setRoomData(room);
            setCurrentQuestion(room.currentQuestion || 0);
          } else {
            navigate("/chapters");
            return;
          }
        }
      } catch (error) {
        console.error("Error loading room:", error);
        navigate("/chapters");
      } finally {
        setLoading(false);
      }
    };

    loadRoomData();
  }, [roomId, location.state, navigate]);

  // Listen for real-time updates
  useEffect(() => {
    if (!roomId || !roomData) return;

    const unsubscribe = onSnapshot(
      doc(db, "quizRooms", roomId),
      (doc) => {
        if (doc.exists()) {
          const updatedRoom = { id: doc.id, ...doc.data() };
          setRoomData(updatedRoom);

          // Update current question if host moves forward
          if (updatedRoom.currentQuestion !== currentQuestion) {
            setCurrentQuestion(updatedRoom.currentQuestion);
            setHasAnswered(false);
            setSelectedAnswer("");
            setShowFeedback(false);
          }

          // Check if game ended
          if (updatedRoom.status === "completed") {
            setGameEnded(true);
          }

          setConnectionStatus("connected");
        } else {
          setConnectionStatus("disconnected");
          setTimeout(() => navigate("/chapters"), 3000);
        }
      },
      (error) => {
        console.error("Error listening to room updates:", error);
        setConnectionStatus("disconnected");
      }
    );

    return () => unsubscribe();
  }, [roomId, roomData, currentQuestion, navigate]);

  const handleAnswerSelect = (answer) => {
    if (hasAnswered || !roomData) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || hasAnswered || !user || !roomData) return;

    setHasAnswered(true);

    const currentQ = roomData.questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.answer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Show feedback
    setShowFeedback(true);

    try {
      // Update participant's answer in Firebase
      const participantIndex = roomData.participants.findIndex(
        (p) => p.userId === user.uid
      );

      if (participantIndex !== -1) {
        const updatedParticipants = [...roomData.participants];
        if (!updatedParticipants[participantIndex].answers) {
          updatedParticipants[participantIndex].answers = [];
        }

        updatedParticipants[participantIndex].answers[currentQuestion] = {
          questionId: currentQ.id,
          selectedAnswer,
          isCorrect,
          answeredAt: new Date(),
        };

        if (isCorrect) {
          updatedParticipants[participantIndex].score =
            (updatedParticipants[participantIndex].score || 0) + 1;
        }

        await updateDoc(doc(db, "quizRooms", roomId), {
          participants: updatedParticipants,
        });
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < roomData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setHasAnswered(false);
      setSelectedAnswer("");
      setShowFeedback(false);
    } else {
      setGameEnded(true);
    }
  };

  const handleLeaveQuiz = () => {
    navigate("/chapters");
  };

  if (loading) {
    return (
      <div className="wrapper-m">
        <CloseButton />
        <div className="play_quiz_container">
          <div className="loading_quiz">
            <div className="loading_spinner"></div>
            <h2>Loading quiz...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="wrapper-m">
        <CloseButton />
        <div className="play_quiz_container">
          <div className="waiting_section">
            <h2>Room not found</h2>
            <p>The quiz room may have ended or doesn't exist.</p>
            <button onClick={handleLeaveQuiz} className="action_btn">
              Back to Chapters
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (roomData.status === "waiting") {
    return (
      <div className="wrapper-m">
        <CloseButton />
        <div className="play_quiz_container">
          <div className={`connection_status ${connectionStatus}`}>
            {connectionStatus === "connected"
              ? "🟢 Connected"
              : "🔴 Disconnected"}
          </div>

          <div className="waiting_section">
            <span className="waiting_icon">⏳</span>
            <h2>Waiting for Game to Start</h2>
            <p>The host will begin the quiz shortly. Get ready!</p>
            <p>
              <strong>Room Code:</strong> {roomData.code}
            </p>
            <p>
              <strong>Players:</strong> {roomData.participants?.length || 0}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (gameEnded || roomData.status === "completed") {
    const totalQuestions = roomData.questions?.length || 0;
    const percentage =
      totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    return (
      <div className="wrapper-m">
        <CloseButton />
        <div className="play_quiz_container">
          <div className="results_section">
            <h2>🎉 Quiz Complete!</h2>

            <div className="final_score">
              <h3>Your Final Score</h3>
              <div className="score_details">
                <div className="score_item">
                  <span className="score_number">{score}</span>
                  <div className="score_label">Correct</div>
                </div>
                <div className="score_item">
                  <span className="score_number">{totalQuestions}</span>
                  <div className="score_label">Total</div>
                </div>
                <div className="score_item">
                  <span className="score_number">{percentage}%</span>
                  <div className="score_label">Accuracy</div>
                </div>
              </div>
            </div>

            <div className="action_buttons">
              <button onClick={handleLeaveQuiz} className="action_btn">
                Back to Chapters
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (roomData.status !== "active") {
    return (
      <div className="wrapper-m">
        <CloseButton />
        <div className="play_quiz_container">
          <div className="waiting_section">
            <h2>Quiz Not Active</h2>
            <p>This quiz session is not currently active.</p>
            <button onClick={handleLeaveQuiz} className="action_btn">
              Back to Chapters
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = roomData.questions[currentQuestion];
  const totalQuestions = roomData.questions.length;

  if (!currentQ) {
    return (
      <div className="wrapper-m">
        <CloseButton />
        <div className="play_quiz_container">
          <div className="waiting_section">
            <h2>No Question Available</h2>
            <p>Waiting for the next question...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper-m">
      <CloseButton />

      <div className="play_quiz_container">
        <div className={`connection_status ${connectionStatus}`}>
          {connectionStatus === "connected" ? "🟢 Live" : "🔴 Connection Lost"}
        </div>

        {/* Quiz Header */}
        <div className="quiz_header">
          <h1>🎯 {roomData.lessonName}</h1>
          <div className="quiz_info">
            <span>👤 {playerName}</span>
            <span>🏆 Score: {score}</span>
            <span>👥 Room: {roomData.code}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="quiz_progress_section">
          <div className="progress_info">
            <span className="question_counter">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span className="score_display">
              Score: {score}/{currentQuestion + (hasAnswered ? 1 : 0)}
            </span>
          </div>
          <div className="progress_bar_container">
            <div
              className="progress_bar_fill"
              style={{
                width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="question_container">
          <h2 className="question_text">{currentQ.question}</h2>

          {currentQ.type === "choice" && (
            <div className="answer_options">
              {currentQ.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={hasAnswered}
                  className={`answer_option ${
                    selectedAnswer === option ? "selected" : ""
                  } ${
                    hasAnswered && showFeedback
                      ? option === currentQ.answer
                        ? "correct"
                        : selectedAnswer === option
                        ? "incorrect"
                        : ""
                      : ""
                  }`}
                >
                  <span className="option_letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="option_text">{option}</span>
                </button>
              ))}
            </div>
          )}

          {currentQ.type === "fill" && (
            <div className="fill_container">
              <div className="fill_question">
                {currentQ.question.split("_").map((part, index) => (
                  <span key={index}>
                    {part}
                    {index < currentQ.question.split("_").length - 1 && (
                      <input
                        type="text"
                        className="fill_input"
                        value={selectedAnswer}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        disabled={hasAnswered}
                        placeholder="?"
                      />
                    )}
                  </span>
                ))}
              </div>

              {currentQ.options && (
                <div className="fill_options">
                  <p
                    style={{
                      width: "100%",
                      marginBottom: "12px",
                      color: "#666",
                    }}
                  >
                    Hint - Choose from:
                  </p>
                  {currentQ.options.map((option, index) => (
                    <span
                      key={index}
                      onClick={() => !hasAnswered && setSelectedAnswer(option)}
                      className="fill_option"
                      style={{
                        cursor: hasAnswered ? "default" : "pointer",
                        opacity: hasAnswered ? 0.7 : 1,
                      }}
                    >
                      {option}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {!hasAnswered && (
            <div className="submit_section">
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer || hasAnswered}
                className="submit_answer_btn"
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>

        {/* Answer Feedback */}
        {hasAnswered && showFeedback && (
          <div className="answer_feedback">
            <div className="feedback_header">
              <span
                className={`feedback_icon ${
                  selectedAnswer === currentQ.answer ? "correct" : "incorrect"
                }`}
              >
                {selectedAnswer === currentQ.answer ? "✅" : "❌"}
              </span>
              <span
                className={`feedback_title ${
                  selectedAnswer === currentQ.answer ? "correct" : "incorrect"
                }`}
              >
                {selectedAnswer === currentQ.answer ? "Correct!" : "Incorrect"}
              </span>
            </div>

            {currentQ.explanation && (
              <div className="feedback_explanation">{currentQ.explanation}</div>
            )}

            {selectedAnswer !== currentQ.answer && (
              <div className="feedback_explanation">
                <strong>Correct answer:</strong> {currentQ.answer}
              </div>
            )}
          </div>
        )}

        {/* Waiting for next question */}
        {hasAnswered && !gameEnded && (
          <div className="waiting_section">
            <span className="waiting_icon">⏳</span>
            <h3>Waiting for next question...</h3>
            <p>The host will continue when ready</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayQuiz;
