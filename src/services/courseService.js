const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';

// Handle response utility
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
  const response = await fetch(`${BACKEND_URL}/api/courses`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    }
  });
  return handleResponse(response);
};

// Get course by ID
const getCourseById = async (courseId) => {
  const response = await fetch(`${BACKEND_URL}/api/courses/${courseId}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    }
  });
  return handleResponse(response);
};

// Create a new course (trainer/manager only)
const createCourse = async (courseData) => {
  const response = await fetch(`${BACKEND_URL}/api/courses`, {
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
  const response = await fetch(`${BACKEND_URL}/api/courses/${courseId}`, {
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
  const response = await fetch(`${BACKEND_URL}/api/courses/${courseId}`, {
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
