// src/pages/MyCoursesPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MyCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // For now, just set loading to false
    // We'll implement actual API calls later
    setLoading(false);
  }, []);

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>

      {loading ? (
        <div>Loading your courses...</div>
      ) : enrollments && enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map(enrollment => (
            <div key={enrollment._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{enrollment.course.title}</h2>
                <p className="text-gray-600 mb-4">{enrollment.course.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span>Progress</span>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full" 
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <Link 
                  to={`/courses/${enrollment.course._id}`} 
                  className="block bg-blue-500 text-white rounded py-2 px-4 text-center"
                >
                  Continue Learning
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="mt-4 inline-block bg-blue-500 text-white rounded py-2 px-6">
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;