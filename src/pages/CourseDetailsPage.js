// src/pages/CourseDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // For now, just set loading to false
    // We'll implement actual API calls later
    setLoading(false);
  }, [id]);

  return (
    <div className="container mx-auto mt-8 p-4">
      {loading ? (
        <div>Loading course details...</div>
      ) : course ? (
        <div>
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <p className="text-gray-700 mb-4">{course.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-gray-500 block">Duration</span>
                <span className="font-medium">{course.duration}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-gray-500 block">Level</span>
                <span className="font-medium">{course.level}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-gray-500 block">Instructor</span>
                <span className="font-medium">{course.instructor}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="bg-blue-500 text-white py-2 px-6 rounded-lg">
                Enroll in Course
              </button>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Course Materials</h2>
            {course.materials && course.materials.length > 0 ? (
              <div className="bg-white shadow-md rounded-lg p-6">
                <ul className="divide-y">
                  {course.materials.map((material, index) => (
                    <li key={index} className="py-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{material.title}</span>
                        <a 
                          href={material.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Download
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500">No materials available for this course yet.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">Course not found.</p>
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;