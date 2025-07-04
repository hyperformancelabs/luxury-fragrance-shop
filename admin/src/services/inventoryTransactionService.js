import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/emp/inventory-transactions';

const inventoryTransactionService = {
  getAllInventoryTransactions: async (page = 0, size = 10, sortBy = 'transactionDate', sortDir = 'desc', filters = {}) => {
    try {
      // Build query parameters
      let queryParams = `?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
      
      // Add filters if they exist
      if (filters.transactionType) {
        const transactionTypeArray = Array.isArray(filters.transactionType) 
          ? filters.transactionType 
          : filters.transactionType.split(',');
          
        // Add each transaction type as a separate parameter
        transactionTypeArray.forEach(type => {
          if (type) queryParams += `&transactionType=${encodeURIComponent(type)}`;
        });
      }
      
      if (filters.productVariantId) {
        queryParams += `&productVariantId=${encodeURIComponent(filters.productVariantId)}`;
      }
      
      if (filters.productId) {
        queryParams += `&productId=${encodeURIComponent(filters.productId)}`;
      }
      
      if (filters.performedBy) {
        queryParams += `&performedBy=${encodeURIComponent(filters.performedBy)}`;
      }
      
      if (filters.search) {
        queryParams += `&search=${encodeURIComponent(filters.search)}`;
      }
      
      if (filters.startDate && filters.endDate) {
        queryParams += `&startDate=${encodeURIComponent(filters.startDate)}&endDate=${encodeURIComponent(filters.endDate)}`;
      }
      
      if (filters.field) {
        queryParams += `&field=${encodeURIComponent(filters.field)}`;
      }
      
      // Make the API request
      const response = await axios.get(BASE_URL + queryParams);
      
      if (response.data && response.data.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch inventory transactions');
      }
    } catch (error) {
      console.error('Error in getAllInventoryTransactions:', error);
      throw error;
    }
  },

  getInventoryTransaction: async (transactionId) => {
    try {
      const response = await axios.get(`${BASE_URL}/${transactionId}`);
      
      if (response.data && response.data.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch inventory transaction');
      }
    } catch (error) {
      console.error('Error in getInventoryTransaction:', error);
      throw error;
    }
  },

  createInventoryTransaction: async (transactionData) => {
    try {
      // Prepare the data to ensure it's properly formatted
      const payload = {
        productVariantId: parseInt(transactionData.productVariantId),
        transactionType: transactionData.transactionType,
        reason: transactionData.reason || '',
        note: transactionData.note || ''
        // Allow the backend to set the current transaction date
      };
      
      // Ensure quantity is a positive number (API requirement)
      const quantity = parseInt(transactionData.quantity || 0);
      payload.quantity = quantity > 0 ? quantity : 1; // Default to 1 if not positive
      
      // Add cost price if provided - handle empty strings or 0 values appropriately
      if (transactionData.costPrice !== undefined && 
          transactionData.costPrice !== null && 
          transactionData.costPrice !== '') {
        const costPrice = parseFloat(transactionData.costPrice);
        if (!isNaN(costPrice) && costPrice > 0) {
          payload.costPrice = costPrice;
        }
      }
      
      // Add field tracking information if provided
      if (transactionData.field) {
        payload.field = transactionData.field;
      }
      
      // Add before/after values if provided, with appropriate type conversion
      if (transactionData.beforeValue !== undefined) {
        // Convert to appropriate type based on field
        if (transactionData.field === 'price' || transactionData.field === 'discountPrice' || transactionData.field === 'costPrice') {
          payload.beforeValue = parseFloat(transactionData.beforeValue);
        } else {
          payload.beforeValue = parseInt(transactionData.beforeValue);
        }
      }
      
      if (transactionData.afterValue !== undefined) {
        // Convert to appropriate type based on field
        if (transactionData.field === 'price' || transactionData.field === 'discountPrice' || transactionData.field === 'costPrice') {
          payload.afterValue = parseFloat(transactionData.afterValue);
        } else {
          payload.afterValue = parseInt(transactionData.afterValue);
        }
      }
      
      // Debug: Log the payload being sent
      console.log('Inventory transaction payload:', JSON.stringify(payload, null, 2));
      
      try {
        const response = await axios.post(BASE_URL, payload);
        
        if (response.data && response.data.status === 'success') {
          return response.data;
        } else {
          throw new Error(response.data?.message || 'Failed to create inventory transaction');
        }
      } catch (axiosError) {
        // Get detailed error information from the response
        const errorResponse = axiosError.response?.data;
        console.error('API Error Response:', errorResponse);
        
        // Rethrow with more details
        const errorMessage = errorResponse?.message || 
                           errorResponse?.error || 
                           `Error ${axiosError.response?.status}: ${axiosError.response?.statusText}`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error in createInventoryTransaction:', error);
      throw error;
    }
  },

  updateInventoryTransaction: async (transactionId, transactionData) => {
    try {
      // Prepare the data to ensure it's properly formatted
      const payload = {};
      
      if (transactionData.transactionType) {
        payload.transactionType = transactionData.transactionType;
      }
      
      if (transactionData.quantity !== undefined) {
        payload.quantity = transactionData.quantity;
      }
      
      if (transactionData.reason) {
        payload.reason = transactionData.reason;
      }
      
      if (transactionData.note) {
        payload.note = transactionData.note;
      }
      
      // Add cost price if provided - handle empty strings or 0 values appropriately
      if (transactionData.costPrice !== undefined && 
          transactionData.costPrice !== null && 
          transactionData.costPrice !== '' &&
          parseFloat(transactionData.costPrice) > 0) {
        payload.costPrice = parseFloat(transactionData.costPrice);
      }
      
      // Add field if provided
      if (transactionData.field) {
        payload.field = transactionData.field;
      }
      
      // Add before/after values if provided
      if (transactionData.beforeValue !== undefined) {
        payload.beforeValue = transactionData.beforeValue;
      }
      
      if (transactionData.afterValue !== undefined) {
        payload.afterValue = transactionData.afterValue;
      }
      
      const response = await axios.put(`${BASE_URL}/${transactionId}`, payload);
      
      if (response.data && response.data.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Failed to update inventory transaction');
      }
    } catch (error) {
      console.error('Error in updateInventoryTransaction:', error);
      throw error;
    }
  },

  deleteInventoryTransaction: async (transactionId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${transactionId}`);
      
      if (response.data && response.data.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Failed to delete inventory transaction');
      }
    } catch (error) {
      console.error('Error in deleteInventoryTransaction:', error);
      throw error;
    }
  },
  
  // Get summary of inventory transactions for a specific product variant
  getInventoryTransactionSummary: async (productVariantId, options = {}) => {
    try {
      let url = `${BASE_URL}/summary/${productVariantId}`;
      let queryParams = [];
      
      // Add optional query parameters
      if (options.startDate) {
        queryParams.push(`startDate=${encodeURIComponent(options.startDate)}`);
      }
      
      if (options.endDate) {
        queryParams.push(`endDate=${encodeURIComponent(options.endDate)}`);
      }
      
      if (options.transactionTypes) {
        const typesArray = Array.isArray(options.transactionTypes) 
          ? options.transactionTypes 
          : options.transactionTypes.split(',');
          
        typesArray.forEach(type => {
          if (type) queryParams.push(`transactionType=${encodeURIComponent(type)}`);
        });
      }
      
      if (options.field) {
        queryParams.push(`field=${encodeURIComponent(options.field)}`);
      }
      
      // Add query parameters to URL if there are any
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
      
      const response = await axios.get(url);
      
      if (response.data && response.data.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch inventory transaction summary');
      }
    } catch (error) {
      console.error('Error in getInventoryTransactionSummary:', error);
      throw error;
    }
  },

  // Create multiple transactions at once (batch processing)
  createBatchTransactions: async (transactionsData) => {
    try {
      // Ensure each transaction has the required fields and proper formatting
      const payload = transactionsData.map(transaction => {
        const formattedTransaction = {
          productVariantId: transaction.productVariantId,
          transactionType: transaction.transactionType,
          quantity: transaction.quantity || 0,
          reason: transaction.reason,
          note: transaction.note || ''
        };
        
        // Add cost price if provided
        if (transaction.costPrice !== undefined && 
            transaction.costPrice !== null && 
            transaction.costPrice !== '' &&
            parseFloat(transaction.costPrice) > 0) {
          formattedTransaction.costPrice = parseFloat(transaction.costPrice);
        }
        
        // Add field tracking information if provided
        if (transaction.field) {
          formattedTransaction.field = transaction.field;
        }
        
        // Add before/after values if provided
        if (transaction.beforeValue !== undefined) {
          formattedTransaction.beforeValue = transaction.beforeValue;
        }
        
        if (transaction.afterValue !== undefined) {
          formattedTransaction.afterValue = transaction.afterValue;
        }
        
        return formattedTransaction;
      });
      
      const response = await axios.post(`${BASE_URL}/batch`, payload);
      
      if (response.data && response.data.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Failed to create batch transactions');
      }
    } catch (error) {
      console.error('Error in createBatchTransactions:', error);
      throw error;
    }
  }
};

export default inventoryTransactionService; 