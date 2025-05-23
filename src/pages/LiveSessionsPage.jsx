// client/src/pages/LiveSessionsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar';
import { getActiveSessions, getScheduledSessions, startSession, endSession } from '../services/liveSessionService';

const LiveSessionsPage = () => {
  const { user } = useAuth();
  const [activeSessions, setActiveSessions] = useState([]);
  const [scheduledSessions, setScheduledSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isTrainer = user && (user.role === 'trainer' || user.role === 'trainer_manager');

  // Sample mock data to display while API is being fixed
  const mockActiveSessions = [
    {
      _id: '60d5ec9c734231456ed85f01',
      title: 'Advanced React Patterns',
      description: 'Learn the most powerful React design patterns used in modern applications.',
      course: {
        _id: '60d5ec9c734231456ed85f10',
        title: 'React Mastery'
      },
      instructor: {
        _id: user ? user._id : '123',
        firstName: user ? user.firstName : 'Varshini',
        lastName: user ? user.lastName : 'Madamanchi'
      },
      isActive: true,
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      scheduledFor: new Date().toISOString(),
      duration: 90,
      participants: [
        '60d5ec9c734231456ed85f30',
        '60d5ec9c734231456ed85f31',
        '60d5ec9c734231456ed85f32'
      ]
    },
    {
      _id: '60d5ec9c734231456ed85f02',
      title: 'Node.js Best Practices',
      description: 'Essential practices for building robust Node.js applications.',
      course: {
        _id: '60d5ec9c734231456ed85f11',
        title: 'Backend Development'
      },
      instructor: {
        _id: user ? user._id : '123',
        firstName: user ? user.firstName : 'Varshini',
        lastName: user ? user.lastName : 'Madamanchi'
      },
      isActive: true,
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      scheduledFor: new Date().toISOString(),
      duration: 60,
      participants: [
        '60d5ec9c734231456ed85f33',
        '60d5ec9c734231456ed85f34'
      ]
    }
  ];

  const mockScheduledSessions = [
    {
      _id: '60d5ec9c734231456ed85f03',
      title: 'Introduction to TypeScript',
      description: 'Getting started with TypeScript for JavaScript developers.',
      course: {
        _id: '60d5ec9c734231456ed85f12',
        title: 'Frontend Development'
      },
      instructor: {
        _id: user ? user._id : '123',
        firstName: user ? user.firstName : 'Varshini',
        lastName: user ? user.lastName : 'Madamanchi'
      },
      isActive: false,
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      duration: 120
    },
    {
      _id: '60d5ec9c734231456ed85f04',
      title: 'Database Design Principles',
      description: 'Learn how to design efficient and scalable database schemas.',
      course: {
        _id: '60d5ec9c734231456ed85f13',
        title: 'Database Management'
      },
      instructor: {
        _id: user ? user._id : '123',
        firstName: user ? user.firstName : 'Varshini',
        lastName: user ? user.lastName : 'Madamanchi'
      },
      isActive: false,
      scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      duration: 90
    }
  ];

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        
        // Comment out the API calls and use mock data instead
        // Uncomment these when your API is working
        /*
        const activeData = await getActiveSessions();
        const scheduledData = await getScheduledSessions();
        
        setActiveSessions(activeData);
        setScheduledSessions(scheduledData);
        */
        
        // Use mock data temporarily
        setActiveSessions(mockActiveSessions);
        setScheduledSessions(mockScheduledSessions);
        
        setLoading(false);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError('Failed to load sessions');
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  const handleStartSession = async (sessionId) => {
    try {
      // Comment out the API call when using mock data
      // await startSession(sessionId);
      
      // Optimistically update UI
      const session = scheduledSessions.find(s => s._id === sessionId);
      if (session) {
        const updatedSession = {
          ...session, 
          isActive: true,
          startedAt: new Date().toISOString(),
          participants: []
        };
        setActiveSessions([...activeSessions, updatedSession]);
        setScheduledSessions(scheduledSessions.filter(s => s._id !== sessionId));
      }
    } catch (err) {
      console.error("Error starting session:", err);
      setError('Failed to start session');
    }
  };

  const handleEndSession = async (sessionId) => {
    try {
      // Comment out the API call when using mock data
      // await endSession(sessionId);
      
      // Update UI
      setActiveSessions(activeSessions.filter(s => s._id !== sessionId));
    } catch (err) {
      console.error("Error ending session:", err);
      setError('Failed to end session');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Live Sessions</h1>
          {isTrainer && (
            <Link 
              to="/create-session" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create New Session
            </Link>
          )}
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Active Sessions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Active Now</h2>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Loading sessions...</p>
            </div>
          ) : activeSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSessions.map(session => (
                <div key={session._id} className="border border-green-200 bg-green-50 rounded-lg p-6 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">{session.title}</h3>
                    {session.description && (
                      <p className="text-gray-600 mt-1">{session.description}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap text-sm text-gray-600 mb-4">
                    <div className="w-full sm:w-1/2 mb-2">
                      <span className="font-medium">Course:</span> {session.course?.title || 'N/A'}
                    </div>
                    <div className="w-full sm:w-1/2 mb-2">
                      <span className="font-medium">Instructor:</span> {session.instructor?.firstName} {session.instructor?.lastName}
                    </div>
                    <div className="w-full sm:w-1/2 mb-2">
                      <span className="font-medium">Started:</span> {new Date(session.startedAt || session.createdAt).toLocaleTimeString()}
                    </div>
                    <div className="w-full sm:w-1/2 mb-2">
                      <span className="font-medium">Participants:</span> {session.participants?.length || 0}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="flex items-center text-green-600">
                      <span className="relative flex h-3 w-3 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      Live Now
                    </span>
                    
                    <div className="flex space-x-2">
                      <Link 
                        to={`/training-sessions/${session._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Join Session
                      </Link>
                      {isTrainer && session.instructor?._id === user?._id && (
                        <button 
                          onClick={() => handleEndSession(session._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          End Session
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm">
              <p>No active sessions at the moment</p>
            </div>
          )}
        </div>
        
        {/* Scheduled Sessions - Only show to trainers or if there are upcoming sessions */}
        {(isTrainer || scheduledSessions.length > 0) && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
            
            {loading ? (
              <div className="text-center py-4">
                <p>Loading...</p>
              </div>
            ) : scheduledSessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scheduledSessions.map(session => (
                  <div key={session._id} className="border rounded-lg p-6 bg-white shadow-sm">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">{session.title}</h3>
                      {session.description && (
                        <p className="text-gray-600 mt-1">{session.description}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap text-sm text-gray-600 mb-4">
                      <div className="w-full sm:w-1/2 mb-2">
                        <span className="font-medium">Course:</span> {session.course?.title || 'N/A'}
                      </div>
                      <div className="w-full sm:w-1/2 mb-2">
                        <span className="font-medium">Instructor:</span> {session.instructor?.firstName} {session.instructor?.lastName}
                      </div>
                      <div className="w-full mb-2">
                        <span className="font-medium">Scheduled for:</span> {new Date(session.scheduledFor).toLocaleString()}
                      </div>
                      <div className="w-full mb-2">
                        <span className="font-medium">Duration:</span> {session.duration} minutes
                      </div>
                    </div>
                    
                    {isTrainer && session.instructor?._id === user?._id && (
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleStartSession(session._id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Start Now
                        </button>
                        <Link 
                          to={`/edit-session/${session._id}`} 
                          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                        >
                          Edit
                        </Link>
                      </div>
                    )}
                    
                    {!isTrainer && (
                      <div className="text-right text-sm text-gray-600">
                        {new Date(session.scheduledFor) > new Date() ? (
                          <span>Coming up in {getTimeUntil(session.scheduledFor)}</span>
                        ) : (
                          <span>Expected to start soon</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm">
                <p>No upcoming sessions scheduled</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to display time until session starts
const getTimeUntil = (dateString) => {
  const now = new Date();
  const sessionDate = new Date(dateString);
  const diffMs = sessionDate - now;
  
  if (diffMs <= 0) return 'now';
  
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
};

export default LiveSessionsPage;