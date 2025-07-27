import "./ChaptersMenu.css";
import ChaptersCard from "../chaptersCard/ChaptersCard";
import CloseButton from "../../../components/closeButton/CloseButton";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";
import { useUserData } from "../../../services/UserDataContext";

function ChaptersMenu({ setChapter, selectedChapter }) {
  const { chapters, loading } = useUserData();

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
    <div className="wrapper-m">
      <CloseButton />
      <div id="chapters_container_top" className="flex-row">
        <div className="chapters_container_top_button">
          <button onClick={() => console.log("Create")}>+ Create Quiz</button>
        </div>
        <div className="chapters_container_top_button" id="join_quiz">
          <input type="number" name="quiz_code" placeholder="Quiz Code" />
          <button className="side" onClick={() => console.log("Join!")}>
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
  );
}

export default ChaptersMenu;
