import React, { useState, useEffect, useRef } from 'react';
import { Users, Search, Plus, Edit, Trash2, Filter, Download, Mail, Phone, Award, ChevronDown, ChevronUp, Check, X, UserRound, Eye, EyeOff, Copy, MapPin } from 'lucide-react';
import employeeService from '../services/employeeService';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

// Sample staff data
const initialStaffData = [];

// Placeholder for roles data until API data is loaded
const initialRolesData = [];

// Function to fetch employees list from API
const fetchEmployees = async (setLoading, setError, setStaffData) => {
  setLoading(true);
  try {
    const res = await employeeService.getEmployees();
    if (res?.data?.employees) setStaffData(res.data.employees);
    setError(null);
  } catch (err) {
    console.error('Error fetching employees:', err);
    setError('Không thể tải dữ liệu nhân viên. Vui lòng thử lại sau.');
  } finally {
    setLoading(false);
  }
};

// Fetch active roles for form
const fetchActiveRoles = async (setLoading, setRoles) => {
  setLoading(true);
  try { const res = await employeeService.getActiveRoles(); if (res?.data) setRoles(res.data); } catch {} finally { setLoading(false); }
};

// Performance status component
const PerformanceIndicator = ({ value }) => {
  let bgColor = 'bg-gray-200';
  let textColor = 'text-gray-500';
  
  if (value === 0) {
    return <span className="text-gray-400">N/A</span>;
  } else if (value >= 90) {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
  } else if (value >= 80) {
    bgColor = 'bg-blue-100';
    textColor = 'text-blue-800';
  } else if (value >= 70) {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
  } else {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
  }
  
  return (
    <div className="flex items-center">
      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
        <div 
          className={`h-2 rounded-full ${bgColor}`} 
          style={{ width: `${value}%` }}
        ></div>
      </div>
      <span className={`text-xs font-medium ${textColor}`}>{value}%</span>
    </div>
  );
};

// Status badge component
const StatusBadge = ({ status }) => {
  switch (status) {
    case 'active':
      return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Đang làm việc</span>;
    case 'probation':
      return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Thử việc</span>;
    case 'on_leave':
      return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Đang nghỉ phép</span>;
    case 'inactive':
      return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Đã nghỉ</span>;
    default:
      return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
  }
};

// Role card component
const RoleCard = ({ role }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <h3 className="font-medium text-lg mb-2">{role.roleName}</h3>
      <div className="flex items-center mt-1">
        <Users size={16} className="text-gray-500 mr-2" />
        <span className="text-gray-600 text-sm">{role.employeeCount} nhân viên</span>
      </div>
      <button className="mt-4 text-blue-600 text-sm hover:text-blue-800 transition-colors">Xem chi tiết</button>
    </div>
  );
};

