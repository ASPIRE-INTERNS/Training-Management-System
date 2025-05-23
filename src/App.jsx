// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyTrainingsPage from './pages/MyTrainingsPage';
import CoursesPage from './pages/CoursesPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import LiveSessionsPage from './pages/LiveSessionsPage';
import LiveSessionPage from './pages/LiveSessionPage';
import NotFoundPage from './pages/NotFoundPage';
import TrainerDashboard from './pages/TrainerDashboard';
import TraineeDashboard from './pages/TraineeDashboard';
import MyCoursesPage from './pages/MyCoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import AttendancePage from './pages/AttendancePage';
import './App.css';
import { WebSocketProvider } from './context/WebSocketContext';

const DashboardRouter = () => {
  const { user, loading } = useAuth();
  
  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to appropriate dashboard based on user role
  if (user) {
    if (user.role === 'trainer' || user.role === 'trainer_manager') {
      return <TrainerDashboard />;
    } else {
      // Default to trainee dashboard for all other roles
      return <TraineeDashboard />;
    }
  }
  
  // Redirect to login if not authenticated
  return <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <useAuth>
        <WebSocketProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ProtectedRoute><DashboardRouter/></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter/></ProtectedRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/my-trainings" element={<ProtectedRoute><MyTrainingsPage /></ProtectedRoute>} />
              <Route path="/my-courses" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />
              <Route path="/courses/:id" element={<ProtectedRoute><CourseDetailsPage /></ProtectedRoute>} />
              <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
              <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/live-sessions" element={<ProtectedRoute><LiveSessionsPage /></ProtectedRoute>} />
        <Route path="/training-sessions/:id" element={<LiveSessionPage />} /> 
        {/* <Route path="/create-session" element={<CreateSessionPage />} /> */}
            </Routes>
          </main>
        </div>
        </WebSocketProvider>
      </useAuth>
    </Router>
  );
}

export default App;