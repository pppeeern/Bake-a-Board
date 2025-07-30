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
import CloseButton from "../../components/closeButton/CloseButton";
import "./HostRoom.css";

function HostRoom() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Load room data
  useEffect(() => {
    const loadRoomData = async () => {
      try {
        // First try to get from navigation state
        if (location.state?.roomData) {
          setRoomData(location.state.roomData);
          setLoading(false);
          return;
        }

        // If no state, fetch from Firebase
        const roomDoc = await getDoc(doc(db, "quizRooms", roomId));
        if (roomDoc.exists()) {
          const room = { id: roomDoc.id, ...roomDoc.data() };
          setRoomData(room);
        } else {
          console.error("Room not found");
          alert("Room not found");
          navigate("/chapters");
        }
      } catch (error) {
        console.error("Error loading room:", error);
        alert("Failed to load room");
        navigate("/chapters");
      } finally {
        setLoading(false);
      }
    };

    loadRoomData();
  }, [roomId, location.state, navigate]);

  // Listen for real-time updates
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = onSnapshot(doc(db, "quizRooms", roomId), (doc) => {
      if (doc.exists()) {
        const updatedRoom = { id: doc.id, ...doc.data() };
        setRoomData(updatedRoom);
        setParticipants(updatedRoom.participants || []);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleStartGame = async () => {
    if (!roomData || participants.length === 0) {
      alert("Need at least 1 participant to start");
      return;
    }

    try {
      await updateDoc(doc(db, "quizRooms", roomId), {
        status: "active",
        currentQuestion: 0,
        startedAt: new Date(),
      });

      setGameStarted(true);
      setCurrentQuestion(0);
    } catch (error) {
      console.error("Error starting game:", error);
      alert("Failed to start game");
    }
  };

  const handleNextQuestion = async () => {
    const nextQ = currentQuestion + 1;

    if (nextQ < roomData.questions.length) {
      try {
        await updateDoc(doc(db, "quizRooms", roomId), {
          currentQuestion: nextQ,
        });
        setCurrentQuestion(nextQ);
      } catch (error) {
        console.error("Error updating question:", error);
      }
    } else {
      // Game finished
      try {
        await updateDoc(doc(db, "quizRooms", roomId), {
          status: "completed",
          endedAt: new Date(),
        });
        setShowResults(true);
      } catch (error) {
        console.error("Error ending game:", error);
      }
    }
  };

  const handleEndGame = () => {
    navigate("/chapters");
  };

  if (loading) {
    return (
      <div className="wrapper-m">
        <CloseButton />
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h2>Loading room...</h2>
        </div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="wrapper-m">
        <CloseButton />
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h2>Room not found</h2>
          <button onClick={() => navigate("/chapters")}>
            Back to Chapters
          </button>
        </div>
      </div>
    );
  }

  const currentQ = roomData.questions[currentQuestion];
  const totalQuestions = roomData.questions.length;

  return (
    <div className="wrapper-m">
      <CloseButton />

      <div className="host_room_container">
        {/* Room Header */}
        <div className="room_header">
          <div className="room_info">
            <h1>🎯 {roomData.lessonName}</h1>
            <div className="room_details">
              <span className="room_code">
                Room Code: <strong>{roomData.code}</strong>
              </span>
              <span className="participant_count">
                👥 {participants.length} joined
              </span>
            </div>
          </div>
        </div>

        {!gameStarted ? (
          /* Waiting Room */
          <div className="waiting_room">
            <div className="waiting_info">
              <h2>Waiting for participants...</h2>
              <p>
                Share this code:{" "}
                <span className="share_code">{roomData.code}</span>
              </p>
            </div>

            <div className="participants_section">
              <h3>Participants ({participants.length}):</h3>
              <div className="participants_grid">
                {participants.length === 0 ? (
                  <div className="no_participants">No participants yet</div>
                ) : (
                  participants.map((participant, index) => (
                    <div key={index} className="participant_card">
                      <div className="participant_avatar">
                        {participant.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="participant_name">
                        {participant.name || "Anonymous"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="host_controls">
              <button
                onClick={handleStartGame}
                disabled={participants.length === 0}
                className="start_game_btn"
              >
                {participants.length === 0
                  ? "Waiting for participants..."
                  : `Start Game (${totalQuestions} questions)`}
              </button>
            </div>
          </div>
        ) : showResults ? (
          /* Results Screen */
          <div className="results_screen">
            <h2>🎉 Game Complete!</h2>
            <div className="final_results">
              <h3>Final Leaderboard:</h3>
              {/* TODO: Show participant scores */}
              <div className="results_placeholder">
                Results will be displayed here
              </div>
            </div>

            <div className="host_controls">
              <button onClick={handleEndGame} className="end_game_btn">
                End Session
              </button>
            </div>
          </div>
        ) : (
          /* Active Game */
          <div className="active_game">
            <div className="question_header">
              <div className="question_progress">
                Question {currentQuestion + 1} of {totalQuestions}
              </div>
              <div className="progress_bar">
                <div
                  className="progress_fill"
                  style={{
                    width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="current_question">
              <h2 className="question_text">{currentQ?.question}</h2>

              {currentQ?.type === "choice" && (
                <div className="answer_options">
                  {currentQ.options?.map((option, index) => (
                    <div
                      key={index}
                      className={`option_display ${
                        option === currentQ.answer ? "correct" : ""
                      }`}
                    >
                      <span className="option_letter">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="option_text">{option}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="host_controls">
              <button
                onClick={handleNextQuestion}
                className="next_question_btn"
              >
                {currentQuestion + 1 < totalQuestions
                  ? "Next Question"
                  : "Show Results"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HostRoom;
