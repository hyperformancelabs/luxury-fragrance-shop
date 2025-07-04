import axios from 'axios';
import authService from './authService';

// Centralized Axios instance for admin app
// Automatically attaches Authorization header if user is logged in
// Base URL already includes /api/v1 so individual service calls only need path after that.
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor – inject JWT
apiClient.interceptors.request.use(
  (config) => {
    const { Authorization } = authService.getAuthHeader();
    if (Authorization) {
      config.headers.Authorization = Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient; 