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
      
      const response = await axios.get('http://localhost:8080/api/v1/emp/promotions');
      
      // Process the promotion data to convert date arrays to proper date strings
      if (response.data?.data?.promotions) {
        const processedPromotions = response.data.data.promotions.map(promotion => ({
          ...promotion,
          id: promotion.promotionId, // Map promotionId to id for consistency
          // Convert array date format [2025,7,1] to string "2025-07-01"
          startDate: Array.isArray(promotion.startDate) ? 
            `${promotion.startDate[0]}-${String(promotion.startDate[1]).padStart(2, '0')}-${String(promotion.startDate[2]).padStart(2, '0')}` : 
            promotion.startDate,
          endDate: Array.isArray(promotion.endDate) ? 
            `${promotion.endDate[0]}-${String(promotion.endDate[1]).padStart(2, '0')}-${String(promotion.endDate[2]).padStart(2, '0')}` : 
            promotion.endDate
        }));
        return processedPromotions;
      }
      
      return response.data;
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
        const processedPromotion = {
          ...promotion,
          id: promotion.promotionId, // Map promotionId to id for consistency
          // Convert array date format [2025,7,1] to string "2025-07-01"
          startDate: Array.isArray(promotion.startDate) ? 
            `${promotion.startDate[0]}-${String(promotion.startDate[1]).padStart(2, '0')}-${String(promotion.startDate[2]).padStart(2, '0')}` : 
            promotion.startDate,
          endDate: Array.isArray(promotion.endDate) ? 
            `${promotion.endDate[0]}-${String(promotion.endDate[1]).padStart(2, '0')}-${String(promotion.endDate[2]).padStart(2, '0')}` : 
            promotion.endDate
        };
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
      const response = await axios.post('http://localhost:8080/api/v1/emp/promotions', promotionData);
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
      const response = await axios.put(`http://localhost:8080/api/v1/emp/promotions/${promotionId}`, promotionData);
      // Clear cache when updating promotion
      promotionCache.data = null;
      return response.data;
    } catch (error) {
      console.error('Error updating promotion:', error);
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