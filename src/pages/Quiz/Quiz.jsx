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
  const { completeQuizWithRewards, getLessonById } = useUserData();
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

      console.log(`Starting quiz completion for ${quizSelector}`);
      console.log(
        `Score: ${score}/${totalQuestions} (${Math.round(scorePercentage)}%)`
      );

      const result = await completeQuizWithRewards(
        quizSelector,
        score,
        totalQuestions
      );
      console.log("Quiz completion result:", result);

      const navigationState = {
        completed: quizSelector,
        score: score,
        total: totalQuestions,
        percentage: Math.round(scorePercentage),
        quizResult: result,
      };

      if (result.success && result.progressIncremented) {
        let message = `Great job! You scored ${score}/${totalQuestions} (${Math.round(
          scorePercentage
        )}%)`;

        if (result.rewards && result.rewards.newReward) {
          message += `\n🍪 +${result.rewards.cookies} cookies | ⭐ +${result.rewards.exp} XP`;

          if (result.rewards.lessonCompleteBonus) {
            message += `\n🎉 Lesson Complete Bonus!`;
          }

          if (scorePercentage === 100) {
            message += `\n✨ Perfect Score Bonus!`;
          }
        } else if (result.alreadyRewarded) {
          message += `\n(No rewards - already completed this quiz)`;
        }

        navigationState.message = message;
        navigationState.rewards = result.rewards;
      } else {
        navigationState.message =
          result.message ||
          `You scored ${score}/${totalQuestions} (${Math.round(
            scorePercentage
          )}%)`;
      }

      console.log("Navigating back to home with state:", navigationState);

      setTimeout(() => {
        navigate("/", { state: navigationState });
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

  const getPotentialRewards = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage < 50) return null;

    let cookies = 5;
    let exp = Math.round(percentage);

    if (percentage === 100) {
      cookies += 5;
      exp += 25;
    }

    const currentLesson = getLessonById(quizSelector);
    const willCompletLesson =
      currentLesson &&
      currentLesson.progress.completed + 1 >= currentLesson.progress.total;

    if (willCompletLesson) {
      cookies += 20;
      exp += 100;
    }

    return {
      cookies,
      exp,
      willCompletLesson,
      lessonProgress: currentLesson
        ? `${currentLesson.progress.completed + 1}/${
            currentLesson.progress.total
          }`
        : null,
    };
  };

  const potentialRewards = getPotentialRewards();

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
              <div className="progress_info">
                ✓ Progress will be updated!
                {potentialRewards && (
                  <div className="reward_preview">
                    🍪 +{potentialRewards.cookies} cookies | ⭐ +
                    {potentialRewards.exp} XP
                    {potentialRewards.lessonProgress && (
                      <div className="progress_display">
                        Progress: {potentialRewards.lessonProgress}
                      </div>
                    )}
                    {score === totalQuestions && (
                      <div className="perfect_bonus">
                        ✨ Perfect Score Bonus!
                      </div>
                    )}
                    {potentialRewards.willCompletLesson && (
                      <div className="lesson_complete_bonus">
                        🎉 Lesson Complete Bonus! (+20 🍪 +100 ⭐)
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="progress_info warning">
                ⚠ Need ≥50% to count as progress and earn rewards
              </div>
            )}
          </div>

          <button
            className="primary"
            onClick={handleComplete}
            disabled={isProcessingCompletion}
          >
            {isProcessingCompletion ? "Processing..." : "Complete"}
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
