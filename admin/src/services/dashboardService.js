import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1'; // URL đầy đủ với prefix api/v1

// Hàm helper để định dạng ngày thành dd/MM/yyyy
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const dashboardService = {
  // Lấy top K nhân viên xuất sắc nhất theo hiệu suất trong khoảng thời gian
  getTopPerformingEmployees: async (startDate, endDate, limit = 5) => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      
      const response = await axios.get(`${API_BASE_URL}/employee-performance/top-performers`, {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          limit
        }
      });
      
      if (response.data.code === 200 && response.data.status === 'success') {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Không thể lấy dữ liệu nhân viên xuất sắc');
      }
    } catch (error) {
      console.error('Error fetching top performing employees:', error);
      throw error;
    }
  },
  // Lấy danh sách sản phẩm có tồn kho thấp
  getLowStockProducts: async (limit = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory/low-stock-alerts`, {
        params: { limit },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Không thể lấy danh sách sản phẩm tồn kho thấp');
      }
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      throw error;
    }
  },
  
  // Lấy danh sách đơn hàng gần đây theo khoảng thời gian
  getRecentOrdersByDateRange: async (startDate, endDate, limit = 5) => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      
      // Gọi API để lấy danh sách đơn hàng gần đây
      const response = await axios.get(`${API_BASE_URL}/orders/recent-orders-by-date-range`, {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          limit
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Không thể lấy danh sách đơn hàng gần đây');
      }
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw error;
    }
  },
  
  // Lấy số lượng khách hàng mới theo khoảng thời gian và phần trăm thay đổi
  getNewCustomersCountByDateRange: async (startDate, endDate) => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      
      console.log(`Gọi API lấy số khách hàng mới với range: ${formattedStartDate} - ${formattedEndDate}`);
      
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
            throw new Error('Dữ liệu trả về không hợp lệ');
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
            throw new Error('Dữ liệu trả về không hợp lệ');
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
        throw apiError;
      }
    } catch (error) {
      console.error('Error in getNewOrdersCountByDateRange:', error);
      throw error;
    }
  },
  
  // Lấy giá trị trung bình đơn hàng theo khoảng thời gian
  getAverageOrderValueByDateRange: async (startDate, endDate) => {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    const response = await axios.get(
      `${API_BASE_URL}/orders/average-order-value-by-date-range`,
      { params: { startDate: formattedStartDate, endDate: formattedEndDate } }
    );
    if (response.data && (response.data.status === 'SUCCESS' || response.data.status === 'success')) {
      const data = response.data.data;
      if (!data) throw new Error('Dữ liệu trả về không hợp lệ');
      return { averageOrderValue: data.averageOrderValue || 0 };
    }
    throw new Error(response.data?.message || 'Có lỗi khi lấy giá trị trung bình đơn hàng');
  },
  
  // Lấy doanh thu theo range thời gian và phần trăm thay đổi
  getRevenueByDateRange: async (startDate, endDate) => {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    const response = await axios.get(
      `${API_BASE_URL}/orders/revenue-by-date-range`,
      { params: { startDate: formattedStartDate, endDate: formattedEndDate } }
    );
    if (response.data && (response.data.status === 'SUCCESS' || response.data.status === 'success')) {
      const data = response.data.data;
      if (!data) throw new Error('Dữ liệu trả về không hợp lệ');
      return { totalAmount: data.totalAmount||0, chartData: data.chartData||[], maxRevenueDay: data.maxRevenueDay||null, averageDailyRevenue: data.averageDailyRevenue||0 };
    }
    throw new Error(response.data?.message || 'Có lỗi khi lấy doanh thu');
  },
  
  // Lấy top K sản phẩm bán chạy nhất trong khoảng thời gian
  getTopSellingProductsByDateRange: async (startDate, endDate, limit = 10, category = null) => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      
      console.log(`Gọi API lấy top ${limit} sản phẩm bán chạy với range: ${formattedStartDate} - ${formattedEndDate}`);
      
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
          throw new Error('Dữ liệu trả về không hợp lệ');
        }
        
        return data;
      } else {
        console.error('API error:', response.data);
        throw new Error(response.data?.message || 'Có lỗi khi lấy dữ liệu sản phẩm bán chạy');
      }
    } catch (apiError) {
      console.error('API request failed:', apiError);
      throw apiError;
    }
  },
  
  // Lấy các số liệu thống kê: đơn hàng mới, khách hàng mới, và trung bình đơn hàng
  getStatsByDateRange: async (startDate, endDate) => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      
      console.log(`Gọi API lấy thống kê với range: ${formattedStartDate} - ${formattedEndDate}`);
      
      // Trong môi trường thực tế, bạn sẽ gọi API thực tế ở đây
      // Hiện tại chúng ta sẽ sử dụng dữ liệu mẫu
      throw new Error('Chưa có API thực tế để lấy thống kê');
    } catch (error) {
      console.error('Error in getStatsByDateRange:', error);
      throw error;
    }
  }
};

export default dashboardService; 