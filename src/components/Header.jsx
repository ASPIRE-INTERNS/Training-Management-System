import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path if needed

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <Link to="/" className="text-xl font-bold">
            Training Management
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-200">
              Home
            </Link>
            <Link to="/courses" className="hover:text-blue-200">
              Courses
            </Link>
            {user && (
              <>
                <Link to="/dashboard" className="hover:text-blue-200">
                  Dashboard
                </Link>
                {(user.role === 'trainer' || user.role === 'admin') && (
                  <Link to="/manage-sessions" className="hover:text-blue-200">
                    Manage Sessions
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <span className="font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs bg-blue-700 px-2 py-1 rounded ml-2">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-1 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-1 rounded"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;