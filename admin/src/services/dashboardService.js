import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1'; // URL đầy đủ với prefix api/v1

// Hàm helper để định dạng ngày thành dd/MM/yyyy
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Hàm tạo dữ liệu mẫu qua nhiều năm
const generateMockData = (startDate, endDate) => {
  // Tạo một series dữ liệu từ startDate đến endDate
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Tính số ngày giữa hai ngày
  const days = Math.round((end - start) / (24 * 60 * 60 * 1000)) + 1;
  
  // Nếu khoảng thời gian lớn hơn 60 ngày, hãy giảm mật độ dữ liệu
  // Hiển thị mẫu đầu tiên cho mỗi tuần hoặc mỗi tháng tùy thuộc vào khoảng thời gian
  let sampleInterval = 1; // mặc định: mỗi ngày
  
  if (days > 365) {
    sampleInterval = 14; // nếu > 1 năm: mỗi 2 tuần
  } else if (days > 90) {
    sampleInterval = 7; // nếu > 3 tháng: mỗi tuần
  } else if (days > 60) {
    sampleInterval = 3; // nếu > 2 tháng: mỗi 3 ngày
  }
  
  const chartData = [];
  let totalAmount = 0;
  let maxAmount = 0;
  let maxDay = null;
  
  // Tạo dữ liệu cho khoảng thời gian dài
  for (let i = 0; i < days; i += sampleInterval) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    
    // Tạo số tiền ngẫu nhiên
    let amount = 0;
    
    // Tạo doanh thu theo mẫu có ý nghĩa
    // Cuối tuần (thứ 6, thứ 7) có doanh thu cao hơn
    const dayOfWeek = currentDate.getDay(); // 0 = Chủ nhật, 6 = Thứ 7
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Thứ 6 hoặc thứ 7
    const monthFactor = 1 + (currentDate.getMonth() % 12) * 0.1; // Yếu tố tháng (càng gần cuối năm càng cao)
    
    if (isWeekend) {
      // Cuối tuần: 5-10 triệu
      amount = Math.floor(Math.random() * 5000000 + 5000000) * monthFactor;
    } else {
      // Ngày thường: 2-7 triệu
      amount = Math.floor(Math.random() * 5000000 + 2000000) * monthFactor;
    }
    
    // Ngày lễ hoặc sự kiện đặc biệt (giả định)
    const month = currentDate.getMonth() + 1; // 1-12
    const day = currentDate.getDate(); // 1-31
    
    // Ngày 1 tháng 1, Tết, Valentine, 8/3, 30/4, 1/5, Noel,... có doanh thu cao hơn
    const specialDays = [
      { month: 1, day: 1 },    // Tết dương
      { month: 2, day: 14 },   // Valentine
      { month: 3, day: 8 },    // Quốc tế phụ nữ
      { month: 4, day: 30 },   // Giải phóng
      { month: 5, day: 1 },    // Quốc tế lao động
      { month: 10, day: 20 },  // Phụ nữ Việt Nam
      { month: 12, day: 24 },  // Đêm Noel
      { month: 12, day: 25 },  // Noel
      { month: 12, day: 31 }   // Năm mới
    ];
    
    const isSpecialDay = specialDays.some(special => special.month === month && special.day === day);
    if (isSpecialDay) {
      amount *= 2; // x2 doanh thu vào ngày lễ
    }
    
    const orderCount = Math.floor(amount / 500000); // Trung bình 500k mỗi đơn
    const formattedDate = formatDate(currentDate);
    
    chartData.push({
      date: formattedDate,
      amount: Math.round(amount),
      orderCount: orderCount
    });
    
    totalAmount += amount;
    
    if (amount > maxAmount) {
      maxAmount = amount;
      maxDay = {
        date: formattedDate,
        amount: Math.round(amount),
        orderCount: orderCount
      };
    }
  }
  
  return {
    totalAmount: Math.round(totalAmount),
    chartData: chartData,
    maxRevenueDay: maxDay,
    averageDailyRevenue: Math.round(totalAmount / chartData.length)
  };
};

