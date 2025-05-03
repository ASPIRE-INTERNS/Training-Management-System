// src/pages/ProfilePage.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      {user && (
        <div className="bg-white shadow-md rounded p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-600">@{user.username}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
              <p className="text-gray-700"><strong>Role:</strong> {user.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;