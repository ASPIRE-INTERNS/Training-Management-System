import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { getCourses } from '../services/courseService';
import { Link } from 'react-router-dom';
import { FaBook, FaUserGraduate, FaChalkboardTeacher, FaChartLine } from 'react-icons/fa';
import axios from 'axios';

const ManagerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalTrainees: 0,
    totalTrainers: 0,
    totalCourses: 0,
    activeEnrollments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get all courses
        const coursesData = await getCourses();
        setCourses(coursesData);
        
        // Get user stats
        const usersRes = await axios.get('/api/auth/users');
        const trainees = usersRes.data.filter(u => u.role === 'trainee').length;
        const trainers = usersRes.data.filter(u => u.role === 'trainer').length;
        
        // Get enrollment stats
        const enrollmentsRes = await axios.get('/api/enrollments');
        const activeEnrollments = enrollmentsRes.data.filter(e => !e.completed).length;
        
        setStats({
          totalTrainees: trainees,
          totalTrainers: trainers,
          totalCourses: coursesData.length,
          activeEnrollments
        });
        
        setLoading(false);
      } catch (error) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Welcome, Manager {user.firstName}!</h1>
        
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
                <p className="text-gray-500">Total Courses</p>
                <h3 className="text-2xl font-bold">{stats.totalCourses}</h3>
              </div>
            </div>
            <Link to="/courses" className="text-purple-500 text-sm hover:underline">View all courses</Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaUserGraduate className="text-blue-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Total Trainees</p>
                <h3 className="text-2xl font-bold">{stats.totalTrainees}</h3>
              </div>
            </div>
            <Link to="/trainees" className="text-blue-500 text-sm hover:underline">View all trainees</Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaChalkboardTeacher className="text-green-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Total Trainers</p>
                <h3 className="text-2xl font-bold">{stats.totalTrainers}</h3>
              </div>
            </div>
            <Link to="/trainers" className="text-green-500 text-sm hover:underline">View all trainers</Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <FaChartLine className="text-orange-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Active Enrollments</p>
                <h3 className="text-2xl font-bold">{stats.activeEnrollments}</h3>
              </div>
            </div>
            <Link to="/reports" className="text-orange-500 text-sm hover:underline">View reports</Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Courses</h2>
              <Link to="/courses/create" className="text-sm bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark">
                Create Course
              </Link>
            </div>
            
            {courses.length === 0 ? (
              <p className="text-gray-500">No courses available.</p>
            ) : (
              <div className="space-y-4">
                {courses.slice(0, 3).map(course => (
                  <div key={course._id} className="border-b pb-3">
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.description.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {course.level}
                      </span>
                      <span className="text-sm text-gray-600">
                        by {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Unknown'}
                      </span>
                    </div>
                  </div>
                ))}
                {courses.length > 3 && (
                  <Link to="/courses" className="text-primary font-medium hover:underline block mt-4">
                    View all courses
                  </Link>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Training Performance</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Course Completion Rate</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>65%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Trainer Performance</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>78%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Trainee Engagement</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '52%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>52%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <Link to="/reports" className="text-primary font-medium hover:underline block mt-4">
                View detailed reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;