// Tạo dữ liệu mẫu cho thống kê
const generateStatsMockData = (startDate, endDate) => {
  // Tạo một số liệu ngẫu nhiên nhưng có ý nghĩa
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.round((end - start) / (24 * 60 * 60 * 1000)) + 1;
  
  // Tính toán số đơn hàng mới dựa trên khoảng thời gian
  const dailyOrdersAvg = Math.floor(Math.random() * 3) + 3; // 3-5 đơn hàng mỗi ngày
  const totalOrders = Math.round(days * dailyOrdersAvg * (0.9 + Math.random() * 0.2)); // Thêm một chút biến động
  
  // Tính toán số khách hàng mới (thường ít hơn đơn hàng)
  const newCustomersRatio = 0.3 + Math.random() * 0.2; // 30-50% đơn hàng từ khách mới
  const totalNewCustomers = Math.round(totalOrders * newCustomersRatio);
  
  // Tính giá trị trung bình đơn hàng
  const avgOrderValueBase = 800000 + Math.random() * 400000; // 800k-1.2M
  
  // Tính % thay đổi so với khoảng thời gian trước đó
  const orderChangePercent = -5 + Math.random() * 20; // -5% đến +15%
  const customerChangePercent = -3 + Math.random() * 18; // -3% đến +15%
  const avgOrderChangePercent = -8 + Math.random() * 10; // -8% đến +2%
  
  return {
    newOrders: {
      count: totalOrders,
      changePercent: orderChangePercent,
      changeDirection: orderChangePercent >= 0 ? 'up' : 'down'
    },
    newCustomers: {
      count: totalNewCustomers,
      changePercent: customerChangePercent,
      changeDirection: customerChangePercent >= 0 ? 'up' : 'down'
    },
    averageOrderValue: {
      amount: Math.round(avgOrderValueBase),
      changePercent: avgOrderChangePercent,
      changeDirection: avgOrderChangePercent >= 0 ? 'up' : 'down'
    }
  };
};

