import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { getCourses } from '../services/courseService';
import { getCourseEnrollments } from '../services/enrollmentService';
import { Link } from 'react-router-dom';
import { FaBook, FaUserGraduate, FaCalendarAlt, FaChalkboardTeacher } from 'react-icons/fa';

const TrainerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const coursesData = await getCourses();
        
        // Filter courses taught by this trainer
        const myCourses = coursesData.filter(course => 
          course.instructor && course.instructor._id === user._id
        );
        
        setCourses(myCourses);
        
        // Get enrollments for first course if available
        if (myCourses.length > 0) {
          const enrollmentsData = await getCourseEnrollments(myCourses[0]._id);
          setEnrollments(enrollmentsData);
        }
        
        setLoading(false);
      } catch (error) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, [user._id]);

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate dashboard stats
  const totalStudents = enrollments.length;
  const totalCourses = courses.length;
  const activeStudents = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
  const completedStudents = enrollments.filter(e => e.completed).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Welcome, Trainer {user.firstName}!</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <FaBook className="text-purple-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">My Courses</p>
                <h3 className="text-2xl font-bold">{totalCourses}</h3>
              </div>
            </div>
            <Link to="/my-courses" className="text-purple-500 text-sm hover:underline">Manage courses</Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaUserGraduate className="text-blue-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Total Students</p>
                <h3 className="text-2xl font-bold">{totalStudents}</h3>
              </div>
            </div>
            <Link to="/students" className="text-blue-500 text-sm hover:underline">View all students</Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaChalkboardTeacher className="text-green-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Active Students</p>
                <h3 className="text-2xl font-bold">{activeStudents}</h3>
              </div>
            </div>
            <p className="text-gray-500 text-sm">{completedStudents} students completed</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <FaCalendarAlt className="text-orange-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Upcoming Sessions</p>
                <h3 className="text-2xl font-bold">0</h3>
              </div>
            </div>
            <Link to="/manage-attendance" className="text-orange-500 text-sm hover:underline">Manage attendance</Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Courses</h2>
              <Link to="/courses/create" className="text-sm bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark">
                Create Course
              </Link>
            </div>
            
            {courses.length === 0 ? (
              <p className="text-gray-500">You haven't created any courses yet.</p>
            ) : (
              <div className="space-y-4">
                {courses.slice(0, 3).map(course => (
                  <div key={course._id} className="border-b pb-3">
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.description.substring(0, 100)}...</p>
                    <div className="mt-2">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {course.level}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">{course.duration}</span>
                    </div>
                  </div>
                ))}
                {courses.length > 3 && (
                  <Link to="/my-courses" className="text-primary font-medium hover:underline block mt-4">
                    View all courses
                  </Link>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Students</h2>
            {enrollments.length === 0 ? (
              <p className="text-gray-500">No students enrolled in your courses yet.</p>
            ) : (
              <div className="space-y-4">
                {enrollments.slice(0, 4).map(enrollment => (
                  <div key={enrollment._id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-medium">{enrollment.user.firstName} {enrollment.user.lastName}</h3>
                      <p className="text-sm text-gray-500">Progress: {enrollment.progress}%</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      enrollment.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {enrollment.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                ))}
                {enrollments.length > 4 && (
                  <Link to="/students" className="text-primary font-medium hover:underline block mt-4">
                    View all students
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;