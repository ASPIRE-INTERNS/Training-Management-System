// client/src/services/courseService.js
const API_URL = '/api/courses';

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

// Get all courses
const getAllCourses = async () => {
  const response = await fetch(API_URL, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
};

// Get course by ID
const getCourseById = async (courseId) => {
  const response = await fetch(`${API_URL}/${courseId}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
};

// Create a new course (trainer/manager only)
const createCourse = async (courseData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(courseData)
  });
  return handleResponse(response);
};

// Update a course (trainer/manager only)
const updateCourse = async (courseId, courseData) => {
  const response = await fetch(`${API_URL}/${courseId}`, {
    method: 'PUT',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(courseData)
  });
  return handleResponse(response);
};

// Delete a course (trainer/manager only)
const deleteCourse = async (courseId) => {
  const response = await fetch(`${API_URL}/${courseId}`, {
    method: 'DELETE',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
};

const courseService = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};

export default courseService;