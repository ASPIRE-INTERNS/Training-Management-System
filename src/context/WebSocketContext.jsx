import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const { currentUser, token } = useAuth();

  // Initialize socket connection
  useEffect(() => {
    if (!currentUser || !token) return;

    // Connect to WebSocket server
    const socketInstance = io('', {  // Empty string connects to current host
      auth: { token },
      autoConnect: false,
    });

    // Socket event handlers
    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    });

    socketInstance.on('error', (error) => {
      console.error('WebSocket error:', error.message);
    });

    setSocket(socketInstance);

    // Clean up socket connection on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [currentUser, token]);

  // Join a training session
  const joinSession = (sessionId) => {
    if (!socket || !currentUser) return false;
    
    // Connect if not already
    if (!socket.connected) {
      socket.connect();
    }
    
    socket.emit('join-session', { sessionId });
    setActiveSession(sessionId);
    return true;
  };

  // Leave current session
  const leaveSession = () => {
    if (socket) {
      socket.disconnect();
    }
    setActiveSession(null);
  };

  // Submit a question (trainer only)
  const submitQuestion = (question) => {
    if (!socket || !activeSession || !currentUser) return false;
    
    if (currentUser.role !== 'trainer' && currentUser.role !== 'admin') {
      console.error('Only trainers can submit questions');
      return false;
    }
    
    socket.emit('submit-question', {
      sessionId: activeSession,
      question: {
        id: Date.now().toString(),
        ...question
      }
    });
    
    return true;
  };

  // End the current question (trainer only)
  const endQuestion = () => {
    if (!socket || !activeSession || !currentUser) return false;
    
    if (currentUser.role !== 'trainer' && currentUser.role !== 'admin') {
      console.error('Only trainers can end questions');
      return false;
    }
    
    socket.emit('end-question', { sessionId: activeSession });
    return true;
  };

  // Submit answer to question (trainee)
  const submitAnswer = (questionId, answer) => {
    if (!socket || !activeSession || !currentUser) return false;
    
    socket.emit('submit-answer', {
      sessionId: activeSession,
      questionId,
      answer
    });
    
    return true;
  };

  return (
    <WebSocketContext.Provider value={{
      socket,
      connected,
      activeSession,
      joinSession,
      leaveSession,
      submitQuestion,
      endQuestion,
      submitAnswer
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};