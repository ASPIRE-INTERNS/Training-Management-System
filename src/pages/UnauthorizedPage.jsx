// src/pages/UnauthorizedPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">403</h1>
        <p className="text-2xl font-medium text-gray-600 mt-4">Unauthorized Access</p>
        <p className="text-gray-500 mt-2">
          You do not have permission to access this page.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-blue-500 text-white py-2 px-6 rounded-lg"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;