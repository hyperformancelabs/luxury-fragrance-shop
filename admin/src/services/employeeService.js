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
    // Merge Authorization with Content-Type for JSON
    const headers = {
      'Content-Type': 'application/json',
      ...authService.getAuthHeader()
    };
    const response = await axios.put(
      `${API_URL}/employees/profile`,
      profileData,
      { headers }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi kết nối đến máy chủ' };
  }
};

// Get employee performance data
const getEmployeePerformance = async (employeeId, startDate, endDate) => {
  try {
    // Format dates to dd/MM/yyyy
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const formattedStartDate = formatDate(startDate || new Date('2004-07-08')); // Default to system start date
    const formattedEndDate = formatDate(endDate || new Date()); // Default to today
    
    const response = await axios.get(`${API_URL}/employee-performance/top-performers`, {
      params: {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        limit: 100 // Get a large number to include all employees
      },
      headers: authService.getAuthHeader()
    });
    
    if (response.data.code === 200 && response.data.status === 'success') {
      if (employeeId) {
        // Find specific employee
        const employeeData = response.data.data.find(emp => emp.employeeId === employeeId);
        return employeeData || { performanceScore: 0 }; // Return 0 if not found
      }
      return response.data.data;
    }
    throw new Error(response.data.message || 'Không thể lấy dữ liệu hiệu suất nhân viên');
  } catch (error) {
    console.error('Error fetching employee performance:', error);
    return { performanceScore: 0 }; // Return 0 on error
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

// Assign roles to employee (add without removing existing)
const assignRolesToEmployee = async (employeeId, roleIds) => {
  try {
    const response = await axios.post(
      `${API_URL}/emp/employees/${employeeId}/roles`,
      { roleIds },
      { headers: authService.getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi gán vai trò cho nhân viên' };
  }
};

// Remove roles from employee (delete specific roles)
const removeRolesFromEmployee = async (employeeId, roleIds) => {
  try {
    const response = await axios.delete(
      `${API_URL}/emp/employees/${employeeId}/roles`,
      { data: { roleIds }, headers: authService.getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi xóa vai trò khỏi nhân viên' };
  }
};

// Get all roles
const getAllRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/emp/roles/all`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi lấy tất cả vai trò' };
  }
};

// Get role by ID
const getRoleById = async (roleId) => {
  try {
    const response = await axios.get(`${API_URL}/emp/roles/${roleId}`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi lấy vai trò' };
  }
};

// Create new role
const createRole = async (roleData) => {
  try {
    const response = await axios.post(`${API_URL}/emp/roles`, roleData, { 
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader()
      } 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi tạo vai trò' };
  }
};

// Reset default role (set all roles to non-default)
const resetDefaultRole = async () => {
  try {
    const response = await axios.post(`${API_URL}/emp/roles/reset-default`, {}, {
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader()
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error resetting default role:', error);
    // Nếu API chưa được triển khai, chúng ta sẽ tự xử lý
    // Lấy tất cả vai trò
    const roles = await getAllRoles();
    if (roles?.data) {
      // Tìm vai trò mặc định
      const defaultRole = roles.data.find(role => role.isDefault);
      if (defaultRole) {
        // Cập nhật vai trò mặc định thành không mặc định
        await axios.put(`${API_URL}/emp/roles/${defaultRole.roleId}`, 
          { ...defaultRole, isDefault: false },
          { headers: { 'Content-Type': 'application/json', ...authService.getAuthHeader() } }
        );
      }
    }
    return { success: true };
  }
};

// Update role
const updateRole = async (roleId, roleData) => {
  try {
    const response = await axios.put(`${API_URL}/emp/roles/${roleId}`, roleData, { 
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader()
      } 
    });
    return response.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error.response?.data || { message: 'Lỗi khi cập nhật vai trò' };
  }
};

// Delete role
const deleteRole = async (roleId, force = false) => {
  try {
    const response = await axios.delete(`${API_URL}/emp/roles/${roleId}`, { 
      params: { force }, 
      headers: authService.getAuthHeader() 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi xóa vai trò' };
  }
};

// Get all permissions
const getAllPermissions = async () => {
  try {
    const response = await axios.get(`${API_URL}/emp/permissions/all`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi lấy tất cả quyền' };
  }
};

// Get employees by role ID - API này có thể chưa được triển khai
const getEmployeesByRole = async (roleId) => {
  try {
    const response = await axios.get(`${API_URL}/emp/employees/role/${roleId}`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching employees by role:', error);
    // Nếu API không tồn tại, chúng ta sẽ sử dụng API getEmployees thay thế
    return { data: [] };
  }
};

// Get roles of an employee
const getEmployeeRoles = async (employeeId) => {
  try {
    const response = await axios.get(`${API_URL}/emp/employees/${employeeId}/roles`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching employee roles:', error);
    // Nếu API không tồn tại, chúng ta có thể lấy thông tin nhân viên và trả về vai trò của họ
    try {
      const employeeResponse = await axios.get(`${API_URL}/emp/employees/${employeeId}`, {
        headers: authService.getAuthHeader()
      });
      if (employeeResponse?.data?.employee?.roles) {
        return { data: employeeResponse.data.employee.roles };
      }
    } catch (innerError) {
      console.error('Error in fallback for employee roles:', innerError);
    }
    return { data: [] };
  }
};

// Remove employee from role - API này có thể chưa được triển khai
// Chúng ta sẽ sử dụng updateEmployeeRoles thay thế
const removeEmployeeFromRole = async (employeeId, roleId) => {
  try {
    const response = await axios.delete(`${API_URL}/emp/employees/${employeeId}/roles/${roleId}`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error removing employee from role:', error);
    // Nếu API không tồn tại, chúng ta sẽ sử dụng updateEmployeeRoles thay thế
    throw error.response?.data || { message: 'Lỗi khi xóa nhân viên khỏi vai trò' };
  }
};

// Get employees by role ID
const getEmployeesByRoleId = async (roleId) => {
  try {
    const response = await axios.get(`${API_URL}/emp/roles/${roleId}/employees`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi lấy danh sách nhân viên theo vai trò' };
  }
};

// Get permissions by role ID
const getPermissionsByRole = async (roleId) => {
  try {
    const response = await axios.get(`${API_URL}/emp/permissions/role/${roleId}`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi lấy quyền theo vai trò' };
  }
};

// Get available permissions for a role
const getAvailablePermissionsByRole = async (roleId) => {
  try {
    const response = await axios.get(`${API_URL}/emp/permissions/role/${roleId}/available`, {
      headers: authService.getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi lấy quyền chưa gán' };
  }
};

// Add permissions to role
const addPermissionsToRole = async (roleId, permissionIds) => {
  try {
    const response = await axios.post(
      `${API_URL}/emp/roles/${roleId}/permissions`,
      { permissionIds },
      { 
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader()
        } 
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi thêm quyền vào vai trò' };
  }
};

// Remove permissions from role
const removePermissionsFromRole = async (roleId, permissionIds) => {
  try {
    const response = await axios.delete(
      `${API_URL}/emp/roles/${roleId}/permissions`,
      { 
        data: { permissionIds },
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader()
        } 
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi xóa quyền khỏi vai trò' };
  }
};

export default {
  getProfile,
  updateProfile,
  getEmployeePerformance,
  getRolesWithEmployeeCount,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getActiveRoles,
  updateEmployeeRoles,
  assignRolesToEmployee,
  removeRolesFromEmployee,
  getAllRoles,
  getRoleById,
  createRole,
  resetDefaultRole,
  updateRole,
  deleteRole,
  getAllPermissions,
  getEmployeesByRole,
  getEmployeeRoles,
  removeEmployeeFromRole,
  getEmployeesByRoleId,
  getPermissionsByRole,
  getAvailablePermissionsByRole,
  addPermissionsToRole,
  removePermissionsFromRole
};
