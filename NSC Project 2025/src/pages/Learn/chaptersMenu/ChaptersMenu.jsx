import "./ChaptersMenu.css";
import ChaptersCard from "../chaptersCard/ChaptersCard";
import CloseButton from "../../../components/closeButton/CloseButton";

function Chapters() {
  return (
    <div className="wrapper-m">
      <CloseButton />
      <div id="chapters_container_top" className="flex-row dashed">
        <div className="chapters_container_top_button">
          <button onClick={() => console.log("Create")}>+ Create Quiz</button>
        </div>
        <div className="chapters_container_top_button" id="join_quiz">
          <input type="number" name="quiz_code" />
          <button onClick={() => console.log("Join!")}>Join</button>
        </div>
      </div>
      <div id="chapters_card_container">
        <ChaptersCard />
        <ChaptersCard className="chapters_card active" />
        <ChaptersCard className="learned" />
        <ChaptersCard />
        <ChaptersCard />
        <ChaptersCard />
        <ChaptersCard />
        <ChaptersCard />
      </div>
    </div>
  );
}

export default Chapters;
