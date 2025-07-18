import { useEffect, useState } from "react";
import "./Quiz.css";
import CloseButton from "../../components/closeButton/CloseButton";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";
import Choice from "./quizzes/choice/Choice";

import { quizData } from "../Learn/data/quizData";
import { useNavigate, useParams } from "react-router-dom";

function Quiz() {
  const navigate = useNavigate();
  const { chapterId, lessonId } = useParams();
  const quizSelector = `${chapterId}/${lessonId}`;

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showEachResult, setShowEachResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const quiz = quizData[quizSelector];
    if (quiz) {
      setQuestions(quiz);
    } else {
      console.error(`Quiz not found at ${quizSelector}`);
    }
  }, [quizSelector]);

  if (!questions.length) return <LoadingSpinner />;

  const totalQuestions = questions.length;
  const question = questions[currentQuestion];

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    const correct = selectedAnswer === question.answer;
    if (correct) setScore(score + 1);
    setIsCorrect(correct);
    setShowEachResult(true);
  };

  const handleNext = () => {
    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setShowEachResult(false);
      setSelectedAnswer(null);
    } else {
      setIsComplete(true);
    }
  };

  const handleComplete = () => {
    console.log(`Navigating with completed lesson: ${quizSelector}`);
    navigate("/", {
      state: {
        completed: quizSelector,
        //   score: score,
        //   total: totalQuestions,
        //   message: `Great job! You scored ${score}/${totalQuestions}`
      },
    });
  };

  if (isComplete) {
    return (
      <div className="wrapper-m">
        <div className="quiz_complete_container">
          <div>Your score:</div>
          <div className="quiz_complete_text">
            <span id="quiz_progress">{score}</span>
            <span>/</span>
            <span id="quiz_total">{questions.length}</span>
          </div>
          <button className="primary" onClick={handleComplete}>
            Back
          </button>
        </div>
      </div>
    );
  }

  const renderEachResult = () => {
    return (
      <div id="quiz_each_result" className="flex-row">
        <div className="flex-column">
          <div id="quiz_each_result_status">
            {isCorrect ? "Correct!" : "Incorrect"}
          </div>
          <div id="quiz_each_result_detail">{question.explanation || ""}</div>
        </div>
        {currentQuestion < totalQuestions - 1 ? (
          <button
            onClick={handleNext}
            className={isCorrect ? "success" : "danger"}
          >
            Next
          </button>
        ) : (
          <button onClick={handleNext} className="success">
            Complete
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="wrapper-m">
      <CloseButton />

      <div className="quiz_container">
        <Choice
          question={question}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          showEachResult={showEachResult}
        />
      </div>

      {showEachResult ? (
        renderEachResult()
      ) : (
        <div id="quiz_navigator" className="flex-row">
          {/* <button onClick={handleNext}>Skip</button> */}
          <div className="quiz_progress_container">
            <span id="quiz_progress">{currentQuestion + 1}</span>
            <span>/</span>
            <span id="quiz_total">{questions.length}</span>
          </div>
          <button
            onClick={handleCheck}
            disabled={selectedAnswer === null}
            className={`primary ${selectedAnswer === null ? "disable" : ""}`}
          >
            Check
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
