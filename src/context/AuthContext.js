import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  isAuthenticated: false
};

// Check token expiration
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwt_decode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    return true;
  }
};

// Create context
export const AuthContext = createContext(initialState);

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    default:
      return state;
  }
};

// Create provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios interceptors for JWT
  axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // Load user on first run or refresh
  useEffect(() => {
    const loadUser = async () => {
      // Check if token exists and is not expired
      const token = localStorage.getItem('token');
      if (token && !isTokenExpired(token)) {
        try {
          const res = await axios.get('/api/auth/me');
          dispatch({ 
            type: 'LOAD_USER', 
            payload: { ...res.data, token }
          });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ 
            type: 'LOGIN_FAIL', 
            payload: 'Session expired. Please log in again.'
          });
        }
      } else if (token && isTokenExpired(token)) {
        localStorage.removeItem('token');
        dispatch({ 
          type: 'LOGIN_FAIL', 
          payload: 'Session expired. Please log in again.'
        });
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (userData) => {
    dispatch({ type: 'REGISTER_REQUEST' });

    try {
      const res = await axios.post('/api/auth/register', userData);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: error.response?.data?.message || 'Registration failed'
      });
    }
  };

  // Login user
  const login = async (userData) => {
    dispatch({ type: 'LOGIN_REQUEST' });

    try {
      const res = await axios.post('/api/auth/login', userData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: error.response?.data?.message || 'Invalid credentials'
      });
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        register,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};