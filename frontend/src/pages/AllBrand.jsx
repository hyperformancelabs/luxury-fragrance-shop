import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllBrands = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [alphabetFilter, setAlphabetFilter] = useState('');

  useEffect(() => {
    fetchBrands();
  }, [currentPage]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/v1/brands', {
        params: {
          page: currentPage - 1, // API might be 0-indexed
          size: 24 // Show 24 brands per page
        }
      });
      
      if (response.data.status === "success") {
        setBrands(response.data.data.items);
        setTotalPages(response.data.data.totalPages);
      } else {
        setError('Failed to load brands data');
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError('Không thể tải thương hiệu. Vui lòng thử lại sau.');
    } finally {
      // Add a small delay to show loading animation
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };



  const handleBrandClick = (brandName) => {
    navigate(`/products/brand/${encodeURIComponent(brandName)}`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      
    }
  };

  const renderPagination = () => (
    <div className="flex justify-center items-center mt-8 mb-6 gap-2">
      <button 
        className={`px-3 py-1 border rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {'<'}
      </button>
      {renderPageNumbers()}
      <button 
        className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {'>'}
      </button>
    </div>
  );

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-3 py-1 border rounded ${currentPage === i ? 'bg-gray-800 text-white' : 'hover:bg-gray-100'}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    return pageNumbers;
  };

  

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <a href="/" className="hover:underline">TRANG CHỦ</a>
            <span className="mx-2">/</span>
            <span>BRAND</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 flex-grow">
        
   
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 24 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="animate-pulse bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <div className="w-full h-36 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button 
              className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
              onClick={fetchBrands}
            >
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {brands.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Không tìm thấy thương hiệu phù hợp.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {brands.map((brand, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    onClick={() => handleBrandClick(brand.brandName)}
                  >
                    <div className="w-full h-36 mb-4 flex items-center justify-center">
                      <img
                        src={brand.logoUrl || 'https://via.placeholder.com/150x100?text=No+Logo'}
                        alt={brand.brandName}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150x100?text=No+Logo';
                        }}
                      />
                    </div>
                    <h3 className="font-medium text-center hover:text-red-600 transition">
                      {brand.brandName}
                    </h3>
                  </div>
                ))}
              </div>
            )}


            {renderPagination()}
          </>
        )}
      </main>
    </div>
  );
};

export default AllBrands;