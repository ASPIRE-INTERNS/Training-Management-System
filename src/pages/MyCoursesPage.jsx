// client/src/pages/MyCoursesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import enrollmentService from '../services/enrollmentService';
import { AlertCircle, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';

const MyCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const data = await enrollmentService.getMyEnrollments();
        setEnrollments(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        setError('Failed to load your courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    fetchEnrollments();
  };

  const fetchEnrollments = async () => {
    try {
      const data = await enrollmentService.getMyEnrollments();
      setEnrollments(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      setError('Failed to load your courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbar>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">My Enrolled Courses</h1>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your courses...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-md border border-red-100">
            <div className="flex items-start">
              <div className="text-red-500 mr-3">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-red-800 font-medium">Failed to load your courses</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <button 
                  onClick={retryFetch}
                  className="mt-3 bg-white border border-red-300 text-red-700 px-4 py-2 rounded hover:bg-red-50 transition"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-500 mb-4">
              <BookOpen className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">No courses yet</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              You haven't enrolled in any courses yet. Explore our catalog to find courses that match your interests.
            </p>
            <Link 
              to="/courses" 
              className="bg-primary hover:bg-primary-700 text-white py-2.5 px-5 rounded-md font-medium transition inline-flex items-center"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map(enrollment => (
              <div 
                key={enrollment._id} 
                className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-[1.02] hover:shadow-lg"
              >
                {enrollment.course.coverImage && (
                  <img 
                    src={enrollment.course.coverImage} 
                    alt={enrollment.course.title} 
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">
                    {enrollment.course.title}
                  </h2>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Enrolled on: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                    </p>
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-gray-700">
                          Progress: {enrollment.progress}%
                        </p>
                        {enrollment.course.totalModules && (
                          <span className="text-xs text-gray-500">
                            {enrollment.course.completedModules}/{enrollment.course.totalModules} modules
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${enrollment.isCompleted ? 'bg-green-500' : 'bg-primary'}`} 
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link 
                      to={`/courses/${enrollment.course._id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View Course
                    </Link>
                    {enrollment.isCompleted ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">
                        Completed
                      </span>
                    ) : (
                      <Link 
                        to={`/my-courses/${enrollment._id}`}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                      >
                        Continue
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Navbar>
  );
};

export default MyCoursesPage;