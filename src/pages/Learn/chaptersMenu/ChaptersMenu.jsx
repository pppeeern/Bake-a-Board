import "./ChaptersMenu.css";
import ChaptersCard from "../chaptersCard/ChaptersCard";
import CloseButton from "../../../components/closeButton/CloseButton";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";
import HostQuizModal from "./HostQuizModal";
import { useUserData } from "../../../services/UserDataContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";

function ChaptersMenu({ setChapter, selectedChapter }) {
  const { chapters, loading } = useUserData();
  const navigate = useNavigate();
  const [showHostModal, setShowHostModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const handleHostQuiz = () => {
    setShowHostModal(true);
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) {
      alert("Please enter a room code");
      return;
    }

    try {
      const roomsRef = collection(db, "quizRooms");
      const q = query(
        roomsRef,
        where("code", "==", parseInt(joinCode)),
        where("status", "in", ["waiting", "active"])
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Room not found or no longer active.");
        return;
      }

      const roomDoc = querySnapshot.docs[0];
      const roomData = roomDoc.data();

      navigate(`/join-room/${roomDoc.id}`, {
        state: {
          roomData: {
            id: roomDoc.id,
            ...roomData,
          },
        },
      });
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Failed to join room. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="wrapper-m">
        <CloseButton />
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wrapper-m">
        <CloseButton />
        <div id="chapters_container_top" className="flex-row">
          <div className="chapters_container_top_button">
            <button onClick={handleHostQuiz}>+ Host Quiz</button>
          </div>
          <div className="chapters_container_top_button" id="join_quiz">
            <input
              type="number"
              name="room_code"
              placeholder="Room Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <button className="side" onClick={handleJoinRoom}>
              Join
            </button>
          </div>
        </div>
        <div id="chapters_card_container">
          {chapters.map((chapter) => (
            <ChaptersCard
              key={chapter.id}
              chapter={chapter}
              selectedChapter={selectedChapter}
              onSelect={() => setChapter(chapter)}
            />
          ))}
        </div>
      </div>

      <HostQuizModal
        isOpen={showHostModal}
        onClose={() => setShowHostModal(false)}
      />
    </>
  );
}

export default ChaptersMenu;
