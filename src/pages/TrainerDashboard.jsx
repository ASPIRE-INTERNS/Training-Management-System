import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';
import { getScheduledSessions, startSession } from '../services/liveSessionService';
import { 
  FaBook, 
  FaUserGraduate, 
  FaCalendarAlt, 
  FaChalkboardTeacher 
} from 'react-icons/fa';

const TrainerDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all data at once without depending on each other
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Dashboard: Starting data fetch');
        
        // Load data even if user is not fully loaded yet
        const coursesData = await courseService.getAllCourses();
        console.log('Dashboard: Courses data received:', coursesData);
        
        // Set all courses, we'll filter in the UI
        setCourses(coursesData);
        
        // Get some enrollments for display
        const enrollmentPromises = [];
        if (coursesData.length > 0) {
          // Get enrollments for up to 2 courses
          const coursesToFetch = coursesData.slice(0, 2);
          for (const course of coursesToFetch) {
            enrollmentPromises.push(enrollmentService(course._id));
          }
        }
        
        // Wait for all enrollment requests
        const enrollmentsResults = await Promise.all(enrollmentPromises);
        // Flatten the results
        const allEnrollments = enrollmentsResults.flat();
        console.log('Dashboard: Enrollments data received:', allEnrollments);
        setEnrollments(allEnrollments);
        
        // Fetch upcoming live sessions
        const scheduledSessionsData = await getScheduledSessions();
        console.log('Dashboard: Scheduled sessions data received:', scheduledSessionsData);
        
        // Sort sessions by date (closest first)
        const sortedSessions = scheduledSessionsData.sort((a, b) => 
          new Date(a.scheduledFor) - new Date(b.scheduledFor)
        );
        
        setUpcomingSessions(sortedSessions);
        console.log('Dashboard: All data fetched successfully');
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        // setError('Failed to load dashboard data');
      } finally {
        // Always set loading to false, even if there was an error
        setLoading(false);
      }
    };

    fetchData();
  }, []);  // Only load once when component mounts, not dependent on user

  const handleStartSession = async (sessionId) => {
    try {
      await startSession(sessionId);
      // Redirect to the live session page
      window.location.href = `/live-session/${sessionId}`;
    } catch (err) {
      setError('Failed to start session');
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Helper function to display time until session starts
  const getTimeUntil = (dateString) => {
    const now = new Date();
    const sessionDate = new Date(dateString);
    const diffMs = sessionDate - now;
    
    if (diffMs <= 0) return 'Starting soon';
    
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 60) return `In ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `In ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `In ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  // Filter courses for this trainer (do this in the render phase, not during data fetch)
  const myCourses = user && user._id ? 
    courses.filter(course => course.instructor && course.instructor._id === user._id) : 
    courses;
    
  // Calculate dashboard stats
  const totalStudents = enrollments.length;
  const totalCourses = myCourses.length;
  const activeStudents = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
  const completedStudents = enrollments.filter(e => e.completed).length;
  const scheduledSessionsCount = upcomingSessions.length;

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Welcome to your Training Dashboard, {user?.firstName || 'Trainer'}!</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <FaBook className="text-purple-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">My Courses</p>
                <h3 className="text-2xl font-bold">{totalCourses}</h3>
              </div>
            </div>
            <Link to="/my-courses" className="text-purple-500 text-sm hover:underline">Manage courses</Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaUserGraduate className="text-blue-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Total Students</p>
                <h3 className="text-2xl font-bold">{totalStudents}</h3>
              </div>
            </div>
            <Link to="/my-students" className="text-blue-500 text-sm hover:underline">View all students</Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaChalkboardTeacher className="text-green-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Active Students</p>
                <h3 className="text-2xl font-bold">{activeStudents}</h3>
              </div>
            </div>
            <p className="text-gray-500 text-sm">{completedStudents} students completed</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <FaCalendarAlt className="text-orange-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500">Upcoming Sessions</p>
                <h3 className="text-2xl font-bold">{scheduledSessionsCount}</h3>
              </div>
            </div>
            <Link to="/live-sessions" className="text-orange-500 text-sm hover:underline">View all sessions</Link>
          </div>
        </div>

        {/* Recent Students Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Students</h2>
          {enrollments.length === 0 ? (
            <p className="text-gray-500">No students enrolled in your courses yet.</p>
          ) : (
            <div className="space-y-4">
              {enrollments.slice(0, 4).map(enrollment => (
                <div key={enrollment._id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-medium">
                      {enrollment.user?.firstName || 'Student'} {enrollment.user?.lastName || ''}
                    </h3>
                    <p className="text-sm text-gray-500">Progress: {enrollment.progress}%</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    enrollment.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {enrollment.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              ))}
              {enrollments.length > 4 && (
                <Link to="/my-students" className="text-blue-600 font-medium hover:underline block mt-4">
                  View all students
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;