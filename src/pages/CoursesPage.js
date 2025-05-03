// src/pages/CoursesPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, just set loading to false
    // We'll implement actual API calls later
    setLoading(false);
  }, []);

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Available Courses</h1>
      
      {loading ? (
        <div>Loading courses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses && courses.length > 0 ? (
            courses.map(course => (
              <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">Duration: {course.duration}</span>
                    <span className="text-sm text-gray-500">Level: {course.level}</span>
                  </div>
                  <Link 
                    to={`/courses/${course._id}`} 
                    className="block mt-4 bg-blue-500 text-white rounded py-2 px-4 text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No courses available at the moment.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;