import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import TraineeDashboard from './TraineeDashboard';
import TrainerDashboard from './TrainerDashboard';
import ManagerDashboard from './ManagerDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // Render dashboard based on user role
  const renderDashboard = () => {
    switch (user.role) {
      case 'trainee':
        return <TraineeDashboard />;
      case 'trainer':
        return <TrainerDashboard />;
      case 'trainer_manager':
        return <ManagerDashboard />;
      default:
        return <TraineeDashboard />;
    }
  };

  return renderDashboard();
};

export default Dashboard;