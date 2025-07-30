import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import CloseButton from "../../components/closeButton/CloseButton";
import "./HostRoom.css";

function HostRoom() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Real-time custom quiz states
  const [isCustomQuiz, setIsCustomQuiz] = useState(false);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    type: "choice",
    question: "",
    options: ["", "", "", ""],
    answer: "",
    explanation: "",
    timeLimit: 30,
  });
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Question templates for quick insertion
  const questionTemplates = {
    choice: [
      {
        question:
          "What is the correct way to connect an LED to prevent damage?",
        options: [
          "With a resistor in series",
          "Directly to power",
          "With a capacitor",
          "In parallel",
        ],
        answer: "With a resistor in series",
        explanation:
          "LEDs need current limiting resistors to prevent damage from excessive current.",
      },
      {
        question: "Which component stores electrical energy?",
        options: ["Resistor", "Capacitor", "Wire", "Switch"],
        answer: "Capacitor",
        explanation:
          "Capacitors store electrical energy in an electric field between their plates.",
      },
    ],
    fill: [
      {
        question: "The formula for Ohm's Law is V = _ × R",
        answer: "I",
        explanation:
          "Ohm's Law states that Voltage equals Current times Resistance (V = I × R).",
      },
      {
        question: "A _ is used to control the flow of current in a circuit.",
        answer: "switch",
        explanation:
          "Switches open and close circuits to control current flow.",
      },
    ],
    "true-false": [
      {
        question:
          "Current flows from positive to negative in conventional current flow.",
        answer: "true",
        explanation:
          "By convention, current is said to flow from positive to negative, even though electrons actually move from negative to positive.",
      },
      {
        question: "Resistors in parallel have the same voltage across them.",
        answer: "true",
        explanation:
          "In parallel circuits, all components share the same voltage across their terminals.",
      },
    ],
  };

  // Load room data with custom quiz detection
  useEffect(() => {
    const loadRoomData = async () => {
      try {
        if (location.state?.roomData) {
          const roomData = location.state.roomData;
          setRoomData(roomData);
          setIsCustomQuiz(roomData.isCustomQuiz || false);
          setLoading(false);
          return;
        }

        const roomDoc = await getDoc(doc(db, "quizRooms", roomId));
        if (roomDoc.exists()) {
          const room = { id: roomDoc.id, ...roomDoc.data() };
          setRoomData(room);
          setIsCustomQuiz(room.isCustomQuiz || false);
        } else {
          console.error("Room not found");
          alert("Room not found");
          navigate("/chapters");
        }
      } catch (error) {
        console.error("Error loading room:", error);
        alert("Failed to load room");
        navigate("/chapters");
      } finally {
        setLoading(false);
      }
    };

    loadRoomData();
  }, [roomId, location.state, navigate]);

  // Enhanced real-time listener with question updates
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = onSnapshot(doc(db, "quizRooms", roomId), (doc) => {
      if (doc.exists()) {
        const updatedRoom = { id: doc.id, ...doc.data() };
        setRoomData(updatedRoom);
        setParticipants(updatedRoom.participants || []);

        // Update current question if it changed
        if (updatedRoom.currentQuestion !== undefined) {
          setCurrentQuestion(updatedRoom.currentQuestion);
        }

        // Update game state
        if (updatedRoom.status === "active") {
          setGameStarted(true);
        } else if (updatedRoom.status === "completed") {
          setShowResults(true);
        }
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleStartGame = async () => {
    if (!roomData || participants.length === 0) {
      alert("Need at least 1 participant to start");
      return;
    }

    if (roomData.questions.length === 0) {
      alert("Need at least 1 question to start the quiz");
      return;
    }

    try {
      await updateDoc(doc(db, "quizRooms", roomId), {
        status: "active",
        currentQuestion: 0,
        startedAt: new Date(),
      });

      setGameStarted(true);
      setCurrentQuestion(0);
    } catch (error) {
      console.error("Error starting game:", error);
      alert("Failed to start game");
    }
  };

  const handleNextQuestion = async () => {
    const nextQ = currentQuestion + 1;

    if (nextQ < roomData.questions.length) {
      try {
        await updateDoc(doc(db, "quizRooms", roomId), {
          currentQuestion: nextQ,
        });
        setCurrentQuestion(nextQ);
      } catch (error) {
        console.error("Error updating question:", error);
      }
    } else {
      // Game finished
      try {
        await updateDoc(doc(db, "quizRooms", roomId), {
          status: "completed",
          endedAt: new Date(),
        });
        setShowResults(true);
      } catch (error) {
        console.error("Error ending game:", error);
      }
    }
  };

  // Real-time question management
  const handleAddQuestion = async () => {
    if (!newQuestion.question.trim()) {
      alert("Please enter a question");
      return;
    }

    if (newQuestion.type === "choice") {
      const filledOptions = newQuestion.options.filter((opt) => opt.trim());
      if (filledOptions.length < 2) {
        alert("Please provide at least 2 answer options");
        return;
      }
      if (!newQuestion.answer) {
        alert("Please select the correct answer");
        return;
      }
    }

    if (newQuestion.type === "fill" && !newQuestion.answer.trim()) {
      alert("Please provide the correct answer");
      return;
    }

    if (newQuestion.type === "true-false" && !newQuestion.answer) {
      alert("Please select true or false");
      return;
    }

    setIsAddingQuestion(true);

    try {
      const questionToAdd = {
        ...newQuestion,
        id: Date.now(),
        order: roomData.questions.length + 1,
        // Filter empty options for choice questions
        options:
          newQuestion.type === "choice"
            ? newQuestion.options.filter((opt) => opt.trim())
            : newQuestion.options,
      };

      await updateDoc(doc(db, "quizRooms", roomId), {
        questions: arrayUnion(questionToAdd),
      });

      // Reset form
      resetQuestionForm();
      setShowQuestionEditor(false);
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question");
    } finally {
      setIsAddingQuestion(false);
    }
  };

  const handleEditQuestion = (question, index) => {
    setEditingQuestion(index);
    setNewQuestion({
      ...question,
      options: question.options || ["", "", "", ""],
    });
    setShowQuestionEditor(true);
  };

  const handleUpdateQuestion = async () => {
    if (!newQuestion.question.trim()) {
      alert("Please enter a question");
      return;
    }

    setIsAddingQuestion(true);

    try {
      // Remove old question and add updated one
      const oldQuestion = roomData.questions[editingQuestion];
      const updatedQuestion = {
        ...newQuestion,
        id: oldQuestion.id,
        order: oldQuestion.order,
        options:
          newQuestion.type === "choice"
            ? newQuestion.options.filter((opt) => opt.trim())
            : newQuestion.options,
      };

      // Create new questions array with updated question
      const updatedQuestions = [...roomData.questions];
      updatedQuestions[editingQuestion] = updatedQuestion;

      await updateDoc(doc(db, "quizRooms", roomId), {
        questions: updatedQuestions,
      });

      resetQuestionForm();
      setShowQuestionEditor(false);
      setEditingQuestion(null);
    } catch (error) {
      console.error("Error updating question:", error);
      alert("Failed to update question");
    } finally {
      setIsAddingQuestion(false);
    }
  };

  const handleRemoveQuestion = async (questionToRemove) => {
    if (window.confirm("Are you sure you want to remove this question?")) {
      try {
        await updateDoc(doc(db, "quizRooms", roomId), {
          questions: arrayRemove(questionToRemove),
        });
      } catch (error) {
        console.error("Error removing question:", error);
        alert("Failed to remove question");
      }
    }
  };

  const handleMoveQuestion = async (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    try {
      const questions = [...roomData.questions];
      const [movedQuestion] = questions.splice(fromIndex, 1);
      questions.splice(toIndex, 0, movedQuestion);

      // Update order numbers
      const reorderedQuestions = questions.map((q, index) => ({
        ...q,
        order: index + 1,
      }));

      await updateDoc(doc(db, "quizRooms", roomId), {
        questions: reorderedQuestions,
      });
    } catch (error) {
      console.error("Error reordering questions:", error);
      alert("Failed to reorder questions");
    }
  };

  const handleBulkAddQuestions = async (templates) => {
    setIsAddingQuestion(true);
    try {
      const questionsToAdd = templates.map((template, index) => ({
        ...template,
        id: Date.now() + index,
        order: roomData.questions.length + index + 1,
        type: template.type || "choice",
      }));

      for (const question of questionsToAdd) {
        await updateDoc(doc(db, "quizRooms", roomId), {
          questions: arrayUnion(question),
        });
      }

      setShowTemplates(false);
    } catch (error) {
      console.error("Error adding bulk questions:", error);
      alert("Failed to add questions");
    } finally {
      setIsAddingQuestion(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setNewQuestion({
      ...template,
      options: template.options || ["", "", "", ""],
      timeLimit: 30,
    });
    setShowTemplates(false);
  };

  const updateQuestionOption = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const resetQuestionForm = () => {
    setNewQuestion({
      type: "choice",
      question: "",
      options: ["", "", "", ""],
      answer: "",
      explanation: "",
      timeLimit: 30,
    });
  };

  const handleEndGame = () => {
    navigate("/chapters");
  };

  if (loading) {
    return (
      <div className="wrapper-m">
        <CloseButton />
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h2>Loading room...</h2>
        </div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="wrapper-m">
        <CloseButton />
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h2>Room not found</h2>
          <button onClick={() => navigate("/chapters")}>
            Back to Chapters
          </button>
        </div>
      </div>
    );
  }

  const currentQ = roomData.questions[currentQuestion];
  const totalQuestions = roomData.questions.length;

  return (
    <div className="wrapper-m">
      <CloseButton />

      <div className="host_room_container">
        {/* Enhanced Room Header */}
        <div className="room_header">
          <div className="room_info">
            <h1>
              {isCustomQuiz ? "🎨" : "🎯"} {roomData.lessonName}
              {isCustomQuiz && <span className="custom_badge">Live Quiz</span>}
            </h1>
            <div className="room_details">
              <span className="room_code">
                Room Code: <strong>{roomData.code}</strong>
              </span>
              <span className="participant_count">
                👥 {participants.length} joined
              </span>
              <span className="question_count">
                📝 {totalQuestions} questions
              </span>
            </div>
          </div>
        </div>

        {!gameStarted ? (
          /* Enhanced Waiting Room with Real-time Quiz Builder */
          <div className="waiting_room">
            <div className="waiting_info">
              <h2>
                {isCustomQuiz
                  ? "Building Your Live Quiz..."
                  : "Waiting for participants..."}
              </h2>
              <p>
                Share this code:{" "}
                <span className="share_code">{roomData.code}</span>
              </p>
              {isCustomQuiz && (
                <div className="live_indicator">
                  <div className="pulse_dot"></div>
                  <span>Questions update in real-time for all players!</span>
                </div>
              )}
            </div>

            {/* Real-time Custom Quiz Management */}
            {isCustomQuiz && (
              <div className="custom_quiz_section">
                <div className="quiz_questions_header">
                  <h3>📝 Quiz Questions ({totalQuestions})</h3>
                  <div className="header_buttons">
                    <button
                      onClick={() => setShowTemplates(true)}
                      className="template_btn"
                      disabled={gameStarted}
                    >
                      📋 Templates
                    </button>
                    <button
                      onClick={() => {
                        resetQuestionForm();
                        setEditingQuestion(null);
                        setShowQuestionEditor(true);
                      }}
                      className="add_question_btn"
                      disabled={gameStarted}
                    >
                      ➕ Add Question
                    </button>
                  </div>
                </div>

                {/* Question Templates Modal */}
                {showTemplates && (
                  <div className="question_editor_modal">
                    <div className="editor_content">
                      <h4>📋 Question Templates</h4>

                      <div className="template_categories">
                        {Object.entries(questionTemplates).map(
                          ([type, templates]) => (
                            <div key={type} className="template_category">
                              <h5>
                                {type === "true-false"
                                  ? "True/False"
                                  : type.charAt(0).toUpperCase() +
                                    type.slice(1)}{" "}
                                Questions
                              </h5>
                              <div className="template_list">
                                {templates.map((template, index) => (
                                  <div key={index} className="template_item">
                                    <div className="template_question">
                                      {template.question}
                                    </div>
                                    <div className="template_actions">
                                      <button
                                        onClick={() =>
                                          handleTemplateSelect({
                                            ...template,
                                            type,
                                          })
                                        }
                                        className="use_template_btn"
                                      >
                                        Use Template
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      <div className="editor_actions">
                        <button
                          onClick={() => setShowTemplates(false)}
                          className="cancel_btn"
                        >
                          Close
                        </button>
                        <button
                          onClick={() => {
                            const allTemplates = Object.entries(
                              questionTemplates
                            ).flatMap(([type, templates]) =>
                              templates.map((t) => ({ ...t, type }))
                            );
                            handleBulkAddQuestions(allTemplates);
                          }}
                          disabled={isAddingQuestion}
                          className="add_btn"
                        >
                          {isAddingQuestion ? "Adding..." : "Add All Templates"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Real-time Question Editor Modal */}
                {showQuestionEditor && (
                  <div className="question_editor_modal">
                    <div className="editor_content">
                      <h4>
                        {editingQuestion !== null
                          ? "✏️ Edit Question"
                          : "➕ Add New Question"}
                        (Real-time)
                      </h4>

                      <div className="question_type_selector">
                        <label>Question Type:</label>
                        <select
                          value={newQuestion.type}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              type: e.target.value,
                              answer: "", // Reset answer when type changes
                              options:
                                e.target.value === "choice"
                                  ? ["", "", "", ""]
                                  : newQuestion.options,
                            })
                          }
                        >
                          <option value="choice">Multiple Choice</option>
                          <option value="fill">Fill in the Blank</option>
                          <option value="true-false">True/False</option>
                        </select>
                      </div>

                      <div className="question_input_group">
                        <label>Question:</label>
                        <textarea
                          value={newQuestion.question}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              question: e.target.value,
                            })
                          }
                          placeholder={
                            newQuestion.type === "fill"
                              ? "The capital of France is _."
                              : "Enter your question..."
                          }
                          rows="3"
                        />
                      </div>

                      {/* Dynamic Question Type Forms */}
                      {newQuestion.type === "choice" && (
                        <div className="options_section">
                          <label>Answer Options:</label>
                          {newQuestion.options.map((option, index) => (
                            <div key={index} className="option_row">
                              <span className="option_letter">
                                {String.fromCharCode(65 + index)}
                              </span>
                              <input
                                type="text"
                                value={option}
                                onChange={(e) =>
                                  updateQuestionOption(index, e.target.value)
                                }
                                placeholder={`Option ${String.fromCharCode(
                                  65 + index
                                )}`}
                              />
                              <input
                                type="radio"
                                name="correctAnswer"
                                checked={
                                  newQuestion.answer === option &&
                                  option.trim() !== ""
                                }
                                onChange={() =>
                                  setNewQuestion({
                                    ...newQuestion,
                                    answer: option,
                                  })
                                }
                                disabled={!option.trim()}
                              />
                              <span>Correct</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {newQuestion.type === "fill" && (
                        <div className="fill_answer_group">
                          <label>Correct Answer:</label>
                          <input
                            type="text"
                            value={newQuestion.answer}
                            onChange={(e) =>
                              setNewQuestion({
                                ...newQuestion,
                                answer: e.target.value,
                              })
                            }
                            placeholder="Enter the correct answer..."
                          />
                          <small>
                            Use _ in your question to mark where the blank
                            should be.
                          </small>
                        </div>
                      )}

                      {newQuestion.type === "true-false" && (
                        <div className="true_false_group">
                          <label>Correct Answer:</label>
                          <select
                            value={newQuestion.answer}
                            onChange={(e) =>
                              setNewQuestion({
                                ...newQuestion,
                                answer: e.target.value,
                              })
                            }
                          >
                            <option value="">Select...</option>
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        </div>
                      )}

                      <div className="explanation_group">
                        <label>Explanation (optional):</label>
                        <textarea
                          value={newQuestion.explanation}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              explanation: e.target.value,
                            })
                          }
                          placeholder="Explain why this is the correct answer..."
                          rows="2"
                        />
                      </div>

                      <div className="editor_actions">
                        <button
                          onClick={() => {
                            setShowQuestionEditor(false);
                            setEditingQuestion(null);
                            resetQuestionForm();
                          }}
                          className="cancel_btn"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={
                            editingQuestion !== null
                              ? handleUpdateQuestion
                              : handleAddQuestion
                          }
                          disabled={isAddingQuestion}
                          className="add_btn"
                        >
                          {isAddingQuestion
                            ? "Saving..."
                            : editingQuestion !== null
                            ? "💾 Update Live"
                            : "📡 Add Live"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Real-time Questions List */}
                <div className="questions_list">
                  {roomData.questions.length === 0 ? (
                    <div className="no_questions">
                      <span className="empty_icon">📝</span>
                      <p>
                        No questions yet. Add your first question to get
                        started!
                      </p>
                    </div>
                  ) : (
                    roomData.questions.map((question, index) => (
                      <div key={question.id || index} className="question_item">
                        <div className="question_header_item">
                          <span className="question_number">Q{index + 1}</span>
                          <span className="question_type_badge">
                            {question.type}
                          </span>
                          <div className="question_actions">
                            {index > 0 && !gameStarted && (
                              <button
                                onClick={() =>
                                  handleMoveQuestion(index, index - 1)
                                }
                                className="move_btn"
                                title="Move up"
                              >
                                ⬆️
                              </button>
                            )}
                            {index < roomData.questions.length - 1 &&
                              !gameStarted && (
                                <button
                                  onClick={() =>
                                    handleMoveQuestion(index, index + 1)
                                  }
                                  className="move_btn"
                                  title="Move down"
                                >
                                  ⬇️
                                </button>
                              )}
                            {!gameStarted && (
                              <button
                                onClick={() =>
                                  handleEditQuestion(question, index)
                                }
                                className="edit_question_btn"
                                title="Edit question"
                              >
                                ✏️
                              </button>
                            )}
                            {!gameStarted && (
                              <button
                                onClick={() => handleRemoveQuestion(question)}
                                className="remove_question_btn"
                                title="Remove question"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="question_preview">
                          {question.question}
                        </div>
                        {question.type === "choice" && question.options && (
                          <div className="options_preview">
                            {question.options.map((option, optIndex) => (
                              <span
                                key={optIndex}
                                className={`option_preview ${
                                  option === question.answer ? "correct" : ""
                                }`}
                              >
                                {String.fromCharCode(65 + optIndex)}) {option}
                              </span>
                            ))}
                          </div>
                        )}
                        {question.type === "fill" && (
                          <div className="answer_preview">
                            <strong>Answer:</strong> {question.answer}
                          </div>
                        )}
                        {question.type === "true-false" && (
                          <div className="answer_preview">
                            <strong>Answer:</strong>{" "}
                            {question.answer === "true"
                              ? "True ✅"
                              : "False ❌"}
                          </div>
                        )}
                        {question.explanation && (
                          <div className="explanation_preview">
                            <strong>Explanation:</strong> {question.explanation}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="participants_section">
              <h3>Participants ({participants.length}):</h3>
              <div className="participants_grid">
                {participants.length === 0 ? (
                  <div className="no_participants">No participants yet</div>
                ) : (
                  participants.map((participant, index) => (
                    <div key={index} className="participant_card">
                      <div className="participant_avatar">
                        {participant.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="participant_name">
                        {participant.name || "Anonymous"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="host_controls">
              <button
                onClick={handleStartGame}
                disabled={participants.length === 0 || totalQuestions === 0}
                className="start_game_btn"
              >
                {participants.length === 0
                  ? "Waiting for participants..."
                  : totalQuestions === 0
                  ? "Add questions to start"
                  : `🚀 Start Live Quiz (${totalQuestions} questions)`}
              </button>
            </div>
          </div>
        ) : showResults ? (
          /* Results Screen */
          <div className="results_screen">
            <h2>🎉 Game Complete!</h2>
            <div className="final_results">
              <h3>Final Leaderboard:</h3>
              <div className="results_placeholder">
                Results will be displayed here
              </div>
            </div>

            <div className="host_controls">
              <button onClick={handleEndGame} className="end_game_btn">
                End Session
              </button>
            </div>
          </div>
        ) : (
          /* Enhanced Active Game */
          <div className="active_game">
            <div className="question_header">
              <div className="question_progress">
                Question {currentQuestion + 1} of {totalQuestions}
                {isCustomQuiz && <span className="live_badge">LIVE</span>}
              </div>
              <div className="progress_bar">
                <div
                  className="progress_fill"
                  style={{
                    width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="current_question">
              <h2 className="question_text">{currentQ?.question}</h2>

              {/* Enhanced question type display */}
              {currentQ?.type === "choice" && (
                <div className="answer_options">
                  {currentQ.options?.map((option, index) => (
                    <div
                      key={index}
                      className={`option_display ${
                        option === currentQ.answer ? "correct" : ""
                      }`}
                    >
                      <span className="option_letter">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="option_text">{option}</span>
                    </div>
                  ))}
                </div>
              )}

              {currentQ?.type === "fill" && (
                <div className="fill_display">
                  <p>Fill in the blank:</p>
                  <div className="fill_question_display">
                    {currentQ.question.split("_").map((part, index) => (
                      <span key={index}>
                        {part}
                        {index < currentQ.question.split("_").length - 1 && (
                          <span className="blank_indicator">[_____]</span>
                        )}
                      </span>
                    ))}
                  </div>
                  <p className="correct_answer">
                    Correct Answer: <strong>{currentQ.answer}</strong>
                  </p>
                </div>
              )}

              {currentQ?.type === "true-false" && (
                <div className="true_false_display">
                  <div className="tf_options">
                    <div
                      className={`tf_option ${
                        currentQ.answer === "true" ? "correct" : ""
                      }`}
                    >
                      ✅ True
                    </div>
                    <div
                      className={`tf_option ${
                        currentQ.answer === "false" ? "correct" : ""
                      }`}
                    >
                      ❌ False
                    </div>
                  </div>
                </div>
              )}

              {currentQ?.explanation && (
                <div className="question_explanation">
                  <h4>Explanation:</h4>
                  <p>{currentQ.explanation}</p>
                </div>
              )}
            </div>

            <div className="host_controls">
              <button
                onClick={handleNextQuestion}
                className="next_question_btn"
              >
                {currentQuestion + 1 < totalQuestions
                  ? "➡️ Next Question"
                  : "🏁 Show Results"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HostRoom;
