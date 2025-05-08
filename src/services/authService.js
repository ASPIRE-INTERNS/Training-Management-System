// client/src/services/authService.js
const API_URL = '/api/auth';

// Helper function to handle response
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Get auth header
const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Register user
const register = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
};

// Login user
const login = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  return handleResponse(response);
};

// Get current user
const getCurrentUser = async () => {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
};

const authService = {
  register,
  login,
  getCurrentUser
};

export default authService;