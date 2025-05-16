// client/src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || ''
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await authService.updateProfile(formData);
      setSuccess(true);
      setEditing(false);
      // In a real app, you might want to update the currentUser context as well
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <p className="text-green-700">Profile updated successfully!</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            )}
          </div>
          
          {editing ? (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="text-lg">{currentUser.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="text-lg">{currentUser.lastName}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg">{currentUser.email}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500">Username</p>
                <p className="text-lg">{currentUser.username}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-lg capitalize">{currentUser.role ? currentUser.role.replace('_', ' ') : ''}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;