// client/src/pages/CourseDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseById(id);
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError('Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!currentUser) return;
    
    setEnrolling(true);
    try {
      await enrollmentService.enrollInCourse(id);
      setEnrollmentStatus('success');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setEnrollmentStatus('error');
    } finally {
      setEnrolling(false);
    }
  };

  const isAdmin = currentUser && 
    (currentUser.role === 'trainer' || 
     currentUser.role === 'trainer_manager' ||
     currentUser.role === 'manager');

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4">Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
          <Link to="/courses" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-10">
          <p className="text-gray-500">Course not found.</p>
          <Link to="/courses" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link to="/courses" className="text-blue-600 hover:underline">
          ← Back to Courses
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {course.coverImage && (
          <div className="w-full h-64 bg-gray-200">
            <img 
              src={course.coverImage} 
              alt={course.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            {isAdmin && (
              <Link 
                to={`/courses/${id}/edit`} 
                className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
              >
                Edit Course
              </Link>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-blue-50 rounded-full px-3 py-1 text-sm text-blue-700">
              Level: {course.level}
            </div>
            <div className="bg-green-50 rounded-full px-3 py-1 text-sm text-green-700">
              Duration: {course.duration}
            </div>
            <div className="bg-purple-50 rounded-full px-3 py-1 text-sm text-purple-700">
              Instructor: {course.instructor?.firstName} {course.instructor?.lastName}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Course Description</h2>
            <p className="text-gray-700">{course.description}</p>
          </div>

          {currentUser && currentUser.role === 'trainee' && (
            <div className="mt-6">
              {enrollmentStatus === 'success' ? (
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-green-800">You have successfully enrolled in this course!</p>
                  <Link to="/my-courses" className="text-blue-600 hover:underline mt-2 inline-block">
                    Go to My Courses
                  </Link>
                </div>
              ) : enrollmentStatus === 'error' ? (
                <div className="bg-red-50 p-4 rounded-md">
                  <p className="text-red-700">Failed to enroll in this course. Please try again.</p>
                  <button 
                    onClick={handleEnroll} 
                    className="text-blue-600 hover:underline mt-2 inline-block"
                    disabled={enrolling}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-medium"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;