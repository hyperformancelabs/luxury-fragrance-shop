import React, { useState, useEffect, useRef } from 'react';
import { Users, Search, Plus, Edit, Trash2, Filter, Download, Mail, Phone, Award, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Check, X, UserRound, Eye, EyeOff, Copy, MapPin, Settings, User, UserPlus } from 'lucide-react';
import { PageHeader, TableToolbar, DataTable, PaginationFooter } from '../Components/common';
import employeeService from '../services/employeeService';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { PasswordStrengthMeter, PhoneNumberInput, checkPasswordStrength, normalizeFullName, normalizeAddress } from '../components/FormHelper';

// Custom FieldHelper component để giải quyết vấn đề tooltip bị che
const FieldHelper = ({ text }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = (e) => {
    // Tính toán vị trí tooltip dựa trên vị trí của nút
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ 
        x: rect.left + rect.width / 2, 
        y: rect.bottom + window.scrollY
      });
    }
    setShowTooltip(true);
  };

  return (
    <div className="relative inline-block ml-1">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setTimeout(() => setShowTooltip(false), 200)}
        className="text-gray-400 hover:text-blue-500 focus:outline-none transition-colors"
        aria-label="Hiển thị thông tin"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </button>
      {showTooltip && (
        <div 
          ref={tooltipRef}
          className="fixed transform -translate-x-1/2 z-[9999] w-64 p-3 mt-2 text-sm bg-white rounded-lg shadow-lg border border-gray-200 animate-fade-in"
          style={{ 
            left: position.x,
            top: position.y,
          }}
        >
          <div className="relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45"></div>
            {text}
          </div>
        </div>
      )}
    </div>
  );
};

// Sample staff data
const initialStaffData = [];

// Placeholder for roles data until API data is loaded
const initialRolesData = [];

