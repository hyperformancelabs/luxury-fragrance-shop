import axios from 'axios';

// Cache for storing sorted products to improve performance
let productCache = {
  data: null,
  timestamp: null,
  sortBy: null,
  sortDir: null,
  filters: null,
  sortedResults: {}
};

// Cache expiration time in milliseconds (10 minutes)
const CACHE_EXPIRATION = 10 * 60 * 1000;

const productService = {
  getAllProducts: async (page = 0, size = 10, sortBy = 'productId', sortDir = 'asc', filters = {}) => {
    try {
      console.log(`Fetching products with sort: ${sortBy} ${sortDir} and filters:`, filters);
      
      // Determine if we need to handle sorting on backend or frontend
      const frontendSortFields = ['totalInventory', 'volumes', 'brandName', 'minPrice', 'maxPrice'];
      const needsFrontendSort = frontendSortFields.includes(sortBy);
      
      // Determine if we need to fetch variants for more complex filtering
      const needsVariantFetch = filters.inStock || filters.discounted || filters.volume;
      
      // Check if we can use cached data for frontend sorting
      const now = Date.now();
      const cacheValid = productCache.data && 
                       productCache.timestamp && 
                       (now - productCache.timestamp < CACHE_EXPIRATION) &&
                       JSON.stringify(filters) === JSON.stringify(productCache.filters);
      
      // For backend sorting, use normal pagination through API
      if (!needsFrontendSort && !needsVariantFetch) {
        let apiUrl = 'http://localhost:8080/api/v1/emp/products';
        let queryParams = `?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
        
        // Add filters
        if (filters.productName) {
          queryParams += `&productName=${encodeURIComponent(filters.productName)}`;
        }
        
        // Add basic filters that don't need variant details
        if (filters.minPrice) {
          queryParams += `&minPrice=${filters.minPrice}`;
        }
        
        if (filters.maxPrice) {
          queryParams += `&maxPrice=${filters.maxPrice}`;
        }
        
        // Make the API request
        const response = await axios.get(apiUrl + queryParams);
        return response.data;
      }
      
      // For frontend sorting or complex filtering, fetch all products and their variants
      let allProducts;
      let totalProducts;
      let responseData;
      
      if (!cacheValid) {
        // Cache is invalid, fetch all products
        let apiUrl = 'http://localhost:8080/api/v1/emp/products';
        // Get count with basic filters
        let countQueryParams = `?page=0&size=1&sortBy=productId&sortDir=asc`;
        
        // Add basic filters for counting
        if (filters.productName) {
          countQueryParams += `&productName=${encodeURIComponent(filters.productName)}`;
        }
        
        if (filters.minPrice) {
          countQueryParams += `&minPrice=${filters.minPrice}`;
        }
        
        if (filters.maxPrice) {
          countQueryParams += `&maxPrice=${filters.maxPrice}`;
        }
        
        // Base query for getting all products with only basic filters
        let queryParams = `?page=0&size=5000&sortBy=productId&sortDir=asc`;
        
        if (filters.productName) {
          queryParams += `&productName=${encodeURIComponent(filters.productName)}`;
        }
        
        if (filters.minPrice) {
          queryParams += `&minPrice=${filters.minPrice}`;
        }
        
        if (filters.maxPrice) {
          queryParams += `&maxPrice=${filters.maxPrice}`;
        }
        
        // Query count
        const countResponse = await axios.get(apiUrl + countQueryParams);
        const totalElementsCount = countResponse.data?.data?.totalElements || 0;
        
        // Fetch all products
        const response = await axios.get(apiUrl + queryParams);
        responseData = response.data;
        
        if (responseData?.status === 'success' && responseData?.data?.products) {
          allProducts = responseData.data.products;
          totalProducts = totalElementsCount || responseData.data.totalElements || allProducts.length;
          
          // If we need variant details for filtering, fetch them for each product
          if (needsVariantFetch) {
            const productsWithVariants = await Promise.all(
              allProducts.map(async (product) => {
                try {
                  // Fetch the complete variants for this product
                  const variantResponse = await axios.get(
                    `http://localhost:8080/api/v1/emp/products/${product.productId}/variants?page=0&size=5000`
                  );
                  
                  if (variantResponse.data?.status === 'success' && variantResponse.data?.data?.variants) {
                    // Attach full variant data to product
                    return {
                      ...product,
                      fullVariants: variantResponse.data.data.variants || []
                    };
                  }
                  
                  return {
                    ...product,
                    fullVariants: []
                  };
                } catch (error) {
                  console.error(`Error fetching variants for product ${product.productId}:`, error);
                  return {
                    ...product,
                    fullVariants: []
                  };
                }
              })
            );
            
            allProducts = productsWithVariants;
          }
          
          responseData.data.totalElements = totalProducts;
          
          // Update cache
          productCache = {
            data: allProducts,
            fullResponse: responseData,
            timestamp: now,
            totalProducts: totalProducts,
            filters: JSON.parse(JSON.stringify(filters))
          };
        } else {
          return responseData; // Return original response if something went wrong
        }
      } else {
        // Use cached data
        console.log('Using cached product data');
        allProducts = productCache.data;
        totalProducts = productCache.totalProducts;
        responseData = productCache.fullResponse;
      }
      
      // Check if we have already sorted with these criteria
      const sortCacheKey = `${sortBy}_${sortDir}`;
      let sortedProducts;
      
      if (productCache.sortedResults && productCache.sortedResults[sortCacheKey]) {
        console.log(`Using cached sorting for ${sortBy} ${sortDir}`);
        sortedProducts = productCache.sortedResults[sortCacheKey];
      } else {
        console.log(`Performing new sort for ${sortBy} ${sortDir}`);
        // Create a copy to avoid modifying the cache
        sortedProducts = [...allProducts];
        
        if (sortBy === 'totalInventory') {
          sortedProducts.sort((a, b) => {
            const aInventory = parseInt(a.totalInventory || 0);
            const bInventory = parseInt(b.totalInventory || 0);
            return sortDir === 'asc' ? aInventory - bInventory : bInventory - aInventory;
          });
        } else if (sortBy === 'volumes') {
          sortedProducts.sort((a, b) => {
            const aVolumes = a.volumes || [];
            const bVolumes = b.volumes || [];
            
            // Handle empty volumes arrays
            if (aVolumes.length === 0 && bVolumes.length === 0) return 0;
            if (aVolumes.length === 0) return sortDir === 'asc' ? -1 : 1;
            if (bVolumes.length === 0) return sortDir === 'asc' ? 1 : -1;
            
            // For ascending sort, compare minimum volumes
            // For descending sort, compare maximum volumes
            let aValue, bValue;
            if (sortDir === 'asc') {
              aValue = Math.min(...aVolumes);
              bValue = Math.min(...bVolumes);
            } else {
              aValue = Math.max(...aVolumes);
              bValue = Math.max(...bVolumes);
            }
            
            return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
          });
        } else if (sortBy === 'brandName') {
          sortedProducts.sort((a, b) => {
            const aBrand = (a.brandName || '').toLowerCase();
            const bBrand = (b.brandName || '').toLowerCase();
            return sortDir === 'asc' ? aBrand.localeCompare(bBrand) : bBrand.localeCompare(aBrand);
          });
        } else if (sortBy === 'minPrice' || sortBy === 'maxPrice') {
          sortedProducts.sort((a, b) => {
            const aPrice = parseFloat(a[sortBy] || 0);
            const bPrice = parseFloat(b[sortBy] || 0);
            return sortDir === 'asc' ? aPrice - bPrice : bPrice - aPrice;
          });
        }
        
        // Store the sorted results in cache
        if (!productCache.sortedResults) {
          productCache.sortedResults = {};
        }
        productCache.sortedResults[sortCacheKey] = sortedProducts;
      }
      
      // Apply frontend filters for those that might not be fully supported by API
      let filteredProducts = [...sortedProducts];
      
      if (filters.inStock || filters.discounted || filters.volume) {
        filteredProducts = sortedProducts.filter(product => {
          // In-stock filter - product has at least one variant with stock > 0
          if (filters.inStock) {
            if (product.fullVariants && product.fullVariants.length > 0) {
              // Check if any variant has stock
              const hasStock = product.fullVariants.some(v => v.quantityInStock > 0);
              if (!hasStock) return false;
            } else if (product.totalInventory <= 0) {
              return false;
            }
          }
          
          // Discounted filter - product has at least one variant with a discount
          if (filters.discounted) {
            if (product.fullVariants && product.fullVariants.length > 0) {
              // Check if any variant has a discount
              const hasDiscount = product.fullVariants.some(v => 
                v.discountPrice && v.discountPrice < v.price
              );
              if (!hasDiscount) return false;
            } else {
              // If no variants loaded, use product level discount indicators
              const hasProductLevelDiscount = (
                (product.minDiscountPrice && product.minDiscountPrice < product.minPrice) || 
                (product.maxDiscountPrice && product.maxDiscountPrice < product.maxPrice)
              );
              if (!hasProductLevelDiscount) return false;
            }
          }
          
          // Volume filter - product has at least one variant with the specified volume
          if (filters.volume) {
            const targetVolume = parseInt(filters.volume);
            
            if (product.fullVariants && product.fullVariants.length > 0) {
              // Check if any variant has the target volume
              const hasVolume = product.fullVariants.some(v => parseInt(v.volume) === targetVolume);
              if (!hasVolume) return false;
            } else {
              // If no variants loaded, use product level volumes list
              const hasVolume = product.volumes && product.volumes.some(v => v === targetVolume);
              if (!hasVolume) return false;
            }
          }
          
          // Product passed all active filters
          return true;
        });
      }
      
      // For price range filters, apply after the variant-based filters
      if (filters.minPrice || filters.maxPrice) {
        filteredProducts = filteredProducts.filter(product => {
          let lowestPrice, highestPrice;
          
          // If we have full variant data, use it for accurate price filtering
          if (product.fullVariants && product.fullVariants.length > 0) {
            const allPrices = [];
            
            // Collect all prices (regular and discount) from variants
            product.fullVariants.forEach(v => {
              if (v.price) allPrices.push(parseFloat(v.price));
              if (v.discountPrice) allPrices.push(parseFloat(v.discountPrice));
            });
            
            lowestPrice = allPrices.length > 0 ? Math.min(...allPrices) : Infinity;
            highestPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;
          } else {
            // Use product level price data if variants not loaded
            lowestPrice = Math.min(
              parseFloat(product.minPrice || Infinity),
              parseFloat(product.minDiscountPrice || Infinity)
            );
            
            highestPrice = Math.max(
              parseFloat(product.maxPrice || 0),
              parseFloat(product.maxDiscountPrice || 0)
            );
          }
          
          // Apply min price filter
          if (filters.minPrice && parseFloat(lowestPrice) < parseFloat(filters.minPrice)) {
            return false;
          }
          
          // Apply max price filter
          if (filters.maxPrice && parseFloat(highestPrice) > parseFloat(filters.maxPrice)) {
            return false;
          }
          
          return true;
        });
      }
      
      // Apply pagination to the filtered products
      const startIndex = page * size;
      const endIndex = Math.min(startIndex + size, filteredProducts.length);
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      
      // Get actual total elements from filtered results
      const actualTotalElements = filteredProducts.length;
      
      // Create a new response with the paginated data
      const paginatedResponse = {
        ...responseData,
        data: {
          ...responseData.data,
          products: paginatedProducts,
          totalPages: Math.ceil(actualTotalElements / size),
          currentPage: page,
          totalElements: actualTotalElements
        }
      };
      
      return paginatedResponse;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  getProductById: async (productId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/emp/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error);
      throw error;
    }
  },
  
  createProduct: async (productData) => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/emp/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  updateProduct: async (productId, productData) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/v1/emp/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product with ID ${productId}:`, error);
      throw error;
    }
  },
  
  deleteProduct: async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/v1/emp/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product with ID ${productId}:`, error);
      // Rethrow with more detailed error information
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.data || 
                           `Lỗi ${error.response.status}: ${error.response.statusText}`;
        const enhancedError = new Error(errorMessage);
        enhancedError.originalError = error;
        throw enhancedError;
      }
      throw error;
    }
  },
  
  getProductVariants: async (productId, page = 0, size = 10, sortBy = 'volume', sortDir = 'asc') => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/emp/products/${productId}/variants?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching variants for product ${productId}:`, error);
      throw error;
    }
  },
  
  getProductDetails: async (productId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/emp/products/${productId}/details`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for product ${productId}:`, error);
      throw error;
    }
  },
  
  createProductVariant: async (productId, variantData) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/emp/products/${productId}/variants`,
        variantData
      );
      return response.data;
    } catch (error) {
      console.error(`Error creating variant for product ${productId}:`, error);
      throw error;
    }
  },
  
  updateProductVariant: async (productId, variantId, variantData) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/emp/products/${productId}/variants/${variantId}`,
        variantData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating variant ${variantId} for product ${productId}:`, error);
      throw error;
    }
  },
  
  deleteProductVariant: async (productId, variantId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/emp/products/${productId}/variants/${variantId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting variant ${variantId} for product ${productId}:`, error);
      throw error;
    }
  },
  
  // Calculate product statistics
  getProductStats: async (products) => {
    if (!products || !Array.isArray(products) || products.length === 0) {
      return {
        totalProducts: 0,
        totalInventory: 0,
        inStockProducts: 0,
        discountedProducts: 0
      };
    }
    
    const totalInventoryCount = products.reduce((sum, product) => sum + (parseInt(product.totalInventory) || 0), 0);
    
    const inStockProductsCount = products.filter(p => parseInt(p.totalInventory) > 0).length;
    
    const discountedProductsCount = products.filter(p => {
      // Check product level discount indicators
      if ((p.minDiscountPrice && p.minDiscountPrice < p.minPrice) || 
          (p.maxDiscountPrice && p.maxDiscountPrice < p.maxPrice)) {
        return true;
      }
      
      // If full variants available, check them too
      if (p.fullVariants && p.fullVariants.length > 0) {
        return p.fullVariants.some(v => v.discountPrice && v.discountPrice < v.price);
      }
      
      return false;
    }).length;
    
    return {
      totalProducts: products.length || 0,
      totalInventory: totalInventoryCount,
      inStockProducts: inStockProductsCount,
      discountedProducts: discountedProductsCount
    };
  }
};

export default productService; 