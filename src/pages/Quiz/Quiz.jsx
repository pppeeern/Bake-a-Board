import { useEffect, useState } from "react";
import "./Quiz.css";
import CloseButton from "../../components/closeButton/CloseButton";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";

import Choice from "./quizzes/choice/Choice";
import Match from "./quizzes/match/Match";

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

  // get lesson's quiz data
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
  const isMatchType = question.type === "match";

  const plusScore = () => {
    setScore(score + 1);
  };

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    const correct = selectedAnswer === question.answer;
    if (correct) plusScore();
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

  const renderQuestion = () => {
    switch (question.type) {
      case "choice":
        return (
          <Choice
            question={question}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
            showEachResult={showEachResult}
          />
        );
      case "match":
        return (
          <Match
            question={question}
            setSelectedAnswer={setSelectedAnswer}
            plusScore={plusScore}
          />
        );
      default:
        return <div>Unknown question type</div>;
    }
  };

  const renderNavigator = () => {
    return (
      <>
        <div id="quiz_navigator" className="flex-row">
          <div className="quiz_progress_container">
            <span id="quiz_progress">{currentQuestion + 1}</span>
            <span>/</span>
            <span id="quiz_total">{questions.length}</span>
          </div>
          <button
            onClick={isMatchType ? handleNext : handleCheck}
            disabled={selectedAnswer === null}
            className={`primary ${selectedAnswer === null ? "disable" : ""}`}
          >
            {isMatchType ? "Next" : "Check"}
          </button>
        </div>
      </>
    );
  };

  const renderEachResult = () => {
    // setSelectedAnswer(null);
    return (
      <>
        <div id="quiz_each_result" className="flex-row">
          <div className="flex-column">
            <div id="quiz_each_result_status">
              {isCorrect ? "Correct!" : "Incorrect"}
            </div>
            <div id="quiz_each_result_detail">{question.explanation || ""}</div>
          </div>
          <button
            onClick={handleNext}
            className={isCorrect ? "success" : "danger"}
          >
            Next
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="wrapper-m">
      <CloseButton />
      {isComplete ? (
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
      ) : (
        <>
          <div className="quiz_container">{renderQuestion()}</div>
          {showEachResult ? renderEachResult() : renderNavigator()}
        </>
      )}
    </div>
  );
}

export default Quiz;
