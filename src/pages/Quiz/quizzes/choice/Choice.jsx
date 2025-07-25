import { useEffect, useState } from "react";
import "./Choice.css";

function Choice({
  question,
  selectedAnswer,
  setSelectedAnswer,
  showEachResult,
}) {
  const [option, setOption] = useState([]);

  useEffect(() => {
    const shuffled = [...question.options] // clone
      .map((option, index) => ({ option, index }))
      .sort(() => Math.random() - 0.5);
    setOption(shuffled);
    setSelectedAnswer(null);
  }, [question]);

  return (
    <div id="choice_container">
      <div id="choice_question_container">
        <div className="quiz_question">{question.question}</div>
        <div id="quiz_question_img"></div>
      </div>
      <div id="choice_answer_container" className="flex-col">
        {option.map(({ option }, i) => (
          <button
            key={i}
            className={`quiz_option ${
              selectedAnswer === option ? "selected" : ""
            }`}
            onClick={() => {
              if (selectedAnswer !== option) setSelectedAnswer(option);
              else setSelectedAnswer(null);
            }}
            disabled={showEachResult}
          >
            <span>{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Choice;
