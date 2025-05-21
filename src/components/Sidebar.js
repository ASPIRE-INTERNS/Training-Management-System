import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, 
  FaBook, 
  FaCalendarAlt, 
  FaUserAlt, 
  FaChartBar, 
  FaUsers, 
  FaFileAlt 
} from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100';
  };

  // Different menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      { path: '/dashboard', name: 'Dashboard', icon: <FaHome /> },
      { path: '/profile', name: 'Profile', icon: <FaUserAlt /> },
    ];

    const traineeItems = [
      { path: '/courses', name: 'Available Courses', icon: <FaBook /> },
      { path: '/my-courses', name: 'My Courses', icon: <FaCalendarAlt /> },
      { path: '/attendance', name: 'My Attendance', icon: <FaCalendarAlt /> },
    ];

    const trainerItems = [
      { path: '/courses', name: 'All Courses', icon: <FaBook /> },
      { path: '/my-courses', name: 'My Courses', icon: <FaBook /> },
      { path: '/manage-attendance', name: 'Manage Attendance', icon: <FaCalendarAlt /> },
      { path: '/students', name: 'My Students', icon: <FaUsers /> },
    ];

    const managerItems = [
      { path: '/courses', name: 'All Courses', icon: <FaBook /> },
      { path: '/trainers', name: 'Trainers', icon: <FaUsers /> },
      { path: '/trainees', name: 'Trainees', icon: <FaUsers /> },
      { path: '/reports', name: 'Reports', icon: <FaChartBar /> },
    ];

    switch (user.role) {
      case 'trainee':
        return [...commonItems, ...traineeItems];
      case 'trainer':
        return [...commonItems, ...trainerItems];
      case 'trainer_manager':
        return [...commonItems, ...managerItems];
      default:
        return commonItems;
    }
  };

  return (
    <div className="bg-white w-64 min-h-screen shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
        <p className="text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
      </div>
      <nav className="mt-4">
        <ul>
          {getMenuItems().map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 ${isActive(item.path)}`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;