import axios from 'axios';

// Get all courses
export const getCourses = async () => {
  const res = await axios.get('/api/courses');
  return res.data;
};

// Get single course
export const getCourse = async (id) => {
  const res = await axios.get(`/api/courses/${id}`);
  return res.data;
};

// Create new course (trainer/manager only)
export const createCourse = async (courseData) => {
  const res = await axios.post('/api/courses', courseData);
  return res.data;
};

// Update course (trainer/manager only)
export const updateCourse = async (id, courseData) => {
  const res = await axios.put(`/api/courses/${id}`, courseData);
  return res.data;
};

// Delete course (manager only)
export const deleteCourse = async (id) => {
  const res = await axios.delete(`/api/courses/${id}`);
  return res.data;
};

// Add material to course (trainer/manager only)
export const addMaterial = async (courseId, materialData) => {
  const res = await axios.post(`/api/courses/${courseId}/materials`, materialData);
  return res.data;
};