import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/emp';

const materialTransactionService = {
  /**
   * Fetch paginated & filtered list of material transactions
   */
  getAllMaterialTransactions: async (page = 0, size = 10, sortBy = 'transactionDate', sortDir = 'desc', filters = {}) => {
    try {
      let url = `${BASE_URL}/material-transactions?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
      });
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching material transactions:', error);
      throw error;
    }
  },

  /**
   * Create a new material transaction (import, export, adjust).
   */
  createMaterialTransaction: async (transactionData) => {
    try {
      const response = await axios.post(`${BASE_URL}/material-transactions`, transactionData);
      return response.data;
    } catch (error) {
      console.error('Error creating material transaction:', error);
      throw error;
    }
  }
};

export default materialTransactionService; 