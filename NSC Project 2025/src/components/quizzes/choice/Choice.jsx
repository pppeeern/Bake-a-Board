import "./Choice.css";

function Choice() {
  return (
    <div id="choice_container">
      <div id="choice_question_container">
        <div id="quiz_question">What is this?</div>
        <div id="quiz_question_img"></div>
      </div>
      <div id="choice_answer_container" className="flex-col">
        <button className="choice_answer">choice</button>
        <button className="choice_answer">choice</button>
        <button className="choice_answer">choice</button>
        <button className="choice_answer">choice</button>
      </div>
    </div>
  );
}

export default Choice;
