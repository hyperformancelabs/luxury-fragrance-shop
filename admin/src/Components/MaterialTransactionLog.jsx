import React, { useState, useEffect } from 'react';
import { XCircle, Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import materialTransactionService from '../services/MaterialTransactionService';
import toast from 'react-hot-toast';

const MaterialTransactionLog = ({ materialId, hideTitle }) => {
  // State for transactions data
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  // State for filtering and sorting
  const [sortField, setSortField] = useState('transactionDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    transactionType: '',
    materialId: materialId || '',
    startDate: '',
    endDate: '',
  });

  // Update filters when props change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      materialId: materialId || ''
    }));
  }, [materialId]);

  // Effect to fetch transactions when needed
  useEffect(() => {
    fetchTransactions();
  }, [page, pageSize, sortField, sortDirection, filters, materialId, searchTerm]);

  // Function to fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      // Build query parameters for API
      let queryParams = {
        page,
        size: pageSize,
        sortBy: sortField,
        sortDir: sortDirection
      };
      
      // Add filters
      const apiFilters = { ...filters };
      if (searchTerm) {
        apiFilters.search = searchTerm;
      }
      
      // Make the API request
      const response = await materialTransactionService.getAllMaterialTransactions(
        page, pageSize, sortField, sortDirection, apiFilters
      );
      
      if (response.data && response.status === 'success') {
        const data = response.data;
        setTransactions(data.items || []);
        setTotalItems(data.totalElements || 0);
        setTotalPages(data.totalPages || 0);
      } else {
        setError('Failed to fetch material transactions');
        toast.error('Failed to fetch material transactions');
      }
    } catch (error) {
      console.error('Error fetching material transactions:', error);
      setError('Error fetching material transactions');
      toast.error('Failed to fetch material transactions: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Function to handle search term change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Search starts automatically due to the useEffect dependency on searchTerm
    setPage(0);
  };

  // Function to handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  // Function to handle sort
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Function to get sort icon
  const getSortIcon = (field) => {
    if (field === sortField) {
      return sortDirection === 'asc' ? 
        <ChevronUp size={16} className="ml-1" /> : 
        <ChevronDown size={16} className="ml-1" />;
    }
    return null;
  };

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(0);
  };

  // Function to clear filters
  const handleClearFilters = () => {
    setFilters({
      transactionType: '',
      materialId: materialId || '',
      startDate: '',
      endDate: '',
    });
    setSearchTerm('');
    setPage(0);
  };

  // Function to format date and time
  const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    
    try {
      const date = new Date(dateTime);
      
      // Format date: DD/MM/YYYY
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      // Format time: HH:MM
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateTime.toString();
    }
  };

  // Function to format currency
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '';
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  // Function to get transaction type display info
  const getTransactionTypeInfo = (type) => {
    switch (type) {
      case 'import':
        return {
          label: 'Nhập kho',
          textColor: 'text-green-800',
          bgColor: 'bg-green-100'
        };
      case 'export':
        return {
          label: 'Xuất kho',
          textColor: 'text-blue-800',
          bgColor: 'bg-blue-100'
        };
      case 'adjust':
        return {
          label: 'Điều chỉnh',
          textColor: 'text-yellow-800',
          bgColor: 'bg-yellow-100'
        };
      default:
        return {
          label: type,
          textColor: 'text-gray-800',
          bgColor: 'bg-gray-100'
        };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {!hideTitle && (
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Lịch sử giao dịch vật tư
          </h3>
        </div>
      )}
      
      <div className="p-4">
        {/* Search and filters */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm giao dịch..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600"
            >
              <Filter size={16} className="mr-1" /> Bộ lọc
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-3 p-3 border border-gray-200 rounded-md bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700 mb-1">
                    Loại giao dịch
                  </label>
                  <select
                    id="transactionType"
                    name="transactionType"
                    value={filters.transactionType}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả</option>
                    <option value="import">Nhập kho</option>
                    <option value="export">Xuất kho</option>
                    <option value="adjust">Điều chỉnh</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Transactions table */}
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('transactionDate')}
                >
                  <div className="flex items-center">
                    Thời gian
                    {getSortIcon('transactionDate')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('transactionType')}
                >
                  <div className="flex items-center">
                    Loại giao dịch
                    {getSortIcon('transactionType')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center justify-end">
                    Số lượng
                    {getSortIcon('quantity')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('beforeQuantity')}
                >
                  <div className="flex items-center justify-end">
                    Trước
                    {getSortIcon('beforeQuantity')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('afterQuantity')}
                >
                  <div className="flex items-center justify-end">
                    Sau
                    {getSortIcon('afterQuantity')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('costPrice')}
                >
                  <div className="flex items-center justify-end">
                    Giá (VNĐ)
                    {getSortIcon('costPrice')}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lý do
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-gray-500">Đang tải...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-red-600">{error}</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-gray-500">Không có dữ liệu giao dịch</td>
                </tr>
              ) : (
                transactions.map((transaction) => {
                  const typeInfo = getTransactionTypeInfo(transaction.transactionType);
                  return (
                    <tr key={transaction.materialTransactionId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(transaction.transactionDate)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${typeInfo.bgColor} ${typeInfo.textColor}`}>
                          {typeInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        {transaction.quantity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        {transaction.beforeQuantity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        {transaction.afterQuantity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        {transaction.costPrice ? formatCurrency(transaction.costPrice) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          {transaction.reason || '-'}
                        </div>
                        {transaction.note && (
                          <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                            {transaction.note}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && totalPages > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 mt-4">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
            
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{transactions.length}</span> trong số <span className="font-medium">{totalItems}</span> giao dịch
                </p>
              </div>
              
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      page === 0 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (page < 2) {
                      pageNum = i;
                    } else if (page > totalPages - 3) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pageNum === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      page >= totalPages - 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialTransactionLog; 