import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWebSocket } from '../context/WebSocketContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import QuestionPanel from '../components/QuestionPanel.jsx';
import SessionChat from '../components/SessionChat.jsx';
import LiveVideo from '../components/LiveVideo.jsx';
import './LiveSessionPage.css';

const LiveSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { joinSession, leaveSession, connected } = useWebSocket();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);

  // Fetch session details
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/training-sessions/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch session details');
        }
        
        const data = await response.json();
        setSession(data);
      } catch (err) {
        console.error('Error fetching session:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSession();
  }, [id]);

  // Join WebSocket session
  useEffect(() => {
    if (session && currentUser && !loading) {
      joinSession(id);
      
      return () => {
        // Clean up on unmount
        leaveSession();
      };
    }
  }, [session, currentUser, loading, joinSession, leaveSession, id]);

  // Listen for participant count updates
  const { socket } = useWebSocket();
  useEffect(() => {
    if (connected) {
      socket.on('participant-count', (data) => {
        setParticipantCount(data.count);
      });
      
      return () => {
        socket.off('participant-count');
      };
    }
  }, [connected,socket]);

  // Determine if user is a trainer for this session
  const isTrainer = session && currentUser && 
    (currentUser.role === 'trainer' || currentUser.role === 'admin');

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/my-trainings')}>
          Back to My Trainings
        </button>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="not-found-container">
        <h2>Session Not Found</h2>
        <p>The training session you're looking for doesn't exist or has ended.</p>
        <button onClick={() => navigate('/my-trainings')}>
          Back to My Trainings
        </button>
      </div>
    );
  }

  return (
    <div className="live-session-container">
      <div className="session-header">
        <h1>{session.title}</h1>
        <div className="session-meta">
          <p className="session-date">Date: {new Date(session.date).toLocaleDateString()}</p>
          <p className="session-time">Time: {session.startTime} - {session.endTime}</p>
          <p className="participant-count">{participantCount} Participants Online</p>
        </div>
      </div>

      <div className="session-content">
        <div className="main-content">
          <LiveVideo sessionId={id} isTrainer={isTrainer} />
          
          <div className="interactive-panel">
            <QuestionPanel isTrainer={isTrainer} />
          </div>
        </div>
        
        <div className="side-panel">
          <SessionChat sessionId={id} userName={currentUser.firstName} />
        </div>
      </div>

      <div className="session-actions">
        <button 
          className="leave-session-btn"
          onClick={() => {
            leaveSession();
            navigate('/my-trainings');
          }}
        >
          Leave Session
        </button>
      </div>
    </div>
  );
};

export default LiveSessionPage;