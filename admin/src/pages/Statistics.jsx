import React, { useState, useEffect } from 'react';
import { BarChart, LineChart, PieChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Pie, Cell } from 'recharts';
import { Download, Calendar, DollarSign, Users, ShoppingCart, ArrowUp, ArrowDown, Filter } from 'lucide-react';

// Sample data
const monthlyData = [
  { name: 'T1', revenue: 4000, expenses: 2400, profit: 1600 },
  { name: 'T2', revenue: 3000, expenses: 1398, profit: 1602 },
  { name: 'T3', revenue: 2000, expenses: 9800, profit: -7800 },
  { name: 'T4', revenue: 2780, expenses: 3908, profit: -1128 },
  { name: 'T5', revenue: 1890, expenses: 4800, profit: -2910 },
  { name: 'T6', revenue: 2390, expenses: 3800, profit: -1410 },
  { name: 'T7', revenue: 3490, expenses: 4300, profit: -810 },
  { name: 'T8', revenue: 5490, expenses: 3300, profit: 2190 },
  { name: 'T9', revenue: 7490, expenses: 3800, profit: 3690 },
  { name: 'T10', revenue: 6490, expenses: 4300, profit: 2190 },
  { name: 'T11', revenue: 8490, expenses: 4800, profit: 3690 },
  { name: 'T12', revenue: 9490, expenses: 5800, profit: 3690 }
];

const productData = [
  { name: 'Sản phẩm A', value: 400 },
  { name: 'Sản phẩm B', value: 300 },
  { name: 'Sản phẩm C', value: 300 },
  { name: 'Sản phẩm D', value: 200 },
  { name: 'Sản phẩm E', value: 100 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const customerData = [
  { name: 'T1', newUsers: 400, activeUsers: 240 },
  { name: 'T2', newUsers: 300, activeUsers: 139 },
  { name: 'T3', newUsers: 200, activeUsers: 980 },
  { name: 'T4', newUsers: 278, activeUsers: 390 },
  { name: 'T5', newUsers: 189, activeUsers: 480 },
  { name: 'T6', newUsers: 239, activeUsers: 380 },
  { name: 'T7', newUsers: 349, activeUsers: 430 },
  { name: 'T8', newUsers: 549, activeUsers: 330 },
  { name: 'T9', newUsers: 749, activeUsers: 380 },
  { name: 'T10', newUsers: 649, activeUsers: 430 },
  { name: 'T11', newUsers: 849, activeUsers: 480 },
  { name: 'T12', newUsers: 949, activeUsers: 580 }
];

// Card component for statistics overview
const StatCard = ({ title, value, icon, trend, percentage, color }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <ArrowUp size={16} className="text-green-500" />
            ) : (
              <ArrowDown size={16} className="text-red-500" />
            )}
            <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {percentage}%
            </span>
            <span className="text-gray-500 text-xs ml-1">so với tháng trước</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Main Statistics component
const Statistics = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [exportFormat, setExportFormat] = useState('pdf');
  
  const handleExport = () => {
    alert(`Xuất báo cáo dạng ${exportFormat} thành công!`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Thống kê doanh thu</h1>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Controls row */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="bg-white rounded-lg shadow px-4 py-2 flex items-center">
              <Calendar size={18} className="text-gray-400 mr-2" />
              <select 
                className="border-none focus:ring-0 text-sm"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="day">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm nay</option>
              </select>
            </div>
            
            <div className="bg-white rounded-lg shadow px-4 py-2 flex items-center">
              <Filter size={18} className="text-gray-400 mr-2" />
              <select className="border-none focus:ring-0 text-sm">
                <option>Tất cả sản phẩm</option>
                <option>Sản phẩm A</option>
                <option>Sản phẩm B</option>
                <option>Sản phẩm C</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
            <button 
              onClick={handleExport}
              className="bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center text-sm"
            >
              <Download size={16} className="mr-2" />
              Xuất báo cáo
            </button>
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Tổng doanh thu" 
            value="2.456.000.000₫" 
            icon={<DollarSign size={20} className="text-white" />}
            trend="up"
            percentage="12.5"
            color="bg-blue-500"
          />
          <StatCard 
            title="Đơn hàng" 
            value="1,243" 
            icon={<ShoppingCart size={20} className="text-white" />}
            trend="up"
            percentage="8.3"
            color="bg-green-500"
          />
          <StatCard 
            title="Khách hàng mới" 
            value="845" 
            icon={<Users size={20} className="text-white" />}
            trend="down"
            percentage="3.2"
            color="bg-purple-500"
          />
          <StatCard 
            title="Tỷ lệ chuyển đổi" 
            value="24.5%" 
            icon={<ArrowUp size={20} className="text-white" />}
            trend="up"
            percentage="4.3"
            color="bg-orange-500"
          />
        </div>
        
        {/* First row of charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Doanh thu theo tháng</h3>
              <div className="flex gap-2">
                <span className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>Doanh thu
                </span>
                <span className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>Chi phí
                </span>
                <span className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>Lợi nhuận
                </span>
              </div>
            </div>
            <div className="h-64">
              <BarChart width={500} height={250} data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" />
                <Bar dataKey="expenses" fill="#ef4444" />
                <Bar dataKey="profit" fill="#10b981" />
              </BarChart>
            </div>
          </div>
          
          {/* Product performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Hiệu suất sản phẩm</h3>
            </div>
            <div className="h-64 flex">
              <div className="w-1/2">
                <PieChart width={200} height={200}>
                  <Pie
                    data={productData}
                    cx={100}
                    cy={100}
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
              <div className="w-1/2">
                {productData.map((item, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <div className="text-sm flex-1">{item.name}</div>
                    <div className="text-sm font-medium">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Second row of charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer growth */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Tăng trưởng khách hàng</h3>
            </div>
            <div className="h-64">
              <LineChart width={500} height={250} data={customerData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="newUsers" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="activeUsers" stroke="#82ca9d" />
              </LineChart>
            </div>
          </div>
          
          {/* Recent transactions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Giao dịch gần đây</h3>
              <button className="text-sm text-blue-600">Xem tất cả</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">#1234</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Nguyễn Văn A</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">12/04/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">2.500.000₫</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Hoàn thành</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">#1235</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Trần Thị B</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">11/04/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">1.800.000₫</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Đang xử lý</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">#1236</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Lê Văn C</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">10/04/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">3.200.000₫</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Hoàn thành</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;