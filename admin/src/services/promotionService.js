import axios from 'axios';

// Cache for storing promotions to improve performance
let promotionCache = {
  data: null,
  timestamp: null,
  sortBy: null,
  sortDir: null,
  filters: null,
  sortedResults: {}
};

// Cache expiration time in milliseconds (10 minutes)
const CACHE_EXPIRATION = 10 * 60 * 1000;

const promotionService = {
  getAllPromotions: async () => {
    try {
      console.log('Fetching all promotions');
      
      // Clear cache before fetching to ensure we get fresh data
      promotionCache.data = null;
      
      // Lấy tất cả khuyến mãi với kích thước trang lớn
      const response = await axios.get('http://localhost:8080/api/v1/emp/promotions?page=0&size=100');
      
      console.log('API Response:', response.data);
      
      // Process the promotion data to convert date arrays to proper date strings
      if (response.data?.data?.promotions) {
        const processedPromotions = response.data.data.promotions.map(promotion => {
          // Chuyển đổi định dạng ngày tháng từ mảng sang chuỗi
          const formattedStartDate = Array.isArray(promotion.startDate) ? 
            `${promotion.startDate[0]}-${String(promotion.startDate[1]).padStart(2, '0')}-${String(promotion.startDate[2]).padStart(2, '0')}` : 
            promotion.startDate;
            
          const formattedEndDate = Array.isArray(promotion.endDate) ? 
            `${promotion.endDate[0]}-${String(promotion.endDate[1]).padStart(2, '0')}-${String(promotion.endDate[2]).padStart(2, '0')}` : 
            promotion.endDate;
            
          return {
            ...promotion,
            id: promotion.promotionId, // Map promotionId to id for consistency
            startDate: formattedStartDate,
            endDate: formattedEndDate
          };
        });
        
        console.log(`Loaded ${processedPromotions.length} promotions from API`);
        return processedPromotions;
      }
      
      // Nếu không có cấu trúc data.promotions, trả về mảng rỗng để tránh lỗi
      console.warn('Unexpected API response structure:', response.data);
      return [];
    } catch (error) {
      console.error('Error fetching promotions:', error);
      throw error;
    }
  },

  getPromotionById: async (promotionId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/emp/promotions/${promotionId}`);
      
      // Process the promotion data to convert date arrays to proper date strings
      if (response.data?.data) {
        const promotion = response.data.data;
        
        // Chuyển đổi định dạng ngày tháng từ mảng sang chuỗi
        const formattedStartDate = Array.isArray(promotion.startDate) ? 
          `${promotion.startDate[0]}-${String(promotion.startDate[1]).padStart(2, '0')}-${String(promotion.startDate[2]).padStart(2, '0')}` : 
          promotion.startDate;
          
        const formattedEndDate = Array.isArray(promotion.endDate) ? 
          `${promotion.endDate[0]}-${String(promotion.endDate[1]).padStart(2, '0')}-${String(promotion.endDate[2]).padStart(2, '0')}` : 
          promotion.endDate;
        
        const processedPromotion = {
          ...promotion,
          id: promotion.promotionId, // Map promotionId to id for consistency
          startDate: formattedStartDate,
          endDate: formattedEndDate
        };
        
        console.log('Processed promotion:', processedPromotion);
        return processedPromotion;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching promotion by ID:', error);
      throw error;
    }
  },

  createPromotion: async (promotionData) => {
    try {
      console.log('Creating new promotion with data:', promotionData);
      
      const response = await axios.post('http://localhost:8080/api/v1/emp/promotions', promotionData);
      console.log('Create response:', response.data);
      
      // Clear cache when creating new promotion
      promotionCache.data = null;
      return response.data;
    } catch (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }
  },

  updatePromotion: async (promotionId, promotionData) => {
    try {
      if (!promotionId) {
        throw new Error('Missing promotion ID for update operation');
      }
      
      console.log(`Updating promotion ID ${promotionId} with data:`, JSON.stringify(promotionData));
      
      // Ensure we're using the correct ID format
      const id = promotionId.toString();
      
      // Make sure we're sending the right data format to the API
      const apiData = {
        ...promotionData,
        // Convert empty strings to null for backend
        description: promotionData.description || null,
        endDate: promotionData.endDate || null,
        usageLimit: promotionData.usageLimit === '' ? null : 
                   (promotionData.usageLimit ? parseInt(promotionData.usageLimit) : null),
        discountValue: promotionData.discountType === 'free_shipping' ? null : 
                      (promotionData.discountValue ? parseFloat(promotionData.discountValue) : null)
      };
      
      const response = await axios.put(`http://localhost:8080/api/v1/emp/promotions/${id}`, apiData);
      console.log('Update response:', response.data);
      
      // Clear cache when updating promotion
      promotionCache.data = null;
      
      // No artificial delay – backend save is synchronous within transaction
      
      return response.data;
    } catch (error) {
      console.error(`Error updating promotion ID ${promotionId}:`, error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },

  deletePromotion: async (promotionId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/v1/emp/promotions/${promotionId}`);
      // Clear cache when deleting promotion
      promotionCache.data = null;
      return response.data;
    } catch (error) {
      console.error('Error deleting promotion:', error);
      throw error;
    }
  },

  // Product management in promotions
  getPromotionProducts: async (promotionId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/emp/promotions/${promotionId}/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching promotion products:', error);
      throw error;
    }
  },

  addProductsToPromotion: async (promotionId, productRequests) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/v1/emp/promotions/${promotionId}/products`, productRequests);
      return response.data;
    } catch (error) {
      console.error('Error adding products to promotion:', error);
      throw error;
    }
  },

  removeProductFromPromotion: async (promotionId, productId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/v1/emp/promotions/${promotionId}/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing product from promotion:', error);
      throw error;
    }
  },

  // Analytics and reporting
  getInventorySummary: async (promotionId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/emp/promotions/${promotionId}/inventory-summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory summary:', error);
      throw error;
    }
  },

  getSalesSummary: async (promotionId, startDate = null, endDate = null) => {
    try {
      let url = `http://localhost:8080/api/v1/emp/promotions/${promotionId}/sales-summary`;
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales summary:', error);
      throw error;
    }
  },

  getUsage: async (promotionId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/emp/promotions/${promotionId}/usage`);
      return response.data;
    } catch (error) {
      console.error('Error fetching promotion usage:', error);
      throw error;
    }
  },

  // Helper functions
  clearCache: () => {
    console.log('Clearing promotion cache');
    promotionCache = {
      data: null,
      timestamp: null,
      sortBy: null,
      sortDir: null,
      filters: null,
      sortedResults: {}
    };
  },

  // Status helper
  getStatusOptions: () => [
    { value: 'inactive', label: 'Tạm dừng' },
    { value: 'active', label: 'Đang hoạt động' },
    { value: 'expired', label: 'Hết hạn' }
  ],

  // Discount type helper
  getDiscountTypeOptions: () => [
    { value: 'percentage', label: 'Phần trăm (%)' },
    { value: 'fixed_amount', label: 'Số tiền cố định (VNĐ)' },
    { value: 'free_shipping', label: 'Free ship' }
  ]
};

export default promotionService; 