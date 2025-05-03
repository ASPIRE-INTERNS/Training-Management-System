import axios from 'axios';

// Get my enrollments
export const getMyEnrollments = async () => {
  const res = await axios.get('/api/enrollments/me');
  return res.data;
};

// Enroll in a course
export const enrollCourse = async (courseId) => {
  const res = await axios.post('/api/enrollments', { courseId });
  return res.data;
};

// Update enrollment progress
export const updateProgress = async (enrollmentId, progress) => {
  const res = await axios.put(`/api/enrollments/${enrollmentId}`, { progress });
  return res.data;
};

// Get course enrollments (trainer/manager only)
export const getCourseEnrollments = async (courseId) => {
  const res = await axios.get(`/api/enrollments/course/${courseId}`);
  return res.data;
};