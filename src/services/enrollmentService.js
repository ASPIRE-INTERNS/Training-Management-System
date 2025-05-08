// client/src/services/enrollmentService.js
const API_URL = '/api/enrollments';

// Helper function to handle response
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Get auth header
const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Get user's enrollments
const getMyEnrollments = async () => {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
};

// Enroll in a course
const enrollInCourse = async (courseId) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ courseId })
  });
  return handleResponse(response);
};

// Update enrollment progress
const updateProgress = async (enrollmentId, progress) => {
  const response = await fetch(`${API_URL}/${enrollmentId}/progress`, {
    method: 'PUT',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ progress })
  });
  return handleResponse(response);
};

// Mark course as completed
const markAsCompleted = async (enrollmentId) => {
  const response = await fetch(`${API_URL}/${enrollmentId}/complete`, {
    method: 'PUT',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
};

// Get enrollment statistics
const getEnrollmentStats = async () => {
  const response = await fetch(`${API_URL}/stats`, {
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
};

const enrollmentService = {
  getMyEnrollments,
  enrollInCourse,
  updateProgress,
  markAsCompleted,
  getEnrollmentStats
};

export default enrollmentService;