import apiClient from './apiClient';

// Remove empty-string/null fields to satisfy backend validation
const cleanPayload = (obj) => {
  const cleaned = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) cleaned[k] = v;
  });
  return cleaned;
};

const customerService = {
  // Customer CRUD
  getAllCustomers: async (params = {}) => {
    const response = await apiClient.get('/emp/customers', { params });
    return response.data;
  },
  searchCustomers: async (keyword, page = 0, size = 10) => {
    const response = await apiClient.get('/emp/customers/search', {
      params: { keyword, page, size }
    });
    return response.data;
  },
  getCustomerById: async (customerId) => {
    const response = await apiClient.get(`/emp/customers/${customerId}`);
    return response.data;
  },
  createCustomer: async (customerData) => {
    const response = await apiClient.post('/emp/customers', cleanPayload(customerData));
    return response.data;
  },
  updateCustomer: async (customerId, customerData) => {
    const response = await apiClient.put(`/emp/customers/${customerId}`, cleanPayload(customerData));
    return response.data;
  },
  deleteCustomer: async (customerId) => {
    const response = await apiClient.delete(`/emp/customers/${customerId}`);
    return response.data;
  },
  updateCustomerStatus: async (customerId, status) => {
    const response = await apiClient.patch(`/emp/customers/${customerId}/status`, { status });
    return response.data;
  },
  updateCustomerRating: async (customerId, rating) => {
    const response = await apiClient.patch(`/emp/customers/${customerId}/rating`, { rating });
    return response.data;
  },
  adjustLoyaltyPoints: async (customerId, delta) => {
    const response = await apiClient.patch(`/emp/customers/${customerId}/loyalty-points`, { delta });
    return response.data;
  },

  // Payment Methods
  getPaymentMethods: async (customerId) => {
    const response = await apiClient.get(`/emp/customers/${customerId}/payment-methods`);
    return response.data;
  },
  addPaymentMethod: async (customerId, data) => {
    const response = await apiClient.post(`/emp/customers/${customerId}/payment-methods`, data);
    return response.data;
  },
  updatePaymentMethod: async (customerId, cpmId, data) => {
    const response = await apiClient.put(`/emp/customers/${customerId}/payment-methods/${cpmId}`, data);
    return response.data;
  },
  setDefaultPaymentMethod: async (customerId, cpmId) => {
    const response = await apiClient.patch(`/emp/customers/${customerId}/payment-methods/${cpmId}/default`);
    return response.data;
  },
  deletePaymentMethod: async (customerId, cpmId) => {
    const response = await apiClient.delete(`/emp/customers/${customerId}/payment-methods/${cpmId}`);
    return response.data;
  },

  // Orders
  getCustomerOrders: async (customerId, params = {}) => {
    const response = await apiClient.get('/emp/orders', { params: { customerId, ...params } });
    return response.data;
  },
  getOrderDetail: async (orderId) => {
    const response = await apiClient.get(`/emp/orders/${orderId}`);
    return response.data;
  },

  // Carts
  getCustomerCarts: async (customerId, status = null, page = 0, size = 10) => {
    const query = { page, size };
    if (status) query.status = status;
    const response = await apiClient.get(`/emp/customers/${customerId}/carts`, { params: query });
    return response.data;
  },
  getCartDetail: async (customerId, cartId) => {
    const response = await apiClient.get(`/emp/customers/${customerId}/carts/${cartId}`);
    return response.data;
  },

  // Wishlist
  getCustomerWishlist: async (customerId) => {
    const response = await apiClient.get(`/emp/customers/${customerId}/wishlist`);
    return response.data;
  },
  deleteWishlistItem: async (customerId, wishlistId) => {
    const response = await apiClient.delete(`/emp/customers/${customerId}/wishlist/${wishlistId}`);
    return response.data;
  },

  // Conversations
  getCustomerConversations: async (customerId) => {
    const response = await apiClient.get(`/emp/customers/${customerId}/conversations`);
    return response.data;
  },
  getConversationDetail: async (customerId, convId) => {
    const response = await apiClient.get(`/emp/customers/${customerId}/conversations/${convId}`);
    return response.data;
  }
};

export default customerService; 