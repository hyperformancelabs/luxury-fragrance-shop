import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, isSameDay } from 'date-fns';
import { AlertCircle, TrendingUp, TrendingDown, ShoppingCart, Users, Clock, Calendar, Package, ChevronRight, ChevronDown, Truck, User, DollarSign, Activity, Award, Star } from 'lucide-react';
import { revenueService } from '../services/revenueService';
import { dashboardService } from '../services/dashboardService';
import { PageHeader } from '../Components/common';

// Quick select presets
const presets = [
  { label: 'Toàn bộ', range: [new Date('2004-07-08'), new Date()] },
  { label: 'Hôm nay', range: [new Date(), new Date()] },
  { label: 'Tuần này', range: [startOfWeek(new Date(), { weekStartsOn: 1 }), endOfWeek(new Date(), { weekStartsOn: 1 })] },
  { label: 'Tháng này', range: [startOfMonth(new Date()), endOfMonth(new Date())] },
  { label: 'Quý này', range: [startOfQuarter(new Date()), endOfQuarter(new Date())] },
  { label: 'Năm nay', range: [startOfYear(new Date()), endOfYear(new Date())] }
];

function DateRangeFilter({ onChange }) {
  // Set default date range to "All time" (July 8, 2004 to today)
  const defaultRange = { from: new Date('2004-07-08'), to: new Date() };
  const [range, setRange] = useState(defaultRange);
  const [tempRange, setTempRange] = useState(range);
  const [menuOpen, setMenuOpen] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const containerRef = useRef(null);
  
  // Determine if current range matches a preset
  const activePreset = presets.find(p =>
    isSameDay(p.range[0], range.from) && isSameDay(p.range[1], range.to)
  );

  const handlePreset = (preset) => {
    const [from, to] = preset.range;
    setRange({ from, to });
    setTempRange({ from, to });
    onChange({ from, to });
    setMenuOpen(false);
    setCustomizing(false);
  };

  // Trigger onChange with default range on mount
  useEffect(() => {
    onChange(defaultRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close menu on outside click, discard temp if customizing
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (customizing) {
          setTempRange(range);
          setCustomizing(false);
        }
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen, customizing, range]);

  // Format the display date
  const getDisplayText = () => {
    if (activePreset) return activePreset.label;
    return `${format(range.from, 'dd/MM/yyyy')} - ${format(range.to, 'dd/MM/yyyy')}`;
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        onClick={() => { setMenuOpen(!menuOpen); setCustomizing(false); setTempRange(range); }}
      >
        <span>{getDisplayText()}</span>
        <ChevronDown size={16} className="ml-2 text-gray-500" />
      </button>
      
      {/* Dropdown Panel */}
      {menuOpen && (
        <div className={`absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md z-50 ${customizing ? 'w-[340px]' : 'w-64'}`}>
          {!customizing ? (
            <ul className="divide-y divide-gray-100">
              {presets.map((p) => (
                <li key={p.label}>
                  <button
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${p.label === activePreset?.label ? 'bg-blue-50 text-blue-600' : ''}`}
                    onClick={() => handlePreset(p)}
                  >{p.label}</button>
                </li>
              ))}
              <li>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${!activePreset ? 'bg-blue-50 text-blue-600' : ''}`}
                  onClick={() => setCustomizing(true)}
                >Tùy chỉnh</button>
              </li>
            </ul>
          ) : (
            <div className="p-4">
              <DayPicker
                mode="range"
                selected={tempRange}
                onSelect={(r) => { if (r?.from && r?.to) setTempRange(r); }}
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setCustomizing(false)}
                >Hủy</button>
                <button
                  className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => { setRange(tempRange); onChange(tempRange); setMenuOpen(false); setCustomizing(false); }}
                >Xác nhận</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Thêm hàm nhóm dữ liệu theo năm
const groupDataByYear = (chartData) => {
  if (!chartData || chartData.length === 0) return [];

  // Nhóm dữ liệu theo năm
  const groupedByYear = {};
  
  chartData.forEach(item => {
    // Lấy năm từ ngày (định dạng dd/MM/yyyy)
    const year = item.date.split('/')[2];
    
    if (!groupedByYear[year]) {
      groupedByYear[year] = [];
    }
    
    groupedByYear[year].push(item);
  });
  
  // Sắp xếp các năm
  return Object.keys(groupedByYear)
    .sort()
    .map(year => ({
      year,
      data: groupedByYear[year]
    }));
};

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Date range state - default to "All time" (July 8, 2004 to today)
  const [dateRange, setDateRange] = useState({
    from: new Date('2004-07-08'),
    to: new Date()
  });
  const [revenueData, setRevenueData] = useState(null);
  const [newOrdersData, setNewOrdersData] = useState(null);
  const [newCustomersData, setNewCustomersData] = useState(null);
  const [avgOrderValueData, setAvgOrderValueData] = useState(null);
  const [apiRecentOrders, setApiRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topEmployees, setTopEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingAvgOrderValue, setLoadingAvgOrderValue] = useState(false);
  const [loadingRecentOrders, setLoadingRecentOrders] = useState(false);
  const [loadingLowStock, setLoadingLowStock] = useState(false);
  const [loadingTopEmployees, setLoadingTopEmployees] = useState(false);
  const [error, setError] = useState(null);
  const [ordersError, setOrdersError] = useState(null);
  const [customersError, setCustomersError] = useState(null);
  const [avgOrderValueError, setAvgOrderValueError] = useState(null);
  const [recentOrdersError, setRecentOrdersError] = useState(null);
  const [lowStockError, setLowStockError] = useState(null);
  const [topEmployeesError, setTopEmployeesError] = useState(null);

  // Fetch revenue data when date range changes
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching revenue data for range:', dateRange);
        const data = await revenueService.getRevenueByDateRange(dateRange.from, dateRange.to);
        console.log('Revenue data received:', data);
        
        // Kiểm tra dữ liệu trả về - không coi doanh thu 0 là lỗi
        if (data === null || data === undefined) {
          throw new Error('Dữ liệu trả về không hợp lệ');
        }
        
        setRevenueData(data);
      } catch (err) {
        console.error('Error fetching revenue data:', err);
        setError(err.message || 'Không thể lấy dữ liệu doanh thu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [dateRange]);
  
  // Fetch new orders count data when date range changes
  useEffect(() => {
    const fetchNewOrdersData = async () => {
      try {
        setLoadingOrders(true);
        setOrdersError(null);
        console.log('Fetching new orders data for range:', dateRange);
        const data = await dashboardService.getNewOrdersCountByDateRange(dateRange.from, dateRange.to);
        console.log('New orders data received:', data);
        
        // Kiểm tra dữ liệu trả về
        if (data === null || data === undefined) {
          throw new Error('Dữ liệu đơn hàng trả về không hợp lệ');
        }
        
        setNewOrdersData(data);
      } catch (err) {
        console.error('Error fetching new orders data:', err);
        setOrdersError(err.message || 'Không thể lấy dữ liệu đơn hàng mới. Vui lòng thử lại sau.');
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchNewOrdersData();
  }, [dateRange]);
  
  // Fetch new customers count data when date range changes
  useEffect(() => {
    const fetchNewCustomersData = async () => {
      try {
        setLoadingCustomers(true);
        setCustomersError(null);
        console.log('Fetching new customers data for range:', dateRange);
        const data = await dashboardService.getNewCustomersCountByDateRange(dateRange.from, dateRange.to);
        console.log('New customers data received:', data);
        
        // Kiểm tra dữ liệu trả về
        if (data === null || data === undefined) {
          throw new Error('Dữ liệu khách hàng trả về không hợp lệ');
        }
        
        setNewCustomersData(data);
      } catch (err) {
        console.error('Error fetching new customers data:', err);
        setCustomersError(err.message || 'Không thể lấy dữ liệu khách hàng mới. Vui lòng thử lại sau.');
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchNewCustomersData();
  }, [dateRange]);
  
  // Fetch average order value data when date range changes
  useEffect(() => {
    const fetchAverageOrderValueData = async () => {
      try {
        setLoadingAvgOrderValue(true);
        setAvgOrderValueError(null);
        console.log('Fetching average order value data for range:', dateRange);
        const data = await dashboardService.getAverageOrderValueByDateRange(dateRange.from, dateRange.to);
        console.log('Average order value data received:', data);
        
        // Kiểm tra dữ liệu trả về
        if (data === null || data === undefined) {
          throw new Error('Dữ liệu giá trị trung bình đơn hàng trả về không hợp lệ');
        }
        
        setAvgOrderValueData(data);
      } catch (err) {
        console.error('Error fetching average order value data:', err);
        setAvgOrderValueError(err.message || 'Không thể lấy dữ liệu giá trị trung bình đơn hàng. Vui lòng thử lại sau.');
      } finally {
        setLoadingAvgOrderValue(false);
      }
    };

    fetchAverageOrderValueData();
  }, [dateRange]);
  
  // Fetch recent orders data when date range changes
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoadingRecentOrders(true);
        setRecentOrdersError(null);
        console.log('Fetching recent orders for range:', dateRange);
        const data = await dashboardService.getRecentOrdersByDateRange(dateRange.from, dateRange.to, 5);
        console.log('Recent orders data received:', data);
        
        // Kiểm tra dữ liệu trả về
        if (data === null || data === undefined) {
          throw new Error('Dữ liệu đơn hàng gần đây trả về không hợp lệ');
        }
        
        setApiRecentOrders(data);
      } catch (err) {
        console.error('Error fetching recent orders data:', err);
        setRecentOrdersError(err.message || 'Không thể lấy dữ liệu đơn hàng gần đây. Vui lòng thử lại sau.');
      } finally {
        setLoadingRecentOrders(false);
      }
    };

    fetchRecentOrders();
  }, [dateRange]);
  
  // Fetch low stock products
  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        setLoadingLowStock(true);
        setLowStockError(null);
        console.log('Fetching low stock products');
        const data = await dashboardService.getLowStockProducts(5); // Get top 5 low stock products
        console.log('Low stock products data received:', data);
        
        // Kiểm tra dữ liệu trả về
        if (data === null || data === undefined) {
          throw new Error('Dữ liệu sản phẩm tồn kho thấp trả về không hợp lệ');
        }
        
        setLowStockProducts(data);
      } catch (err) {
        console.error('Error fetching low stock products:', err);
        setLowStockError(err.message || 'Không thể lấy dữ liệu sản phẩm tồn kho thấp. Vui lòng thử lại sau.');
      } finally {
        setLoadingLowStock(false);
      }
    };

    fetchLowStockProducts();
  }, []);
  
  // Fetch top performing employees
  useEffect(() => {
    const fetchTopEmployees = async () => {
      try {
        setLoadingTopEmployees(true);
        setTopEmployeesError(null);
        console.log('Fetching top performing employees for range:', dateRange);
        const data = await dashboardService.getTopPerformingEmployees(dateRange.from, dateRange.to, 5);
        console.log('Top employees data received:', data);
        
        // Kiểm tra dữ liệu trả về
        if (data === null || data === undefined) {
          throw new Error('Dữ liệu nhân viên xuất sắc trả về không hợp lệ');
        }
        
        setTopEmployees(data);
      } catch (err) {
        console.error('Error fetching top employees:', err);
        setTopEmployeesError(err.message || 'Không thể lấy dữ liệu nhân viên xuất sắc. Vui lòng thử lại sau.');
      } finally {
        setLoadingTopEmployees(false);
      }
    };

    fetchTopEmployees();
  }, [dateRange]);

  // Format currency function
  const formatCurrency = (amount) => {
    if (!amount) return '₫0';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get date range display text
  const getDateRangeText = () => {
    const activePreset = presets.find(p =>
      isSameDay(p.range[0], dateRange.from) && isSameDay(p.range[1], dateRange.to)
    );
    
    if (activePreset) return activePreset.label.toLowerCase();
    return `từ ${format(dateRange.from, 'dd/MM/yyyy')} đến ${format(dateRange.to, 'dd/MM/yyyy')}`;
  };

  // Sample data for charts and widgets
  const salesData = [
    { month: 'T1', amount: 4500000 },
    { month: 'T2', amount: 5200000 },
    { month: 'T3', amount: 4800000 },
    { month: 'T4', amount: 6100000 },
    { month: 'T5', amount: 7200000 },
    { month: 'T6', amount: 6700000 }
  ];
  
  // State for top selling products
  const [topProducts, setTopProducts] = useState([]);
  const [loadingTopProducts, setLoadingTopProducts] = useState(false);
  const [topProductsError, setTopProductsError] = useState(null);
  
  // Fetch top selling products when date range changes
  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        setLoadingTopProducts(true);
        setTopProductsError(null);
        console.log('Fetching top selling products for range:', dateRange);
        const data = await dashboardService.getTopSellingProductsByDateRange(dateRange.from, dateRange.to, 5);
        console.log('Top selling products data received:', data);
        
        // Kiểm tra dữ liệu trả về
        if (data === null || data === undefined || !Array.isArray(data)) {
          throw new Error('Dữ liệu sản phẩm bán chạy trả về không hợp lệ');
        }
        
        // Chuyển đổi dữ liệu API thành định dạng hiển thị
        const formattedProducts = data.map(product => ({
          id: product.productId,
          name: `${product.brandName} ${product.productName} ${product.volume}ml`,
          sold: product.totalQuantitySold,
          revenue: product.price * product.totalQuantitySold,
          stock: 0, // Thông tin này không có trong API, có thể bổ sung sau
          imageUrl: product.imageUrl
        }));
        
        setTopProducts(formattedProducts);
      } catch (err) {
        console.error('Error fetching top selling products:', err);
        setTopProductsError(err.message || 'Không thể lấy dữ liệu sản phẩm bán chạy. Vui lòng thử lại sau.');
      } finally {
        setLoadingTopProducts(false);
      }
    };

    fetchTopSellingProducts();
  }, [dateRange]);
  
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
  
  // Upcoming marketing campaigns fetched from API
  const [marketingCampaigns, setMarketingCampaigns] = useState([]);
  const [loadingMarketing, setLoadingMarketing] = useState(false);
  const [marketingError, setMarketingError] = useState(null);

  useEffect(() => {
    const fetchMarketingCampaigns = async () => {
      setLoadingMarketing(true);
      setMarketingError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'}/emp/promotions/upcoming?limit=5`, {
          headers: {
            'Content-Type': 'application/json',
            // TODO: Replace with actual auth token retrieval logic
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        });
        const json = await response.json();
        if (response.ok && json?.data) {
          const today = new Date();
          // Map raw data to objects with Date instances first
          const mapped = json.data.map(item => {
            const startArr = item.startDate;
            const endArr = item.endDate;
            const start = startArr ? new Date(startArr[0], startArr[1] - 1, startArr[2]) : null;
            const end = endArr ? new Date(endArr[0], endArr[1] - 1, endArr[2]) : null;

            let statusLabel = 'Đã kết thúc';
            if (start && start > today) {
              statusLabel = 'Sắp diễn ra';
            } else if (!end || end >= today) {
              statusLabel = 'Đang diễn ra';
            }

            // Format dates professionally
            const formatDate = (date) => {
              if (!date) return null;
              return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric'
              });
            };

            const formatDateRange = (startDate, endDate) => {
              const startStr = formatDate(startDate);
              if (!endDate) {
                return startStr ? `Từ ${startStr}` : 'Không xác định';
              }
              const endStr = formatDate(endDate);
              return `${startStr || 'N/A'} - ${endStr}`;
            };

            return {
              id: item.promotionId,
              name: item.promotionName,
              dateRange: formatDateRange(start, end),
              status: statusLabel,
              rawStart: start,
              currentUsage: item.currentUsage || 0,
              usageLimit: item.usageLimit,
              usagePercentage: item.usagePercentage,
              timeProgressPercentage: item.timeProgressPercentage
            };
          });

          // Sort by newest start date
          const campaigns = mapped.sort((a, b) => {
            if (!a.rawStart) return 1;
            if (!b.rawStart) return -1;
            return b.rawStart - a.rawStart;
          });

          setMarketingCampaigns(campaigns);
        } else {
          throw new Error(json?.message || 'Lỗi không xác định');
        }
      } catch (err) {
        console.error(err);
        setMarketingError(err.message);
      } finally {
        setLoadingMarketing(false);
      }
    };

    fetchMarketingCampaigns();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6">
        <PageHeader 
          title="Tổng quan" 
          subtitle={`Thời gian: ${getDateRangeText()}`}
        >
          <div className="flex items-center gap-3">
            <DateRangeFilter onChange={setDateRange} />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
              Xuất báo cáo
            </button>
          </div>
        </PageHeader>
        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 mt-6">
          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={() => navigate('/statistics')}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-1">Doanh thu</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {loading ? (
                    <span className="text-gray-500">Đang tải...</span>
                  ) : error ? (
                    <div>
                      <span className="text-red-500 text-sm">Lỗi khi tải dữ liệu</span>
                      <span className="block text-xs text-gray-500 mt-1">{error}</span>
                    </div>
                  ) : (
                    formatCurrency(revenueData?.totalAmount || 0)
                  )}
                </h3>
                {!loading && !error && revenueData?.previousPeriodChange !== undefined && (
                  <div className={`flex items-center text-sm mt-2 ${revenueData.previousPeriodChange > 0 ? 'text-green-500' : revenueData.previousPeriodChange < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                    {revenueData.previousPeriodChange > 0 ? (
                      <TrendingUp size={16} className="mr-1" />
                    ) : revenueData.previousPeriodChange < 0 ? (
                      <TrendingDown size={16} className="mr-1" />
                    ) : (
                      <Activity size={16} className="mr-1" />
                    )}
                    {revenueData.previousPeriodChange === 0 ? (
                      'Bằng kỳ trước'
                    ) : (
                      `${revenueData.previousPeriodChange > 0 ? 'Tăng' : 'Giảm'} ${Math.abs(revenueData.previousPeriodChange)}% so với kỳ trước`
                    )}
                  </div>
                )}
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <DollarSign size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={() => navigate('/orders')}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-1">Đơn hàng mới</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {loadingOrders ? (
                    <span className="text-gray-500">Đang tải...</span>
                  ) : ordersError ? (
                    <div>
                      <span className="text-red-500 text-sm">Lỗi khi tải dữ liệu</span>
                      <span className="block text-xs text-gray-500 mt-1">{ordersError}</span>
                    </div>
                  ) : (
                    newOrdersData?.newOrdersCount || 0
                  )}
                </h3>
                {!loadingOrders && !ordersError && newOrdersData?.previousPeriodChange !== undefined && (
                  <div className={`flex items-center text-sm mt-2 ${newOrdersData.previousPeriodChange > 0 ? 'text-green-500' : newOrdersData.previousPeriodChange < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                    {newOrdersData.previousPeriodChange > 0 ? (
                      <TrendingUp size={16} className="mr-1" />
                    ) : newOrdersData.previousPeriodChange < 0 ? (
                      <TrendingDown size={16} className="mr-1" />
                    ) : (
                      <Activity size={16} className="mr-1" />
                    )}
                    {newOrdersData.previousPeriodChange === 0 ? (
                      'Bằng kỳ trước'
                    ) : (
                      `${newOrdersData.previousPeriodChange > 0 ? 'Tăng' : 'Giảm'} ${Math.abs(newOrdersData.previousPeriodChange)}% so với kỳ trước`
                    )}
                  </div>
                )}
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <ShoppingCart size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
          
          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={() => navigate('/customers')}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-1">Khách hàng mới</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {loadingCustomers ? (
                    <span className="text-gray-500">Đang tải...</span>
                  ) : customersError ? (
                    <div>
                      <span className="text-red-500 text-sm">Lỗi khi tải dữ liệu</span>
                      <span className="block text-xs text-gray-500 mt-1">{customersError}</span>
                    </div>
                  ) : (
                    newCustomersData?.newCustomersCount || 0
                  )}
                </h3>
                {!loadingCustomers && !customersError && newCustomersData?.previousPeriodChange !== undefined && (
                  <div className={`flex items-center text-sm mt-2 ${newCustomersData.previousPeriodChange > 0 ? 'text-green-500' : newCustomersData.previousPeriodChange < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                    {newCustomersData.previousPeriodChange > 0 ? (
                      <TrendingUp size={16} className="mr-1" />
                    ) : newCustomersData.previousPeriodChange < 0 ? (
                      <TrendingDown size={16} className="mr-1" />
                    ) : (
                      <Activity size={16} className="mr-1" />
                    )}
                    {newCustomersData.previousPeriodChange === 0 ? (
                      'Bằng kỳ trước'
                    ) : (
                      `${newCustomersData.previousPeriodChange > 0 ? 'Tăng' : 'Giảm'} ${Math.abs(newCustomersData.previousPeriodChange)}% so với kỳ trước`
                    )}
                  </div>
                )}
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Users size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={() => navigate('/orders')}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-1">Giá trị trung bình đơn hàng</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {loadingAvgOrderValue ? (
                    <span className="text-gray-500">Đang tải...</span>
                  ) : avgOrderValueError ? (
                    <div>
                      <span className="text-red-500 text-sm">Lỗi khi tải dữ liệu</span>
                      <span className="block text-xs text-gray-500 mt-1">{avgOrderValueError}</span>
                    </div>
                  ) : (
                    formatCurrency(avgOrderValueData?.averageOrderValue || 0)
                  )}
                </h3>
                {/* Không hiển thị thông tin thêm cho giá trị trung bình đơn hàng */}
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Sales Chart and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-gray-800">Doanh thu</h3>
              <div className="flex items-center gap-3">
                {!loading && !error && revenueData?.maxRevenueDay && (
                  <div className="text-sm text-gray-500">
                    Ngày cao nhất: {revenueData.maxRevenueDay.date} ({formatCurrency(revenueData.maxRevenueDay.amount)})
                  </div>
                )}
                <button 
                  className="text-blue-600 text-sm flex items-center hover:text-blue-800"
                  onClick={() => navigate('/statistics')}
                >
                  Xem chi tiết <ChevronRight size={16} />
                </button>
              </div>
            </div>
            
            {/* Phần hiển thị biểu đồ - tăng chiều cao để biểu đồ đẹp hơn */}
            <div className="h-80">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">Đang tải dữ liệu biểu đồ...</span>
                </div>
              ) : error ? (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-red-500">Không thể tải dữ liệu biểu đồ</span>
                </div>
              ) : revenueData?.chartData && revenueData.chartData.length > 0 ? (
                <div className="w-full h-full bg-gray-50 flex flex-col overflow-hidden rounded-lg">
                  {/* Container chính với thanh cuộn ngang */}
                  <div className="w-full flex-1 overflow-x-auto">
                    <div className="h-full flex items-end p-4 pb-1 relative">
                      {/* Nhóm dữ liệu theo năm và hiển thị */}
                      {groupDataByYear(revenueData.chartData).map((yearGroup, groupIndex) => {
                        // Tính toán chiều rộng dựa trên số lượng dữ liệu
                        const widthPerItem = Math.max(30, Math.min(80, 1000 / revenueData.chartData.length));
                        
                        return (
                          <div 
                            key={yearGroup.year} 
                            className="flex flex-col h-full min-w-fit relative"
                            style={{ borderLeft: groupIndex > 0 ? '1px dashed #e5e7eb' : 'none' }}
                          >
                            {/* Nhãn năm */}
                            <div className="sticky left-0 self-start px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded mb-2 shadow-sm z-10">
                              {yearGroup.year}
                            </div>
                            
                            {/* Dữ liệu năm */}
                            <div className="flex flex-1 items-end">
                              {yearGroup.data.map((item, index) => {
                                // Tính chiều cao tương đối với giá trị cao nhất
                                const height = Math.max(
                                  10, 
                                  (Number(item.amount) / (revenueData.maxRevenueDay?.amount || 1)) * 200
                                );
                                
                                return (
                                  <div 
                                    key={index} 
                                    className="relative group mx-1 flex flex-col items-center"
                                    style={{ width: `${widthPerItem}px` }}
                                  >
                                    <div 
                                      className="bg-blue-500 group-hover:bg-blue-600 hover:shadow-lg transition-all duration-200 w-full max-w-8 rounded-t-sm"
                                      style={{ height: `${height}px` }}
                                    >
                                      {/* Hiển thị giá trị khi cột đủ cao */}
                                      {height > 40 && (
                                        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full text-xs text-blue-700 opacity-0 group-hover:opacity-100">
                                          {formatCurrency(item.amount).replace('₫', '')}
                                        </span>
                                      )}
                                    </div>
                                    
                                    <span className="text-xs mt-1 text-gray-600 whitespace-nowrap truncate" style={{ maxWidth: `${widthPerItem}px` }}>
                                      {item.date.substring(0, 5)}
                                    </span>
                                    
                                    {/* Tooltip hiển thị khi hover */}
                                    <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap">
                                      <div className="font-medium">{item.date}</div>
                                      <div className="font-semibold">{formatCurrency(item.amount)}</div>
                                      <div>{item.orderCount} đơn hàng</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex justify-between items-center p-2 border-t border-gray-200 bg-white text-xs text-gray-500">
                    <div>
                      <span className="w-2 h-2 inline-block bg-blue-500 rounded-full mr-1"></span>
                      Doanh thu theo ngày
                    </div>
                    <div>
                      {revenueData.chartData.length} ngày • Tổng: {formatCurrency(revenueData.totalAmount)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg">
                  <span className="text-gray-500 mb-2">Không có dữ liệu doanh thu trong khoảng thời gian này</span>
                  <span className="text-sm text-gray-400">Vui lòng chọn khoảng thời gian khác hoặc kiểm tra lại dữ liệu</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-800">Sản phẩm bán chạy</h3>
                <button 
                  className="text-blue-600 text-sm flex items-center hover:text-blue-800"
                  onClick={() => navigate('/products')}
                >
                  Xem chi tiết <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="p-3 max-h-80 overflow-y-auto">
              {loadingTopProducts ? (
                <div className="p-6 flex justify-center items-center">
                  <div className="text-gray-500 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                    <span>Đang tải dữ liệu...</span>
                  </div>
                </div>
              ) : topProductsError ? (
                <div className="p-6 text-center">
                  <div className="text-red-500 mb-2">
                    <AlertCircle size={24} className="mx-auto mb-2" />
                    <p>Không thể tải dữ liệu sản phẩm bán chạy</p>
                  </div>
                  <p className="text-sm text-gray-500">{topProductsError}</p>
                </div>
              ) : topProducts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Package size={24} className="mx-auto mb-2" />
                  <p>Không có dữ liệu sản phẩm bán chạy trong khoảng thời gian này</p>
                </div>
              ) : (
                topProducts.map((product, index) => (
                  <div key={index} className="p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-8 h-8 object-cover rounded" />
                        ) : (
                          <Package size={20} className="text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{product.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-500">{product.sold} đã bán</span>
                          <span className="text-sm font-medium text-blue-600">{formatCurrency(product.revenue)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Recent Orders and Marketing Campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-800">Đơn hàng gần đây</h3>
                <button 
                  className="text-blue-600 text-sm flex items-center hover:text-blue-800"
                  onClick={() => navigate('/orders')}
                >
                  Xem chi tiết <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[512px] overflow-y-auto">
              {loadingRecentOrders ? (
                <div className="p-6 flex justify-center items-center">
                  <div className="text-gray-500 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                    <span>Đang tải dữ liệu...</span>
                  </div>
                </div>
              ) : recentOrdersError ? (
                <div className="p-6 text-center">
                  <div className="text-red-500 mb-2">
                    <AlertCircle size={24} className="mx-auto mb-2" />
                    <p>Không thể tải dữ liệu đơn hàng gần đây</p>
                  </div>
                  <p className="text-sm text-gray-500">{recentOrdersError}</p>
                </div>
              ) : apiRecentOrders.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <ShoppingCart size={24} className="mx-auto mb-2" />
                  <p>Không có đơn hàng nào trong khoảng thời gian này</p>
                </div>
              ) : (
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
                    {apiRecentOrders.map((order, index) => {
                      // Format the order date
                      const orderDate = order.orderDate ? 
                        `${order.orderDate[2]}/${order.orderDate[1]}/${order.orderDate[0]}` : 
                        'N/A';
                      
                      // Map order status to Vietnamese
                      const statusMap = {
                        'pending': 'Chờ xử lý',
                        'processing': 'Đang xử lý',
                        'shipping': 'Đang giao',
                        'delivered': 'Đã giao',
                        'cancelled': 'Đã hủy'
                      };
                      
                      const statusClass = {
                        'pending': 'bg-blue-100 text-blue-800',
                        'processing': 'bg-purple-100 text-purple-800',
                        'shipping': 'bg-yellow-100 text-yellow-800',
                        'delivered': 'bg-green-100 text-green-800',
                        'cancelled': 'bg-red-100 text-red-800'
                      };
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">#{order.orderId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">ID: {order.customerId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{orderDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${statusClass[order.orderStatus] || 'bg-gray-100 text-gray-800'}`}>
                              {statusMap[order.orderStatus] || order.orderStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{formatCurrency(order.totalAmount)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-gray-800">Chiến dịch Marketing</h3>
                  <button 
                    className="text-blue-600 text-sm flex items-center hover:text-blue-800"
                    onClick={() => navigate('/marketings')}
                  >
                    Xem chi tiết <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div className="p-3 max-h-80 overflow-y-auto">
                {loadingMarketing ? (
                  <div className="p-6 flex justify-center items-center">
                    <div className="text-gray-500 flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-2"></div>
                      <span>Đang tải dữ liệu...</span>
                    </div>
                  </div>
                ) : marketingError ? (
                  <div className="p-6 text-center">
                    <div className="text-red-500 mb-2">
                      <AlertCircle size={24} className="mx-auto mb-2" />
                      <p>Không thể tải dữ liệu chiến dịch marketing</p>
                    </div>
                    <p className="text-sm text-gray-500">{marketingError}</p>
                  </div>
                ) : marketingCampaigns.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Calendar size={24} className="mx-auto mb-2" />
                    <p>Không có chiến dịch marketing sắp diễn ra</p>
                  </div>
                ) : (
                  marketingCampaigns.map((campaign, index) => (
                    <div key={index} className="py-1.5 px-2.5 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-7 h-7 bg-pink-100 rounded-lg flex items-center justify-center mr-2.5">
                          <Calendar size={14} className="text-pink-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-medium text-gray-800 truncate pr-2">{campaign.name}</h4>
                            <div>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                                campaign.status === 'Đang diễn ra' ? 'bg-green-100 text-green-700' :
                                campaign.status === 'Sắp diễn ra' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {campaign.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500 mb-0.5 line-clamp-1">{campaign.dateRange}</div>
                          
                          {/* Compact Usage Statistics */}
                          {campaign.usageLimit && campaign.usagePercentage !== null ? (
                            <div className="flex items-center justify-between">
                              <div className="flex-1 mr-2">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                      campaign.usagePercentage >= 90 ? 'bg-red-500' :
                                      campaign.usagePercentage >= 60 ? 'bg-yellow-500' :
                                      'bg-green-500'
                                    }`}
                                    style={{ width: `${Math.min(100, campaign.usagePercentage)}%` }}
                                  ></div>
                                </div>
                              </div>
                              <span className="text-xs text-gray-600 font-medium">
                                {campaign.currentUsage}/{campaign.usageLimit}
                              </span>
                            </div>
                          ) : campaign.timeProgressPercentage !== null && campaign.startDate && campaign.endDate ? (
                            <div className="flex items-center justify-between">
                              <div className="flex-1 mr-2">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-blue-400 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(100, campaign.timeProgressPercentage)}%` }}
                                  ></div>
                                </div>
                              </div>
                              <span className="text-xs text-gray-600 font-medium">
                                {(() => {
                                  // Calculate days between dates
                                  const startArr = campaign.startDate;
                                  const endArr = campaign.endDate;
                                  const start = startArr ? new Date(startArr[0], startArr[1] - 1, startArr[2]) : new Date();
                                  const end = endArr ? new Date(endArr[0], endArr[1] - 1, endArr[2]) : new Date();
                                  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                                  const daysPassed = Math.floor(totalDays * campaign.timeProgressPercentage / 100);
                                  return `${daysPassed}/${totalDays} ngày`;
                                })()}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex-1 mr-2">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                              </div>
                              <span className="text-xs text-gray-600 font-medium">{campaign.currentUsage || 0}/∞</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-gray-800">Cảnh báo tồn kho thấp</h3>
                  <button 
                    className="text-blue-600 text-sm flex items-center hover:text-blue-800"
                    onClick={() => navigate('/products')}
                  >
                    Xem chi tiết <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div className="p-3 max-h-80 overflow-y-auto">
                {loadingLowStock ? (
                  <div className="p-6 flex justify-center items-center">
                    <div className="text-gray-500 flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mb-2"></div>
                      <span>Đang tải dữ liệu...</span>
                    </div>
                  </div>
                ) : lowStockError ? (
                  <div className="p-6 text-center">
                    <div className="text-red-500 mb-2">
                      <AlertCircle size={24} className="mx-auto mb-2" />
                      <p>Không thể tải dữ liệu cảnh báo tồn kho</p>
                    </div>
                    <p className="text-sm text-gray-500">{lowStockError}</p>
                  </div>
                ) : lowStockProducts.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Package size={24} className="mx-auto mb-2" />
                    <p>Không có sản phẩm nào dưới ngưỡng tồn kho</p>
                  </div>
                ) : (
                  lowStockProducts.map((item, index) => (
                    <div key={index} className="p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                          <AlertCircle size={20} className="text-red-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.brandName} {item.productName} {item.volume}ml</h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-gray-500">Ngưỡng: {item.reorderLevel}</span>
                            <span className="text-sm font-medium text-red-600">Còn lại: {item.quantityInStock}</span>
                          </div>
                          {/* Progress bar showing stock level relative to threshold */}
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div 
                              className="bg-red-500 h-1.5 rounded-full" 
                              style={{ width: `${Math.min(100, (item.quantityInStock / item.reorderLevel) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Top Performing Employees */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-gray-800">Nhân viên xuất sắc</h3>
              <button 
                className="text-blue-600 text-sm flex items-center hover:text-blue-800"
                onClick={() => navigate('/staffs')}
              >
                Xem chi tiết <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="p-3 max-h-80 overflow-y-auto">
            {loadingTopEmployees ? (
              <div className="p-6 flex justify-center items-center">
                <div className="text-gray-500 flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                  <span>Đang tải dữ liệu...</span>
                </div>
              </div>
            ) : topEmployeesError ? (
              <div className="p-6 text-center">
                <div className="text-red-500 mb-2">
                  <AlertCircle size={24} className="mx-auto mb-2" />
                  <p>Không thể tải dữ liệu nhân viên xuất sắc</p>
                </div>
                <p className="text-sm text-gray-500">{topEmployeesError}</p>
              </div>
            ) : topEmployees.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Users size={24} className="mx-auto mb-2" />
                <p>Không có dữ liệu nhân viên xuất sắc trong khoảng thời gian này</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-3">
                {topEmployees.map((employee, index) => (
                  <div key={employee.employeeId} className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 mb-3">
                        {employee.profilePictureUrl ? (
                          <img 
                            src={employee.profilePictureUrl} 
                            alt={employee.fullName} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <User size={32} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      {index < 3 && (
                        <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : 'bg-amber-600'}`}>
                          <Award size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-800 text-center">{employee.fullName}</h4>
                    <p className="text-sm text-gray-500 mb-2">@{employee.username}</p>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, employee.performanceScore)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between w-full text-xs text-gray-500">
                      <span className="flex items-center">
                        <ShoppingCart size={12} className="mr-1" />
                        {employee.processedOrdersCount}
                      </span>
                      <span className="flex items-center">
                        <Package size={12} className="mr-1" />
                        {employee.inventoryOperationsCount}
                      </span>
                      <span className="flex items-center">
                        <Users size={12} className="mr-1" />
                        {employee.customerSupportCount}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center">
                      <Star size={14} className="text-yellow-400 mr-1" />
                      <span className="font-semibold">{employee.performanceScore.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;