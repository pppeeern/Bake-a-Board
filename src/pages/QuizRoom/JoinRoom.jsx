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
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";
import "./JoinRoom.css";

function JoinRoom() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  // Load room data with retry logic
  useEffect(() => {
    const loadRoomData = async () => {
      try {
        // First try to get from navigation state
        if (location.state?.roomData) {
          setRoomData(location.state.roomData);
          setParticipants(location.state.roomData.participants || []);
          setLoading(false);
          return;
        }

        // If no state, fetch from Firebase with retry
        const roomDoc = await getDoc(doc(db, "quizRooms", roomId));
        if (roomDoc.exists()) {
          const room = { id: roomDoc.id, ...roomDoc.data() };
          setRoomData(room);
          setParticipants(room.participants || []);
          setRetryCount(0); // Reset retry count on success
        } else {
          setError("Room not found or has ended");
          setTimeout(() => navigate("/chapters"), 3000);
        }
      } catch (error) {
        console.error("Error loading room:", error);

        if (retryCount < 3) {
          setRetryCount((prev) => prev + 1);
          setTimeout(() => loadRoomData(), 2000 * retryCount); // Exponential backoff
          setError(`Connection failed. Retrying... (${retryCount + 1}/3)`);
        } else {
          setError(
            "Failed to load room details. Please check your connection and try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadRoomData();
  }, [roomId, location.state, navigate, retryCount]);

  // Listen for real-time updates with better error handling
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = onSnapshot(
      doc(db, "quizRooms", roomId),
      (doc) => {
        if (doc.exists()) {
          const updatedRoom = { id: doc.id, ...doc.data() };
          setRoomData(updatedRoom);
          setParticipants(updatedRoom.participants || []);

          // Check if user is already in participants
          if (user) {
            const userInRoom = updatedRoom.participants?.some(
              (p) => p.userId === user.uid
            );
            setHasJoined(userInRoom);
          }

          // Redirect if game starts
          if (updatedRoom.status === "active" && hasJoined) {
            navigate(`/play-quiz/${roomId}`, {
              state: { roomData: updatedRoom, playerName },
            });
          }

          setConnectionAttempts(0); // Reset connection attempts on success
        } else {
          setError("Room no longer exists");
          setTimeout(() => navigate("/chapters"), 3000);
        }
      },
      (error) => {
        console.error("Error listening to room updates:", error);

        if (connectionAttempts < 5) {
          setConnectionAttempts((prev) => prev + 1);
          setError(
            `Connection unstable. Reconnecting... (${connectionAttempts + 1}/5)`
          );
        } else {
          setError(
            "Connection lost. Please refresh the page or check your internet connection."
          );
        }
      }
    );

    return () => unsubscribe();
  }, [roomId, user, hasJoined, navigate, playerName, connectionAttempts]);

  // Set default player name from user
  useEffect(() => {
    if (user && !playerName) {
      setPlayerName(user.displayName || user.email?.split("@")[0] || "");
    }
  }, [user, playerName]);

  const handleJoinRoom = async () => {
    if (!user) {
      setError("You must be logged in to join a quiz room");
      return;
    }

    const trimmedName = playerName.trim();
    if (!trimmedName) {
      setError("Please enter your display name");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }

    if (trimmedName.length > 20) {
      setError("Name must be less than 20 characters");
      return;
    }

    if (!roomData) {
      setError("Room data not available. Please refresh and try again.");
      return;
    }

    if (roomData.status !== "waiting") {
      setError("This room is no longer accepting participants");
      return;
    }

    if (participants.length >= (roomData.maxParticipants || 50)) {
      setError("Room is full");
      return;
    }

    // Check if user already joined
    const alreadyJoined = participants.some((p) => p.userId === user.uid);
    if (alreadyJoined) {
      setSuccess("You're already in this room!");
      setHasJoined(true);
      return;
    }

    // Check if name is already taken
    const nameTaken = participants.some(
      (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (nameTaken) {
      setError("This name is already taken. Please choose a different name.");
      return;
    }

    setIsJoining(true);
    setError("");

    try {
      const participantData = {
        userId: user.uid,
        name: trimmedName,
        joinedAt: new Date(),
        score: 0,
        answers: [],
      };

      await updateDoc(doc(db, "quizRooms", roomId), {
        participants: arrayUnion(participantData),
      });

      setSuccess(`Welcome ${trimmedName}! Waiting for the game to start...`);
      setHasJoined(true);
    } catch (error) {
      console.error("Error joining room:", error);
      if (error.code === "permission-denied") {
        setError("You don't have permission to join this room.");
      } else if (error.code === "unavailable") {
        setError(
          "Service temporarily unavailable. Please try again in a moment."
        );
      } else {
        setError(
          "Failed to join room. Please check your connection and try again."
        );
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveRoom = () => {
    navigate("/chapters");
  };

  if (loading) {
    return (
      <div className="wrapper-m">
        <CloseButton />

        <div className="join_room_container">
          <div className="loading_container">
            <LoadingSpinner />
            <h2>Loading room details...</h2>
            <p>Please wait while we fetch the quiz information</p>

            {retryCount > 0 && (
              <div className="retry_info">
                <span>⚠️ Connection issues detected</span>
                <p>Retrying... ({retryCount}/3)</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="wrapper-m">
        <CloseButton />
        <div className="join_room_container">
          <div className="error_message">
            Room not found or has ended. Redirecting...
          </div>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (roomData.status) {
      case "waiting":
        return {
          icon: "⏳",
          message: "Waiting for Host",
          description: "The host will start the game soon",
          className: "status_waiting",
        };
      case "active":
        return {
          icon: "🎮",
          message: "Game in Progress",
          description: "Quiz has started!",
          className: "status_active",
        };
      case "completed":
        return {
          icon: "🏁",
          message: "Game Completed",
          description: "This game has ended",
          className: "status_completed",
        };
      default:
        return {
          icon: "❓",
          message: "Unknown Status",
          description: "",
          className: "",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="wrapper-m">
      <CloseButton />

      <div className="join_room_container">
        {/* Room Header */}
        <div className="join_room_header">
          <h1>🎯 Join Quiz Room</h1>
          <div className="room_code_display">
            Room Code: <strong>{roomData.code}</strong>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && <div className="error_message">{error}</div>}
        {success && <div className="success_message">{success}</div>}

        {/* Room Information */}
        <div className="room_info_section">
          <h2>📚 Quiz Details</h2>
          <div className="lesson_info">
            <h3>{roomData.lessonName || "Unknown Lesson"}</h3>
            <p>
              Test your knowledge and compete with other players in this
              interactive quiz session!
            </p>
          </div>

          <div className="quiz_stats">
            <div className="stat_item">
              <span className="stat_number">
                {roomData.questions?.length || 0}
              </span>
              <div className="stat_label">Questions</div>
            </div>
            <div className="stat_item">
              <span className="stat_number">{participants.length}</span>
              <div className="stat_label">Players</div>
            </div>
            <div className="stat_item">
              <span className="stat_number">
                {roomData.maxParticipants || 50}
              </span>
              <div className="stat_label">Max Players</div>
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="game_status">
          <span className={`status_icon ${statusInfo.className}`}>
            {statusInfo.icon}
          </span>
          <div className={`status_message ${statusInfo.className}`}>
            {statusInfo.message}
          </div>
          <div className="status_description">{statusInfo.description}</div>
        </div>

        {/* Player Setup (only show if not joined and room is waiting) */}
        {!hasJoined && roomData.status === "waiting" && (
          <div className="player_setup_section">
            <h2>👤 Enter Your Name</h2>
            <div className="name_input_group">
              <label htmlFor="playerName">Display Name:</label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name..."
                className="player_name_input"
                maxLength={20}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isJoining) {
                    handleJoinRoom();
                  }
                }}
              />
            </div>

            <div className="join_controls">
              <button
                onClick={handleJoinRoom}
                disabled={
                  isJoining ||
                  !playerName.trim() ||
                  roomData.status !== "waiting"
                }
                className="join_room_btn"
              >
                {isJoining ? "Joining..." : "Join Game"}
              </button>
              <button onClick={handleLeaveRoom} className="cancel_join_btn">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Joined Status */}
        {hasJoined && roomData.status === "waiting" && (
          <div className="player_setup_section">
            <h2>✅ You're In!</h2>
            <p
              style={{
                textAlign: "center",
                color: "#666",
                marginBottom: "20px",
              }}
            >
              Waiting for the host to start the game...
            </p>
            <div className="join_controls">
              <button onClick={handleLeaveRoom} className="cancel_join_btn">
                Leave Room
              </button>
            </div>
          </div>
        )}

        {/* Room Full or Closed */}
        {roomData.status !== "waiting" && !hasJoined && (
          <div className="player_setup_section">
            <h2>🚫 Cannot Join</h2>
            <p
              style={{
                textAlign: "center",
                color: "#666",
                marginBottom: "20px",
              }}
            >
              {roomData.status === "active"
                ? "The game has already started"
                : "This room is no longer active"}
            </p>
            <div className="join_controls">
              <button onClick={handleLeaveRoom} className="cancel_join_btn">
                Back to Chapters
              </button>
            </div>
          </div>
        )}

        {/* Participants Preview */}
        <div className="participants_preview">
          <h3>👥 Players in Room ({participants.length})</h3>
          <div className="participants_list">
            {participants.length === 0 ? (
              <div className="no_participants_preview">No players yet</div>
            ) : (
              participants.map((participant, index) => (
                <div key={index} className="participant_preview_card">
                  <div className="participant_preview_avatar">
                    {participant.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="participant_preview_name">
                    {participant.name || "Anonymous"}
                    {participant.userId === user?.uid && " (You)"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinRoom;
