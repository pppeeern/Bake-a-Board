import "./Choice.css";

function Choice({
  question,
  selectedAnswer,
  setSelectedAnswer,
  showEachResult,
}) {
  return (
    <div id="choice_container">
      <div id="choice_question_container">
        <div id="quiz_question">{question.question}</div>
        {/* <div id="quiz_question_img"></div> */}
      </div>
      <div id="choice_answer_container" className="flex-col">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`choice_answer ${
              selectedAnswer === index ? "selected" : ""
            }`}
            onClick={() => {
              if (selectedAnswer !== index) setSelectedAnswer(index);
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
