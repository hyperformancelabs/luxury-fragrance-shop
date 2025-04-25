import React from 'react';
import { TrendingUp, ShoppingCart, Users, Clock, Calendar, Package, AlertCircle, ChevronRight, ChevronDown, Truck, User, DollarSign, Activity } from 'lucide-react';

const Dashboard = () => {
  // Sample data for charts and widgets
  const salesData = [
    { month: 'T1', amount: 4500000 },
    { month: 'T2', amount: 5200000 },
    { month: 'T3', amount: 4800000 },
    { month: 'T4', amount: 6100000 },
    { month: 'T5', amount: 7200000 },
    { month: 'T6', amount: 6700000 }
  ];
  
  // Top selling products
  const topProducts = [
    { id: 1, name: 'Chanel No.5', sold: 28, revenue: 7000000, stock: 12 },
    { id: 2, name: 'Dior Sauvage', sold: 24, revenue: 6000000, stock: 8 },
    { id: 3, name: 'YSL Black Opium', sold: 19, revenue: 4750000, stock: 15 }
  ];
  
  // Recent orders
  const recentOrders = [
    { id: '#APH1234', customer: 'Nguyễn Văn A', date: '12/04/2025', status: 'Đã giao', amount: 1250000 },
    { id: '#APH1235', customer: 'Trần Thị B', date: '11/04/2025', status: 'Đang giao', amount: 2350000 },
    { id: '#APH1236', customer: 'Lê Văn C', date: '11/04/2025', status: 'Chờ xử lý', amount: 950000 }
  ];
  
  // Low stock alerts
  const lowStockItems = [
    { id: 1, name: 'Dior Sauvage 100ml', stock: 3, threshold: 5 },
    { id: 2, name: 'Tom Ford Tobacco Vanille 50ml', stock: 2, threshold: 5 },
    { id: 3, name: 'Chanel Bleu EDP 100ml', stock: 4, threshold: 5 }
  ];
  
  // Upcoming marketing campaigns
  const marketingCampaigns = [
    { id: 1, name: 'Khuyến mãi mùa hè', startDate: '01/05/2025', endDate: '15/05/2025', status: 'Sắp diễn ra' },
    { id: 2, name: 'Giảm giá cuối tuần', startDate: '16/04/2025', endDate: '18/04/2025', status: 'Sắp diễn ra' }
  ];
  
  // Staff performance
  const staffPerformance = [
    { id: 1, name: 'Nguyễn Thị D', salesAmount: 15400000, target: 15000000, performance: 102.7 },
    { id: 2, name: 'Trần Văn E', salesAmount: 12600000, target: 15000000, performance: 84 }
  ];
  
  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tổng quan</h2>
        <div className="flex items-center">
          <select className="mr-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>Hôm nay</option>
            <option>Tuần này</option>
            <option>Tháng này</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
            Xuất báo cáo
          </button>
        </div>
      </div>
      
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Doanh thu hôm nay</p>
              <h3 className="text-2xl font-bold text-gray-800">₫2,543,000</h3>
              <div className="flex items-center text-green-500 text-sm mt-2">
                <TrendingUp size={16} className="mr-1" /> +15% so với hôm qua
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <DollarSign size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Đơn hàng mới</p>
              <h3 className="text-2xl font-bold text-gray-800">16</h3>
              <div className="flex items-center text-green-500 text-sm mt-2">
                <TrendingUp size={16} className="mr-1" /> +5% so với hôm qua
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <ShoppingCart size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Khách hàng mới</p>
              <h3 className="text-2xl font-bold text-gray-800">12</h3>
              <div className="flex items-center text-green-500 text-sm mt-2">
                <TrendingUp size={16} className="mr-1" /> +8% so với hôm qua
              </div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Users size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Trung bình đơn hàng</p>
              <h3 className="text-2xl font-bold text-gray-800">₫950,000</h3>
              <div className="flex items-center text-red-500 text-sm mt-2">
                <TrendingUp size={16} className="mr-1" /> -3% so với hôm qua
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Activity size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Sales Chart and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-800">Doanh thu theo tháng</h3>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">2025</span>
              <ChevronDown size={16} />
            </div>
          </div>
          <div className="h-64">
            {/* Chart placeholder */}
            <div className="w-full h-full bg-gray-50 flex items-center justify-center rounded-lg relative">
              <div className="absolute inset-0">
                <div className="flex h-full">
                  {salesData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col justify-end px-2">
                      <div 
                        className="bg-blue-500 hover:bg-blue-600 transition-all rounded-t-sm"
                        style={{ height: `${(data.amount / 7200000) * 100}%` }}
                      ></div>
                      <div className="text-xs text-center mt-2 text-gray-600">{data.month}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* This text appears if no chart library is available */}
              <div className="text-gray-400 text-sm z-10 bg-white px-3 py-1 rounded">
                Biểu đồ doanh thu theo tháng
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-gray-800">Sản phẩm bán chạy</h3>
              <button className="text-blue-600 text-sm flex items-center">
                Xem tất cả <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="p-3">
            {topProducts.map((product, index) => (
              <div key={index} className="p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <Package size={20} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{product.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-500">{product.sold} đã bán</span>
                      <span className="text-sm font-medium text-blue-600">₫{(product.revenue / 1000000).toFixed(1)}tr</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Orders and Marketing Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-gray-800">Đơn hàng gần đây</h3>
              <button className="text-blue-600 text-sm flex items-center">
                Xem tất cả <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'Đã giao' ? 'bg-green-100 text-green-800' : 
                        order.status === 'Đang giao' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">₫{order.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-800">Chiến dịch Marketing</h3>
                <button className="text-blue-600 text-sm flex items-center">
                  Xem tất cả <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="p-3">
              {marketingCampaigns.map((campaign, index) => (
                <div key={index} className="p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                      <Calendar size={20} className="text-pink-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{campaign.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-500">{campaign.startDate} - {campaign.endDate}</span>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{campaign.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-800">Cảnh báo tồn kho thấp</h3>
                <button className="text-blue-600 text-sm flex items-center">
                  Xem tất cả <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="p-3">
              {lowStockItems.map((item, index) => (
                <div key={index} className="p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <AlertCircle size={20} className="text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-500">Ngưỡng: {item.threshold}</span>
                        <span className="text-sm font-medium text-red-600">Còn lại: {item.stock}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Staff Performance */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-gray-800">Hiệu suất nhân viên</h3>
              <button className="text-blue-600 text-sm flex items-center">
                Xem tất cả <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="p-3">
            {staffPerformance.map((staff, index) => (
              <div key={index} className="p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <User size={20} className="text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-800">{staff.name}</h4>
                      <span className={`text-sm ${staff.performance >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                        {staff.performance}% mục tiêu
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${staff.performance >= 100 ? 'bg-green-600' : 'bg-orange-500'}`}
                          style={{ width: `${Math.min(staff.performance, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-500">₫{(staff.salesAmount / 1000000).toFixed(1)}tr</span>
                      <span className="text-sm text-gray-500">Mục tiêu: ₫{(staff.target / 1000000).toFixed(1)}tr</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <Truck size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Đơn hàng đang giao</p>
            <p className="font-bold text-lg">8</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 mr-4">
            <Clock size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Chờ xử lý</p>
            <p className="font-bold text-lg">5</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <Package size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Tổng sản phẩm</p>
            <p className="font-bold text-lg">124</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 mr-4">
            <Users size={20} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Khách hàng thành viên</p>
            <p className="font-bold text-lg">328</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;