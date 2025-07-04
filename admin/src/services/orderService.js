import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/emp/orders';

const orderService = {
  // Main CRUD operations
  getAllOrders: async (page = 0, size = 10, sortBy = 'orderId', sortDir = 'asc', filters = {}) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortDir,
        ...filters
      });
      
      const response = await axios.get(`${BASE_URL}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  getOrderDetail: async (orderId) => {
    try {
      const response = await axios.get(`${BASE_URL}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order detail:', error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await axios.post(BASE_URL, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  updateOrderGeneralInfo: async (orderId, updateData) => {
    try {
      const response = await axios.put(`${BASE_URL}/${orderId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axios.put(`${BASE_URL}/${orderId}/status`, null, {
        params: { status }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  cancelOrder: async (orderId, reason = '') => {
    try {
      const response = await axios.delete(`${BASE_URL}/${orderId}`, {
        params: { reason }
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  },

  // Order Items Management
  addOrderItem: async (orderId, itemData) => {
    try {
      const response = await axios.post(`${BASE_URL}/${orderId}/items`, itemData);
      return response.data;
    } catch (error) {
      console.error('Error adding order item:', error);
      throw error;
    }
  },

  updateOrderItemQuantity: async (orderId, itemId, quantity) => {
    try {
      const response = await axios.put(`${BASE_URL}/${orderId}/items/${itemId}`, null, {
        params: { quantity }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating order item quantity:', error);
      throw error;
    }
  },

  deleteOrderItem: async (orderId, itemId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${orderId}/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting order item:', error);
      throw error;
    }
  },

  // Shipment Management
  updateShipment: async (orderId, shipmentData) => {
    try {
      const response = await axios.put(`${BASE_URL}/${orderId}/shipment`, shipmentData);
      return response.data;
    } catch (error) {
      console.error('Error updating shipment:', error);
      throw error;
    }
  },

  // Payment Management
  updatePayment: async (orderId, paymentData) => {
    try {
      const response = await axios.put(`${BASE_URL}/${orderId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  },

  // Promotion Management
  applyPromotion: async (orderId, promotionId) => {
    try {
      const response = await axios.post(`${BASE_URL}/${orderId}/promotions`, null, {
        params: { promotionId }
      });
      return response.data;
    } catch (error) {
      console.error('Error applying promotion:', error);
      throw error;
    }
  },

  removePromotion: async (orderId, promotionId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${orderId}/promotions/${promotionId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing promotion:', error);
      throw error;
    }
  },

  // Helper APIs
  getPaymentMethods: async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/emp/payment-methods');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  },

  getShippingProviders: async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/emp/shipping-providers');
      return response.data;
    } catch (error) {
      console.error('Error fetching shipping providers:', error);
      throw error;
    }
  },

  searchCustomers: async (keyword) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/emp/customers/search`, {
        params: { kw: keyword }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }
};

export default orderService; 