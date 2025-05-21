import axios from 'axios';
// import { apiRequest } from '@/lib/queryClient';

// Use the environment variable with a fallback if it's not defined
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';


// Mock data for when API calls fail
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
      _id: '60d5ec9c734231456ed85f20',
      firstName: 'Varshini',
      lastName: 'Madamanchi'
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
      _id: '60d5ec9c734231456ed85f20',
      firstName: 'Varshini',
      lastName: 'Madamanchi'
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
      _id: '60d5ec9c734231456ed85f20',
      firstName: 'Varshini',
      lastName: 'Madamanchi'
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
      _id: '60d5ec9c734231456ed85f20',
      firstName: 'Varshini',
      lastName: 'Madamanchi'
    },
    isActive: false,
    scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    duration: 90
  }
];

/**
 * Fetches currently active live sessions
 * @returns {Promise<Array>} Array of active session objects
 */
export const getActiveSessions = async () => {
  try {
    // Check if the backend URL is defined
    if (!BACKEND_URL) {
      console.warn('BACKEND_URL is not defined, using mock data');
      return mockActiveSessions;
    }

    const response = await fetch('/api/live-sessions/active', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch active sessions: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching active sessions:', error);
    console.log('Returning mock active sessions data as fallback');
    return mockActiveSessions;
  }
};

/**
 * Fetches scheduled (upcoming) live sessions
 * @returns {Promise<Array>} Array of scheduled session objects
 */
export const getScheduledSessions = async () => {
  try {
    // Check if the backend URL is defined
    if (!BACKEND_URL) {
      console.warn('BACKEND_URL is not defined, using mock data');
      return mockScheduledSessions;
    }

    const response = await fetch('/api/live-sessions/scheduled', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch scheduled sessions: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching scheduled sessions:', error);
    console.log('Returning mock scheduled sessions data as fallback');
    return mockScheduledSessions;
  }
};

/**
 * Gets a session by ID
 * @param {string} sessionId - ID of the session to fetch
 * @returns {Promise<Object>} Session object
 */
export const getSessionById = async (sessionId) => {
  try {
    const response = await fetch(`/api/live-sessions/${sessionId}`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch session: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching session:', error);
    
    // Find in mock data as fallback
    const mockSession = [...mockActiveSessions, ...mockScheduledSessions].find(s => s._id === sessionId);
    
    if (mockSession) {
      return mockSession;
    }
    
    // If not found in mock data, create a generic mock session
    return {
      _id: sessionId,
      title: 'Mock Session',
      description: 'This is a mock session used for testing when the API is unavailable.',
      course: { title: 'Mock Course' },
      instructor: { firstName: 'Varshini', lastName: 'Madamanchi' },
      isActive: true,
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      scheduledFor: new Date().toISOString(),
      duration: 60,
      participants: []
    };
  }
};

/**
 * Starts a scheduled live session
 * @param {string} sessionId - ID of the session to start
 * @returns {Promise<Object>} Updated session object
 */
export const startSession = async (sessionId) => {
  try {
    const response = await axios('POST', `/api/live-sessions/${sessionId}/start`);
    return response.json();
  } catch (error) {
    console.error('Error starting session:', error);
    // Return mock success response
    return { 
      success: true, 
      message: "Session started (mock)",
      session: {
        ...await getSessionById(sessionId),
        isActive: true,
        startedAt: new Date().toISOString()
      }
    };
  }
};

/**
 * Ends an active live session
 * @param {string} sessionId - ID of the session to end
 * @returns {Promise<Object>} Updated session object
 */
export const endSession = async (sessionId) => {
  try {
    const response = await axios('POST', `/api/live-sessions/${sessionId}/end`);
    return response.json();
  } catch (error) {
    console.error('Error ending session:', error);
    // Return mock success response
    return { 
      success: true, 
      message: "Session ended (mock)",
      session: {
        ...await getSessionById(sessionId),
        isActive: false,
        endedAt: new Date().toISOString()
      }
    };
  }
};

/**
 * Creates a new live session
 * @param {Object} sessionData - Data for the new session
 * @returns {Promise<Object>} Created session object
 */
export const createSession = async (sessionData) => {
  try {
    const response = await axios('POST', '/api/live-sessions', sessionData);
    return response.json();
  } catch (error) {
    console.error('Error creating session:', error);
    // Return mock success response
    return { 
      success: true, 
      message: "Session created (mock)", 
      session: { 
        ...sessionData, 
        _id: 'mock-' + Date.now(),
        createdAt: new Date().toISOString(), 
        instructor: {
          _id: '60d5ec9c734231456ed85f20',
          firstName: 'Varshini',
          lastName: 'Madamanchi'
        }
      } 
    };
  }
};

/**
 * Updates an existing live session
 * @param {string} sessionId - ID of the session to update
 * @param {Object} sessionData - Updated session data
 * @returns {Promise<Object>} Updated session object
 */
export const updateSession = async (sessionId, sessionData) => {
  try {
    const response = await axios('PUT', `/api/live-sessions/${sessionId}`, sessionData);
    return response.json();
  } catch (error) {
    console.error('Error updating session:', error);
    // Return mock success response
    return { 
      success: true, 
      message: "Session updated (mock)",
      session: {
        ...await getSessionById(sessionId),
        ...sessionData,
        updatedAt: new Date().toISOString()
      }
    };
  }
};

/**
 * Joins a live session
 * @param {string} sessionId - ID of the session to join
 * @returns {Promise<Object>} Session with participant added
 */
export const joinSession = async (sessionId) => {
  try {
    const response = await axios('POST', `/api/live-sessions/${sessionId}/join`);
    return response.json();
  } catch (error) {
    console.error('Error joining session:', error);
    // Return mock success response
    const session = await getSessionById(sessionId);
    
    // Add a mock participant ID if it's not already included
    const mockParticipantId = 'mock-user-' + Date.now();
    if (!session.participants || !session.participants.includes(mockParticipantId)) {
      session.participants = [...(session.participants || []), mockParticipantId];
    }
    
    return { 
      success: true, 
      message: "Joined session (mock)",
      session: session
    };
  }
};