import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext.jsx';
import './QuestionPanel.css';

const QuestionPanel = ({ isTrainer }) => {
  const { socket, connected, submitQuestion, endQuestion, submitAnswer } = useWebSocket();
  
  // State for active question and responses
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [responseStats, setResponseStats] = useState(null);
  
  // Trainer form state for creating questions
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    options: ['', '', '', ''],
    correctOption: 0
  });

  // Listen for socket events
  useEffect(() => {
    if (!connected || !socket) return;
    
    // Handle incoming questions
    socket.on('question', (question) => {
      setActiveQuestion(question);
      setSelectedAnswer(null);
      setAnswered(false);
    });
    
    // Handle question ended
    socket.on('question-ended', () => {
      setActiveQuestion(null);
      setSelectedAnswer(null);
      setAnswered(false);
      setResponseStats(null);
    });
    
    // For trainers, receive response statistics
    if (isTrainer) {
      socket.on('response-stats', (stats) => {
        setResponseStats(stats);
      });
    }
    
    // Clean up event listeners
    return () => {
      socket.off('question');
      socket.off('question-ended');
      if (isTrainer) {
        socket.off('response-stats');
      }
    };
  }, [connected, socket, isTrainer]);

  // Handle question title input
  const handleQuestionChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      title: e.target.value
    });
  };

  // Handle option input
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions
    });
  };

  // Handle correct option selection
  const handleCorrectOptionChange = (index) => {
    setNewQuestion({
      ...newQuestion,
      correctOption: index
    });
  };

  // Submit new question (trainer only)
  const handleSubmitQuestion = () => {
    if (!newQuestion.title.trim()) {
      alert('Question title cannot be empty');
      return;
    }
    
    // Filter out empty options
    const validOptions = newQuestion.options.filter(opt => opt.trim() !== '');
    
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }
    
    // Adjust correctOption if needed
    const correctOption = newQuestion.correctOption >= validOptions.length 
      ? 0 : newQuestion.correctOption;
    
    submitQuestion({
      title: newQuestion.title,
      options: validOptions,
      correctOption: correctOption
    });
    
    // Reset form
    setNewQuestion({
      title: '',
      options: ['', '', '', ''],
      correctOption: 0
    });
  };

  // End current question (trainer only)
  const handleEndQuestion = () => {
    endQuestion();
  };

  // Submit answer (trainee only)
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !activeQuestion) return;
    
    submitAnswer(activeQuestion.id, selectedAnswer);
    setAnswered(true);
  };

  // Render different views based on role
  if (isTrainer) {
    // Trainer view
    return (
      <div className="question-panel">
        <h3 className="panel-title">Interactive Poll</h3>
        
        {activeQuestion ? (
          // Active question view for trainer
          <div className="active-question">
            <h4>Current Question</h4>
            <p className="question-title">{activeQuestion.title}</p>
            
            <div className="options-list">
              <p>Options:</p>
              <ul>
                {activeQuestion.options.map((option, index) => (
                  <li 
                    key={index} 
                    className={index === activeQuestion.correctOption ? 'correct-option' : ''}
                  >
                    {option} {index === activeQuestion.correctOption && '(Correct)'}
                  </li>
                ))}
              </ul>
            </div>
            
            {responseStats && (
              <div className="response-stats">
                <p>Responses: {responseStats.responseCount}</p>
                
                {activeQuestion.options.map((option, index) => {
                  const count = responseStats.answerDistribution[index] || 0;
                  const percentage = responseStats.responseCount > 0
                    ? Math.round((count / responseStats.responseCount) * 100)
                    : 0;
                    
                  return (
                    <div key={index} className="stat-item">
                      <div className="stat-label">
                        <span>{option}</span>
                        <span>{count} ({percentage}%)</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className={`progress ${index === activeQuestion.correctOption ? 'correct' : ''}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <button 
              className="end-button" 
              onClick={handleEndQuestion}
            >
              End Question
            </button>
          </div>
        ) : (
          // Question creation form for trainer
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
            
            <button 
              className="submit-button"
              onClick={handleSubmitQuestion}
            >
              Send Question
            </button>
          </div>
        )}
      </div>
    );
  } else {
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
              <div className="answer-submitted">
                Your answer has been submitted!
              </div>
            )}
          </div>
        ) : (
          <div className="waiting-message">
            <p>Waiting for the trainer to send a question...</p>
          </div>
        )}
      </div>
    );
  }
};

export default QuestionPanel;