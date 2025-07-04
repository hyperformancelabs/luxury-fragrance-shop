import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

// Login employee
const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/emp/login`, {
      username,
      password
    });
    
    console.log('API login response:', response.data);
    
    if (response.data.data) {
      // Store user details in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.data));
      console.log('User data stored in localStorage:', response.data.data);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error.response?.data || { message: 'Lỗi kết nối đến máy chủ' };
  }
};

// Logout employee
const logout = () => {
  localStorage.removeItem('user');
};

// Get current user from localStorage
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Check if user is authenticated
const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Get auth header
const getAuthHeader = () => {
  const user = getCurrentUser();
  if (user && user.accessToken) {
    return { Authorization: `Bearer ${user.accessToken}` };
  }
  return {};
};

const authService = {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getAuthHeader
};

export default authService;
