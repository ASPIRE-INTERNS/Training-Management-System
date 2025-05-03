import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-primary-light h-32 flex items-center justify-center">
        <h3 className="text-3xl text-primary">{course.title.charAt(0)}</h3>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        <div className="flex justify-between items-center">
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
            {course.level}
          </span>
          <span className="text-gray-500 text-sm">{course.duration}</span>
        </div>
        <Link 
          to={`/courses/${course._id}`} 
          className="block mt-4 bg-primary text-white text-center py-2 rounded hover:bg-primary-dark"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;