// Password input with toggle visibility
const PasswordInput = ({ label, name, value, show, toggleShow, onChange, autoComplete }) => (
  <div>
    <label>{label}</label>
    <div className="relative">
      <input
        name={name}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 pr-10"
        required
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

// Staff Form component
const StaffForm = ({ staff, rolesData, onSave, onCancel }) => {
  const initial = staff
    ? { 
        fullName: staff.fullName || '', 
        email: staff.email || '', 
        phoneNumber: staff.phoneNumber || '', 
        address: staff.address || '', 
        dateOfBirth: staff.dateOfBirth ? new Date(staff.dateOfBirth).toISOString().split('T')[0] : '', 
        profilePictureUrl: staff.profilePictureUrl || '', 
        status: staff.status || 'active', 
        roles: staff.roles.map(rn => {
          const r = rolesData.find(r => r.roleName === rn);
          return r?.roleId;
        }).filter(Boolean) 
      }
    : { 
        username: '', 
        password: '', 
        confirmPassword: '',
        fullName: '', 
        email: '', 
        phoneNumber: '', 
        address: '', 
        dateOfBirth: '', 
        profilePictureUrl: '', 
        status: 'active', 
        roles: [] 
      };
  const [formData, setFormData] = useState(initial);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = e => { const { name, value } = e.target; setFormData(prev=>({ ...prev, [name]:value })); };
  const handleCheckbox = e => { const id=parseInt(e.target.value); setFormData(prev=>({ ...prev, roles:e.target.checked?[...prev.roles,id]:prev.roles.filter(x=>x!==id) })); };
  const validateForm = () => {
    if (!staff) {
      if (!formData.username.trim()) { toast.error('Username không được để trống'); return false; }
      if (formData.username.length < 3 || formData.username.length > 50) { toast.error('Username phải từ 3-50 ký tự'); return false; }
      if (formData.password.length < 6) { toast.error('Mật khẩu phải ít nhất 6 ký tự'); return false; }
      if (formData.password !== formData.confirmPassword) { toast.error('Mật khẩu và xác nhận mật khẩu không khớp'); return false; }
    }
    if (!formData.fullName.trim()) { toast.error('Họ và tên không được để trống'); return false; }
    if (!formData.email) { toast.error('Email không được để trống'); return false; }
    if (!/^[^ ]+@[^ ]{2,}\.[^ ]+$/.test(formData.email)) { toast.error('Email không đúng định dạng'); return false; }
    if (!formData.phoneNumber) { toast.error('Số điện thoại không được để trống'); return false; }
    if (!/^[0-9 ()+-]+$/.test(formData.phoneNumber)) { toast.error('Số điện thoại không hợp lệ'); return false; }
    if (!formData.address.trim()) { toast.error('Địa chỉ không được để trống'); return false; }
    if (formData.dateOfBirth && new Date(formData.dateOfBirth) >= new Date()) { toast.error('Ngày sinh phải trước ngày hiện tại'); return false; }
    return true;
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (!validateForm()) return;
    const dataToSave = { ...formData };
    if (!staff) {
      delete dataToSave.confirmPassword;
    }
    onSave(dataToSave);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl overflow-auto max-h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{staff?'Chỉnh sửa':'Thêm nhân viên'}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* add credentials when creating */}
            {!staff && (
              <>
                <div className="md:col-span-2 flex justify-center">
                  <div className="w-full max-w-xs">
                    <label>Username</label>
                    <input
                      name="username"
                      autoComplete="off"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <PasswordInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  show={showPassword}
                  toggleShow={() => setShowPassword(prev => !prev)}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <PasswordInput
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  show={showConfirmPassword}
                  toggleShow={() => setShowConfirmPassword(prev => !prev)}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </>
            )}
            <div><label>Họ và tên</label><input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border rounded px-3 py-2" required/></div>
            <div><label>Email</label><input name="email" type="text" pattern="^[^ ]+@[^ ]{2,}\.[^ ]+$" title="Email không đúng định dạng" value={formData.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required/></div>
            <div><label>Số điện thoại</label><input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} pattern="^[0-9 ()+-]+$" title="Số điện thoại không hợp lệ" className="w-full border rounded px-3 py-2" required/></div>
            <div><label>Địa chỉ</label><input name="address" value={formData.address} onChange={handleChange} className="w-full border rounded px-3 py-2" required/></div>
            <div><label>Ngày sinh</label><input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className="w-full border rounded px-3 py-2" max={new Date().toISOString().split('T')[0]}/></div>
            <div><label>Trạng thái</label><select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="active">Đang làm việc</option>
                <option value="probation">Thử việc</option>
                <option value="on_leave">Đang nghỉ phép</option>
                <option value="inactive">Đã nghỉ</option>
            </select></div>
            <div className="md:col-span-2"><fieldset><legend>Vai trò</legend><div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded">{rolesData.map(r=>(<label key={r.roleId} className="flex items-center"><input type="checkbox" value={r.roleId} checked={formData.roles.includes(r.roleId)} onChange={handleCheckbox} className="mr-2"/>{r.roleName}</label>))}</div></fieldset></div>
          </div>
          <div className="flex justify-end space-x-4"><button type="button" onClick={onCancel} className="border px-4 py-2 rounded">Hủy</button><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Lưu</button></div>
        </form>
      </div>
    </div>
  );
};

