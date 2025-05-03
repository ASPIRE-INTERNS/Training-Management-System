import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar bg-primary text-white p-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">TrainPro</Link>
        
        <div className="flex items-center">
          {isAuthenticated ? (
            <>
              <span className="mr-4">Hello, {user.firstName}</span>
              <div className="relative group">
                <button className="px-3 py-2 rounded hover:bg-primary-dark">
                  Menu
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg hidden group-hover:block">
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <Link to="/login" className="px-3 py-2 mr-2 rounded hover:bg-primary-dark">Login</Link>
              <Link to="/register" className="px-3 py-2 rounded bg-white text-primary hover:bg-gray-100">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;