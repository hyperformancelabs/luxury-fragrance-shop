import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8080/api/v1';

// Get employee profile
const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/employees/profile`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi kết nối đến máy chủ' };
  }
};

// Update employee profile
const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/employees/profile`, profileData, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi kết nối đến máy chủ' };
  }
};

const employeeService = {
  getProfile,
  updateProfile
};

export default employeeService;
