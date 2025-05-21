// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
          setCurrentUser(null);
          return;
        }

        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error loading user:', error);
        setError('Authentication error. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const refreshToken = async () => {
    try {
      setIsRefreshing(true);
      const token = localStorage.getItem('token');

      if (!token) throw new Error('No token available');

      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to refresh token');

      const data = await response.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setCurrentUser(data.user);
      return data.token;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      setError('Your session expired. Please log in again.');
      return null;
    } finally {
      setIsRefreshing(false);
    }
  };

  const apiRequest = async (url, method = 'GET', body = null) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      };

      const options = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
      };

      let response = await fetch(url, options);

      if (response.status === 401) {
        const errorData = await response.json();

        if (errorData.expired) {
          const newToken = await refreshToken();
          if (newToken) {
            options.headers.Authorization = `Bearer ${newToken}`;
            response = await fetch(url, options);
          } else {
            throw new Error('Session expired');
          }
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentUser(data.user);

      return true;
    } catch (error) {
      setError(error.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentUser(data.user);

      return true;
    } catch (error) {
      setError(error.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const clearError = () => setError(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const value = {
    user: currentUser,     // ✅ alias for convenience
    currentUser,           // keep original
    loading,
    error,
    login,
    register,
    logout,
    getAuthHeader,
    clearError,
    apiRequest,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
