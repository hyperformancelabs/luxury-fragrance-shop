import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1'; // URL đầy đủ với prefix api/v1

// Hàm helper để định dạng ngày thành dd/MM/yyyy
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const revenueService = {
  // Lấy doanh thu theo range thời gian
  getRevenueByDateRange: async (startDate, endDate) => {
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      
      console.log(`Gọi API với range: ${formattedStartDate} - ${formattedEndDate}`);
      
      const response = await axios.get(
        `${API_BASE_URL}/orders/revenue-by-date-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
      
      console.log('API response:', response);
      
      if (response.data && (response.data.status === 'SUCCESS' || response.data.status === 'success')) {
        const data = response.data.data;
        
        if (!data) {
          throw new Error('Dữ liệu trả về không hợp lệ');
        }
        
        return {
          totalAmount: data.totalAmount || 0,
          chartData: data.chartData || [],
          maxRevenueDay: data.maxRevenueDay || null,
          averageDailyRevenue: data.averageDailyRevenue || 0
        };
      } else {
        console.error('API error:', response.data);
        throw new Error(response.data?.message || 'Có lỗi khi lấy doanh thu');
      }
    } catch (error) {
      console.error('Error in getRevenueByDateRange:', error);
      throw error;
    }
  }
};

export default revenueService;