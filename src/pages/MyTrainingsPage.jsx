// frontend/src/pages/MyTrainingsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MyTrainingsPage.css';

const MyTrainingsPage = () => {
  const [trainingSessions, setTrainingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyTrainingSessions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const response = await fetch('/api/user/my-training-sessions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch training sessions (${response.status})`);
        }
        
        const data = await response.json();
        setTrainingSessions(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching training sessions:', error);
        setError(error.message || 'Failed to load training sessions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyTrainingSessions();
  }, []);

  // Function to determine if a session is active (currently running)
  const isSessionActive = (session) => {
    if (session.isLive) return true;
    
    const now = new Date();
    const sessionDate = new Date(session.date);
    
    // Make sure sessionDate is the same date
    if (sessionDate.toDateString() !== now.toDateString()) return false;
    
    // Get session start and end times
    const [startHour, startMinute] = session.startTime.split(':').map(Number);
    const [endHour, endMinute] = session.endTime.split(':').map(Number);
    
    // Set the session start and end times
    const sessionStart = new Date(sessionDate);
    sessionStart.setHours(startHour, startMinute, 0);
    
    const sessionEnd = new Date(sessionDate);
    sessionEnd.setHours(endHour, endMinute, 0);
    
    // Session is active if current time is between start and end times
    return now >= sessionStart && now <= sessionEnd;
  };

  // Function to determine if a session is about to start soon (within 15 minutes)
  const isSessionStartingSoon = (session) => {
    const now = new Date();
    const sessionDate = new Date(session.date);
    
    // Make sure sessionDate is the same date
    if (sessionDate.toDateString() !== now.toDateString()) return false;
    
    // Get session start time
    const [startHour, startMinute] = session.startTime.split(':').map(Number);
    
    // Set the session start time
    const sessionStart = new Date(sessionDate);
    sessionStart.setHours(startHour, startMinute, 0);
    
    // Time difference in minutes
    const minutesUntilStart = (sessionStart - now) / (1000 * 60);
    
    // Session is starting soon if it starts within the next 15 minutes
    return minutesUntilStart >= 0 && minutesUntilStart <= 15;
  };

  if (loading) {
    return (
      <div className="my-trainings-page">
        <h1>{user?.role === 'trainer' ? 'My Training Sessions' : 'My Enrolled Trainings'}</h1>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your training sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-trainings-page">
        <h1>{user?.role === 'trainer' ? 'My Training Sessions' : 'My Enrolled Trainings'}</h1>
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Separate upcoming and past sessions
  const currentDate = new Date();
  const upcomingSessions = trainingSessions.filter(
    session => new Date(session.date) >= currentDate
  );
  const pastSessions = trainingSessions.filter(
    session => new Date(session.date) < currentDate
  );

  return (
    <div className="my-trainings-page">
      <h1>{user?.role === 'trainer' ? 'My Training Sessions' : 'My Enrolled Trainings'}</h1>
      
      {trainingSessions.length === 0 ? (
        <div className="no-sessions">
          <p>You don't have any training sessions yet.</p>
          {user?.role !== 'trainer' && (
            <Link to="/courses" className="browse-link">
              Browse Available Courses
            </Link>
          )}
        </div>
      ) : (
        <>
          {upcomingSessions.length > 0 && (
            <section className="session-list">
              <h2>Upcoming Sessions</h2>
              {upcomingSessions.map(session => (
                <div key={session._id} className="session-card">
                  <div className="session-info">
                    <h3>{session.title}</h3>
                    {session.courseId && <p className="course-title">{session.courseId.title}</p>}
                    <div className="session-details">
                      <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {session.startTime} - {session.endTime}</p>
                      
                      {user?.role !== 'trainer' && session.instructor && (
                        <p>
                          <strong>Instructor:</strong> {session.instructor.firstName} {session.instructor.lastName}
                        </p>
                      )}
                    </div>
                    
                    {/* Status badges */}
                    {isSessionActive(session) && (
                      <span className="live-badge">LIVE NOW</span>
                    )}
                    {isSessionStartingSoon(session) && !isSessionActive(session) && (
                      <span className="starting-soon-badge">STARTING SOON</span>
                    )}
                  </div>
                  <div className="session-actions">
                    {/* Show join button for active or soon-to-start sessions */}
                    {(isSessionActive(session) || isSessionStartingSoon(session)) && (
                      <Link to={`/live-session/${session._id}`} className="join-button">
                        {isSessionActive(session) ? 'Join Session' : 'Enter Waiting Room'}
                      </Link>
                    )}
                    
                    {/* Always show details button */}
                    {session.courseId && (
                      <Link to={`/courses/${session.courseId._id}`} className="details-button">
                        View Course Details
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )}
          
          {pastSessions.length > 0 && (
            <section className="session-list past-sessions">
              <h2>Past Sessions</h2>
              {pastSessions.map(session => (
                <div key={session._id} className="session-card">
                  <div className="session-info">
                    <h3>{session.title}</h3>
                    {session.courseId && <p className="course-title">{session.courseId.title}</p>}
                    <div className="session-details">
                      <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {session.startTime} - {session.endTime}</p>
                      
                      {user?.role !== 'trainer' && session.instructor && (
                        <p>
                          <strong>Instructor:</strong> {session.instructor.firstName} {session.instructor.lastName}
                        </p>
                      )}
                    </div>
                    <span className="completed-badge">COMPLETED</span>
                  </div>
                  <div className="session-actions">
                    {/* For past sessions, show recording if available */}
                    {session.recordingUrl && (
                      <a href={session.recordingUrl} className="recording-button" target="_blank" rel="noopener noreferrer">
                        View Recording
                      </a>
                    )}
                    
                    {/* Always show details button */}
                    {session.courseId && (
                      <Link to={`/courses/${session.courseId._id}`} className="details-button">
                        View Course Details
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default MyTrainingsPage;