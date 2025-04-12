import React, { useState } from 'react';
import { Search, ChevronDown, Plus, Filter, MoreHorizontal, ChevronLeft, ChevronRight, Edit, Trash, Download, Upload } from 'lucide-react';

const Customer = () => {
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sample customer data
  const customers = [
    { id: 1, name: 'Nguyễn Văn An', phone: '0912345678', email: 'nguyenvanan@gmail.com', address: '15 Nguyễn Trãi, Q.1, TP.HCM', totalOrders: 12, totalSpent: '8.250.000', status: 'Hoạt động' },
    { id: 2, name: 'Trần Thị Bình', phone: '0923456789', email: 'tranthibinh@gmail.com', address: '28 Lê Lợi, Q.1, TP.HCM', totalOrders: 8, totalSpent: '5.480.000', status: 'Hoạt động' },
    { id: 3, name: 'Lê Văn Cường', phone: '0934567890', email: 'levancuong@gmail.com', address: '45 Nguyễn Huệ, Q.1, TP.HCM', totalOrders: 5, totalSpent: '3.720.000', status: 'Hoạt động' },
    { id: 4, name: 'Phạm Thị Dung', phone: '0945678901', email: 'phamthidung@gmail.com', address: '72 Hai Bà Trưng, Q.1, TP.HCM', totalOrders: 3, totalSpent: '1.950.000', status: 'Hoạt động' },
    { id: 5, name: 'Hoàng Văn Em', phone: '0956789012', email: 'hoangvanem@gmail.com', address: '103 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM', totalOrders: 7, totalSpent: '4.820.000', status: 'Hoạt động' },
    { id: 6, name: 'Ngô Thị Phương', phone: '0967890123', email: 'ngothiphuong@gmail.com', address: '55 Lý Tự Trọng, Q.1, TP.HCM', totalOrders: 15, totalSpent: '12.350.000', status: 'Không hoạt động' },
    { id: 7, name: 'Vũ Văn Giang', phone: '0978901234', email: 'vuvangiang@gmail.com', address: '82 Nam Kỳ Khởi Nghĩa, Q.3, TP.HCM', totalOrders: 4, totalSpent: '2.670.000', status: 'Hoạt động' },
    { id: 8, name: 'Đặng Thị Hương', phone: '0989012345', email: 'dangthihuong@gmail.com', address: '39 Pasteur, Q.1, TP.HCM', totalOrders: 9, totalSpent: '6.930.000', status: 'Hoạt động' },
    { id: 9, name: 'Bùi Văn Khanh', phone: '0990123456', email: 'buivankhanh@gmail.com', address: '117 Võ Văn Tần, Q.3, TP.HCM', totalOrders: 6, totalSpent: '4.180.000', status: 'Hoạt động' },
    { id: 10, name: 'Đinh Thị Linh', phone: '0901234567', email: 'dinhthilinh@gmail.com', address: '94 Trần Hưng Đạo, Q.1, TP.HCM', totalOrders: 2, totalSpent: '1.250.000', status: 'Không hoạt động' },
  ];
  
  // Toggle select all customers
  const toggleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map(customer => customer.id));
    }
  };
  
  // Toggle select individual customer
  const toggleSelectCustomer = (customerId) => {
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    } else {
      setSelectedCustomers([...selectedCustomers, customerId]);
    }
  };
  
  // Check if customer is selected
  const isSelected = (customerId) => {
    return selectedCustomers.includes(customerId);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (keeping the same structure as the image) */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 font-bold text-blue-900 text-lg border-b">APH PERFUME</div>
        
        <nav className="p-4">
          <ul className="space-y-4">
            <li className="py-2 px-4">
              <a href="#" className="text-gray-700">
                Thống kê
              </a>
            </li>
            <li className="py-2 px-4 rounded-lg bg-blue-900 text-white">
              <a href="#" className="text-white">
                Người dùng
              </a>
            </li>
            <li className="py-2 px-4">
              <a href="#" className="text-gray-700">
                Đơn hàng
              </a>
            </li>
            <li className="py-2 px-4">
              <a href="#" className="text-gray-700">
                Sản phẩm
              </a>
            </li>
            <li className="py-2 px-4">
              <a href="#" className="text-gray-700">
                Kho vật tư
              </a>
            </li>
            <li className="py-2 px-4">
              <a href="#" className="text-gray-700">
                Marketing
              </a>
            </li>
            <li className="py-2 px-4">
              <a href="#" className="text-gray-700">
                Giao hàng
              </a>
            </li>
            <li className="py-2 px-4">
              <a href="#" className="text-gray-700">
                Nhân viên
              </a>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white p-4 flex justify-between items-center border-b border-gray-200">
          <div className="text-xl font-bold">BẢNG ĐIỀU KHIỂN</div>
          
          <div className="w-1/3 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 border-none focus:outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-white">
                1
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="/api/placeholder/40/40"
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="font-medium">Quốc Huy</div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
              <ChevronDown size={16} className="text-gray-600" />
            </div>
          </div>
        </header>
        
        {/* Customer Management Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6">QUẢN LÝ KHÁCH HÀNG</h1>
          
          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-900 text-white rounded-lg flex items-center space-x-2">
                <Plus size={18} />
                <span>Thêm khách hàng</span>
              </button>
              
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center space-x-2">
                <Upload size={18} />
                <span>Nhập file</span>
              </button>
              
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center space-x-2">
                <Download size={18} />
                <span>Xuất file</span>
              </button>
            </div>
            
            <div className="flex space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm khách hàng"
                  className="pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-blue-500 w-64"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center space-x-2">
                <Filter size={18} />
                <span>Lọc</span>
              </button>
            </div>
          </div>
          
          {/* Customer Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.length === customers.length}
                        onChange={toggleSelectAll}
                        className="mr-2 h-4 w-4"
                      />
                      STT
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa chỉ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số đơn hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng chi tiêu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer, index) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected(customer.id)}
                          onChange={() => toggleSelectCustomer(customer.id)}
                          className="mr-2 h-4 w-4"
                        />
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">{customer.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">{customer.totalOrders}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.totalSpent}đ</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${customer.status === 'Hoạt động' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800">
                          <Edit size={16} />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-800">
                          <Trash size={16} />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-gray-800">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-1 border rounded bg-blue-900 text-white">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-100">2</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-100">...</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-100">10</button>
            <button className="p-2 border rounded hover:bg-gray-100">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;