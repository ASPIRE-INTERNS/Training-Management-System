// frontend/src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          TrainPro
        </Link>
        
        <div className="navbar-menu">
          {currentUser ? (
            <>
              <Link 
                to="/courses" 
                className={location.pathname === '/courses' ? 'active' : ''}
              >
                Courses
              </Link>
              
              <Link 
                to="/dashboard" 
                className={location.pathname === '/dashboard' ? 'active' : ''}
              >
                Dashboard
              </Link>
              
              <Link 
                to="/my-trainings" 
                className={location.pathname === '/my-trainings' ? 'active' : ''}
              >
                My Trainings
              </Link>
              
              <div className="navbar-right">
                <Link to="/profile" className="profile-link">
                  Profile
                </Link>
                <button onClick={logout} className="logout-button">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="navbar-right">
              <Link to="/login">Login</Link>
              <Link to="/register" className="register-button">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;