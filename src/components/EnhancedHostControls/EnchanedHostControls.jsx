import React, { useState } from "react";
import "./EnhancedHostControls.css";

const EnhancedHostControls = ({
  roomData,
  participants,
  currentQuestion,
  gameStarted,
  showResults,
  isProcessing,
  onStartGame,
  onNextQuestion,
  onPauseGame,
  onEndGame,
  onSkipQuestion,
}) => {
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const totalQuestions = roomData?.questions?.length || 0;
  const canStart = participants.length > 0 && !gameStarted;
  const canContinue =
    gameStarted && !showResults && currentQuestion < totalQuestions - 1;
  const canFinish =
    gameStarted && !showResults && currentQuestion >= totalQuestions - 1;

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
    if (onPauseGame) {
      onPauseGame(!isPaused);
    }
  };

  const handleEndGameClick = () => {
    setShowConfirmEnd(true);
  };

  const handleConfirmEnd = () => {
    setShowConfirmEnd(false);
    onEndGame();
  };

  const handleCancelEnd = () => {
    setShowConfirmEnd(false);
  };

  if (showResults) {
    return (
      <div className="host_controls_container">
        <div className="control_section">
          <h3>🎉 Game Complete!</h3>
          <p>
            All questions have been answered. Check out the final results above.
          </p>

          <div className="control_buttons">
            <button onClick={onEndGame} className="primary_btn end_btn">
              📊 View Detailed Results
            </button>
            <button onClick={onEndGame} className="secondary_btn">
              🏠 Back to Chapters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="host_controls_container">
      {!gameStarted ? (
        /* Pre-Game Controls */
        <div className="control_section waiting_controls">
          <h3>🎯 Ready to Start?</h3>
          <p>
            {participants.length === 0
              ? "Waiting for participants to join..."
              : `${participants.length} player${
                  participants.length !== 1 ? "s" : ""
                } ready to play!`}
          </p>

          <div className="game_info">
            <div className="info_stat">
              <span className="stat_number">{totalQuestions}</span>
              <span className="stat_label">Questions</span>
            </div>
            <div className="info_stat">
              <span className="stat_number">{participants.length}</span>
              <span className="stat_label">Players</span>
            </div>
            <div className="info_stat">
              <span className="stat_number">{roomData?.code || "------"}</span>
              <span className="stat_label">Room Code</span>
            </div>
          </div>

          <div className="control_buttons">
            <button
              onClick={onStartGame}
              disabled={!canStart || isProcessing}
              className={`primary_btn start_btn ${
                isProcessing ? "loading" : ""
              }`}
            >
              {isProcessing ? (
                <>
                  <span className="loading_spinner"></span>
                  Starting...
                </>
              ) : (
                <>
                  🚀 Start Game
                  {participants.length > 0 &&
                    ` (${participants.length} players)`}
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* In-Game Controls */
        <div className="control_section game_controls">
          <div className="progress_header">
            <h3>
              Question {currentQuestion + 1} of {totalQuestions}
            </h3>
            <div className="progress_bar_container">
              <div
                className="progress_bar"
                style={{
                  width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="control_buttons">
            {/* Pause/Resume Button */}
            <button
              onClick={handlePauseToggle}
              className={`secondary_btn pause_btn ${isPaused ? "paused" : ""}`}
              disabled={isProcessing}
            >
              {isPaused ? "▶️ Resume" : "⏸️ Pause"}
            </button>

            {/* Skip Question Button */}
            <button
              onClick={onSkipQuestion}
              className="secondary_btn skip_btn"
              disabled={isProcessing}
            >
              ⏭️ Skip
            </button>

            {/* Next/Finish Button */}
            {canContinue ? (
              <button
                onClick={onNextQuestion}
                disabled={isProcessing}
                className={`primary_btn next_btn ${
                  isProcessing ? "loading" : ""
                }`}
              >
                {isProcessing ? (
                  <>
                    <span className="loading_spinner"></span>
                    Loading...
                  </>
                ) : (
                  "➡️ Next Question"
                )}
              </button>
            ) : canFinish ? (
              <button
                onClick={onNextQuestion}
                disabled={isProcessing}
                className={`primary_btn finish_btn ${
                  isProcessing ? "loading" : ""
                }`}
              >
                {isProcessing ? (
                  <>
                    <span className="loading_spinner"></span>
                    Finishing...
                  </>
                ) : (
                  "🏁 Finish Game"
                )}
              </button>
            ) : null}

            {/* End Game Button */}
            <button
              onClick={handleEndGameClick}
              className="danger_btn end_early_btn"
              disabled={isProcessing}
            >
              🛑 End Early
            </button>
          </div>

          {/* Game Stats */}
          <div className="game_stats">
            <div className="stat_item">
              <span className="stat_icon">👥</span>
              <span className="stat_text">{participants.length} Active</span>
            </div>
            <div className="stat_item">
              <span className="stat_icon">⏱️</span>
              <span className="stat_text">{isPaused ? "Paused" : "Live"}</span>
            </div>
            <div className="stat_item">
              <span className="stat_icon">📊</span>
              <span className="stat_text">
                {Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%
                Complete
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmEnd && (
        <div className="confirmation_overlay">
          <div className="confirmation_modal">
            <h3>⚠️ End Game Early?</h3>
            <p>
              Are you sure you want to end the game? This action cannot be
              undone.
            </p>
            <div className="confirmation_buttons">
              <button onClick={handleCancelEnd} className="secondary_btn">
                Cancel
              </button>
              <button onClick={handleConfirmEnd} className="danger_btn">
                Yes, End Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedHostControls;
