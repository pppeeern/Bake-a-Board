import { useEffect, useState } from "react";
import "./Quiz.css";
import CloseButton from "../../components/closeButton/CloseButton";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";

import Choice from "./quizzes/choice/Choice";
import Match from "./quizzes/match/Match";
import Fill from "./quizzes/fill/Fill";

import { quizData } from "../Learn/data/quizData";
import { useNavigate, useParams } from "react-router-dom";
import { useUserData } from "../../services/UserDataContext";

function Quiz() {
  const navigate = useNavigate();
  const { chapterId, lessonId } = useParams();
  const { updateLessonProgress, completeQuiz, giveRewards, getLessonById } =
    useUserData();
  const quizSelector = `${chapterId}/${lessonId}`;

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showEachResult, setShowEachResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [isProcessingCompletion, setIsProcessingCompletion] = useState(false);

  // get lesson's quiz data
  useEffect(() => {
    const quiz = quizData[quizSelector];
    if (!quiz) {
      console.error(`Quiz not found at ${quizSelector}`);
      return;
    }

    const ordered = quiz.filter((q) => !isNaN(q.order));
    const unordered = quiz.filter((q) => isNaN(q.order));

    const sortedOrdered = ordered.sort((a, b) => a.order - b.order);
    const shuffledUnordered = unordered.sort(() => Math.random() - 0.5);

    setQuestions([...sortedOrdered, ...shuffledUnordered]);
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

  const handleComplete = async () => {
    if (isProcessingCompletion) return;

    setIsProcessingCompletion(true);

    try {
      const scorePercentage = (score / totalQuestions) * 100;
      const currentLesson = getLessonById(quizSelector);

      let result = { success: true, progressIncremented: false };

      console.log(`Starting quiz completion for ${quizSelector}`);
      console.log(
        `Score: ${score}/${totalQuestions} (${Math.round(scorePercentage)}%)`
      );

      if (scorePercentage >= 50 && currentLesson) {
        console.log("Score meets threshold, updating progress...");

        const newCompleted = Math.min(
          currentLesson.progress.completed + 1,
          currentLesson.progress.total
        );

        const progressResult = await updateLessonProgress(
          quizSelector,
          newCompleted
        );
        console.log("Progress update result:", progressResult);

        if (progressResult.success) {
          result.progressIncremented = true;
          result.newProgress = newCompleted;

          if (newCompleted >= currentLesson.progress.total) {
            console.log("Lesson completed, marking as finished...");
            const completeResult = await completeQuiz(quizSelector);
            console.log("Complete result:", completeResult);

            if (completeResult.success) {
              console.log("Giving rewards...");
              await giveRewards({ exp: 50, cookies: 10 });
              result.lessonCompleted = true;
              result.nextLessonUnlocked = completeResult.nextLessonUnlocked;
              result.nextChapterUnlocked = completeResult.nextChapterUnlocked;
            }
          }
        }
      } else {
        result.message =
          scorePercentage < 50
            ? "Score too low to count as progress (need ≥50%)"
            : "Unknown error";
      }

      console.log("Final result:", result);
      console.log("Navigating back to home...");

      setTimeout(() => {
        navigate("/", {
          state: {
            completed: quizSelector,
            quizResult: result,
            score: score,
            total: totalQuestions,
            percentage: Math.round(scorePercentage),
            message: result.progressIncremented
              ? `Great job! You scored ${score}/${totalQuestions} (${Math.round(
                  scorePercentage
                )}%) - Progress updated!`
              : result.message ||
                `You scored ${score}/${totalQuestions} (${Math.round(
                  scorePercentage
                )}%)`,
          },
        });
      }, 100);
    } catch (error) {
      console.error("Error completing quiz:", error);
      setTimeout(() => {
        navigate("/", {
          state: {
            completed: quizSelector,
            error: "Failed to update progress: " + error.message,
            score: score,
            total: totalQuestions,
          },
        });
      }, 100);
    } finally {
    }
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
      case "fill":
        return (
          <Fill
            question={question}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
            showEachResult={showEachResult}
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
          <button onClick={handleNext}>Skip</button>
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

  const getScoreColor = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 80) return "success";
    if (percentage >= 50) return "warning";
    return "danger";
  };

  const getScoreMessage = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 80) return "Excellent work! 🎉";
    if (percentage >= 50) return "Good job! Keep practicing! 👍";
    return "Keep studying! You'll get it next time! 💪";
  };

  return (
    <div className="wrapper-m">
      <CloseButton />
      {isComplete ? (
        <div className="quiz_complete_container">
          <div className="quiz_complete_header">
            <div>{getScoreMessage()}</div>
            <div className={`quiz_complete_text ${getScoreColor()}`}>
              <span id="quiz_progress">{score}</span>
              <span>/</span>
              <span id="quiz_total">{questions.length}</span>
              <span className="percentage">
                ({Math.round((score / totalQuestions) * 100)}%)
              </span>
            </div>
            {score / totalQuestions >= 0.5 ? (
              <div className="progress_info">✓ Progress will be updated!</div>
            ) : (
              <div className="progress_info warning">
                ⚠ Need ≥50% to count as progress
              </div>
            )}
          </div>

          <button
            className="primary"
            onClick={handleComplete}
            disabled={isProcessingCompletion}
          >
            {isProcessingCompletion ? "Updating Progress..." : "Complete"}
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
