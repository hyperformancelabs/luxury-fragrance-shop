import React, { useState } from 'react';
import { 
  Search, User, Bell, BarChart2, Package, Users, Tag, 
  Menu, X, Settings, LogOut, ChevronRight, TrendingUp, DollarSign,
  Calendar, Download, Percent, ArrowUp, ArrowDown, Home, ShoppingBag
} from 'lucide-react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState('Hôm nay');
  
  // Sample data
  const stats = [
    { id: 1, icon: <DollarSign size={20} />, value: '2.300.000', label: 'Doanh thu', change: '+12%', increasing: true },
    { id: 2, icon: <Package size={20} />, value: '300', label: 'Đơn hàng', change: '+5%', increasing: true },
    { id: 3, icon: <ShoppingBag size={20} />, value: '5', label: 'Sản phẩm', change: '-2%', increasing: false },
    { id: 4, icon: <Users size={20} />, value: '8', label: 'Khách hàng mới', change: '+20%', increasing: true }
  ];
  
  const orderStatus = [
    { id: 1, label: 'Đã hoàn thành', value: 8, color: 'bg-emerald-500' },
    { id: 2, label: 'Đang chuẩn bị', value: 8, color: 'bg-amber-500' },
    { id: 3, label: 'Đang giao', value: 8, color: 'bg-blue-500' },
    { id: 4, label: 'Đã hủy', value: 8, color: 'bg-red-500' }
  ];
  
  const topBrands = [
    { id: 1, brand: 'Louis Vuitton', quantity: 183, growth: '+12%' },
    { id: 2, brand: 'Versace', quantity: 159, growth: '+8%' },
    { id: 3, brand: 'Gucci', quantity: 123, growth: '+5%' },
    { id: 4, brand: 'Chanel', quantity: 92, growth: '-2%' },
    { id: 5, brand: 'Royal', quantity: 76, growth: '+9%' },
  ];

  const topProducts = [
    { id: "01", name: 'Home Decor Range', quantity: 163, price: '950.000', profit: '320.000' },
    { id: "02", name: 'Disney Princess Pink Bag 16', quantity: 121, price: '1.250.000', profit: '450.000' },
    { id: "03", name: 'Bathroom Essentials', quantity: 98, price: '850.000', profit: '220.000' },
    { id: "04", name: 'Apple Smartwatches', quantity: 76, price: '2.150.000', profit: '650.000' },
  ];

  const lowInventory = [
    { id: 1, name: 'Chai 100ml', quantity: 1, threshold: 10 },
    { id: 2, name: 'Chai Spray 50ml', quantity: 2, threshold: 15 },
    { id: 3, name: 'Chai 200ml', quantity: 3, threshold: 12 },
    { id: 4, name: 'Chai 500ml', quantity: 5, threshold: 8 },
  ];
  
  // Profit calculation data
  const profitData = {
    totalRevenue: '12.500.000',
    costOfGoods: '7.200.000',
    operatingExpenses: '1.800.000',
    profit: '3.500.000',
    profitMargin: '28%',
    lastMonthProfit: '3.100.000',
    growthRate: '+12.9%'
  };
  
  const navItems = [
    { icon: <Home size={20} />, label: 'Tổng quan', active: true },
    { icon: <BarChart2 size={20} />, label: 'Thống kê' },
    { icon: <Package size={20} />, label: 'Đơn hàng' },
    { icon: <Tag size={20} />, label: 'Sản phẩm' },
    { icon: <ShoppingBag size={20} />, label: 'Vật tư' },
    { icon: <TrendingUp size={20} />, label: 'Marketing' },
    { icon: <DollarSign size={20} />, label: 'Lợi nhuận' },
    { icon: <Users size={20} />, label: 'Nhân viên' },
    { icon: <Settings size={20} />, label: 'Cài đặt' }
  ];
  
  // Toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  // Date ranges
  const dateRanges = ['Hôm nay', 'Tuần này', 'Tháng này', 'Quý này', 'Năm nay'];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-md transition-all duration-300 fixed h-full z-10`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className={`font-bold text-blue-900 ${sidebarOpen ? 'block' : 'hidden'}`}>APH PERFUME</div>
          <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-100">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <a 
                  href="#" 
                  className={`flex items-center p-3 rounded-lg ${item.active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <div className={`${item.active ? 'text-blue-600' : 'text-gray-500'}`}>{item.icon}</div>
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className={`absolute bottom-0 w-full p-4 border-t ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="flex items-center space-x-3">
            <img src="/api/placeholder/40/40" alt="Avatar" className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-medium">Quốc Huy</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
            <button className="ml-auto text-gray-500 hover:text-gray-700">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">Bảng điều khiển</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-3">
              <img src="/api/placeholder/40/40" alt="Avatar" className="w-8 h-8 rounded-full" />
              <div className="hidden md:block">
                <div className="font-medium">Quốc Huy</div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Tổng quan</h2>
              <div className="text-sm text-gray-500 mt-1">08/04/2025</div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                >
                  {dateRanges.map((range) => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
                <Calendar size={16} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
              </div>
              
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
                <Download size={16} />
                <span>Xuất báo cáo</span>
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <div className="text-blue-600">{stat.icon}</div>
                  </div>
                  <div className={`text-sm font-medium flex items-center ${stat.increasing ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.increasing ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Chart */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profit Calculator Card - NEW */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Phân tích lợi nhuận</h3>
                  <div className="text-sm text-blue-600 font-medium flex items-center cursor-pointer hover:underline">
                    <span>Xem chi tiết</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0">
                  <div className="flex-1">
                    <div className="rounded-lg bg-green-50 p-4 mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm text-gray-500">Lợi nhuận</div>
                          <div className="text-2xl font-bold text-gray-800 mt-1">{profitData.profit} đ</div>
                        </div>
                        <div className="flex items-center text-green-600 text-sm font-medium">
                          <ArrowUp size={14} />
                          <span className="ml-1">{profitData.growthRate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">Doanh thu</div>
                        <div className="text-lg font-semibold mt-1">{profitData.totalRevenue} đ</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">Chi phí sản phẩm</div>
                        <div className="text-lg font-semibold mt-1">{profitData.costOfGoods} đ</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 md:ml-6">
                    <div className="p-4 bg-blue-50 rounded-lg mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm text-gray-500">Biên lợi nhuận</div>
                          <div className="text-2xl font-bold text-gray-800 mt-1">{profitData.profitMargin}</div>
                        </div>
                        <div className="p-2 rounded-full bg-blue-100">
                          <Percent size={16} className="text-blue-600" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">Chi phí vận hành</div>
                        <div className="text-lg font-semibold mt-1">{profitData.operatingExpenses} đ</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm text-gray-500">Lợi nhuận tháng trước</div>
                            <div className="text-lg font-semibold mt-1">{profitData.lastMonthProfit} đ</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Tổng doanh thu</h3>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md font-medium">Theo ngày</button>
                    <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">Theo tuần</button>
                    <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">Theo tháng</button>
                  </div>
                </div>
                
                <div className="h-64 flex items-end justify-between py-2">
                  {/* This is a simplified chart representation */}
                  <div className="flex flex-col items-center group relative">
                    <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transform transition-opacity">520.000đ</div>
                    <div className="h-32 w-12 bg-blue-500 rounded-t-md mb-1 group-hover:bg-blue-600 transition-colors"></div>
                    <div className="h-24 w-12 bg-green-500 rounded-t-md mb-1 group-hover:bg-green-600 transition-colors"></div>
                    <div className="text-xs text-gray-600">T2</div>
                  </div>
                  <div className="flex flex-col items-center group relative">
                    <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transform transition-opacity">650.000đ</div>
                    <div className="h-36 w-12 bg-blue-500 rounded-t-md mb-1 group-hover:bg-blue-600 transition-colors"></div>
                    <div className="h-28 w-12 bg-green-500 rounded-t-md mb-1 group-hover:bg-green-600 transition-colors"></div>
                    <div className="text-xs text-gray-600">T3</div>
                  </div>
                  <div className="flex flex-col items-center group relative">
                    <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transform transition-opacity">780.000đ</div>
                    <div className="h-20 w-12 bg-blue-500 rounded-t-md mb-1 group-hover:bg-blue-600 transition-colors"></div>
                    <div className="h-52 w-12 bg-green-500 rounded-t-md mb-1 group-hover:bg-green-600 transition-colors"></div>
                    <div className="text-xs text-gray-600">T4</div>
                  </div>
                  <div className="flex flex-col items-center group relative">
                    <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transform transition-opacity">420.000đ</div>
                    <div className="h-40 w-12 bg-blue-500 rounded-t-md mb-1 group-hover:bg-blue-600 transition-colors"></div>
                    <div className="h-12 w-12 bg-green-500 rounded-t-md mb-1 group-hover:bg-green-600 transition-colors"></div>
                    <div className="text-xs text-gray-600">T5</div>
                  </div>
                  <div className="flex flex-col items-center group relative">
                    <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transform transition-opacity">680.000đ</div>
                    <div className="h-32 w-12 bg-blue-500 rounded-t-md mb-1 group-hover:bg-blue-600 transition-colors"></div>
                    <div className="h-32 w-12 bg-green-500 rounded-t-md mb-1 group-hover:bg-green-600 transition-colors"></div>
                    <div className="text-xs text-gray-600">T6</div>
                  </div>
                  <div className="flex flex-col items-center group relative">
                    <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transform transition-opacity">590.000đ</div>
                    <div className="h-36 w-12 bg-blue-500 rounded-t-md mb-1 group-hover:bg-blue-600 transition-colors"></div>
                    <div className="h-28 w-12 bg-green-500 rounded-t-md mb-1 group-hover:bg-green-600 transition-colors"></div>
                    <div className="text-xs text-gray-600">T7</div>
                  </div>
                  <div className="flex flex-col items-center group relative">
                    <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transform transition-opacity">730.000đ</div>
                    <div className="h-44 w-12 bg-blue-500 rounded-t-md mb-1 group-hover:bg-blue-600 transition-colors"></div>
                    <div className="h-24 w-12 bg-green-500 rounded-t-md mb-1 group-hover:bg-green-600 transition-colors"></div>
                    <div className="text-xs text-gray-600">CN</div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6 space-x-8">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm">Tiền mặt</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Chuyển khoản</span>
                  </div>
                </div>
              </div>
              
              {/* Top Products Table */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Sản phẩm bán chạy nhất</h3>
                  <div className="text-sm text-blue-600 font-medium flex items-center cursor-pointer hover:underline">
                    <span>Xem tất cả</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-3 rounded-l-lg">#</th>
                        <th className="px-6 py-3">Tên sản phẩm</th>
                        <th className="px-6 py-3 text-center">Số lượng</th>
                        <th className="px-6 py-3 text-center">Giá bán</th>
                        <th className="px-6 py-3 text-center rounded-r-lg">Lợi nhuận</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {topProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">{product.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">{product.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">{product.price}đ</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-green-600 font-medium">{product.profit}đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Right Column - Stats */}
            <div className="space-y-6">
              {/* Order Status */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tình trạng đơn hàng</h3>
                <div className="space-y-3">
                  {orderStatus.map((status) => (
                    <div key={status.id} className="bg-gray-50 p-4 rounded-lg flex items-center">
                      <div className={`${status.color} w-3 h-3 rounded-full mr-3`}></div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">{status.label}</div>
                      </div>
                      <div className="text-xl font-bold">{status.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Top Brands */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Brand bán chạy nhất</h3>
                  <div className="text-sm text-blue-600 font-medium flex items-center cursor-pointer hover:underline">
                    <span>Xem tất cả</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  {topBrands.map((brand) => (
                    <div key={brand.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center">
                        <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                          {brand.id}
                        </div>
                        <div>
                          <div className="font-medium">{brand.brand}</div>
                          <div className="text-xs text-gray-500">Brand ID: #{brand.id}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-semibold">{brand.quantity}</div>
                          <div className={`text-xs ${brand.growth.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {brand.growth}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Low Inventory */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Vật tư sắp hết</h3>
                  <div className="text-sm text-blue-600 font-medium flex items-center cursor-pointer hover:underline">
                    <span>Đặt hàng</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
                
                <div className="space-y-3">
                  {lowInventory.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg flex items-center justify-between bg-gray-50 hover:bg-red-50 transition-colors">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500">Ngưỡng tối thiểu: {item.threshold}</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${item.quantity <= 2 ? 'text-red-600' : 'text-amber-600'}`}>
                          {item.quantity}
                        </div>
                        <div className="text-xs text-gray-500">Còn lại</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;