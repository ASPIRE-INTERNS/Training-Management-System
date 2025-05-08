// client/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    attendanceRate: 0,
    upcomingTraining: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const fetchData = async () => {
      try {
        // Here you would typically fetch actual data from your API
        // For now, using setTimeout to simulate async operation
        setTimeout(() => {
          setStats({
            enrolledCourses: 3,
            completedCourses: 1,
            attendanceRate: 85,
            upcomingTraining: [
              {
                id: 1,
                title: 'Introduction to React',
                date: '2025-05-10',
                time: '10:00 AM'
              }
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderTraineeContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">My Learning Progress</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <span className="block text-3xl font-bold text-blue-600">{stats.enrolledCourses}</span>
            <span className="text-gray-600">Enrolled Courses</span>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <span className="block text-3xl font-bold text-green-600">{stats.completedCourses}</span>
            <span className="text-gray-600">Completed Courses</span>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg col-span-2">
            <span className="block text-3xl font-bold text-purple-600">{stats.attendanceRate}%</span>
            <span className="text-gray-600">Attendance Rate</span>
          </div>
        </div>
        <div className="mt-6">
          <Link to="/my-courses" className="text-blue-500 hover:underline">View my courses →</Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Training</h2>
        {stats.upcomingTraining.length > 0 ? (
          <div>
            {stats.upcomingTraining.map(training => (
              <div key={training.id} className="border-b border-gray-200 pb-3 mb-3">
                <h3 className="font-medium">{training.title}</h3>
                <p className="text-sm text-gray-600">
                  Date: {new Date(training.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">Time: {training.time}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming training sessions.</p>
        )}
        <div className="mt-6">
          <Link to="/attendance" className="text-blue-500 hover:underline">View my attendance →</Link>
        </div>
      </div>
    </div>
  );

  const renderTrainerContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">My Courses</h2>
        <p className="text-gray-600 mb-4">Manage the courses you're instructing.</p>
        <Link to="/courses" className="block bg-blue-500 text-white rounded py-2 px-4 text-center">
          View My Courses
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Attendance Management</h2>
        <p className="text-gray-600 mb-4">Track attendance for your trainees.</p>
        <Link to="/attendance" className="block bg-blue-500 text-white rounded py-2 px-4 text-center">
          Manage Attendance
        </Link>
      </div>
    </div>
  );

  const renderManagerContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <p className="text-gray-600 mb-4">Manage trainers and trainees.</p>
        <Link to="/users" className="block bg-blue-500 text-white rounded py-2 px-4 text-center">
          Manage Users
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Course Management</h2>
        <p className="text-gray-600 mb-4">Create and manage training courses.</p>
        <Link to="/courses" className="block bg-blue-500 text-white rounded py-2 px-4 text-center">
          Manage Courses
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Reports</h2>
        <p className="text-gray-600 mb-4">View training program analytics.</p>
        <Link to="/reports" className="block bg-blue-500 text-white rounded py-2 px-4 text-center">
          View Reports
        </Link>
      </div>
    </div>
  );

  const renderDashboardContent = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case 'trainee':
        return renderTraineeContent();
      case 'trainer':
        return renderTrainerContent();
      case 'trainer_manager':
      case 'manager':
        return renderManagerContent();
      default:
        return renderTraineeContent();
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {currentUser && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold">Welcome, {currentUser.firstName}!</h2>
          <p className="text-gray-600">Your role: {currentUser.role}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading dashboard data...</p>
        </div>
      ) : (
        renderDashboardContent()
      )}
    </div>
  );
};

export default DashboardPage;