export const dashboardService = {
  // Lấy số lượng khách hàng mới theo khoảng thời gian và phần trăm thay đổi
  getNewCustomersCountByDateRange: async (startDate, endDate) => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      
      console.log(`Gọi API lấy số khách hàng mới với range: ${formattedStartDate} - ${formattedEndDate}`);
      
      // Thêm timeout để xem rõ trạng thái loading
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const response = await axios.get(
          `${API_BASE_URL}/customers/new-customers-count-by-date-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        );
        
        console.log('API response for new customers count:', response);
        
        if (response.data && (response.data.status === 'SUCCESS' || response.data.status === 'success')) {
          // Kiểm tra xem response.data.data có tồn tại và không null
          const data = response.data.data;
          
          if (!data) {
            console.warn('API returned null or undefined data');
            return {
              newCustomersCount: 0,
              previousPeriodChange: 0
            };
          }
          
          return {
            newCustomersCount: data.newCustomersCount || 0,
            previousPeriodChange: data.previousPeriodChange || 0
          };
        } else {
          console.error('API error:', response.data);
          throw new Error(response.data?.message || 'Có lỗi khi lấy số khách hàng mới');
        }
      } catch (apiError) {
        console.error('API request failed:', apiError);
        
        // Trả về dữ liệu mẫu nếu có lỗi kết nối
        if (apiError.code === 'ERR_NETWORK' || 
            apiError.message.includes('Network Error') ||
            (apiError.response && apiError.response.status >= 500)) {
          console.warn('Using mock data due to backend error');
          return {
            newCustomersCount: 45,
            previousPeriodChange: 12.5
          };
        }
        
        throw apiError;
      }
    } catch (error) {
      console.error('Error in getNewCustomersCountByDateRange:', error);
      throw error;
    }
  },
  
  // Lấy số lượng đơn hàng mới theo khoảng thời gian và phần trăm thay đổi
  getNewOrdersCountByDateRange: async (startDate, endDate) => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      
      console.log(`Gọi API lấy số đơn hàng mới với range: ${formattedStartDate} - ${formattedEndDate}`);
      
      // Thêm timeout để xem rõ trạng thái loading
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const response = await axios.get(
          `${API_BASE_URL}/orders/new-orders-count-by-date-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        );
        
        console.log('API response for new orders count:', response);
        
        if (response.data && (response.data.status === 'SUCCESS' || response.data.status === 'success')) {
          // Kiểm tra xem response.data.data có tồn tại và không null
          const data = response.data.data;
          
          if (!data) {
            console.warn('API returned null or undefined data');
            return {
              newOrdersCount: 0,
              previousPeriodChange: 0
            };
          }
          
          return {
            newOrdersCount: data.newOrdersCount || 0,
            previousPeriodChange: data.previousPeriodChange || 0
          };
        } else {
          console.error('API error:', response.data);
          throw new Error(response.data?.message || 'Có lỗi khi lấy số đơn hàng mới');
        }
      } catch (apiError) {
        console.error('API request failed:', apiError);
        
        // Trả về dữ liệu mẫu nếu có lỗi kết nối
        if (apiError.code === 'ERR_NETWORK' || 
            apiError.message.includes('Network Error') ||
            (apiError.response && apiError.response.status >= 500)) {
          console.warn('Using mock data due to backend error');
          return {
            newOrdersCount: 78,
            previousPeriodChange: 8.2
          };
        }
        
        throw apiError;
      }
    } catch (error) {
      console.error('Error in getNewOrdersCountByDateRange:', error);
      throw error;
    }
  },
  
  // Lấy giá trị trung bình đơn hàng theo khoảng thời gian
  getAverageOrderValueByDateRange: async (startDate, endDate) => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      
      console.log(`Gọi API lấy giá trị trung bình đơn hàng với range: ${formattedStartDate} - ${formattedEndDate}`);
      
      // Thêm timeout để xem rõ trạng thái loading
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const response = await axios.get(
          `${API_BASE_URL}/orders/average-order-value-by-date-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        );
        
        console.log('API response for average order value:', response);
        
        if (response.data && (response.data.status === 'SUCCESS' || response.data.status === 'success')) {
          // Kiểm tra xem response.data.data có tồn tại và không null
          const data = response.data.data;
          
          if (!data) {
            console.warn('API returned null or undefined data');
            return {
              averageOrderValue: 0
            };
          }
          
          return {
            averageOrderValue: data.averageOrderValue || 0
          };
        } else {
          console.error('API error:', response.data);
          throw new Error(response.data?.message || 'Có lỗi khi lấy giá trị trung bình đơn hàng');
        }
      } catch (apiError) {
        console.error('API request failed:', apiError);
        
        // Trả về dữ liệu mẫu nếu có lỗi kết nối
        if (apiError.code === 'ERR_NETWORK' || 
            apiError.message.includes('Network Error') ||
            (apiError.response && apiError.response.status >= 500)) {
          console.warn('Using mock data due to backend error');
          return {
            averageOrderValue: 950000
          };
        }
        
        throw apiError;
      }
    } catch (error) {
      console.error('Error in getAverageOrderValueByDateRange:', error);
      throw error;
    }
  },
  
  // Lấy doanh thu theo range thời gian và phần trăm thay đổi
  getRevenueByDateRange: async (startDate, endDate) => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      
      console.log(`Gọi API lấy doanh thu với range: ${formattedStartDate} - ${formattedEndDate}`);
      
      // Thêm timeout để xem rõ trạng thái loading
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const response = await axios.get(
          `${API_BASE_URL}/orders/revenue-by-date-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        );
        
        console.log('API response for revenue:', response);
        
        if (response.data && (response.data.status === 'SUCCESS' || response.data.status === 'success')) {
          // Kiểm tra xem response.data.data có tồn tại và không null
          const data = response.data.data;
          
          if (!data) {
            console.warn('API returned null or undefined data');
            return generateMockData(startDate, endDate);
          }
          
          // Kiểm tra xem data.chartData có tồn tại và là mảng
          if (!data.chartData || !Array.isArray(data.chartData) || data.chartData.length === 0) {
            console.warn('API returned invalid chartData');
            return generateMockData(startDate, endDate);
          }
          
          return data;
        } else {
          console.error('API error:', response.data);
          throw new Error(response.data?.message || 'Có lỗi khi lấy dữ liệu doanh thu');
        }
      } catch (apiError) {
        console.error('API request failed:', apiError);
        
        // Trả về dữ liệu mẫu nếu có lỗi kết nối
        if (apiError.code === 'ERR_NETWORK' || 
            apiError.message.includes('Network Error') ||
            (apiError.response && apiError.response.status >= 500)) {
          console.warn('Using mock data due to backend error');
          return generateMockData(startDate, endDate);
        }
        
        throw apiError;
      }
    } catch (error) {
      console.error('Error in getRevenueByDateRange:', error);
      throw error;
    }
  },
  
  // Lấy top K sản phẩm bán chạy nhất trong khoảng thời gian
  getTopSellingProductsByDateRange: async (startDate, endDate, limit = 10, category = null) => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      
      console.log(`Gọi API lấy top ${limit} sản phẩm bán chạy với range: ${formattedStartDate} - ${formattedEndDate}`);
      
      // Thêm timeout để xem rõ trạng thái loading
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        // Xây dựng URL với các tham số
        let url = `${API_BASE_URL}/products/top-selling-products-by-date-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}&limit=${limit}`;
        
        // Thêm category nếu được cung cấp
        if (category) {
          url += `&category=${encodeURIComponent(category)}`;
        }
        
        const response = await axios.get(url);
        
        console.log('API response for top selling products:', response);
        
        if (response.data && (response.data.status === 'SUCCESS' || response.data.status === 'success')) {
          // Kiểm tra xem response.data.data có tồn tại và không null
          const data = response.data.data;
          
          if (!data || !Array.isArray(data)) {
            console.warn('API returned null, undefined or non-array data');
            return [];
          }
          
          return data;
        } else {
          console.error('API error:', response.data);
          throw new Error(response.data?.message || 'Có lỗi khi lấy dữ liệu sản phẩm bán chạy');
        }
      } catch (apiError) {
        console.error('API request failed:', apiError);
        
        // Trả về dữ liệu mẫu nếu có lỗi kết nối
        if (apiError.code === 'ERR_NETWORK' || 
            apiError.message.includes('Network Error') ||
            (apiError.response && apiError.response.status >= 500)) {
          console.warn('Using mock data due to backend error');
          return [
            { productId: 1, productName: 'Chanel No.5', brandName: 'Chanel', volume: 100, price: 2500000, imageUrl: null, totalQuantitySold: 28 },
            { productId: 2, productName: 'Dior Sauvage', brandName: 'Dior', volume: 100, price: 2800000, imageUrl: null, totalQuantitySold: 24 },
            { productId: 3, productName: 'YSL Black Opium', brandName: 'Yves Saint Laurent', volume: 90, price: 2400000, imageUrl: null, totalQuantitySold: 19 }
          ];
        }
        
        throw apiError;
      }
    } catch (error) {
      console.error('Error in getTopSellingProductsByDateRange:', error);
      throw error;
    }
  },
  
  // Lấy các số liệu thống kê: đơn hàng mới, khách hàng mới, và trung bình đơn hàng
  getStatsByDateRange: async (startDate, endDate) => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      
      console.log(`Gọi API lấy thống kê với range: ${formattedStartDate} - ${formattedEndDate}`);
      
      // Thêm timeout để xem rõ trạng thái loading
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Trong môi trường thực tế, bạn sẽ gọi API thực tế ở đây
      // Hiện tại chúng ta sẽ sử dụng dữ liệu mẫu
      const mockData = generateStatsMockData(startDate, endDate);
      
      return {
        newOrders: mockData.newOrders,
        newCustomers: mockData.newCustomers,
        averageOrderValue: mockData.averageOrderValue
      };
    } catch (error) {
      console.error('Error in getStatsByDateRange:', error);
      throw error;
    }
  }
};

export default dashboardService; 