// Function to fetch employees list from API
const fetchEmployees = async (setLoading, setError, setStaffData, setMaxPerformance) => {
  setLoading(true);
  try {
    const res = await employeeService.getEmployees();
    if (res?.data?.employees) {
      // Fetch performance data for all employees
      const startDate = new Date('2004-07-08'); // System start date
      const endDate = new Date(); // Today
      const performanceData = await employeeService.getEmployeePerformance(null, startDate, endDate);
      
      // Tìm giá trị hiệu suất cao nhất
      let maxValue = 100; // Giá trị mặc định
      if (performanceData && performanceData.length > 0) {
        maxValue = Math.max(...performanceData.map(p => parseFloat(p.performanceScore || 0)));
        // Đảm bảo maxValue không bao giờ là 0 để tránh chia cho 0
        maxValue = maxValue > 0 ? maxValue : 100;
        // Cập nhật state maxPerformance
        if (setMaxPerformance) {
          setMaxPerformance(maxValue);
        }
      }
      
      // Map performance data to employees
      const employeesWithPerformance = res.data.employees.map(employee => {
        const performance = performanceData.find(p => p.employeeId === employee.employeeId);
        return {
          ...employee,
          performanceScore: performance ? performance.performanceScore : 0
        };
      });
      
      setStaffData(employeesWithPerformance);
    }
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

// Performance status component with maxValue context
const PerformanceIndicator = ({ value, maxValue = 100 }) => {
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
  
  // Tính toán phần trăm dựa trên giá trị tối đa
  const percentage = Math.min(100, (value / maxValue) * 100);
  
  return (
    <div className="flex items-center">
      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
        <div 
          className={`h-2 rounded-full ${bgColor}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className={`text-xs font-medium ${textColor}`}>{value}</span>
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
const RoleCard = ({ role, onEdit }) => {
  return (
    <div onClick={() => onEdit(role)} className="bg-white rounded-lg shadow p-4 flex flex-col relative cursor-pointer hover:bg-gray-50">
      <h3 className="font-medium text-lg mb-2">{role.roleName}</h3>
      {role.isDefault && (
        <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          Mặc định
        </span>
      )}
      <div className="flex items-center mt-1">
        <Users size={16} className="text-gray-500 mr-2" />
        <span className="text-gray-600 text-sm">{role.employeeCount} nhân viên</span>
      </div>
      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
        {role.roleDescription || "Không có mô tả"}
      </p>
      <div className="flex justify-between items-center mt-3">
        <span className={`text-xs py-1 px-2 rounded-full ${role.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {role.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      </div>
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
        autoComplete={autoComplete || "off"}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 pr-10"
        required
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
        tabIndex="-1"
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
        // Auto-select default roles when creating
        roles: rolesData.filter(r => r.isDefault).map(r => r.roleId) 
      };
  const [formData, setFormData] = useState(initial);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = e => { const { name, value } = e.target; setFormData(prev=>({ ...prev, [name]:value })); };
  const handleCheckbox = e => { const id=parseInt(e.target.value); setFormData(prev=>({ ...prev, roles:e.target.checked?[...prev.roles,id]:prev.roles.filter(x=>x!==id) })); };
  // Sử dụng các hàm từ FormHelper
  
  // Xử lý thay đổi họ tên với chuẩn hóa
  const handleFullNameChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, fullName: value }));
  };
  
  // Xử lý thay đổi địa chỉ với chuẩn hóa
  const handleAddressChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, address: value }));
  };
  
  // Xử lý blur họ tên để chuẩn hóa
  const handleFullNameBlur = (e) => {
    const normalizedName = normalizeFullName(e.target.value);
    setFormData(prev => ({ ...prev, fullName: normalizedName }));
  };
  
  // Xử lý blur địa chỉ để chuẩn hóa
  const handleAddressBlur = (e) => {
    const normalizedAddress = normalizeAddress(e.target.value);
    setFormData(prev => ({ ...prev, address: normalizedAddress }));
  };
  
  // Kiểm tra form
  const validateForm = () => {
    if (!staff) {
      if (!formData.username.trim()) { toast.error('Username không được để trống'); return false; }
      if (!/^[a-zA-Z0-9]+$/.test(formData.username)) { toast.error('Username chỉ được chứa chữ cái và số, không có khoảng trắng hoặc ký tự đặc biệt'); return false; }
      if (formData.username.length < 3 || formData.username.length > 50) { toast.error('Username phải từ 3-50 ký tự'); return false; }
      
      if (!formData.password) { toast.error('Mật khẩu không được để trống'); return false; }
      if (formData.password.length < 6) { toast.error('Mật khẩu phải ít nhất 6 ký tự'); return false; }
      if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) { toast.error('Mật khẩu phải chứa ít nhất một chữ cái và một số'); return false; }
      if (formData.password !== formData.confirmPassword) { toast.error('Mật khẩu và xác nhận mật khẩu không khớp'); return false; }
    }
    
    if (!formData.fullName.trim()) { toast.error('Họ và tên không được để trống'); return false; }
    
    if (!formData.email) { toast.error('Email không được để trống'); return false; }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) { toast.error('Email không đúng định dạng'); return false; }
    
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
                    <div className="flex items-center">
                      <label>Username</label>
                      <FieldHelper text="Chỉ chứa chữ cái và số, không có khoảng trắng hoặc ký tự đặc biệt. Độ dài từ 3-50 ký tự." />
                    </div>
                    <input
                      name="username"
                      autoComplete="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 mt-1"
                      placeholder="Nhập username (chỉ chữ cái và số)"
                      required
                    />
                    {formData.username && !/^[a-zA-Z0-9]+$/.test(formData.username) && (
                      <p className="text-xs text-red-500 mt-1">Username chỉ được chứa chữ cái và số</p>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <label>Password</label>
                    <FieldHelper text="Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ cái và số. Mật khẩu mạnh nên có thêm ký tự đặc biệt và độ dài trên 8 ký tự." />
                  </div>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full border rounded px-3 py-2 pr-10 ${formData.password && (formData.password.length < 6 || !/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) ? 'border-red-300' : ''}`}
                      autoComplete="new-password"
                      placeholder="Mật khẩu (ít nhất 6 ký tự)"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  
                  {/* Hiển thị độ mạnh mật khẩu */}
                  {formData.password && <PasswordStrengthMeter password={formData.password} />}
                  
                  {formData.password && formData.password.length < 6 && (
                    <p className="text-xs text-red-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
                  )}
                  
                  {formData.password && formData.password.length >= 6 && !/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password) && (
                    <p className="text-xs text-red-500 mt-1">Mật khẩu phải chứa ít nhất một chữ cái và một số</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center">
                    <label>Xác nhận mật khẩu</label>
                    <FieldHelper text="Nhập lại mật khẩu để xác nhận" />
                  </div>
                  <div className="relative mt-1">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full border rounded px-3 py-2 pr-10 ${formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300' : ''}`}
                      autoComplete="new-password"
                      placeholder="Nhập lại mật khẩu"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formData.password && formData.confirmPassword && (
                    <p className={`text-xs mt-1 ${formData.password === formData.confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                      {formData.password === formData.confirmPassword ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}
                    </p>
                  )}
                </div>
              </>
            )}
            <div>
              <div className="flex items-center">
                <label>Họ và tên</label>
                <FieldHelper text="Họ tên sẽ được chuẩn hóa: viết hoa chữ cái đầu mỗi từ và loại bỏ khoảng trắng thừa" />
              </div>
              <input 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleFullNameChange} 
                onBlur={handleFullNameBlur}
                autoComplete="name" 
                className="w-full border rounded px-3 py-2 mt-1" 
                placeholder="Nhập họ và tên"
                required
              />
              {formData.fullName && formData.fullName.trim() === '' && (
                <p className="text-xs text-red-500 mt-1">Họ tên không được để trống</p>
              )}
            </div>
            <div>
              <div className="flex items-center">
                <label>Email</label>
                <FieldHelper text="Email phải đúng định dạng: example@domain.com" />
              </div>
              <input 
                name="email" 
                type="email" 
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" 
                title="Email không đúng định dạng" 
                value={formData.email} 
                onChange={handleChange} 
                autoComplete="email" 
                className={`w-full border rounded px-3 py-2 mt-1 ${formData.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) ? 'border-red-300' : ''}`} 
                placeholder="example@domain.com"
                required
              />
              {formData.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) && (
                <p className="text-xs text-red-500 mt-1">Email không đúng định dạng</p>
              )}
            </div>
            <div>
              <div className="flex items-center">
                <label>Số điện thoại</label>
                <FieldHelper text="Chỉ hỗ trợ số điện thoại Việt Nam (+84). Các vùng khác hiện chưa được hỗ trợ." />
              </div>
              <div className="mt-1 relative">
                <PhoneNumberInput 
                  value={formData.phoneNumber} 
                  onChange={handleChange} 
                  required={true}
                  error={formData.phoneNumber && !/^[0-9 ()+-]+$/.test(formData.phoneNumber) ? 'Số điện thoại không hợp lệ' : ''}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <label>Địa chỉ</label>
                <FieldHelper text="Địa chỉ sẽ được chuẩn hóa: loại bỏ khoảng trắng thừa" />
              </div>
              <input 
                name="address" 
                value={formData.address} 
                onChange={handleAddressChange} 
                onBlur={handleAddressBlur}
                autoComplete="street-address" 
                className="w-full border rounded px-3 py-2 mt-1" 
                placeholder="Nhập địa chỉ"
                required
              />
              {formData.address && formData.address.trim() === '' && (
                <p className="text-xs text-red-500 mt-1">Địa chỉ không được để trống</p>
              )}
            </div>
            <div>
              <div className="flex items-center">
                <label>Ngày sinh</label>
                <FieldHelper text="Ngày sinh phải trước ngày hiện tại" />
              </div>
              <input 
                name="dateOfBirth" 
                type="date" 
                value={formData.dateOfBirth} 
                onChange={handleChange} 
                autoComplete="bday" 
                className="w-full border rounded px-3 py-2 mt-1" 
                max={new Date().toISOString().split('T')[0]}
              />
              {formData.dateOfBirth && new Date(formData.dateOfBirth) >= new Date() && (
                <p className="text-xs text-red-500 mt-1">Ngày sinh phải trước ngày hiện tại</p>
              )}
            </div>
            <div>
              <div className="flex items-center">
                <label>Trạng thái</label>
                <FieldHelper text="Trạng thái hiện tại của nhân viên" />
              </div>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                className="w-full border rounded px-3 py-2 mt-1"
              >
                <option value="active">Đang làm việc</option>
                <option value="probation">Thử việc</option>
                <option value="on_leave">Đang nghỉ phép</option>
                <option value="inactive">Đã nghỉ</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <fieldset>
                <div className="flex items-center">
                  <legend>Vai trò</legend>
                  <FieldHelper text="Chọn một hoặc nhiều vai trò cho nhân viên" />
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded mt-1">
                  {rolesData.map(r => (
                    <label key={r.roleId} className="flex items-center p-1 hover:bg-gray-50 rounded">
                      <input 
                        type="checkbox" 
                        value={r.roleId} 
                        checked={formData.roles.includes(r.roleId)} 
                        onChange={handleCheckbox} 
                        className="mr-2"
                      />
                      <span className="text-sm">{r.roleName}</span>
                    </label>
                  ))}
                </div>
                {formData.roles.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">Phải chọn ít nhất một vai trò</p>
                )}
              </fieldset>
            </div>
          </div>
          <div className="flex justify-end space-x-4"><button type="button" onClick={onCancel} className="border px-4 py-2 rounded">Hủy</button><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Lưu</button></div>
        </form>
      </div>
    </div>
  );
};

// Confirm Dialog component
const ConfirmDialog = ({ title, message, onConfirm, onCancel, confirmText = "Xác nhận", confirmButtonClass = "bg-red-600 hover:bg-red-700" }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">{title || "Xác nhận"}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-md ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// View dialog for detailed info
const ViewDialog = ({ employee, onClose }) => {
  if (!employee) return null;
  
  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const fields = [ 
    ['ID', employee.employeeId], 
    ['Họ và tên', employee.fullName], 
    ['Email', employee.email], 
    ['Số điện thoại', employee.phoneNumber], 
    ['Địa chỉ', employee.address], 
    ['Ngày sinh', formatDate(employee.dateOfBirth)], 
    ['Trạng thái', employee.status], 
    ['Vai trò', employee.roles.join(', ')],
    ['Hiệu suất', employee.performanceScore || 'N/A']
  ];
  
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

// Role Form component
const RoleForm = ({ role, onSave, onCancel, staffData }) => {
  // State cho quy trình 3 bước
  const [currentStep, setCurrentStep] = useState(1);
  const [allPermissions, setAllPermissions] = useState([]);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permissionGroups, setPermissionGroups] = useState({});
  
  // State cho dữ liệu form
  const initialData = role 
    ? { 
        roleName: role.roleName || '', 
        roleDescription: role.roleDescription || '',
        isDefault: role.isDefault || false,
        status: role.status || 'active',
        permissions: [],
        employees: []
      } 
    : { 
        roleName: '', 
        roleDescription: '',
        isDefault: false,
        status: 'active',
        permissions: [],
        employees: []
      };
    
  const [formData, setFormData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  
  // Fetch permissions khi component mount
  useEffect(() => {
    if (currentStep === 2) {
      fetchPermissions();
    }
  }, [currentStep]);
  
  // Fetch employees khi chuyển đến bước 3
  useEffect(() => {
    if (currentStep === 3) {
      prepareEmployeesList();
    }
  }, [currentStep]);
  
  // Fetch permissions từ API
  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const permissionsResponse = await employeeService.getAllPermissions();
      if (permissionsResponse?.data) {
        setAllPermissions(permissionsResponse.data);
        
        // Group permissions
        const groups = {};
        permissionsResponse.data.forEach(permission => {
          const [category] = permission.permissionName.split('.');
          if (!groups[category]) {
            groups[category] = [];
          }
          groups[category].push(permission);
        });
        setPermissionGroups(groups);
        
        // Initialize expanded state
        const initialExpandedState = {};
        Object.keys(groups).forEach(group => {
          initialExpandedState[group] = true; // Start with all expanded
        });
        setExpandedGroups(initialExpandedState);
        
        // If editing role, fetch its permissions
        if (role) {
          fetchRolePermissions(role.roleId);
        }
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Không thể tải dữ liệu quyền. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch permissions của role cụ thể
  const fetchRolePermissions = async (roleId) => {
    try {
      const rolePermissionsResponse = await employeeService.getPermissionsByRole(roleId);
      if (rolePermissionsResponse?.data) {
        setFormData(prev => ({
          ...prev,
          permissions: rolePermissionsResponse.data.map(p => p.permissionId)
        }));
      }
    } catch (error) {
      console.error('Error fetching role permissions:', error);
    }
  };
  
  // Chuẩn bị danh sách nhân viên cho bước 3
  const prepareEmployeesList = () => {
    if (!staffData) return;
    
    // Chỉ hiển thị nhân viên đang hoạt động
    const activeEmployees = staffData.filter(emp => emp.status === 'active');
    setAvailableEmployees(activeEmployees);
    
    // Nếu đang chỉnh sửa, lấy danh sách nhân viên của vai trò
    if (role) {
      fetchEmployeesByRole(role.roleId);
    }
  };
  
  // Fetch employees của role cụ thể
  const fetchEmployeesByRole = async (roleId) => {
    setLoading(true);
    try {
      const response = await employeeService.getEmployeesByRoleId(roleId);
      if (response?.data) {
        setFormData(prev => ({
          ...prev,
          employees: response.data.map(emp => emp.employeeId)
        }));
      }
    } catch (error) {
      console.error('Error fetching employees by role:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle change for form fields
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle permission selection change
  const handlePermissionChange = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };
  
  // Toggle group expansion
  const toggleGroupExpansion = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };
  
  // Select all permissions in a group
  const selectAllInGroup = (group) => {
    const groupPermissionIds = permissionGroups[group].map(p => p.permissionId);
    const allSelected = groupPermissionIds.every(id => formData.permissions.includes(id));
    
    if (allSelected) {
      // Deselect all in group
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(id => !groupPermissionIds.includes(id))
      }));
    } else {
      // Select all in group
      setFormData(prev => {
        const newSelected = [...prev.permissions];
        groupPermissionIds.forEach(id => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return {
          ...prev,
          permissions: newSelected
        };
      });
    }
  };
  
  // Handle employee selection
  const handleEmployeeSelect = (employeeId) => {
    setFormData(prev => ({
      ...prev,
      employees: prev.employees.includes(employeeId)
        ? prev.employees.filter(id => id !== employeeId)
        : [...prev.employees, employeeId]
    }));
  };
  
  // Validate form for each step
  const validateForm = () => {
    if (currentStep === 1) {
    if (!formData.roleName.trim()) {
      toast.error('Tên vai trò không được để trống');
      return false;
      }
    }
    return true;
  };
  
  // Handle next step
  const handleNextStep = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // Handle final submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      let roleId;
      
      // Step 1: Save or update role
      if (formData.isDefault) {
        await employeeService.resetDefaultRole();
      }
      
      if (role) {
        // Update existing role
        await employeeService.updateRole(role.roleId, {
          roleName: formData.roleName,
          roleDescription: formData.roleDescription,
          isDefault: formData.isDefault,
          status: formData.status
        });
        roleId = role.roleId;
        toast.success('Cập nhật vai trò thành công!');
      } else {
        // Create new role
        const response = await employeeService.createRole({
          roleName: formData.roleName,
          roleDescription: formData.roleDescription,
          isDefault: formData.isDefault,
          status: formData.status
        });
        roleId = response.data; // Corrected extraction
        toast.success('Tạo vai trò mới thành công!');
      }
      
      // Step 2: Update permissions
      if (formData.permissions.length > 0) {
        await employeeService.addPermissionsToRole(roleId, formData.permissions);
      }
      
      // Step 3: Update employees
      if (formData.employees.length > 0) {
        for (const employeeId of formData.employees) {
          await employeeService.assignRolesToEmployee(employeeId, [roleId]);
        }
      }
      
      // Call onSave to refresh parent component
      onSave(formData);
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error('Lỗi khi lưu vai trò: ' + (error.message || 'Vui lòng thử lại sau'));
    } finally {
      setLoading(false);
    }
  };

  // Format category name for display
  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'employee': 'Nhân viên', 'role': 'Vai trò', 'permission': 'Quyền hạn', 
      'material': 'Vật tư', 'material_transaction': 'Giao dịch vật tư', 
      'brand': 'Thương hiệu', 'product': 'Sản phẩm', 'inventory': 'Kho hàng', 
      'inventory_transaction': 'Giao dịch kho', 'promotion': 'Khuyến mãi', 
      'customer': 'Khách hàng', 'cart': 'Giỏ hàng', 'order': 'Đơn hàng', 
      'payment': 'Thanh toán', 'shipment': 'Vận chuyển', 'conversation': 'Hội thoại', 
      'report': 'Báo cáo', 'dashboard': 'Bảng điều khiển'
    };
    
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Format permission name for display
  const getDisplayName = (name) => {
    const parts = name.split('.');
    if (parts.length === 2) {
      const [category, action] = parts;
      return action.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    return name;
  };

  // Filter permission groups based on search term
  const filteredGroups = Object.keys(permissionGroups).filter(group => {
    if (!searchTerm) return true;
    if (group.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    return permissionGroups[group].some(permission => 
      permission.permissionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (permission.permissionDescription && 
       permission.permissionDescription.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Filter employees based on search term
  const filteredEmployees = availableEmployees.filter(emp => 
    !employeeSearchTerm || 
    emp.fullName.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(employeeSearchTerm.toLowerCase())
  );

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên vai trò <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="roleName"
                value={formData.roleName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                name="roleDescription"
                value={formData.roleDescription}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mô tả chi tiết về vai trò này"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                Đặt làm vai trò mặc định
              </label>
              <FieldHelper text="Vai trò mặc định sẽ được gán tự động cho nhân viên mới. Chỉ có thể có một vai trò mặc định." />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">Chọn quyền cho vai trò</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm quyền..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
          
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                {filteredGroups.length > 0 ? (
                  filteredGroups.map(group => (
                    <div key={group} className="border-b last:border-b-0">
                      <div 
                        className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleGroupExpansion(group)}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`group-${group}`}
                            checked={
                              permissionGroups[group].length > 0 && 
                              permissionGroups[group].every(p => 
                                formData.permissions.includes(p.permissionId)
                              )
                            }
                            onChange={(e) => {
                              e.stopPropagation();
                              selectAllInGroup(group);
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                          />
                          <label htmlFor={`group-${group}`} className="font-medium text-gray-700">
                            {getCategoryDisplayName(group)}
                          </label>
                        </div>
                        {expandedGroups[group] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                      
                      {expandedGroups[group] && (
                        <div className="bg-white p-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {permissionGroups[group]
                              .filter(permission => 
                                !searchTerm || 
                                permission.permissionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (permission.permissionDescription && 
                                 permission.permissionDescription.toLowerCase().includes(searchTerm.toLowerCase()))
                              )
                              .map(permission => (
                                <div key={permission.permissionId} className="flex items-start p-2 hover:bg-gray-50 rounded">
                                  <input
                                    type="checkbox"
                                    id={`permission-${permission.permissionId}`}
                                    checked={formData.permissions.includes(permission.permissionId)}
                                    onChange={() => handlePermissionChange(permission.permissionId)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                                  />
                                  <label 
                                    htmlFor={`permission-${permission.permissionId}`}
                                    className="ml-3 text-sm cursor-pointer"
                                  >
                                    <div className="font-medium text-gray-700">
                                      {getDisplayName(permission.permissionName)}
                                    </div>
                                    <div className="text-gray-500 text-xs mt-0.5">
                                      {permission.permissionDescription || 'Không có mô tả'}
                                    </div>
                                  </label>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    Không tìm thấy quyền nào phù hợp với từ khóa tìm kiếm
                  </div>
                )}
              </div>
            )}
            
            <div className="text-sm text-gray-500">
              Đã chọn {formData.permissions.length} quyền
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">Thêm nhân viên vào vai trò</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm nhân viên..."
                  value={employeeSearchTerm}
                  onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                  className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                {filteredEmployees.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
                    {filteredEmployees.map(emp => (
                      <div 
                        key={emp.employeeId} 
                        className={`border rounded-lg p-3 hover:bg-gray-50 cursor-pointer flex items-center ${
                          formData.employees.includes(emp.employeeId) ? 'bg-blue-50 border-blue-300' : ''
                        }`}
                        onClick={() => handleEmployeeSelect(emp.employeeId)}
                      >
                        <input
                          type="checkbox"
                          checked={formData.employees.includes(emp.employeeId)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleEmployeeSelect(emp.employeeId);
                          }}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                        />
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          {emp.profilePictureUrl ? (
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={emp.profilePictureUrl} 
                              alt={emp.fullName} 
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              <User size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{emp.fullName}</div>
                          <div className="text-sm text-gray-500">{emp.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    Không tìm thấy nhân viên nào phù hợp
                  </div>
                )}
              </div>
            )}
            
            <div className="text-sm text-gray-500">
              Đã chọn {formData.employees.length} nhân viên
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Render step indicator
  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-6">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === step 
                    ? 'bg-blue-600 text-white' 
                    : currentStep > step 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                }`}
              >
                {currentStep > step ? <Check size={16} /> : step}
              </div>
              <div className="text-xs mt-1 text-center">
                {step === 1 ? 'Thông tin' : step === 2 ? 'Quyền hạn' : 'Nhân viên'}
              </div>
            </div>
            
            {step < 3 && (
              <div 
                className={`w-12 h-1 mx-2 ${
                  currentStep > step ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {role ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}
          </h3>
          <button onClick={onCancel}><X size={20}/></button>
        </div>
        
        {renderStepIndicator()}
        
        <form onSubmit={handleSubmit}>
          {renderStepContent()}
          
          <div className="flex justify-between mt-6">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Quay lại
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              {/* Cancel Button - Always visible */}
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              
              {/* Next Button - Visible before Step 3 */}
              {currentStep < 3 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Tiếp theo
                </button>
              )}
              
              {/* Submit Button - Visible only on Step 3 */}
              {currentStep === 3 && (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  {loading && <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}
                  {role ? 'Cập nhật' : 'Tạo vai trò'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Permission Management component
const PermissionManager = ({ role, onSave, onCancel }) => {
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permissionGroups, setPermissionGroups] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});

  // Fetch all permissions and role's current permissions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all permissions
        const permissionsResponse = await employeeService.getAllPermissions();
        if (permissionsResponse?.data) {
          setAllPermissions(permissionsResponse.data);
          
          // Group permissions by category (based on prefix before the dot)
          const groups = {};
          permissionsResponse.data.forEach(permission => {
            const [category] = permission.permissionName.split('.');
            if (!groups[category]) {
              groups[category] = [];
            }
            groups[category].push(permission);
          });
          setPermissionGroups(groups);
          
          // Initialize expanded state for all groups
          const initialExpandedState = {};
          Object.keys(groups).forEach(group => {
            initialExpandedState[group] = true; // Start with all expanded
          });
          setExpandedGroups(initialExpandedState);
          
          // If editing role, fetch its permissions
          if (role) {
            fetchRolePermissions(role.roleId);
          }
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
        toast.error('Không thể tải dữ liệu quyền. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [role]);
  
  // Handle permission selection change
  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };
  
  // Handle group expansion toggle
  const toggleGroupExpansion = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };
  
  // Handle select all permissions in a group
  const selectAllInGroup = (group) => {
    const groupPermissionIds = permissionGroups[group].map(p => p.permissionId);
    const allSelected = groupPermissionIds.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      // Deselect all in group
      setSelectedPermissions(prev => 
        prev.filter(id => !groupPermissionIds.includes(id))
      );
    } else {
      // Select all in group
      setSelectedPermissions(prev => {
        const newSelected = [...prev];
        groupPermissionIds.forEach(id => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      });
    }
  };
  
  // Filter permissions based on search term
  const filteredGroups = Object.keys(permissionGroups).filter(group => {
    if (!searchTerm) return true;
    
    // Check if group name contains search term
    if (group.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    
    // Check if any permission in group contains search term
    return permissionGroups[group].some(permission => 
      permission.permissionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (permission.permissionDescription && 
       permission.permissionDescription.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Map permission name to display name
  const getDisplayName = (name) => {
    const parts = name.split('.');
    if (parts.length === 2) {
      const [category, action] = parts;
      return action.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    return name;
  };
  
  // Map category name to display name
  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'employee': 'Nhân viên', 'role': 'Vai trò', 'permission': 'Quyền hạn', 
      'material': 'Vật tư', 'material_transaction': 'Giao dịch vật tư', 
      'brand': 'Thương hiệu', 'product': 'Sản phẩm', 'inventory': 'Kho hàng', 
      'inventory_transaction': 'Giao dịch kho', 'promotion': 'Khuyến mãi', 
      'customer': 'Khách hàng', 'cart': 'Giỏ hàng', 'order': 'Đơn hàng', 
      'payment': 'Thanh toán', 'shipment': 'Vận chuyển', 'conversation': 'Hội thoại', 
      'report': 'Báo cáo', 'dashboard': 'Bảng điều khiển'
    };
    
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Get current permissions for the role
      const currentPermissionsResponse = await employeeService.getPermissionsByRole(role.roleId);
      const currentPermissionIds = currentPermissionsResponse?.data?.map(p => p.permissionId) || [];
      
      // Calculate permissions to add and remove
      const permissionsToAdd = selectedPermissions.filter(id => !currentPermissionIds.includes(id));
      const permissionsToRemove = currentPermissionIds.filter(id => !selectedPermissions.includes(id));
      
      // Add new permissions
      if (permissionsToAdd.length > 0) {
        await employeeService.addPermissionsToRole(role.roleId, permissionsToAdd);
      }
      
      // Remove permissions
      if (permissionsToRemove.length > 0) {
        await employeeService.removePermissionsFromRole(role.roleId, permissionsToRemove);
      }
      
      toast.success('Cập nhật quyền thành công');
      
      // Thực hiện callback onSave để cập nhật UI
      if (onSave) {
      onSave();
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Lỗi khi lưu quyền: ' + (error.message || 'Vui lòng thử lại sau'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Quản lý quyền cho vai trò: {role?.roleName}</h3>
          <button onClick={onCancel}><X size={20}/></button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm quyền..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden mb-4">
              <div className="max-h-[60vh] overflow-y-auto">
                {filteredGroups.length > 0 ? (
                  filteredGroups.map(group => (
                    <div key={group} className="border-b last:border-b-0">
                      <div 
                        className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleGroupExpansion(group)}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`group-${group}`}
                            checked={permissionGroups[group].every(p => selectedPermissions.includes(p.permissionId))}
                            onChange={(e) => {
                              e.stopPropagation();
                              selectAllInGroup(group);
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                          />
                          <label htmlFor={`group-${group}`} className="font-medium text-gray-700">
                            {getCategoryDisplayName(group)}
                          </label>
                        </div>
                        {expandedGroups[group] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                      
                      {expandedGroups[group] && (
                        <div className="bg-white p-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {permissionGroups[group]
                              .filter(permission => 
                                !searchTerm || 
                                permission.permissionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (permission.permissionDescription && 
                                 permission.permissionDescription.toLowerCase().includes(searchTerm.toLowerCase()))
                              )
                              .map(permission => (
                                <div key={permission.permissionId} className="flex items-start p-2 hover:bg-gray-50 rounded">
                                  <input
                                    type="checkbox"
                                    id={`permission-${permission.permissionId}`}
                                    checked={selectedPermissions.includes(permission.permissionId)}
                                    onChange={() => handlePermissionChange(permission.permissionId)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                                  />
                                  <label 
                                    htmlFor={`permission-${permission.permissionId}`}
                                    className="ml-3 text-sm cursor-pointer"
                                  >
                                    <div className="font-medium text-gray-700">{getDisplayName(permission.permissionName)}</div>
                                    <div className="text-gray-500 text-xs mt-0.5">{permission.permissionDescription || 'Không có mô tả'}</div>
                                  </label>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    Không tìm thấy quyền nào phù hợp với từ khóa tìm kiếm
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Đã chọn {selectedPermissions.length} quyền
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Role Manager Modal component
import { Save, Trash } from 'lucide-react';
const RoleManagerModal = ({ isOpen, onClose, staffData, defaultRole, singleColumn }) => {
  // Tab state
  const [activeTab, setActiveTab] = useState('settings'); // 'settings', 'permissions', 'employees'
  // Role edit state
  const [editedRole, setEditedRole] = useState(null);
  // Employees in role
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  // Modal thêm nhân viên vào vai trò
  const [showAddEmployeeToRoleModal, setShowAddEmployeeToRoleModal] = useState(false);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [availableEmployeesLoading, setAvailableEmployeesLoading] = useState(false);
  const [availableEmployeeSearchTerm, setAvailableEmployeeSearchTerm] = useState('');
  // State cho xác nhận xóa vai trò
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  // State cho chọn nhiều nhân viên
  const [selectedEmployeesToAdd, setSelectedEmployeesToAdd] = useState([]);
  const [selectedEmployeesToRemove, setSelectedEmployeesToRemove] = useState([]);
  // ... giữ nguyên các state khác

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [loading, setLoading] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissionGroups, setPermissionGroups] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    if (isOpen) fetchRoles();
    // eslint-disable-next-line
  }, [isOpen]);

  useEffect(() => {
    if (selectedRole) {
      setEditedRole({
        roleName: selectedRole.roleName,
        roleDescription: selectedRole.roleDescription || '',
        isDefault: selectedRole.isDefault || false,
        status: selectedRole.status || 'active'
      });
      fetchPermissionsForRole(selectedRole.roleId);
      fetchEmployeesByRole(selectedRole.roleId);
    }
  }, [selectedRole]);

  const fetchEmployeesByRole = async (roleId) => {
    if (!roleId) return;
    setEmployeesLoading(true);
    try {
      // Sử dụng API mới getEmployeesByRoleId để lấy chính xác nhân viên theo vai trò
      const response = await employeeService.getEmployeesByRoleId(roleId);
      if (response?.data) {
        setEmployees(response.data);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees by role:', error);
      toast.error('Không thể tải danh sách nhân viên theo vai trò');
      setEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }
  };

  const handleRoleUpdate = async () => {
    if (!editedRole || !selectedRole) return;
    setLoading(true);
    
    try {
      // Nếu là vai trò mặc định, cần reset các vai trò khác về không mặc định
      if (editedRole.isDefault && !selectedRole.isDefault) {
            await employeeService.resetDefaultRole();
      }
      
      // Cập nhật vai trò
      const updatedData = await employeeService.updateRole(selectedRole.roleId, editedRole);
      
      // Cập nhật trạng thái vai trò trong danh sách vai trò của modal
      setRoles(prevRoles => 
        prevRoles.map(role => 
          role.roleId === selectedRole.roleId ? { ...role, ...editedRole } : role
        )
      );
      
      toast.success('Cập nhật vai trò thành công');
      
      // Chuyển về tab settings
      setActiveTab('settings');
      
      // Cập nhật vai trò đã chọn
      setSelectedRole({...selectedRole, ...editedRole});
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Lỗi khi cập nhật vai trò: ' + (error.message || 'Vui lòng thử lại sau'));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveEmployeeFromRole = async (employeeId, roleId) => {
    // Set the employee to remove and show confirmation dialog
    setSelectedEmployeesToRemove([employeeId]);
    setShowDeleteConfirmation(true);
  };
  
  const handleRemoveSelectedEmployeesFromRole = () => {
    // Show confirmation dialog for multiple employee removal
    if (selectedEmployeesToRemove.length === 0) {
      toast.error('Vui lòng chọn ít nhất một nhân viên để xóa');
      return;
    }
    setShowDeleteConfirmation(true);
  };
  
  const confirmRemoveEmployeesFromRole = async () => {
    if (!selectedRole || selectedEmployeesToRemove.length === 0) return;
    
    setLoading(true);
    try {
      // Xử lý xóa từng nhân viên
      for (const employeeId of selectedEmployeesToRemove) {
        await employeeService.removeRolesFromEmployee(employeeId, [selectedRole.roleId]);
      }
      
      const message = selectedEmployeesToRemove.length === 1 
        ? 'Đã xóa nhân viên khỏi vai trò' 
        : `Đã xóa ${selectedEmployeesToRemove.length} nhân viên khỏi vai trò`;
      
      toast.success(message);
      fetchEmployeesByRole(selectedRole.roleId);
    } catch (error) {
      console.error('Error removing employees from role:', error);
      toast.error('Lỗi khi xóa nhân viên khỏi vai trò: ' + (error.message || 'Vui lòng thử lại sau'));
    } finally {
      setLoading(false);
      setShowDeleteConfirmation(false);
      setSelectedEmployeesToRemove([]);
    }
  };

  const handleAddEmployeeToRole = async () => {
    // Mở modal chọn nhân viên
    setShowAddEmployeeToRoleModal(true);
  };

  const handleEmployeeSelect = (employeeId) => {
    // Toggle selection of employee
    setSelectedEmployeesToAdd(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };
  
  const confirmAddEmployeesToRole = async () => {
    if (!selectedRole || selectedEmployeesToAdd.length === 0) {
      toast.error('Vui lòng chọn ít nhất một nhân viên để thêm');
      return;
    }
    
    setLoading(true);
    try {
      // Xử lý thêm từng nhân viên
      for (const employeeId of selectedEmployeesToAdd) {
        await employeeService.assignRolesToEmployee(employeeId, [selectedRole.roleId]);
      }
      
      const message = selectedEmployeesToAdd.length === 1 
        ? 'Đã thêm nhân viên vào vai trò' 
        : `Đã thêm ${selectedEmployeesToAdd.length} nhân viên vào vai trò`;
      
      toast.success(message);
      fetchEmployeesByRole(selectedRole.roleId);
    } catch (error) {
      console.error('Error adding employees to role:', error);
      toast.error('Lỗi khi thêm nhân viên vào vai trò: ' + (error.message || 'Vui lòng thử lại sau'));
    } finally {
      setLoading(false);
      setShowAddEmployeeToRoleModal(false);
      setSelectedEmployeesToAdd([]);
    }
  };

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getRolesWithEmployeeCount();
      if (response?.data) {
        setRoles(response.data);
        if (response.data.length > 0 && !selectedRole) {
          setSelectedRole(response.data[0]);
          fetchPermissionsForRole(response.data[0].roleId);
        } else if (defaultRole) {
          const initial = response.data.find(r => r.roleId === defaultRole.roleId);
          if (initial) {
            setSelectedRole(initial);
            fetchPermissionsForRole(initial.roleId);
          } else {
            setSelectedRole(response.data[0]);
            fetchPermissionsForRole(response.data[0].roleId);
          }
        }
      }
    } catch (error) {
      toast.error('Không thể tải dữ liệu vai trò');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissionsForRole = async (roleId) => {
    setLoading(true);
    try {
      const allPermissionsResponse = await employeeService.getAllPermissions();
      if (allPermissionsResponse?.data) {
        setPermissions(allPermissionsResponse.data);
        const groups = {};
        allPermissionsResponse.data.forEach(permission => {
          const [category] = permission.permissionName.split('.');
          if (!groups[category]) groups[category] = [];
          groups[category].push(permission);
        });
        setPermissionGroups(groups);
        const initialExpandedState = {};
        Object.keys(groups).forEach(group => { initialExpandedState[group] = true; });
        setExpandedGroups(initialExpandedState);
      }
      const rolePermissionsResponse = await employeeService.getPermissionsByRole(roleId);
      if (rolePermissionsResponse?.data) {
        setSelectedPermissions(rolePermissionsResponse.data.map(p => p.permissionId));
      }
    } catch {
      toast.error('Không thể tải dữ liệu quyền');
    } finally { setLoading(false); }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    fetchPermissionsForRole(role.roleId);
  };

  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      toast.error('Tên vai trò không được để trống'); return;
    }
    setLoading(true);
    try {
      const response = await employeeService.createRole({ roleName: newRoleName.trim(), roleDescription: '', status: 'active' });
      
      // Thêm vai trò mới vào danh sách vai trò
      if (response && response.data) {
        setRoles(prevRoles => [...prevRoles, response.data]);
      }
      
      setNewRoleName(''); 
      setIsAddingRole(false); 
      toast.success('Tạo vai trò mới thành công');
    } catch (error) {
      toast.error('Lỗi khi tạo vai trò: ' + (error.message || 'Vui lòng thử lại sau'));
    } finally { 
      setLoading(false); 
    }
  };

  const handleDeleteRole = (roleId) => {
    // Set the role to delete and show confirmation dialog
    setRoleToDelete(roleId);
    setShowDeleteConfirmation(true);
  };
  
  const confirmDeleteRole = async () => {
    if (!roleToDelete) return;
    
    setLoading(true);
    try { 
      // Remove all permissions from the role
      const permResp = await employeeService.getPermissionsByRole(roleToDelete);
      if (permResp?.data && permResp.data.length) {
        const permIds = permResp.data.map(p => p.permissionId);
        await employeeService.removePermissionsFromRole(roleToDelete, permIds);
      }
      // Remove role from all employees
      const empResp = await employeeService.getEmployeesByRoleId(roleToDelete);
      if (empResp?.data && empResp.data.length) {
        for (const emp of empResp.data) {
          await employeeService.removeRolesFromEmployee(emp.employeeId, [roleToDelete]);
        }
      }
      // Finally delete the role with force
      await employeeService.deleteRole(roleToDelete, true);
      toast.success('Xóa vai trò thành công');
      
      // Cập nhật danh sách vai trò trong modal
      setRoles(prevRoles => prevRoles.filter(role => role.roleId !== roleToDelete));
      
      // Reset selection if the deleted role was selected
      if (selectedRole && selectedRole.roleId === roleToDelete) {
        setSelectedRole(null);
      }
    }
    catch (error) { 
      toast.error('Lỗi khi xóa vai trò: ' + (error.message || 'Vui lòng thử lại sau')); 
    }
    finally { 
      setLoading(false); 
      setShowDeleteConfirmation(false);
      setRoleToDelete(null);
    }
  };

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions(prev => prev.includes(permissionId) ? prev.filter(id => id !== permissionId) : [...prev, permissionId]);
  };
  const toggleGroupExpansion = (group) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };
  const selectAllInGroup = (group) => {
    const groupPermissionIds = permissionGroups[group].map(p => p.permissionId);
    const allSelected = groupPermissionIds.every(id => selectedPermissions.includes(id));
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(id => !groupPermissionIds.includes(id)));
    } else {
      setSelectedPermissions(prev => {
        const newSelected = [...prev];
        groupPermissionIds.forEach(id => { if (!newSelected.includes(id)) newSelected.push(id); });
        return newSelected;
      });
    }
  };
  const savePermissions = async () => {
    if (!selectedRole) return;
    
    setLoading(true);
    try {
      // Get existing permissions
      const currentPermsResponse = await employeeService.getPermissionsByRole(selectedRole.roleId);
      const currentPerms = currentPermsResponse?.data?.map(p => p.permissionId) || [];
      
      // Calculate permissions to add (permissions in selectedPermissions but not in currentPerms)
      const toAdd = selectedPermissions.filter(p => !currentPerms.includes(p));
      
      // Calculate permissions to remove (permissions in currentPerms but not in selectedPermissions)
      const toRemove = currentPerms.filter(p => !selectedPermissions.includes(p));
      
      // Add new permissions if any
      if (toAdd.length > 0) {
        await employeeService.addPermissionsToRole(selectedRole.roleId, toAdd);
      }
      
      // Remove permissions if any
      if (toRemove.length > 0) {
        await employeeService.removePermissionsFromRole(selectedRole.roleId, toRemove);
      }
      
      toast.success('Cập nhật quyền thành công');
    } catch (error) {
      toast.error('Lỗi khi cập nhật quyền: ' + (error.message || 'Vui lòng thử lại sau'));
    } finally {
      setLoading(false);
    }
  };
  const getDisplayName = (name) => {
    const parts = name.split('.');
    if (parts.length === 2) {
      const [category, action] = parts;
      return action.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    return name;
  };
  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'employee': 'Nhân viên', 'role': 'Vai trò', 'permission': 'Quyền hạn', 'material': 'Vật tư', 'material_transaction': 'Giao dịch vật tư', 'brand': 'Thương hiệu', 'product': 'Sản phẩm', 'inventory': 'Kho hàng', 'inventory_transaction': 'Giao dịch kho', 'promotion': 'Khuyến mãi', 'customer': 'Khách hàng', 'cart': 'Giỏ hàng', 'order': 'Đơn hàng', 'payment': 'Thanh toán', 'shipment': 'Vận chuyển', 'conversation': 'Hội thoại', 'report': 'Báo cáo', 'dashboard': 'Bảng điều khiển'
    };
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };
  const filteredGroups = Object.keys(permissionGroups).filter(group => {
    if (!searchTerm) return true;
    if (group.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    return permissionGroups[group].some(permission => permission.permissionName.toLowerCase().includes(searchTerm.toLowerCase()) || (permission.permissionDescription && permission.permissionDescription.toLowerCase().includes(searchTerm.toLowerCase())));
  });

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg shadow-lg w-full ${singleColumn ? 'max-w-[50rem]' : 'max-w-6xl'} h-[80vh] flex flex-col`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Quản lý vai trò và quyền hạn</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        {loading && roles.length === 0 ? (
          <div className="flex-1 flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Left column - Roles (30%) */}
            {!singleColumn && (
              <div className="w-[30%] border-r flex flex-col">
                <div className="p-3 border-b bg-gray-50">
                  <h4 className="font-medium mb-2">Danh sách vai trò</h4>
                  {!isAddingRole ? (
                    <button 
                      onClick={() => setIsAddingRole(true)}
                      className="w-full py-2 px-3 bg-white border border-gray-300 rounded-md text-sm flex items-center justify-center hover:bg-gray-50"
                    >
                      <Plus size={16} className="mr-1" />
                      Thêm vai trò mới
                    </button>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        placeholder="Tên vai trò mới"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        autoFocus
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleAddRole}
                          disabled={loading}
                          className="flex-1 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                        >
                          {loading ? 'Đang thêm...' : 'Thêm'}
                        </button>
                        <button
                          onClick={() => { setIsAddingRole(false); setNewRoleName(''); }}
                          className="flex-1 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto">
                  {roles.map(role => (
                    <div 
                      key={role.roleId}
                      onClick={() => handleRoleSelect(role)}
                      className={`p-3 border-b flex items-center justify-between cursor-pointer hover:bg-gray-50 ${selectedRole?.roleId === role.roleId ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                    >
                      <div>
                        <div className="font-medium">{role.roleName}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Users size={14} className="mr-1" />
                          {role.employeeCount} nhân viên
                        </div>
                        {role.isDefault && (
                          <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Mặc định
                          </span>
                        )}
                        {role.status && (
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${role.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {role.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {roles.length === 0 && (
                    <div className="p-4 text-center text-gray-500">Không có vai trò nào</div>
                  )}
                </div>
              </div>
            )}
            {/* Right column - Tabs (70%) */}
            <div className={`${singleColumn ? 'w-full' : 'w-[70%]'} flex flex-col`}>
              {selectedRole ? (
                <>
                  {/* Tabs header */}
                  <div className="border-b">
                    <div className="flex">
                      <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 py-3 font-medium text-sm border-b-2 ${activeTab === 'settings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                        Cài đặt vai trò
                      </button>
                      <button
                        onClick={() => setActiveTab('permissions')}
                        className={`px-4 py-3 font-medium text-sm border-b-2 ${activeTab === 'permissions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                        Quản lý quyền
                      </button>
                      <button
                        onClick={() => setActiveTab('employees')}
                        className={`px-4 py-3 font-medium text-sm border-b-2 ${activeTab === 'employees' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                        Nhân sự ({employees.length})
                      </button>
                    </div>
                  </div>
                  {/* Tab content */}
                  <div className="flex-1 overflow-y-auto">
                    {/* Tab 1: Cài đặt vai trò */}
                    {activeTab === 'settings' && (
                      <div className="p-4">
                        <h4 className="font-medium mb-4">Chỉnh sửa vai trò: {selectedRole.roleName}</h4>
                        <form onSubmit={(e) => { e.preventDefault(); handleRoleUpdate(); }}>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên vai trò
                              </label>
                              <input
                                type="text"
                                value={editedRole?.roleName || ''}
                                onChange={(e) => setEditedRole({...editedRole, roleName: e.target.value})}
                                className="w-full border rounded-md px-3 py-2"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mô tả
                              </label>
                              <textarea
                                value={editedRole?.roleDescription || ''}
                                onChange={(e) => setEditedRole({...editedRole, roleDescription: e.target.value})}
                                className="w-full border rounded-md px-3 py-2 min-h-[100px]"
                              />
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="isDefault"
                                checked={editedRole?.isDefault || false}
                                onChange={(e) => setEditedRole({...editedRole, isDefault: e.target.checked})}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                                Đặt làm vai trò mặc định
                              </label>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Trạng thái
                              </label>
                              <select
                                value={editedRole?.status || 'active'}
                                onChange={(e) => setEditedRole({...editedRole, status: e.target.value})}
                                className="w-full border rounded-md px-3 py-2"
                              >
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Không hoạt động</option>
                              </select>
                            </div>
                            <div className="pt-4 flex justify-between">
                              <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                              >
                                <Save size={16} className="mr-2" />
                                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => handleDeleteRole(selectedRole.roleId)}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                              >
                                <Trash2 size={16} className="mr-2" />
                                Xóa vai trò
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Tab 2: Quản lý quyền */}
                    {activeTab === 'permissions' && (
                      <>
                        <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Quyền hạn cho vai trò: {selectedRole.roleName}</h4>
                            <p className="text-sm text-gray-500 mt-1">{selectedRole.roleDescription || 'Không có mô tả'}</p>
                          </div>
                          <button
                            onClick={savePermissions}
                            disabled={loading}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm flex items-center hover:bg-blue-700"
                          >
                            <Save size={16} className="mr-1" />
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                          </button>
                        </div>
                        <div className="p-3 border-b">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Tìm kiếm quyền..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3">
                          {loading && permissions.length === 0 ? (
                            <div className="flex justify-center items-center h-full">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {filteredGroups.length > 0 ? (
                                filteredGroups.map(group => (
                                  <div key={group} className="border rounded-lg overflow-hidden">
                                    <div 
                                      className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                                      onClick={() => toggleGroupExpansion(group)}
                                    >
                                      <div className="flex items-center">
                                        <input
                                          type="checkbox"
                                          id={`group-${group}`}
                                          checked={permissionGroups[group].every(p => selectedPermissions.includes(p.permissionId))}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            selectAllInGroup(group);
                                          }}
                                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                                        />
                                        <label htmlFor={`group-${group}`} className="font-medium text-gray-700">
                                          {getCategoryDisplayName(group)}
                                        </label>
                                      </div>
                                      {expandedGroups[group] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                    {expandedGroups[group] && (
                                      <div className="bg-white p-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          {permissionGroups[group]
                                            .filter(permission => 
                                              !searchTerm || 
                                              permission.permissionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                              (permission.permissionDescription && 
                                               permission.permissionDescription.toLowerCase().includes(searchTerm.toLowerCase()))
                                            )
                                            .map(permission => (
                                              <div key={permission.permissionId} className="flex items-start p-2 hover:bg-gray-50 rounded">
                                                <input
                                                  type="checkbox"
                                                  id={`permission-${permission.permissionId}`}
                                                  checked={selectedPermissions.includes(permission.permissionId)}
                                                  onChange={() => handlePermissionChange(permission.permissionId)}
                                                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                                                />
                                                <label 
                                                  htmlFor={`permission-${permission.permissionId}`}
                                                  className="ml-3 text-sm cursor-pointer"
                                                >
                                                  <div className="font-medium text-gray-700">{getDisplayName(permission.permissionName)}</div>
                                                  <div className="text-gray-500 text-xs mt-0.5">{permission.permissionDescription || 'Không có mô tả'}</div>
                                                </label>
                                              </div>
                                            ))
                                          }
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="py-8 text-center text-gray-500">
                                  Không tìm thấy quyền nào phù hợp với từ khóa tìm kiếm
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Tab 3: Nhân sự */}
                    {activeTab === 'employees' && (
                      <>
                        <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Nhân viên thuộc vai trò: {selectedRole.roleName}</h4>
                            <p className="text-sm text-gray-500 mt-1">Chỉ hiển thị nhân viên đang hoạt động</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {selectedEmployeesToRemove.length > 0 && (
                              <button
                                onClick={handleRemoveSelectedEmployeesFromRole}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm flex items-center hover:bg-red-700"
                              >
                                <Trash2 size={16} className="mr-1" />
                                Xóa {selectedEmployeesToRemove.length} đã chọn
                              </button>
                            )}
                            <button
                              onClick={handleAddEmployeeToRole}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm flex items-center hover:bg-blue-700"
                            >
                              <UserPlus size={16} className="mr-1" />
                              Thêm nhân viên
                            </button>
                          </div>
                        </div>
                        <div className="p-3 border-b">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Tìm kiếm nhân viên..."
                              value={employeeSearchTerm || ''}
                              onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                              className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                          {employeesLoading ? (
                            <div className="flex justify-center items-center h-40">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      <input
                                        type="checkbox"
                                        checked={employees.length > 0 && selectedEmployeesToRemove.length === employees.length}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedEmployeesToRemove(employees.map(emp => emp.employeeId));
                                          } else {
                                            setSelectedEmployeesToRemove([]);
                                          }
                                        }}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      />
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Nhân viên
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Liên hệ
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Ngày bắt đầu
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {employees.length > 0 ? (
                                    employees
                                      .filter(employee => 
                                        !employeeSearchTerm || 
                                        employee.fullName.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
                                        employee.email.toLowerCase().includes(employeeSearchTerm.toLowerCase())
                                      )
                                      .map(employee => (
                                        <tr key={employee.employeeId} className="hover:bg-gray-50">
                                          <td className="px-3 py-4 whitespace-nowrap">
                                            <input
                                              type="checkbox"
                                              checked={selectedEmployeesToRemove.includes(employee.employeeId)}
                                              onChange={(e) => {
                                                if (e.target.checked) {
                                                  setSelectedEmployeesToRemove(prev => [...prev, employee.employeeId]);
                                                } else {
                                                  setSelectedEmployeesToRemove(prev => prev.filter(id => id !== employee.employeeId));
                                                }
                                              }}
                                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                              <div className="flex-shrink-0 h-10 w-10">
                                                {employee.profilePictureUrl ? (
                                                  <img 
                                                    className="h-10 w-10 rounded-full object-cover" 
                                                    src={employee.profilePictureUrl} 
                                                    alt={employee.fullName} 
                                                  />
                                                ) : (
                                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                    <User size={20} />
                                                  </div>
                                                )}
                                              </div>
                                              <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{employee.fullName}</div>
                                                <div className="text-sm text-gray-500">{employee.username}</div>
                                              </div>
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{employee.email}</div>
                                            <div className="text-sm text-gray-500">{employee.phoneNumber}</div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(employee.startDate).toLocaleDateString('vi-VN')}
                                          </td>
                                        </tr>
                                      ))
                                  ) : (
                                    <tr>
                                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                        Không có nhân viên nào trong vai trò này
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex justify-center items-center">
                  <div className="text-center text-gray-500">
                    <Users size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>Chọn một vai trò để quản lý</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal chọn nhân viên để thêm vào vai trò */}
      {showAddEmployeeToRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Chọn nhân viên để thêm vào vai trò</h3>
              <button 
                onClick={() => {
                  setShowAddEmployeeToRoleModal(false);
                  setSelectedEmployeesToAdd([]);
                }} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 border-b">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm nhân viên..."
                  value={availableEmployeeSearchTerm}
                  onChange={(e) => setAvailableEmployeeSearchTerm(e.target.value)}
                  className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {availableEmployeesLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sử dụng staffData từ component cha */}
                  {staffData && staffData
                    .filter(emp => 
                      // Chỉ hiển thị nhân viên đang hoạt động
                      emp.status === 'active' && 
                      // Lọc theo từ khóa tìm kiếm
                      (!availableEmployeeSearchTerm || 
                        emp.fullName.toLowerCase().includes(availableEmployeeSearchTerm.toLowerCase()) ||
                        emp.email.toLowerCase().includes(availableEmployeeSearchTerm.toLowerCase())
                      ) &&
                      // Không hiển thị những nhân viên đã có trong vai trò
                      !employees.some(e => e.employeeId === emp.employeeId)
                    )
                    .map(emp => (
                      <div 
                        key={emp.employeeId} 
                        className={`border rounded-lg p-4 hover:bg-gray-50 cursor-pointer flex items-center ${selectedEmployeesToAdd.includes(emp.employeeId) ? 'bg-blue-50 border-blue-300' : ''}`}
                        onClick={() => handleEmployeeSelect(emp.employeeId)}
                      >
                        <div className="flex-shrink-0 mr-3">
                          <input
                            type="checkbox"
                            checked={selectedEmployeesToAdd.includes(emp.employeeId)}
                            onChange={(e) => {
                              // Prevent double triggering with the div click
                              e.stopPropagation();
                              handleEmployeeSelect(emp.employeeId);
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex-shrink-0 h-12 w-12 mr-4">
                          {emp.profilePictureUrl ? (
                            <img 
                              className="h-12 w-12 rounded-full object-cover" 
                              src={emp.profilePictureUrl} 
                              alt={emp.fullName} 
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              <User size={24} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{emp.fullName}</div>
                          <div className="text-sm text-gray-500">{emp.email}</div>
                        </div>
                      </div>
                    ))
                  }
                  
                  {staffData && staffData.filter(emp => 
                    emp.status === 'active' && 
                    !employees.some(e => e.employeeId === emp.employeeId) &&
                    (!availableEmployeeSearchTerm || 
                      emp.fullName.toLowerCase().includes(availableEmployeeSearchTerm.toLowerCase()) ||
                      emp.email.toLowerCase().includes(availableEmployeeSearchTerm.toLowerCase())
                    )
                  ).length === 0 && (
                    <div className="col-span-2 py-8 text-center text-gray-500">
                      Không tìm thấy nhân viên phù hợp hoặc tất cả nhân viên đã được thêm vào vai trò
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t flex justify-end">
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowAddEmployeeToRoleModal(false);
                    setSelectedEmployeesToAdd([]);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmAddEmployeesToRole}
                  disabled={selectedEmployeesToAdd.length === 0 || loading}
                  className={`px-4 py-2 rounded-md text-white ${selectedEmployeesToAdd.length === 0 ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {loading ? 'Đang xử lý...' : `Xác nhận thêm ${selectedEmployeesToAdd.length > 0 ? selectedEmployeesToAdd.length : ''} nhân viên`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Confirmation Dialog for Role Deletion */}
      {showDeleteConfirmation && roleToDelete && (
        <ConfirmDialog
          title="Xác nhận xóa vai trò"
          message="Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác và sẽ xóa vai trò này khỏi tất cả nhân viên."
          onConfirm={confirmDeleteRole}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setRoleToDelete(null);
          }}
          confirmText="Xóa vai trò"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
      )}
      
      {/* Confirmation Dialog for Employee Removal */}
      {showDeleteConfirmation && selectedEmployeesToRemove.length > 0 && !roleToDelete && (
        <ConfirmDialog
          title="Xác nhận xóa nhân viên"
          message={selectedEmployeesToRemove.length === 1 
            ? "Bạn có chắc chắn muốn xóa nhân viên này khỏi vai trò?" 
            : `Bạn có chắc chắn muốn xóa ${selectedEmployeesToRemove.length} nhân viên đã chọn khỏi vai trò?`}
          onConfirm={confirmRemoveEmployeesFromRole}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setSelectedEmployeesToRemove([]);
          }}
          confirmText={`Xóa ${selectedEmployeesToRemove.length > 1 ? selectedEmployeesToRemove.length + ' nhân viên' : 'nhân viên'}`}
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
      )}
    </div>
  ) : null;
};

// Main ManageStaff component
const Staff = () => {
  const [staffData, setStaffData] = useState(initialStaffData);
  const [rolesData, setRolesData] = useState(initialRolesData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAction, setCurrentAction] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [activeRoles, setActiveRoles] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filterRoles, setFilterRoles] = useState([]);
  const [filterStatuses, setFilterStatuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'employeeId', direction: 'asc' });
  // State cho Role Modal
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  // State cho Permission Modal
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  // Role Manager Modal
  const [showRoleManagerModal, setShowRoleManagerModal] = useState(false);
  const [roleManagerSingleColumn, setRoleManagerSingleColumn] = useState(false);
  // New states for pagination and role filter
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState([]);
  // Thêm state mới cho lọc trạng thái vai trò
  const [roleStatusFilter, setRoleStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  // Thêm state để lưu trữ giá trị hiệu suất cao nhất
  const [maxPerformance, setMaxPerformance] = useState(100);

  // Fetch staff data and roles data when component mounts
  useEffect(() => {
    fetchEmployees(setLoading, setError, setStaffData, setMaxPerformance);
    fetchRoles();
    // eslint-disable-next-line
  }, []);

  // Fetch roles data
    const fetchRoles = async () => {
      try {
        const response = await employeeService.getRolesWithEmployeeCount();
        if (response && response.data) {
          setRolesData(response.data);
        }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setError('Lỗi khi tải danh sách vai trò: ' + (error.message || 'Vui lòng thử lại sau'));
    }
  };

  useEffect(() => { fetchActiveRoles(setLoading, setActiveRoles); }, []);

  // Filter staff data based on search and filters
  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoles = filterRoles.length === 0 || staff.roles.some(r=> filterRoles.includes(r));
    const matchesStatus = filterStatuses.length === 0 || filterStatuses.includes(staff.status);
    const matchesRoleFilter = roleFilter.length === 0 || 
                            staff.roles.some(role => roleFilter.includes(role));
    
    return matchesSearch && matchesRoles && matchesStatus && matchesRoleFilter;
  });
  
  // Lọc danh sách vai trò dựa trên trạng thái được chọn
  const filteredRolesData = rolesData.filter(role => {
    if (roleStatusFilter === 'all') return true;
    return role.status === roleStatusFilter;
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

  // Paginate staff data
  const indexOfLastStaff = currentPage * pageSize;
  const indexOfFirstStaff = indexOfLastStaff - pageSize;
  const currentStaffData = sortedStaff.slice(indexOfFirstStaff, indexOfLastStaff);
  const totalPages = Math.ceil(sortedStaff.length / pageSize);
  
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
        // Tạo nhân viên mới
        await employeeService.createEmployee(formData);
        toast.success('Thêm nhân viên mới thành công!');
      } else if (currentAction === 'edit') {
        // Cập nhật nhân viên hiện có
        await employeeService.updateEmployee(selectedStaff.employeeId, formData);
        toast.success('Cập nhật nhân viên thành công!');
      }
      
      // Refresh employee list
      fetchEmployees(setLoading, setError, setStaffData, setMaxPerformance);
      // Reset state
      setCurrentAction(null);
      setSelectedStaff(null);
    } catch (error) {
      toast.error('Lỗi: ' + (error.message || 'Vui lòng thử lại sau'));
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!selectedStaff) return;
    
    setLoading(true);
    try {
      await employeeService.deleteEmployee(selectedStaff.employeeId);
      toast.success('Xóa nhân viên thành công!');
      
      // Refresh employee list
      fetchEmployees(setLoading, setError, setStaffData, setMaxPerformance);
      // Reset state
      setCurrentAction(null);
      setSelectedStaff(null);
    } catch (error) {
      toast.error('Lỗi khi xóa nhân viên: ' + (error.message || 'Vui lòng thử lại sau'));
    } finally {
      setLoading(false);
    }
  };
  
  // Handle cancel modal
  const handleCancel = () => {
    setCurrentAction(null);
    setSelectedStaff(null);
  };
  
  // Handle export data
  const handleExport = () => {
    // This is a placeholder for export functionality
    toast.success('Xuất dữ liệu thành công!');
  };

  // Handle filters for mobile view
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterAnchor && !filterAnchor.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterAnchor]);
  
  // Handle adding a new role
  const handleAddRole = () => {
    setSelectedRole(null);
    setShowRoleModal(true);
  };

  // Handle editing a role
  const handleEditRole = (role) => {
    setSelectedRole(role);
    setShowRoleModal(true);
  };

  // Handle saving a role (create or update)
  const handleSaveRole = async (formData) => {
    setLoading(true);
    try {
      if (selectedRole) {
        // Update existing role
        await employeeService.updateRole(selectedRole.roleId, formData);
        toast.success('Cập nhật vai trò thành công!');
      } else {
        // Create new role
        await employeeService.createRole(formData);
        toast.success('Tạo vai trò mới thành công!');
      }
      
      // Refresh roles data
      const response = await employeeService.getRolesWithEmployeeCount();
      if (response && response.data) {
        setRolesData(response.data);
      }
      
      setShowRoleModal(false);
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error('Lỗi khi lưu vai trò: ' + (error.message || 'Vui lòng thử lại sau'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRole = () => {
    setShowRoleModal(false);
    setSelectedRole(null);
  };

  const handleManagePermissions = (role) => {
    setSelectedRole(role);
    setShowPermissionModal(true);
  };

  const handlePermissionsSaved = async () => {
    // Refresh roles data
    const response = await employeeService.getRolesWithEmployeeCount();
    if (response && response.data) {
      setRolesData(response.data);
    }
    
    setShowPermissionModal(false);
  };

  const handleCancelPermissions = () => {
    setShowPermissionModal(false);
  };

  // Edit role from role card
  const handleRoleCardEdit = (role) => {
    setSelectedRole(role);
    setRoleManagerSingleColumn(true);
    setShowRoleManagerModal(true);
  };

  const handleRoleManagerModalOpen = () => {
    setRoleManagerSingleColumn(false);
    setShowRoleManagerModal(true);
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Page size change handler
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Role filter change handler
  const handleRoleFilterChange = (roleName) => {
    setRoleFilter(prev => 
      prev.includes(roleName) 
        ? prev.filter(r => r !== roleName) 
        : [...prev, roleName]
    );
  };

  // Thêm hàm xuất Excel
  const exportToExcel = () => {
    try {
      // Import dynamically to reduce bundle size
      import('xlsx').then(XLSX => {
        // Chuẩn bị dữ liệu để xuất
        const dataToExport = sortedStaff.map(staff => ({
          'ID': staff.employeeId,
          'Họ và tên': staff.fullName,
          'Email': staff.email,
          'Số điện thoại': staff.phoneNumber,
          'Địa chỉ': staff.address,
          'Vai trò': staff.roles.join(', '),
          'Trạng thái': staff.status === 'active' ? 'Đang làm việc' :
                        staff.status === 'probation' ? 'Thử việc' :
                        staff.status === 'on_leave' ? 'Đang nghỉ phép' : 'Đã nghỉ',
          'Ngày bắt đầu': staff.startDate ? new Date(staff.startDate).toLocaleDateString('vi-VN') : '',
          'Ngày sinh': staff.dateOfBirth ? new Date(staff.dateOfBirth).toLocaleDateString('vi-VN') : '',
          'Hiệu suất': staff.performanceScore || 'N/A'
        }));

        // Tạo worksheet từ dữ liệu
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        
        // Tạo workbook và thêm worksheet vào
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Nhân viên');
        
        // Tạo tên file với timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `danh-sach-nhan-vien-${timestamp}.xlsx`;
        
        // Tải file xuống
        XLSX.writeFile(workbook, fileName);
        
        toast.success('Xuất dữ liệu thành công!');
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Lỗi khi xuất dữ liệu: ' + (error.message || 'Vui lòng thử lại sau'));
    }
  };

  // NEW Handler for multi-step RoleForm completion
  const handleRoleFormComplete = async () => {
     setShowRoleModal(false); // Close the modal
     setSelectedRole(null);   // Clear selection
     setLoading(true);       // Show loading while refreshing
     try {
        // Refresh roles data AFTER RoleForm did its job
        const rolesResponse = await employeeService.getRolesWithEmployeeCount();
        if (rolesResponse?.data) {
           setRolesData(rolesResponse.data);
        }
        // Refresh employee list as role assignments might have changed
        fetchEmployees(setLoading, setError, setStaffData, setMaxPerformance);
        toast.success('Dữ liệu vai trò và nhân viên đã được cập nhật.');
     } catch(error) {
        console.error("Error refreshing data after RoleForm completion:", error);
        toast.error("Lỗi khi tải lại dữ liệu sau khi lưu vai trò.");
     } finally {
        setLoading(false);
     }
  };

  // Define table columns with performance data
  const columns = [
    { key: 'fullName', label: 'Tên nhân viên', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phoneNumber', label: 'Số điện thoại', sortable: false },
    { key: 'roles', label: 'Vai trò', sortable: false },
    { key: 'status', label: 'Trạng thái', sortable: true },
    { key: 'performanceScore', label: 'Hiệu suất', sortable: true },
    { key: 'actions', label: 'Thao tác', sortable: false }
  ];

  return (
    <div className="p-6">
      <Toaster />
      {/* Header */}
      <PageHeader title="Quản lý nhân viên" subtitle="Quản lý tất cả nhân viên trong hệ thống" />
      
      {/* Main content */}
      <div className="mx-auto px-4 py-6">
        {/* Role overview */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h2 className="text-lg font-medium text-gray-900">Cơ cấu nhân sự</h2>
              <button 
                onClick={handleRoleManagerModalOpen}
                className="ml-2 p-1 text-gray-500 hover:text-blue-600 transition-colors"
                title="Quản lý vai trò và quyền hạn"
              >
                <Settings size={18} />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={roleStatusFilter}
                onChange={(e) => setRoleStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 py-1.5 px-3"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="active">Vai trò đang hoạt động</option>
                <option value="inactive">Vai trò không hoạt động</option>
              </select>
            <button 
              onClick={handleAddRole}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm flex items-center hover:bg-blue-700"
            >
              <Plus size={16} className="mr-1" />
              Thêm vai trò
            </button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-4">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[200px]">
              {rolesData
                .filter(role => roleStatusFilter === 'all' || role.status === roleStatusFilter)
                .map(role => (
                  <RoleCard key={role.roleId} role={role} onEdit={handleRoleCardEdit} />
                ))}
              {rolesData.filter(role => roleStatusFilter === 'all' || role.status === roleStatusFilter).length === 0 && (
                <div className="col-span-full text-center py-4 text-gray-500">
                  Không tìm thấy vai trò nào phù hợp với bộ lọc
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Staff management section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Đội ngũ</h2>
                  </div>
          
          {/* Unified Toolbar */}
          <div className="bg-white rounded-lg shadow mb-6">
            <TableToolbar
              searchValue={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              onSearchSubmit={(e) => { e.preventDefault(); setCurrentPage(1); }}
              onFilter={(e) => {
                setFilterOpen((prev) => !prev);
                if (e) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setFilterAnchor({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX });
                }
              }}
              addLabel="Thêm nhân viên"
              onAdd={handleAddStaff}
              placeholder="Tìm nhân viên..."
              extraActions={
                <button
                  onClick={exportToExcel}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center"
                  title="Xuất ra Excel"
                >
                  <Download size={18} className="text-gray-600" />
                </button>
              }
            />
          </div>
          
          {filterOpen && (
            <div
              className="fixed z-50 bg-white border rounded-md shadow-lg p-4 w-80"
              style={{ top: filterAnchor?.top, left: filterAnchor?.left }}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Vai trò</h4>
                  <button onClick={() => setFilterRoles([])} className="text-xs text-blue-600 hover:text-blue-800">Bỏ chọn tất cả</button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {rolesData.map(role => (
                    <label key={role.roleId} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filterRoles.includes(role.roleName)}
                          onChange={() => {
                            setFilterRoles(prev => prev.includes(role.roleName) ? prev.filter(r => r !== role.roleName) : [...prev, role.roleName]);
                          }}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{role.roleName}</span>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${role.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{role.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Trạng thái</h4>
                  <button onClick={() => setFilterStatuses([])} className="text-xs text-blue-600 hover:text-blue-800">Bỏ chọn tất cả</button>
                </div>
                <div className="space-y-2">
                  {[{value:'active',label:'Đang làm việc'},{value:'probation',label:'Thử việc'},{value:'on_leave',label:'Đang nghỉ phép'},{value:'inactive',label:'Đã nghỉ'}].map(({value,label})=> (
                    <label key={value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filterStatuses.includes(value)}
                        onChange={() => {
                          setFilterStatuses(prev => prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]);
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Staff table */}
          <div className="overflow-x-auto min-h-[300px]">
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hiệu suất
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentStaffData.map((staff) => (
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
                            <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-white border rounded shadow-lg p-2 text-sm z-[100] w-max">
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
                      <PerformanceIndicator value={parseFloat(staff.performanceScore || 0)} maxValue={maxPerformance} />
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
                
                {currentStaffData.length === 0 && (
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
          {!loading && sortedStaff.length > 0 && (
            <div className="px-4 py-3 flex flex-col md:flex-row md:justify-between border-t gap-3 bg-white">
              <div className="flex items-center text-sm text-gray-500 flex-wrap gap-2">
                <span>Hiển thị</span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="px-1 py-1 text-sm border rounded"
                >
                  {[5,10,20,50].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                  <option value={sortedStaff.length}>Tất cả</option>
                </select>
                <span>mỗi trang trong {sortedStaff.length} nhân viên</span>
              </div>
              <div className="flex justify-between md:justify-end items-center space-x-2">
                <div className="flex items-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 border rounded ${currentPage===1 ? 'text-gray-400 cursor-not-allowed':'hover:bg-gray-50'}`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex items-center mx-1">
                    <button className={`px-3 py-1 border rounded ${currentPage===1 ? 'bg-blue-600 text-white':'hover:bg-gray-50'}`} onClick={()=>handlePageChange(1)}>1</button>
                    {currentPage > 3 && <span className="px-1">...</span>}
                    {Array.from({length: totalPages}).map((_,i)=>{
                      if(i!==0 && i!== totalPages-1){
                        if(Math.abs(currentPage-(i+1))<=1){
                          return (
                            <button key={i} className={`px-3 py-1 border rounded ${currentPage===i+1?'bg-blue-600 text-white':'hover:bg-gray-50'}`} onClick={()=>handlePageChange(i+1)}>{i+1}</button>
                          );
                        }
                      }
                      return null;
                    })}
                    {currentPage < totalPages-2 && <span className="px-1">...</span>}
                    {totalPages>1 && (
                      <button className={`px-3 py-1 border rounded ${currentPage===totalPages? 'bg-blue-600 text-white':'hover:bg-gray-50'}`} onClick={()=>handlePageChange(totalPages)}>{totalPages}</button>
                    )}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 border rounded ${currentPage===totalPages ? 'text-gray-400 cursor-not-allowed':'hover:bg-gray-50'}`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
                <div className="inline-flex items-center ml-1">
                  <span className="mr-1 text-sm whitespace-nowrap">Đến trang:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    className="w-14 h-8 px-2 border rounded text-sm"
                    onKeyDown={(e)=>{
                      if(e.key==='Enter'){
                        const num=parseInt(e.target.value,10);
                        if(!isNaN(num) && num>=1 && num<= totalPages){
                          handlePageChange(num);
                          e.target.value='';
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      {(currentAction==='add'||currentAction==='edit')&&(<StaffForm staff={currentAction==='edit'?selectedStaff:null} rolesData={activeRoles} onSave={handleSaveStaff} onCancel={handleCancel}/>) }
      {currentAction==='delete'&&(<ConfirmDialog message={`Bạn có chắc chắn muốn xóa nhân viên ${selectedStaff.fullName}?`} onConfirm={handleConfirmDelete} onCancel={handleCancel}/>) }
      {currentAction==='view'&&(<ViewDialog employee={selectedStaff} onClose={handleCancel}/>)}
      {showRoleModal && (
        <RoleForm 
          role={selectedRole} 
          onSave={handleRoleFormComplete} 
          onCancel={handleCancelRole} 
          staffData={staffData}
        />
      )}
      {showPermissionModal && selectedRole && (
        <PermissionManager 
          role={selectedRole} 
          onSave={handlePermissionsSaved} 
          onCancel={handleCancelPermissions} 
        />
      )}
      {showRoleManagerModal && (
        <RoleManagerModal 
          isOpen={showRoleManagerModal}
          onClose={() => {
            setShowRoleManagerModal(false);
            // Refresh roles data when closing the modal
            fetchRoles();
          }}
          staffData={staffData}
          defaultRole={selectedRole}
          singleColumn={roleManagerSingleColumn}
        />
      )}
    </div>
  );
};

// Thêm keyframes animation cho tooltip
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.2s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default Staff;