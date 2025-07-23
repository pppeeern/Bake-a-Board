import { useEffect, useState } from "react";
import "./Fill.css";

function Fill({ question, selectedAnswer, setSelectedAnswer, showEachResult }) {
  const [options, setOptions] = useState([]);
  const originalQuestion = question.question;

  useEffect(() => {
    const shuffled = [...question.options]
      .map((option) => ({ option, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ option }) => option);

    setOptions(shuffled);
    setSelectedAnswer(null);
  }, [question]);

  return (
    <div className="fill_container">
      <div className="quiz_question">
        {originalQuestion.split("_").map((part, index) => (
          <span key={index}>
            {part}
            {index === 0 && (
              <span className={`fill_blank ${!selectedAnswer ? "locked" : ""}`}>
                {selectedAnswer || "\u00A0"}
              </span>
            )}
          </span>
        ))}
      </div>

      <div className="fill_options_container">
        {options.map((option, i) => (
          <button
            key={i}
            className={`quiz_option ${
              selectedAnswer === option ? "selected" : ""
            }`}
            onClick={() =>
              setSelectedAnswer(selectedAnswer === option ? null : option)
            }
            disabled={showEachResult}
          >
            <span>{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Fill;
