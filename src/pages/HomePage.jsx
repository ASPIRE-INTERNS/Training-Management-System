// client/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4">
      <div className="min-h-[70vh] flex items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Training Management System
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Streamline your training programs with our comprehensive platform.
              Track progress, manage courses, and enhance your learning experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg text-center"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-center"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-blue-100 w-full h-[400px] rounded-xl flex items-center justify-center">
              <div className="text-6xl">📚</div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Course Management</h3>
            <p className="text-gray-600">
              Create and manage courses with detailed tracking of materials, schedules, and progress.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Attendance Tracking</h3>
            <p className="text-gray-600">
              Track attendance for all training sessions with detailed reports and analytics.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Reporting</h3>
            <p className="text-gray-600">
              Monitor trainee progress with comprehensive reports and analytics dashboards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;