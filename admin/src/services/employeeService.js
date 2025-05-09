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

// Get roles with employee counts
const getRolesWithEmployeeCount = async () => {
  try {
    const response = await axios.get(`${API_URL}/emp/roles/with-employee-count`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi lấy danh sách vai trò' };
  }
};

// Get employees list
const getEmployees = async (page = 0, size = 10, status, search, roleId) => {
  try {
    const params = { page, size };
    if (status) params.status = status;
    if (search) params.search = search;
    if (roleId) params.roleId = roleId;
    const response = await axios.get(`${API_URL}/emp/employees`, { params, headers: authService.getAuthHeader() });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi lấy danh sách nhân viên' };
  }
};

// Create new employee
const createEmployee = async (employeeData) => {
  try {
    const response = await axios.post(`${API_URL}/emp/employees`, employeeData, { headers: authService.getAuthHeader() });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi tạo nhân viên' };
  }
};

// Update existing employee
const updateEmployee = async (employeeId, employeeData) => {
  try {
    const response = await axios.put(`${API_URL}/emp/employees/${employeeId}`, employeeData, { headers: authService.getAuthHeader() });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi cập nhật nhân viên' };
  }
};

// Delete employee
const deleteEmployee = async (employeeId, force = false) => {
  try {
    const response = await axios.delete(`${API_URL}/emp/employees/${employeeId}`, { params: { force }, headers: authService.getAuthHeader() });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi xóa nhân viên' };
  }
};

// Get active roles list
const getActiveRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/emp/roles/active`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi lấy vai trò hoạt động' };
  }
};

// Update employee roles (replace existing roles)
const updateEmployeeRoles = async (employeeId, roleIds) => {
  try {
    const response = await axios.put(
      `${API_URL}/emp/employees/${employeeId}/roles`,
      { roleIds },
      { headers: authService.getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi cập nhật vai trò nhân viên' };
  }
};

const employeeService = {
  getProfile,
  updateProfile,
  getRolesWithEmployeeCount,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getActiveRoles,
  updateEmployeeRoles
};

export default employeeService;
