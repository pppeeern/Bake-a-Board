import React, { useState, useEffect } from "react";
import "./LiveLeaderboard.css";

const LiveLeaderboard = ({ participants, currentQuestion, isGameActive }) => {
  const [sortedParticipants, setSortedParticipants] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const sorted = [...participants]
      .sort((a, b) => {
        // Sort by score first
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        // Then by speed (earlier answers rank higher)
        const aLatestAnswer = a.answers?.[currentQuestion - 1];
        const bLatestAnswer = b.answers?.[currentQuestion - 1];

        if (aLatestAnswer && bLatestAnswer) {
          return (
            new Date(aLatestAnswer.answeredAt) -
            new Date(bLatestAnswer.answeredAt)
          );
        }

        return 0;
      })
      .slice(0, 10); // Show top 10

    setSortedParticipants(sorted);

    if (isGameActive) {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 1000);
    }
  }, [participants, currentQuestion, isGameActive]);

  const getScoreColor = (score, maxScore) => {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    if (percentage >= 80) return "#4caf50";
    if (percentage >= 60) return "#ff9800";
    if (percentage >= 40) return "#ff6b35";
    return "#f44336";
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className={`leaderboard_container ${showAnimation ? "updating" : ""}`}>
      <div className="leaderboard_header">
        <h3>🏆 Live Leaderboard</h3>
        <span className="participant_count">
          {participants.length} player{participants.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="leaderboard_list">
        {sortedParticipants.length === 0 ? (
          <div className="no_participants">
            <span className="empty_icon">👥</span>
            <p>No participants yet</p>
          </div>
        ) : (
          sortedParticipants.map((participant, index) => {
            const rank = index + 1;
            const maxPossibleScore = Math.max(currentQuestion, 1);
            const accuracy =
              maxPossibleScore > 0
                ? Math.round((participant.score / maxPossibleScore) * 100)
                : 0;

            return (
              <div
                key={participant.userId || index}
                className={`leaderboard_item rank_${rank}`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  borderColor:
                    rank <= 3
                      ? getScoreColor(participant.score, maxPossibleScore)
                      : "#e9ecef",
                }}
              >
                <div className="rank_badge">
                  {rank <= 3 ? getRankBadge(rank) : rank}
                </div>

                <div className="participant_info">
                  <div className="participant_avatar">
                    {participant.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="participant_details">
                    <div className="participant_name">
                      {participant.name || "Anonymous"}
                    </div>
                    <div className="participant_stats">
                      {accuracy}% accuracy
                    </div>
                  </div>
                </div>

                <div className="score_info">
                  <div className="current_score">{participant.score}</div>
                  <div className="score_label">points</div>
                </div>

                <div className="progress_indicator">
                  <div
                    className="progress_bar"
                    style={{
                      width: `${accuracy}%`,
                      backgroundColor: getScoreColor(
                        participant.score,
                        maxPossibleScore
                      ),
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {participants.length > 10 && (
        <div className="more_participants">
          +{participants.length - 10} more participant
          {participants.length - 10 !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default LiveLeaderboard;
