import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit, Trash2, Filter, Download, Mail, Phone, Award, ChevronDown, ChevronUp, Check, X } from 'lucide-react';

// Sample staff data
const initialStaffData = [
  { 
    id: 1, 
    name: 'Nguyễn Văn A', 
    email: 'nguyenvana@example.com', 
    phone: '0912345678', 
    position: 'Nhân viên bán hàng',
    department: 'Kinh doanh', 
    joinDate: '15/01/2023',
    status: 'active',
    performance: 92,
  },
  { 
    id: 2, 
    name: 'Trần Thị B', 
    email: 'tranthib@example.com', 
    phone: '0923456789', 
    position: 'Quản lý kho',
    department: 'Kho vận', 
    joinDate: '03/06/2022',
    status: 'active',
    performance: 88,
  },
  { 
    id: 3, 
    name: 'Lê Văn C', 
    email: 'levanc@example.com', 
    phone: '0934567890', 
    position: 'Kế toán',
    department: 'Tài chính', 
    joinDate: '22/11/2023',
    status: 'active',
    performance: 95,
  },
  { 
    id: 4, 
    name: 'Phạm Thị D', 
    email: 'phamthid@example.com', 
    phone: '0945678901', 
    position: 'Nhân viên bán hàng',
    department: 'Kinh doanh', 
    joinDate: '07/04/2024',
    status: 'probation',
    performance: 78,
  },
  { 
    id: 5, 
    name: 'Hoàng Văn E', 
    email: 'hoangvane@example.com', 
    phone: '0956789012', 
    position: 'Nhân viên IT',
    department: 'Công nghệ', 
    joinDate: '14/08/2023',
    status: 'inactive',
    performance: 0,
  },
];

// Department overview data
const departmentData = [
  { name: 'Kinh doanh', staffCount: 12, openPositions: 2 },
  { name: 'Kho vận', staffCount: 8, openPositions: 1 },
  { name: 'Tài chính', staffCount: 5, openPositions: 0 },
  { name: 'Công nghệ', staffCount: 6, openPositions: 3 },
  { name: 'Nhân sự', staffCount: 3, openPositions: 1 },
];

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
    case 'inactive':
      return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Đã nghỉ</span>;
    default:
      return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
  }
};

// Department card component
const DepartmentCard = ({ department, staffCount, openPositions }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <h3 className="font-medium text-lg mb-2">{department}</h3>
      <div className="flex items-center mt-1">
        <Users size={16} className="text-gray-500 mr-2" />
        <span className="text-gray-600 text-sm">{staffCount} nhân viên</span>
      </div>
      <div className="flex items-center mt-1">
        <Plus size={16} className="text-blue-500 mr-2" />
        <span className="text-gray-600 text-sm">{openPositions} vị trí đang tuyển</span>
      </div>
      <button className="mt-4 text-blue-600 text-sm">Xem chi tiết</button>
    </div>
  );
};

// Staff Form component
const StaffForm = ({ staff, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    staff || {
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      status: 'active',
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {staff ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Chọn phòng ban</option>
                <option value="Kinh doanh">Kinh doanh</option>
                <option value="Kho vận">Kho vận</option>
                <option value="Tài chính">Tài chính</option>
                <option value="Công nghệ">Công nghệ</option>
                <option value="Nhân sự">Nhân sự</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="active">Đang làm việc</option>
                <option value="probation">Thử việc</option>
                <option value="inactive">Đã nghỉ</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg px-4 py-2"
            >
              {staff ? 'Cập nhật' : 'Thêm nhân viên'}
            </button>
          </div>
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

// Main ManageStaff component
const Staff = () => {
  const [staffData, setStaffData] = useState(initialStaffData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [currentAction, setCurrentAction] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  
  // Filter staff data based on search and filters
  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === '' || staff.department === filterDepartment;
    const matchesStatus = filterStatus === '' || staff.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
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
  
  // Save staff (add or edit)
  const handleSaveStaff = (formData) => {
    if (currentAction === 'add') {
      const newStaff = {
        ...formData,
        id: staffData.length > 0 ? Math.max(...staffData.map(s => s.id)) + 1 : 1,
        joinDate: new Date().toLocaleDateString('vi-VN'),
        performance: formData.status === 'inactive' ? 0 : 75,
      };
      setStaffData([...staffData, newStaff]);
    } else if (currentAction === 'edit') {
      setStaffData(staffData.map(item => 
        item.id === selectedStaff.id ? { ...item, ...formData } : item
      ));
    }
    setCurrentAction(null);
  };
  
  // Confirm delete staff
  const handleConfirmDelete = () => {
    setStaffData(staffData.filter(item => item.id !== selectedStaff.id));
    setCurrentAction(null);
  };
  
  // Cancel current action
  const handleCancel = () => {
    setCurrentAction(null);
    setSelectedStaff(null);
  };
  
  // Handle export data
  const handleExport = () => {
    alert('Xuất dữ liệu nhân viên thành công!');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý nhân viên</h1>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Department overview */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Tổng quan phòng ban</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {departmentData.map((dept, index) => (
              <DepartmentCard 
                key={index}
                department={dept.name}
                staffCount={dept.staffCount}
                openPositions={dept.openPositions}
              />
            ))}
          </div>
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
                <div className="flex items-center">
                  <Filter size={18} className="text-gray-400 mr-2" />
                  <select
                    className="border border-gray-300 rounded-md text-sm"
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                  >
                    <option value="">Tất cả phòng ban</option>
                    <option value="Kinh doanh">Kinh doanh</option>
                    <option value="Kho vận">Kho vận</option>
                    <option value="Tài chính">Tài chính</option>
                    <option value="Công nghệ">Công nghệ</option>
                    <option value="Nhân sự">Nhân sự</option>
                  </select>
                </div>
                
                <div className="flex items-center ml-2">
                  <select
                    className="border border-gray-300 rounded-md text-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="active">Đang làm việc</option>
                    <option value="probation">Thử việc</option>
                    <option value="inactive">Đã nghỉ</option>
                  </select>
                </div>
                
                <button
                  onClick={handleExport}
                  className="flex items-center text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-1 ml-2"
                >
                  <Download size={16} className="mr-1" />
                  Xuất
                </button>
                
                <button
                  onClick={handleAddStaff}
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
                    onClick={() => requestSort('id')}
                  >
                    <div className="flex items-center">
                      ID
                      {getSortIndicator('id')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      Tên nhân viên
                      {getSortIndicator('name')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('department')}
                  >
                    <div className="flex items-center">
                      Phòng ban
                      {getSortIndicator('department')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('joinDate')}
                  >
                    <div className="flex items-center">
                      Ngày vào làm
                      {getSortIndicator('joinDate')}
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
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{staff.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                          {staff.name.split(' ').pop().charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                          <div className="text-sm text-gray-500">{staff.position}</div>
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
                        {staff.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={staff.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PerformanceIndicator value={staff.performance} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditStaff(staff)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteStaff(staff)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
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
      {(currentAction === 'add' || currentAction === 'edit') && (
        <StaffForm 
          staff={currentAction === 'edit' ? selectedStaff : null} 
          onSave={handleSaveStaff} 
          onCancel={handleCancel} 
        />
      )}
      
      {currentAction === 'delete' && (
        <ConfirmDialog 
          message={`Bạn có chắc chắn muốn xóa nhân viên ${selectedStaff.name}?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Staff;