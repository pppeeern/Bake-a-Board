import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./Quiz.css";

// Import your quiz questions data
import { quizData } from "../../Learn/data/quizData";

function Quiz() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [hearts, setHearts] = useState(3);

  const lessonData = location.state?.lessonData;

  useEffect(() => {
    // Get questions for this specific lesson
    const lessonQuestions = quizData[id] || [];
    setQuestions(lessonQuestions);

    // If no questions found, redirect back
    // if (lessonQuestions.length === 0) {
    //   navigate("/", {
    //     state: { message: "No questions available for this lesson." },
    //   });
    // }
  }, [id, navigate]);

  const handleAnswerSelect = (answerIndex) => {
    if (!showExplanation) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmit = () => {
    const correct = selectedAnswer === questions[currentQuestion].correctAnswer;

    if (correct) {
      setScore(score + 1);
    } else {
      setHearts(hearts - 1);
      if (hearts <= 1) {
        // Game over - redirect to learn page
        navigate("/", {
          state: { message: "Don't worry! Try again when you're ready." },
        });
        return;
      }
    }

    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleRetryQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setIsQuizComplete(false);
    setHearts(3);
  };

  const handleFinishQuiz = () => {
    const finalScore = score;
    const totalQuestions = questions.length;
    const passed = finalScore >= Math.ceil(totalQuestions * 0.7); // 70% to pass

    navigate("/", {
      state: {
        message: passed
          ? `🎉 Great job! You scored ${finalScore}/${totalQuestions}!`
          : `Keep practicing! You scored ${finalScore}/${totalQuestions}`,
        completedLesson: passed ? id : null,
      },
    });
  };

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (isQuizComplete) {
    const finalScore = score;
    const totalQuestions = questions.length;
    const percentage = Math.round((finalScore / totalQuestions) * 100);
    const passed = finalScore >= Math.ceil(totalQuestions * 0.7);

    return (
      <div className="quiz-container">
        <div className="quiz-complete">
          <h1>{passed ? "🎉" : "📚"} Quiz Complete!</h1>
          <div className="final-score">
            <h2>
              Your Score: {finalScore}/{totalQuestions}
            </h2>
            <div className={`score-percentage ${passed ? "passed" : "failed"}`}>
              {percentage}%
            </div>
            <p className="score-message">
              {passed
                ? "Excellent work! You've mastered this lesson!"
                : "Keep practicing to improve your score!"}
            </p>
          </div>
          <div className="quiz-actions">
            <button onClick={handleRetryQuiz} className="retry-button">
              Try Again
            </button>
            <button onClick={handleFinishQuiz} className="finish-button">
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="quiz-container">
      {/* Header */}
      <div className="quiz-header">
        <button
          onClick={() => navigate("/")}
          className="close-button"
          title="Exit Quiz"
        >
          ✕
        </button>
        <div className="progress-info">
          <span className="question-counter">
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
        <div className="hearts-container">
          {[...Array(3)].map((_, i) => (
            <span key={i} className={`heart ${i >= hearts ? "empty" : ""}`}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* Lesson Info */}
      {lessonData && (
        <div className="lesson-info">
          <h3>{lessonData.name}</h3>
        </div>
      )}

      {/* Question */}
      <div className="question-container">
        <h2 className="question-text">{currentQ.question}</h2>

        {currentQ.image && (
          <div className="question-image">
            <img src={currentQ.image} alt="Question visual" />
          </div>
        )}

        {/* Answer Options */}
        <div className="options-container">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${
                selectedAnswer === index ? "selected" : ""
              } ${
                showExplanation
                  ? index === currentQ.correctAnswer
                    ? "correct"
                    : selectedAnswer === index
                    ? "incorrect"
                    : ""
                  : ""
              }`}
              onClick={() => handleAnswerSelect(index)}
              disabled={showExplanation}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div
            className={`explanation ${
              selectedAnswer === currentQ.correctAnswer
                ? "correct"
                : "incorrect"
            }`}
          >
            <h3>
              {selectedAnswer === currentQ.correctAnswer
                ? "✅ Correct!"
                : "❌ Incorrect"}
            </h3>
            <p>{currentQ.explanation}</p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="quiz-actions">
        {!showExplanation ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="submit-button"
          >
            Check Answer
          </button>
        ) : (
          <button onClick={handleNext} className="next-button">
            {currentQuestion + 1 < questions.length ? "Continue" : "Finish"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz;
