// frontend/src/utils/api.js
import { useAuth } from '../context/AuthContext';

// Custom hook for making API requests with automatic token handling
export const useApi = () => {
  const { apiRequest } = useAuth();
  
  const get = async (endpoint) => {
    return apiRequest(endpoint);
  };
  
  const post = async (endpoint, data) => {
    return apiRequest(endpoint, 'POST', data);
  };
  
  const put = async (endpoint, data) => {
    return apiRequest(endpoint, 'PUT', data);
  };
  
  const del = async (endpoint) => {
    return apiRequest(endpoint, 'DELETE');
  };
  
  return { get, post, put, delete: del };
};