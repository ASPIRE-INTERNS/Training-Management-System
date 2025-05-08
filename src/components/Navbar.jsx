// client/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">
            TrainPro
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/courses" className="hover:text-blue-200">
              Courses
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200">
                  Dashboard
                </Link>
                
                {currentUser.role === 'trainee' && (
                  <Link to="/my-courses" className="hover:text-blue-200">
                    My Courses
                  </Link>
                )}
                
                {currentUser.role === 'trainer' && (
                  <Link to="/attendance" className="hover:text-blue-200">
                    Attendance
                  </Link>
                )}
                
                {(currentUser.role === 'trainer_manager' || currentUser.role === 'manager') && (
                  <Link to="/manage-courses" className="hover:text-blue-200">
                    Manage
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center hover:text-blue-200">
                    <span>{currentUser.firstName}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="bg-transparent hover:bg-blue-700 text-white font-semibold hover:text-white py-2 px-4 border border-white hover:border-transparent rounded"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 hover:bg-blue-100 font-semibold py-2 px-4 border border-white rounded"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;