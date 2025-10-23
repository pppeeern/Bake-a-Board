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

  const handleHostQuiz = () => {
    setShowHostModal(true);
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
