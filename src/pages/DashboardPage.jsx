// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    attendanceRate: 0
  });
  const [upcomingTraining, setUpcomingTraining] = useState(null);
  const [liveSessions, setLiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user stats
        const statsResponse = await fetch('/api/user/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats({
            enrolledCourses: statsData.enrolledCourses || 0,
            completedCourses: statsData.completedCourses || 0,
            attendanceRate: statsData.attendanceRate || 0
          });
        }
        
        // Fetch upcoming training
        const upcomingResponse = await fetch('/api/user/next-training', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (upcomingResponse.ok) {
          const upcomingData = await upcomingResponse.json();
          setUpcomingTraining(upcomingData);
        }
        
        // Fetch active live sessions
        const liveSessionsResponse = await fetch('/api/user/live-sessions', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (liveSessionsResponse.ok) {
          const liveSessionsData = await liveSessionsResponse.json();
          setLiveSessions(liveSessionsData);
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Refresh live sessions every minute
    const intervalId = setInterval(() => {
      fetch('/api/user/live-sessions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(data => setLiveSessions(data))
        .catch(err => console.error('Error refreshing live sessions:', err));
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <div className="welcome-section">
        <h2>Welcome, {currentUser.firstName}!</h2>
        <p>Your role: {currentUser.role}</p>
      </div>
      
      {/* Live Sessions Section - Only show if there are active sessions */}
      {liveSessions.length > 0 && (
        <div className="live-sessions-section">
          <h2>Live Now</h2>
          <div className="live-sessions-grid">
            {liveSessions.map(session => (
              <div key={session._id} className="live-session-card">
                <div className="live-badge">LIVE</div>
                <h3>{session.title}</h3>
                <p>Instructor: {session.instructor.firstName} {session.instructor.lastName}</p>
                <p>Course: {session.courseId.title}</p>
                <Link to={`/live-session/${session._id}`} className="join-live-button">
                  Join Session
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="dashboard-grid">
        <div className="stats-section">
          <h2>My Learning Progress</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-number">{stats.enrolledCourses}</h3>
              <p>Enrolled Courses</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">{stats.completedCourses}</h3>
              <p>Completed Courses</p>
            </div>
            <div className="stat-card attendance">
              <h3 className="stat-number">{stats.attendanceRate}%</h3>
              <p>Attendance Rate</p>
            </div>
          </div>
        </div>
        
        <div className="upcoming-section">
          <h2>Upcoming Training</h2>
          {upcomingTraining ? (
            <div className="upcoming-training-card">
              <h3>{upcomingTraining.title}</h3>
              <p>Date: {new Date(upcomingTraining.date).toLocaleDateString()}</p>
              <p>Time: {upcomingTraining.startTime} AM</p>
              <Link to={`/view-attendance/${upcomingTraining._id}`} className="view-attendance-link">
                View my attendance →
              </Link>
            </div>
          ) : (
            <p className="no-upcoming">No upcoming training sessions.</p>
          )}
        </div>
      </div>
      
      <div className="quick-actions">
        <Link to="/courses" className="action-button">
          Browse Courses
        </Link>
        <Link to="/my-trainings" className="action-button">
          My Trainings
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;