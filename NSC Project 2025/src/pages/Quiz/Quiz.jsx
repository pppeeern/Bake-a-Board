import { useState } from "react";
import "./Quiz.css";
import CloseButton from "../../components/closeButton/CloseButton";
import Choice from "./quizzes/choice/Choice";

function Quiz() {
  const [showEachResult, setShowEachResult] = useState(false);

  const renderEachResult = () => {
    return (
      <div id="quiz_each_result" className="flex-row">
        <div className="flex-column">
          <div id="quiz_each_result_status">Correct!</div>
          <div id="quiz_each_result_detail">Detail...</div>
        </div>
        <button>Next</button>
      </div>
    );
  };

  return (
    <div className="wrapper-m">
      <CloseButton />
      <div className="quiz_container">
        <Choice />
      </div>

      {showEachResult ? (
        renderEachResult()
      ) : (
        <div id="quiz_navigator" className="flex-row">
          <button>Skip</button>
          <div className="quiz_progress_container">
            <span id="quiz_progress">1</span>
            <span>/</span>
            <span id="quiz_total">10</span>
          </div>
          <button onClick={() => setShowEachResult(true)}>Check</button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
