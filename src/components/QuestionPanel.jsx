import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext.jsx';
import './QuestionPanel.css';

const QuestionPanel = ({ isTrainer }) => {
  const { socket, connected, submitQuestion, endQuestion, submitAnswer } = useWebSocket();

  const [activeQuestion, setActiveQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [responseStats, setResponseStats] = useState(null);

  const [newQuestion, setNewQuestion] = useState({
    title: '',
    options: ['', '', '', ''],
    correctOption: 0
  });

  useEffect(() => {
    if (!connected || !socket) return;

    socket.on('question', (question) => {
      setActiveQuestion(question);
      setSelectedAnswer(null);
      setAnswered(false);
    });

    socket.on('question-ended', () => {
      setActiveQuestion(null);
      setSelectedAnswer(null);
      setAnswered(false);
      setResponseStats(null);
    });

    if (isTrainer) {
      socket.on('response-stats', (stats) => {
        setResponseStats(stats);
      });
    }

    return () => {
      socket.off('question');
      socket.off('question-ended');
      if (isTrainer) {
        socket.off('response-stats');
      }
    };
  }, [connected, socket, isTrainer]);

  const handleQuestionChange = (e) => {
    setNewQuestion({ ...newQuestion, title: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleCorrectOptionChange = (index) => {
    setNewQuestion({ ...newQuestion, correctOption: index });
  };

  const handleSubmitQuestion = () => {
    const { title, options, correctOption } = newQuestion;
    if (!title.trim()) return alert('Question title cannot be empty');
    const validOptions = options.filter((opt) => opt.trim() !== '');
    if (validOptions.length < 2) return alert('Please provide at least 2 options');

    submitQuestion({
      title,
      options: validOptions,
      correctOption: correctOption >= validOptions.length ? 0 : correctOption
    });

    setNewQuestion({ title: '', options: ['', '', '', ''], correctOption: 0 });
  };

  const handleEndQuestion = () => {
    endQuestion();
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !activeQuestion) return;
    submitAnswer(activeQuestion.id, selectedAnswer);
    setAnswered(true);
  };

  if (isTrainer) {
    return (
      <div className="question-panel">
        <h3 className="panel-title">Interactive Poll</h3>
        {activeQuestion ? (
          <div className="active-question">
            <p className="question-title">{activeQuestion.title}</p>
            <ul className="options-list">
              {activeQuestion.options.map((option, index) => (
                <li key={index} className={index === activeQuestion.correctOption ? 'correct-option' : ''}>
                  {option} {index === activeQuestion.correctOption && '(Correct)'}
                </li>
              ))}
            </ul>

            {responseStats && (
              <div className="response-stats">
                <p>Responses: {responseStats.responseCount}</p>
                {activeQuestion.options.map((option, index) => {
                  const count = responseStats.answerDistribution[index] || 0;
                  const percentage = responseStats.responseCount > 0 ? Math.round((count / responseStats.responseCount) * 100) : 0;
                  return (
                    <div key={index} className="stat-item">
                      <div className="stat-label">
                        <span>{option}</span>
                        <span>{count} ({percentage}%)</span>
                      </div>
                      <div className="progress-bar">
                        <div className={`progress ${index === activeQuestion.correctOption ? 'correct' : ''}`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button className="end-button" onClick={handleEndQuestion}>End Question</button>
          </div>
        ) : (
          <div className="question-form">
            <div className="form-group">
              <label>Question:</label>
              <input
                type="text"
                value={newQuestion.title}
                onChange={handleQuestionChange}
                placeholder="Enter your question here"
              />
            </div>
            <div className="form-group">
              <label>Options:</label>
              {newQuestion.options.map((option, index) => (
                <div key={index} className="option-input">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={newQuestion.correctOption === index}
                    onChange={() => handleCorrectOptionChange(index)}
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                </div>
              ))}
              <p className="hint">Select the radio button next to the correct answer.</p>
            </div>
            <button className="submit-button" onClick={handleSubmitQuestion}>Send Question</button>
          </div>
        )}
      </div>
    );
  }

  // Trainee view
  return (
    <div className="question-panel">
      <h3 className="panel-title">Interactive Poll</h3>
      {activeQuestion ? (
        <div className="active-question">
          <p className="question-title">{activeQuestion.title}</p>
          <div className="options-list">
            {activeQuestion.options.map((option, index) => (
              <label key={index} className="option-item">
                <input
                  type="radio"
                  name="answer"
                  disabled={answered}
                  checked={selectedAnswer === index}
                  onChange={() => setSelectedAnswer(index)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {!answered ? (
            <button
              className="submit-button"
              disabled={selectedAnswer === null}
              onClick={handleSubmitAnswer}
            >
              Submit Answer
            </button>
          ) : (
            <div className="answer-submitted">Your answer has been submitted!</div>
          )}
        </div>
      ) : (
        <div className="waiting-message">
          <p>Waiting for the trainer to send a question...</p>
        </div>
      )}
    </div>
  );
};

export default QuestionPanel;
