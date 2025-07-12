import "./Quiz.css";
import CloseButton from "../../components/closeButton/CloseButton";
import Choice from "../../components/quizzes/choice/Choice";

function Quiz() {
  return (
    <div className="wrapper-m">
      <CloseButton />
      <div className="quiz_container">
        <Choice />
      </div>
      <div id="quiz_navigator" className="flex-row">
        <button>Skip</button>
        <div className="quiz_progress_container">
          <span id="quiz_progress">1</span>
          <span>/</span>
          <span id="quiz_total">10</span>
        </div>
        <button>Check</button>
      </div>
    </div>
  );
}

export default Quiz;