// Confirm Dialog component
const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">{message}</h3>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white rounded-lg px-4 py-2"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

// View dialog for detailed info
const ViewDialog = ({ employee, onClose }) => {
  if (!employee) return null;
  const fields = [ ['ID', employee.employeeId], ['Họ và tên', employee.fullName], ['Email', employee.email], ['Số điện thoại', employee.phoneNumber], ['Địa chỉ', employee.address], ['Ngày sinh', employee.dateOfBirth], ['Trạng thái', employee.status], ['Vai trò', employee.roles.join(', ')] ];
  const copyText = txt => { 
    navigator.clipboard.writeText(txt); 
    toast.success('Đã sao chép!', {
      duration: 2000,
      position: 'bottom-right',
      style: { background: '#4CAF50', color: 'white' }
    }); 
  };
  
  const copyAll = () => { 
    const allText = fields.map(f=>`${f[0]}: ${f[1]}`).join('\n'); 
    navigator.clipboard.writeText(allText); 
    toast.success('Đã sao chép tất cả!', {
      duration: 2000,
      position: 'bottom-right',
      style: { background: '#4CAF50', color: 'white' }
    }); 
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">Thông tin nhân viên</h3><button onClick={onClose}><X size={20}/></button></div>
        <div className="space-y-2">{fields.map(([label,val],i)=>(<div key={i} className="flex justify-between items-center border-b pb-1"><div><strong>{label}:</strong> {val}</div><button onClick={()=>copyText(val)}><Copy size={16}/></button></div>))}</div>
        <div className="flex justify-end mt-4"><button onClick={copyAll} className="flex items-center text-sm text-gray-700"><Copy size={16} className="mr-1"/>Copy tất cả</button></div>
      </div>
    </div>
  );
};

