// client/src/pages/MyCoursesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import enrollmentService from '../services/enrollmentService';

const MyCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await enrollmentService.getMyEnrollments();
        setEnrollments(data);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        // setError('Failed to load your courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Enrolled Courses</h1>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading your courses...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
          <Link 
            to="/courses" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map(enrollment => (
            <div key={enrollment._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {enrollment.course.coverImage && (
                <img 
                  src={enrollment.course.coverImage} 
                  alt={enrollment.course.title} 
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{enrollment.course.title}</h2>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Enrolled on: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Progress: {enrollment.progress}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Link 
                    to={`/courses/${enrollment.course._id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Course
                  </Link>
                  {enrollment.isCompleted ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Completed
                    </span>
                  ) : (
                    <Link 
                      to={`/my-courses/${enrollment._id}`}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
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
  );
};

export default MyCoursesPage;