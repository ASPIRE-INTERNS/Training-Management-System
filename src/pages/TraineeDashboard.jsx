import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { getMyEnrollments } from '../services/enrollmentService';
import { getMyAttendance } from '../services/attendanceService';
import { Link } from 'react-router-dom';
import { FaBook, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';

const TraineeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const enrollmentsData = await getMyEnrollments();
        const attendanceData = await getMyAttendance();
        
        setEnrollments(enrollmentsData);
        setAttendance(attendanceData);
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

  // Calculate dashboard stats
  const completedCourses = enrollments.filter(e => e.completed).length;
  const inProgressCourses = enrollments.filter(e => !e.completed).length;
  const upcomingAttendance = attendance.filter(a => new Date(a.date) > new Date()).length;
  const averageProgress = enrollments.length 
    ? Math.round(enrollments.reduce((sum, enr) => sum + enr.progress, 0) / enrollments.length) 
    : 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Welcome, {user.firstName}!</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaBook className="text-blue-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Enrolled Courses</p>
                <h3 className="text-2xl font-bold">{enrollments.length}</h3>
              </div>
            </div>
            <Link to="/my-courses" className="text-blue-500 text-sm hover:underline">View all courses</Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaCheckCircle className="text-green-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Completed</p>
                <h3 className="text-2xl font-bold">{completedCourses}</h3>
              </div>
            </div>
            <p className="text-gray-500 text-sm">{inProgressCourses} courses in progress</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <FaClock className="text-purple-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Average Progress</p>
                <h3 className="text-2xl font-bold">{averageProgress}%</h3>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${averageProgress}%` }}></div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <FaCalendarAlt className="text-orange-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Upcoming Sessions</p>
                <h3 className="text-2xl font-bold">{upcomingAttendance}</h3>
              </div>
            </div>
            <Link to="/attendance" className="text-orange-500 text-sm hover:underline">View attendance</Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">My Courses</h2>
            {enrollments.length === 0 ? (
              <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
            ) : (
              <div className="space-y-4">
                {enrollments.slice(0, 3).map(enrollment => (
                  <div key={enrollment._id} className="border-b pb-3">
                    <h3 className="font-medium">{enrollment.course.title}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{enrollment.progress}%</span>
                    </div>
                  </div>
                ))}
                {enrollments.length > 3 && (
                  <Link to="/my-courses" className="text-primary font-medium hover:underline block mt-4">
                    View all courses
                  </Link>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Attendance</h2>
            {attendance.length === 0 ? (
              <p className="text-gray-500">No attendance records found.</p>
            ) : (
              <div className="space-y-4">
                {attendance.slice(0, 4).map(record => (
                  <div key={record._id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-medium">{record.course.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      record.status === 'present' ? 'bg-green-100 text-green-800' : 
                      record.status === 'absent' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </div>
                ))}
                {attendance.length > 4 && (
                  <Link to="/attendance" className="text-primary font-medium hover:underline block mt-4">
                    View all attendance
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

export default TraineeDashboard;