// Main ManageStaff component
const Staff = () => {
  const [staffData, setStaffData] = useState(initialStaffData);
  const [rolesData, setRolesData] = useState(initialRolesData);
  const [activeRoles, setActiveRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRoles, setFilterRoles] = useState([]);
  const [filterStatuses, setFilterStatuses] = useState([]);
  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const roleFilterRef = useRef(null);
  const statusFilterRef = useRef(null);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [currentAction, setCurrentAction] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  
  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees(setLoading, setError, setStaffData);
  }, []);

  // Fetch roles with employee counts
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await employeeService.getRolesWithEmployeeCount();
        if (response && response.data) {
          setRolesData(response.data);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching roles:', err);
        setError('Không thể tải dữ liệu vai trò. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoles();
  }, []);

  // Fetch active roles for form
  useEffect(() => { fetchActiveRoles(setLoading, setActiveRoles); }, []);

  // Filter staff data based on search and filters
  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoles = filterRoles.length === 0 || staff.roles.some(r=> filterRoles.includes(r));
    const matchesStatus = filterStatuses.length === 0 || filterStatuses.includes(staff.status);
    
    return matchesSearch && matchesRoles && matchesStatus;
  });
  
  // Sort staff data
  const sortedStaff = [...filteredStaff].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  // Handle sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };
  
  // Handle add staff
  const handleAddStaff = () => {
    setCurrentAction('add');
    setSelectedStaff(null);
  };
  
  // Handle edit staff
  const handleEditStaff = (staff) => {
    setCurrentAction('edit');
    setSelectedStaff(staff);
  };
  
  // Handle delete staff
  const handleDeleteStaff = (staff) => {
    setCurrentAction('delete');
    setSelectedStaff(staff);
  };

  // Handle view staff
  const handleViewStaff = (staff) => {
    setCurrentAction('view');
    setSelectedStaff(staff);
  };

  // Save staff (add or edit) via API
  const handleSaveStaff = async (formData) => {
    setLoading(true);
    try {
      if (currentAction === 'add') {
        const res = await employeeService.createEmployee(formData);
        const id = res.data;
        if (formData.roles.length) await employeeService.updateEmployeeRoles(id, formData.roles);
        toast.success('Thêm nhân viên thành công!', { duration: 3000, position: 'top-right' });
      } else {
        await employeeService.updateEmployee(selectedStaff.employeeId, formData);
        if (formData.roles.length) await employeeService.updateEmployeeRoles(selectedStaff.employeeId, formData.roles);
        toast.success('Cập nhật nhân viên thành công!', { duration: 3000, position: 'top-right' });
      }
      await fetchEmployees(setLoading, setError, setStaffData);
      setCurrentAction(null);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Lỗi khi lưu nhân viên';
      toast.error(msg, { duration: 4000, position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };
  
  // Confirm delete staff via API
  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await employeeService.deleteEmployee(selectedStaff.employeeId);
      await fetchEmployees(setLoading, setError, setStaffData);
      setError(null);
      toast.success('Xóa nhân viên thành công!');
    } catch (err) {
      console.error('Error deleting employee:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi khi xóa nhân viên.';
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center'
      });
    } finally {
      setLoading(false);
      setCurrentAction(null);
    }
  };
  
  // Cancel current action
  const handleCancel = () => {
    setCurrentAction(null);
    setSelectedStaff(null);
  };
  
  // Handle export data
  const handleExport = () => {
    toast.success('Xuất dữ liệu nhân viên thành công!', {
      duration: 3000,
      position: 'bottom-right',
      style: { background: '#4CAF50', color: 'white' }
    });
  };

  // handle role filter change
  const handleRoleFilterChange = e => {
    const id = parseInt(e.target.value);
    setFilterRoles(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };

  // handle status filter change
  const handleStatusFilterChange = e => {
    const status = e.target.value;
    setFilterStatuses(prev => prev.includes(status) ? prev.filter(x=>x!==status) : [...prev, status]);
  };
  
  // Handle add new staff button click
  const handleAddNewClick = () => {
    setSelectedStaff(null);
    setCurrentAction('add');
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleFilterRef.current && !roleFilterRef.current.contains(event.target)) {
        setShowRoleFilter(false);
      }
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target)) {
        setShowStatusFilter(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [roleFilterRef, statusFilterRef]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Toaster />
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý nhân viên</h1>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Role overview */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Cơ cấu nhân sự</h2>
          {loading ? (
            <div className="text-center py-4">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {rolesData.map((role) => (
                <RoleCard key={role.roleId} role={role} />
              ))}
              {rolesData.length === 0 && !loading && !error && (
                <div className="col-span-full text-center py-4">Không có dữ liệu vai trò</div>
              )}
            </div>
          )}
        </div>
        
        {/* Staff management */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center w-full md:w-auto">
                <div className="relative rounded-md shadow-sm flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-2 border-gray-300 rounded-md"
                    placeholder="Tìm kiếm nhân viên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative inline-block text-left" ref={roleFilterRef}>
                  <button onClick={()=>setShowRoleFilter(!showRoleFilter)} className="flex items-center border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-50">
                    <Filter size={18} className="text-gray-400 mr-2" />
                    <span className="text-sm">{filterRoles.length>0?`${filterRoles.length} vai trò`:'Vai trò'}</span>
                  </button>
                  {showRoleFilter && (
                    <div className="absolute mt-2 bg-white border rounded shadow-lg p-2 max-h-60 w-56 overflow-auto z-10">
                      <div className="mb-2 pb-1 border-b">
                        <span className="text-xs font-medium text-gray-500">Chọn vai trò</span>
                      </div>
                      {rolesData.map(r=>(
                        <label key={r.roleId} className="flex items-center py-1 px-1 hover:bg-gray-50 rounded cursor-pointer">
                          <input type="checkbox" value={r.roleId} checked={filterRoles.includes(r.roleId)} onChange={handleRoleFilterChange} className="mr-2"/>
                          <span className="text-sm">{r.roleName}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="relative inline-block ml-2 text-left" ref={statusFilterRef}>
                  <button onClick={()=>setShowStatusFilter(!showStatusFilter)} className="flex items-center border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-50">
                    <span className="text-sm">{filterStatuses.length>0?`${filterStatuses.length} trạng thái`:'Trạng thái'}</span>
                  </button>
                  {showStatusFilter && (
                    <div className="absolute mt-2 bg-white border rounded shadow-lg p-2 max-h-60 w-48 overflow-auto z-10">
                      <div className="mb-2 pb-1 border-b">
                        <span className="text-xs font-medium text-gray-500">Chọn trạng thái</span>
                      </div>
                      {['active','probation','on_leave','inactive'].map(s=>(
                        <label key={s} className="flex items-center py-1 px-1 hover:bg-gray-50 rounded cursor-pointer">
                          <input type="checkbox" value={s} checked={filterStatuses.includes(s)} onChange={handleStatusFilterChange} className="mr-2"/>
                          <span className="text-sm">{s==='active'?'Đang làm việc':s==='probation'?'Thử việc':s==='on_leave'?'Đang nghỉ phép':'Đã nghỉ'}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleExport}
                  className="flex items-center text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-1 ml-2"
                >
                  <Download size={16} className="mr-1" />
                  Xuất
                </button>
                
                <button
                  onClick={handleAddNewClick}
                  className="flex items-center text-sm text-white bg-blue-600 rounded-md px-3 py-1 ml-2"
                >
                  <Plus size={16} className="mr-1" />
                  Thêm nhân viên
                </button>
              </div>
            </div>
          </div>
          
          {/* Staff table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('employeeId')}
                  >
                    <div className="flex items-center">
                      ID
                      {getSortIndicator('employeeId')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('fullName')}
                  >
                    <div className="flex items-center">
                      Tên nhân viên
                      {getSortIndicator('fullName')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('roles')}
                  >
                    <div className="flex items-center">
                      Vai trò
                      {getSortIndicator('roles')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center">
                      Trạng thái
                      {getSortIndicator('status')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('performance')}
                  >
                    <div className="flex items-center">
                      Hiệu suất
                      {getSortIndicator('performance')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedStaff.map((staff) => (
                  <tr key={staff.employeeId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{staff.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                          {staff.fullName.split(' ').pop().charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{staff.fullName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail size={14} className="text-gray-400 mr-1" />
                        {staff.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Phone size={14} className="text-gray-400 mr-1" />
                        {staff.phoneNumber}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin size={14} className="text-gray-400 mr-1" />
                        {staff.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">{staff.roles[0]}</span>
                        {staff.roles.length>1 && (
                          <div className="relative group">
                            <span className="cursor-pointer text-xs text-gray-500">+{staff.roles.length-1}</span>
                            <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-white border rounded shadow-lg p-2 text-sm z-20 w-max">
                              <div className="flex flex-col space-y-1">
                                {staff.roles.slice(1).map((role, index) => (
                                  <span key={index} className="whitespace-nowrap">{role}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={staff.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PerformanceIndicator value={staff.performance ?? 0} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <button onClick={()=>handleViewStaff(staff)} className="text-gray-600 hover:text-gray-900"><Eye size={16}/></button>
                        <button onClick={()=>handleEditStaff(staff)} className="text-blue-600 hover:text-blue-900"><Edit size={16}/></button>
                        <button onClick={()=>handleDeleteStaff(staff)} className="text-red-600 hover:text-red-900"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {sortedStaff.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                      Không tìm thấy nhân viên nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Trước
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{sortedStaff.length}</span> của <span className="font-medium">{sortedStaff.length}</span> kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <ChevronDown className="h-5 w-5 rotate-90" aria-hidden="true" />
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <ChevronDown className="h-5 w-5 -rotate-90" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {(currentAction==='add'||currentAction==='edit')&&(<StaffForm staff={currentAction==='edit'?selectedStaff:null} rolesData={activeRoles} onSave={handleSaveStaff} onCancel={handleCancel}/>) }
      {currentAction==='delete'&&(<ConfirmDialog message={`Bạn có chắc chắn muốn xóa nhân viên ${selectedStaff.fullName}?`} onConfirm={handleConfirmDelete} onCancel={handleCancel}/>) }
      {currentAction==='view'&&(<ViewDialog employee={selectedStaff} onClose={handleCancel}/>)}
    </div>
  );
};

export default Staff;