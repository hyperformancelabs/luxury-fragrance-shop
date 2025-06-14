import axios from 'axios';

// Base URL for all material-related API endpoints
const BASE_URL = 'http://localhost:8080/api/v1/emp';

const materialService = {
  /**
   * Fetch paginated & filtered list of materials
   * @param {number} page - zero-based page index
   * @param {number} size - page size
   * @param {string} sortBy - column to sort
   * @param {'asc'|'desc'} sortDir - sort direction
   * @param {object} filters - key-value pairs for filtering/search
   */
  getAllMaterials: async (page = 0, size = 10, sortBy = 'materialId', sortDir = 'asc', filters = {}) => {
    try {
      let url = `${BASE_URL}/materials?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
      });
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
  },

  /**
   * Get single material by ID
   */
  getMaterialById: async (materialId) => {
    try {
      const response = await axios.get(`${BASE_URL}/materials/${materialId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching material ${materialId}:`, error);
      throw error;
    }
  },

  /**
   * Create new material
   */
  createMaterial: async (materialData) => {
    try {
      const response = await axios.post(`${BASE_URL}/materials`, materialData);
      return response.data;
    } catch (error) {
      console.error('Error creating material:', error);
      throw error;
    }
  },

  /**
   * Update existing material
   */
  updateMaterial: async (materialId, materialData) => {
    try {
      const response = await axios.put(`${BASE_URL}/materials/${materialId}`, materialData);
      return response.data;
    } catch (error) {
      console.error(`Error updating material ${materialId}:`, error);
      throw error;
    }
  },

  /**
   * Delete single material
   */
  deleteMaterial: async (materialId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/materials/${materialId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting material ${materialId}:`, error);
      throw error;
    }
  },

  /**
   * Bulk delete materials
   */
  deleteMaterialsBulk: async (materialIds = []) => {
    try {
      const response = await axios.delete(`${BASE_URL}/materials`, {
        data: { ids: materialIds }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting materials:', error);
      throw error;
    }
  },

  /**
   * Real-time search materials by name or sku etc.
   * This hits a dedicated search endpoint if provided in backend, otherwise uses getAll with filter.
   */
  searchMaterials: async (query) => {
    try {
      if (!query) return { status: 'success', data: { items: [] } };
      const response = await axios.get(`${BASE_URL}/materials/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching materials:', error);
      throw error;
    }
  }
};

export default materialService; 