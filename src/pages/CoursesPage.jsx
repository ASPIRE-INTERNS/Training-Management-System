// client/src/pages/CoursesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const isAdmin = currentUser && 
    (currentUser.role === 'trainer' || 
     currentUser.role === 'trainer_manager' ||
     currentUser.role === 'manager');

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Available Courses</h1>
        {isAdmin && (
          <Link 
            to="/courses/create" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Create Course
          </Link>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading courses...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No courses available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {course.coverImage && (
                <img 
                  src={course.coverImage} 
                  alt={course.title} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  Level: {course.level} | Duration: {course.duration}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Instructor: {course.instructor?.firstName} {course.instructor?.lastName}
                </p>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {course.description}
                </p>
                <div className="flex justify-between">
                  <Link 
                    to={`/courses/${course._id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </Link>
                  {currentUser && currentUser.role === 'trainee' && (
                    <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                      Enroll Now
                    </button>
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

export default CoursesPage;