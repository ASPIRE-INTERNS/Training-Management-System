import axios from 'axios';

// Record attendance (trainer/manager only)
export const recordAttendance = async (attendanceData) => {
  const res = await axios.post('/api/attendance', attendanceData);
  return res.data;
};

// Get course attendance (trainer/manager only)
export const getCourseAttendance = async (courseId) => {
  const res = await axios.get(`/api/attendance/course/${courseId}`);
  return res.data;
};

// Get my attendance
export const getMyAttendance = async () => {
  const res = await axios.get('/api/attendance/me');
  return res.data;
};