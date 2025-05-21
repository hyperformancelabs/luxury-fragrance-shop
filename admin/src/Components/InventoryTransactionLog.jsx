import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Search, Filter, ChevronDown, ChevronUp, AlertCircle, ChevronLeft, ChevronRight, Clock, Package, ClipboardList, Calendar, X, CheckSquare, Square } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AutocompleteInput from './AutocompleteInput';

const InventoryTransactionLog = ({ productId, productVariantId, hideTitle }) => {
  // State for transactions data
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Reference for dropdown positioning
  const pageSizeButtonRef = useRef(null);
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPageInput, setCurrentPageInput] = useState('1');
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [isEditingPageSize, setIsEditingPageSize] = useState(false);
  
  // State for filtering and sorting
  const [sortField, setSortField] = useState('transactionDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    transactionType: '',
    productVariantId: productVariantId || '',
    productId: '',
    startDate: '',
    endDate: '',
  });
  
  // Temporary filters for the filter modal
  const [tempFilters, setTempFilters] = useState({
    transactionType: '',
    productVariantId: productVariantId || '',
    productId: '',
    startDate: '',
    endDate: '',
  });
  
  // Multiple transaction types selection
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState([]);
  const [tempSelectedTransactionTypes, setTempSelectedTransactionTypes] = useState([]);
  
  // State for showing filter modal
  const [showFilters, setShowFilters] = useState(false);
  
  // State for active date range selection
  const [activeDateRange, setActiveDateRange] = useState('all');
  
  // Get active product info for display
  const [activeProductName, setActiveProductName] = useState('');

  // Initialize product info storage for displaying products in filters
  const [productInfo, setProductInfo] = useState({});

  // Effect to fetch transactions when needed
  useEffect(() => {
    fetchTransactions();
  }, [page, pageSize, sortField, sortDirection, filters, productVariantId, searchTerm]);

  // Effect to update UI based on date filters
  useEffect(() => {
    // We only want to detect matching to preset ranges when filters are changed externally
    if (activeDateRange !== 'custom') {
      // Check if date filters match any preset and update activeDateRange
      if (!filters.startDate && !filters.endDate) {
        setActiveDateRange('all');
      } else {
        const today = new Date();
        const todayFormatted = today.toISOString().split('T')[0];
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayFormatted = yesterday.toISOString().split('T')[0];
        
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoFormatted = weekAgo.toISOString().split('T')[0];
        
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const monthAgoFormatted = monthAgo.toISOString().split('T')[0];
        
        if (filters.startDate === todayFormatted && filters.endDate === todayFormatted) {
          setActiveDateRange('today');
        } else if (filters.startDate === yesterdayFormatted && filters.endDate === yesterdayFormatted) {
          setActiveDateRange('yesterday');
        } else if (Math.abs(new Date(filters.startDate) - weekAgo) < 24*60*60*1000 && filters.endDate === todayFormatted) {
          setActiveDateRange('week');
        } else if (Math.abs(new Date(filters.startDate) - monthAgo) < 24*60*60*1000 && filters.endDate === todayFormatted) {
          setActiveDateRange('month');
        } else {
          setActiveDateRange('custom');
        }
      }
    }
  }, [filters.startDate, filters.endDate]);

  // Effect to update currentPageInput when page changes
  useEffect(() => {
    setCurrentPageInput((page + 1).toString());
  }, [page]);

  // Initialize temp filters when opening the modal
  useEffect(() => {
    if (showFilters) {
      setTempFilters({...filters});
      setTempSelectedTransactionTypes(
        filters.transactionType ? filters.transactionType.split(',').filter(t => t) : []
      );
    }
  }, [showFilters]);

  // Function to fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      let apiUrl = 'http://localhost:8080/api/v1/emp/inventory-transactions';
      let queryParams = `?page=${page}&size=${pageSize}&sortBy=${sortField}&sortDir=${sortDirection}`;
      
      // Add filters if they exist
      if (filters.transactionType) {
        // Send a single parameter with comma-separated values
        queryParams += `&transactionType=${encodeURIComponent(filters.transactionType)}`;
      }
      if (filters.productId) {
        queryParams += `&productId=${encodeURIComponent(filters.productId)}`;
      } else if (productVariantId || filters.productVariantId) {
        queryParams += `&productVariantId=${encodeURIComponent(productVariantId || filters.productVariantId)}`;
      }
      if (filters.startDate && filters.endDate) {
        queryParams += `&startDate=${encodeURIComponent(filters.startDate)}&endDate=${encodeURIComponent(filters.endDate)}`;
      }
      if (searchTerm) {
        queryParams += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      // Make the API request
      const response = await axios.get(apiUrl + queryParams);
      
      if (response.data && response.data.status === 'success') {
        const data = response.data.data;
        
        // Log the first transaction's date for debugging
        if (data.items && data.items.length > 0) {
          console.log('Sample transaction date received:', data.items[0].transactionDate);
          console.log('Parsed date object:', new Date(data.items[0].transactionDate));
        }
        
        setTransactions(data.items || []);
        setTotalItems(data.totalElements || 0);
        setTotalPages(data.totalPages || 0);
      } else {
        setError('Failed to fetch inventory transactions');
        toast.error('Failed to fetch inventory transactions');
      }
    } catch (error) {
      console.error('Error fetching inventory transactions:', error);
      setError('Error fetching inventory transactions');
      toast.error('Failed to fetch inventory transactions: ' + (error.response?.data?.message || error.message));
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

  // Function to handle page input change
  const handlePageInputChange = (e) => {
    setCurrentPageInput(e.target.value);
  };

  // Function to handle page input blur
  const handlePageInputBlur = () => {
    const pageNumber = parseInt(currentPageInput, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber - 1);
    } else {
      setCurrentPageInput((page + 1).toString());
    }
    setIsEditingPage(false);
  };

  // Function to handle page input key press
  const handlePageInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlePageInputBlur();
    } else if (e.key === 'Escape') {
      setCurrentPageInput((page + 1).toString());
      setIsEditingPage(false);
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
      return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    }
    return null;
  };

  // Function to handle temporary filter change
  const handleTempFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to handle transaction type checkbox toggle
  const handleTransactionTypeToggle = (type) => {
    setTempSelectedTransactionTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Function to apply filters
  const applyFilters = () => {
    // Join selected transaction types into a comma-separated string
    const transactionTypeString = tempSelectedTransactionTypes.join(',');
    
    // Apply all filters at once
    setFilters({
      ...tempFilters,
      transactionType: transactionTypeString,
    });
    
    // Update activeDateRange based on selected dates
    if (!tempFilters.startDate && !tempFilters.endDate) {
      setActiveDateRange('all');
    } else if (tempFilters.startDate === tempFilters.endDate && tempFilters.startDate) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayFormatted = yesterday.toISOString().split('T')[0];
      
      if (tempFilters.startDate === today) {
        setActiveDateRange('today');
      } else if (tempFilters.startDate === yesterdayFormatted) {
        setActiveDateRange('yesterday');
      } else {
        setActiveDateRange('custom');
      }
    } else {
      setActiveDateRange('custom');
    }
    
    // Reset to first page and close filter modal
    setPage(0);
    setShowFilters(false);
  };

  // Function to clear filters
  const clearFilters = () => {
    setTempFilters({
      transactionType: '',
      productVariantId: productVariantId || '',
      productId: '',
      startDate: '',
      endDate: '',
    });
    setTempSelectedTransactionTypes([]);
  };

  // Function to apply clear all filters
  const clearAllFilters = () => {
    clearFilters();
    setFilters({
      transactionType: '',
      productVariantId: productVariantId || '',
      productId: '',
      startDate: '',
      endDate: '',
    });
    setSelectedTransactionTypes([]);
    setActiveDateRange('all');
    setSearchTerm('');
    setPage(0);
  };

  // Function to format date and time
  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    try {
      // Handle ISO string format from backend
      const date = new Date(dateTime);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date format received:', dateTime);
        return 'N/A';
      }
      
      return date.toLocaleString('vi-VN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };
  
  // Function to format just the date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date format received:', dateString);
        return '';
      }
      
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Function to get appropriate text and color for transaction type
  const getTransactionTypeInfo = (type) => {
    switch (type) {
      case 'import':
        return { 
          text: 'Nhập hàng', 
          color: 'bg-green-100 text-green-800',
          icon: <Package size={16} className="text-green-600" />
        };
      case 'export':
        return { 
          text: 'Xuất hàng', 
          color: 'bg-red-100 text-red-800',
          icon: <Package size={16} className="text-red-600" />
        };
      case 'adjust':
        return { 
          text: 'Điều chỉnh', 
          color: 'bg-blue-100 text-blue-800',
          icon: <ClipboardList size={16} className="text-blue-600" />
        };
      case 'sell':
        return { 
          text: 'Bán hàng', 
          color: 'bg-purple-100 text-purple-800',
          icon: <Package size={16} className="text-purple-600" />
        };
      case 'combine':
        return { 
          text: 'Kết hợp', 
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Package size={16} className="text-yellow-600" />
        };
      default:
        return { 
          text: type, 
          color: 'bg-gray-100 text-gray-800',
          icon: <Package size={16} className="text-gray-600" />
        };
    }
  };

  // Function to format currency
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Function to create a natural language description of the transaction
  const createTransactionDescription = (transaction) => {
    const typeInfo = getTransactionTypeInfo(transaction.transactionType);
    // Remove dateTime since it's already displayed in the header
    const productInfo = `${transaction.productName} (${transaction.volume}ml)`;
    
    let description = '';
    const performedBy = `${transaction.performedByName || 'N/A'} (ID: ${transaction.performedById || 'N/A'})`;
    
    switch (transaction.transactionType) {
      case 'import':
        description = `<span class="font-semibold">${performedBy}</span> đã nhập thêm <span class="font-semibold text-green-600">${transaction.quantity} sản phẩm</span> ${productInfo}`;
        if (transaction.costPrice) {
          description += ` với giá nhập <span class="font-semibold text-blue-600">${formatCurrency(transaction.costPrice)}</span> mỗi sản phẩm`;
        }
        if (transaction.reason) {
          description += `, lý do: "${transaction.reason}"`;
        }
        description += `. Tồn kho thay đổi từ <span class="font-semibold">${transaction.beforeQuantity}</span> thành <span class="font-semibold">${transaction.afterQuantity}</span> sản phẩm.`;
        break;
        
      case 'export':
        description = `<span class="font-semibold">${performedBy}</span> đã xuất <span class="font-semibold text-red-600">${transaction.quantity} sản phẩm</span> ${productInfo}`;
        if (transaction.reason) {
          description += `, lý do: "${transaction.reason}"`;
        }
        description += `. Tồn kho thay đổi từ <span class="font-semibold">${transaction.beforeQuantity}</span> thành <span class="font-semibold">${transaction.afterQuantity}</span> sản phẩm.`;
        break;
        
      case 'adjust':
        const adjustmentType = transaction.afterQuantity > transaction.beforeQuantity ? 'tăng' : 'giảm';
        const adjustmentAmount = Math.abs(transaction.afterQuantity - transaction.beforeQuantity);
        const adjustmentColor = adjustmentType === 'tăng' ? 'text-green-600' : 'text-red-600';
        
        description = `<span class="font-semibold">${performedBy}</span> đã điều chỉnh <span class="font-semibold ${adjustmentColor}">${adjustmentType} ${adjustmentAmount} sản phẩm</span> ${productInfo}`;
        if (transaction.reason) {
          description += `, lý do: "${transaction.reason}"`;
        }
        description += `. Tồn kho thay đổi từ <span class="font-semibold">${transaction.beforeQuantity}</span> thành <span class="font-semibold">${transaction.afterQuantity}</span> sản phẩm.`;
        break;
        
      case 'sell':
        description = `<span class="font-semibold">${performedBy}</span> đã bán <span class="font-semibold text-purple-600">${transaction.quantity} sản phẩm</span> ${productInfo}`;
        description += `. Tồn kho thay đổi từ <span class="font-semibold">${transaction.beforeQuantity}</span> thành <span class="font-semibold">${transaction.afterQuantity}</span> sản phẩm.`;
        break;
        
      case 'combine':
        description = `<span class="font-semibold">${performedBy}</span> đã kết hợp <span class="font-semibold text-yellow-600">${transaction.quantity} sản phẩm</span> ${productInfo}`;
        if (transaction.reason) {
          description += `, chi tiết: "${transaction.reason}"`;
        }
        description += `. Tồn kho thay đổi từ <span class="font-semibold">${transaction.beforeQuantity}</span> thành <span class="font-semibold">${transaction.afterQuantity}</span> sản phẩm.`;
        break;
        
      default:
        description = `<span class="font-semibold">${performedBy}</span> đã thực hiện giao dịch <span class="font-semibold">${transaction.transactionType}</span> với <span class="font-semibold">${transaction.quantity} sản phẩm</span> ${productInfo}. Tồn kho thay đổi từ <span class="font-semibold">${transaction.beforeQuantity}</span> thành <span class="font-semibold">${transaction.afterQuantity}</span> sản phẩm.`;
    }
    
    if (transaction.note && transaction.note !== transaction.reason) {
      description += ` <span class="italic text-gray-600">Ghi chú: "${transaction.note}"</span>`;
    }
    
    return description;
  };

  // Function to handle filter change in AutocompleteInput
  const handleProductSelection = (e) => {
    handleTempFilterChange(e);
    // Store product name and other info for display if selected from autocomplete
    if (e.target.selectedItem) {
      const product = e.target.selectedItem;
      setActiveProductName(product.productName);
      setProductInfo(prevInfo => ({
        ...prevInfo,
        [e.target.value]: `${product.productName} (${product.volume}ml)`
      }));
    }
  };

  // Filter modal component
  const FilterModal = () => {
    const transactionTypes = [
      { value: 'import', label: 'Nhập hàng' },
      { value: 'export', label: 'Xuất hàng' },
      { value: 'adjust', label: 'Điều chỉnh' },
      { value: 'sell', label: 'Bán hàng' },
      { value: 'combine', label: 'Kết hợp' }
    ];
    
    return (
      <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-4 z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Bộ lọc</h3>
          <button 
            onClick={() => setShowFilters(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại giao dịch
            </label>
            <div className="space-y-2">
              {transactionTypes.map(type => {
                const isSelected = tempSelectedTransactionTypes.includes(type.value);
                return (
                  <div 
                    key={type.value}
                    className="flex items-center cursor-pointer" 
                    onClick={() => handleTransactionTypeToggle(type.value)}
                  >
                    {isSelected ? (
                      <CheckSquare size={18} className="text-blue-600" />
                    ) : (
                      <Square size={18} className="text-gray-400" />
                    )}
                    <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {!productVariantId && (
            <AutocompleteInput
              label="Sản phẩm"
              name="productId"
              value={tempFilters.productId}
              onChange={handleProductSelection}
              placeholder="Tìm kiếm theo tên sản phẩm..."
              searchUrl="http://localhost:8080/api/v1/emp/products/search"
              displayField="productName"
              valueField="productId"
            />
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoảng thời gian
            </label>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Từ ngày</label>
              <input
                type="date"
                name="startDate"
                value={tempFilters.startDate}
                onChange={handleTempFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="mt-2">
              <label className="block text-xs text-gray-500 mb-1">Đến ngày</label>
              <input
                type="date"
                name="endDate"
                value={tempFilters.endDate}
                onChange={handleTempFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          
          <div className="pt-2 flex justify-between">
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Xóa bộ lọc
            </button>
            
            <button
              onClick={applyFilters}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Function to handle "Tất cả" button click
  const handleClearDateFilter = () => {
    setTempFilters(prev => ({ ...prev, startDate: '', endDate: '' }));
    setActiveDateRange('all');
    setPage(0);
  };

  // Function to handle transaction type toggle with badge display
  const getActiveTransactionTypes = () => {
    if (!filters.transactionType) return [];
    return filters.transactionType.split(',').filter(type => type);
  };

  // Get transaction type info for multiple transaction types
  const getTransactionTypeInfoList = () => {
    return getActiveTransactionTypes().map(type => getTransactionTypeInfo(type));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {!hideTitle && (
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Lịch sử giao dịch tồn kho</h2>
          <p className="text-sm text-gray-500 mt-1">
            Xem lịch sử nhập, xuất, điều chỉnh và bán hàng
          </p>
          
          {/* Quick Date Range Selector */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => {
                const today = new Date();
                const formattedDate = today.toISOString().split('T')[0];
                setFilters(prev => ({ ...prev, startDate: formattedDate, endDate: formattedDate }));
                setActiveDateRange('today');
                setPage(0);
              }}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors ${activeDateRange === 'today' ? 'bg-blue-600 text-white font-medium' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              Hôm nay
            </button>
            
            <button
              onClick={() => {
                const today = new Date();
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);
                const formattedDate = yesterday.toISOString().split('T')[0];
                setFilters(prev => ({ ...prev, startDate: formattedDate, endDate: formattedDate }));
                setActiveDateRange('yesterday');
                setPage(0);
              }}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors ${activeDateRange === 'yesterday' ? 'bg-blue-600 text-white font-medium' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              Hôm qua
            </button>
            
            <button
              onClick={() => {
                const today = new Date();
                const weekAgo = new Date();
                weekAgo.setDate(today.getDate() - 7);
                const todayFormatted = today.toISOString().split('T')[0];
                const weekAgoFormatted = weekAgo.toISOString().split('T')[0];
                setFilters(prev => ({ ...prev, startDate: weekAgoFormatted, endDate: todayFormatted }));
                setActiveDateRange('week');
                setPage(0);
              }}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors ${activeDateRange === 'week' ? 'bg-blue-600 text-white font-medium' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              7 ngày qua
            </button>
            
            <button
              onClick={() => {
                const today = new Date();
                const monthAgo = new Date();
                monthAgo.setMonth(today.getMonth() - 1);
                const todayFormatted = today.toISOString().split('T')[0];
                const monthAgoFormatted = monthAgo.toISOString().split('T')[0];
                setFilters(prev => ({ ...prev, startDate: monthAgoFormatted, endDate: todayFormatted }));
                setActiveDateRange('month');
                setPage(0);
              }}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors ${activeDateRange === 'month' ? 'bg-blue-600 text-white font-medium' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              30 ngày qua
            </button>
            
            <button
              onClick={clearAllFilters}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors ${activeDateRange === 'all' ? 'bg-blue-600 text-white font-medium' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              Tất cả
            </button>
          </div>
        </div>
      )}
      
      {/* Search and filter */}
      <div className="px-4 py-3 border-b border-gray-200 sm:px-6">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center w-full md:w-auto mb-2 md:mb-0">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm giao dịch..."
                className="w-full p-2 pl-8 border border-gray-300 rounded-md"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Show active filters */}
            <div className="flex flex-wrap gap-1.5 mr-2">
              {/* Show transaction type filters if active */}
              {getActiveTransactionTypes().length > 0 && getActiveTransactionTypes().map(type => (
                <div key={type} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full flex items-center">
                  {getTransactionTypeInfo(type).icon}
                  <span className="ml-1">{getTransactionTypeInfo(type).text}</span>
                  <button 
                    onClick={() => {
                      const updatedTypes = getActiveTransactionTypes().filter(t => t !== type);
                      setFilters(prev => ({ ...prev, transactionType: updatedTypes.join(',') }));
                      setPage(0);
                    }}
                    className="ml-1 text-blue-500 hover:text-blue-700" 
                    title={`Xóa bộ lọc ${getTransactionTypeInfo(type).text}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              {/* Show product filter if active */}
              {filters.productId && (
                <div className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full flex items-center">
                  <Package size={14} className="mr-1" />
                  <span>{productInfo[filters.productId] ? `${productInfo[filters.productId]} (ID: ${filters.productId})` : `Sản phẩm ID: ${filters.productId}`}</span>
                  <button 
                    onClick={() => {
                      setFilters(prev => ({ ...prev, productId: '' }));
                      setActiveProductName('');
                      setPage(0);
                    }}
                    className="ml-1 text-blue-500 hover:text-blue-700" 
                    title="Xóa bộ lọc sản phẩm"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {(filters.startDate || filters.endDate) && (
                <div className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {filters.startDate && filters.endDate ? (
                    filters.startDate === filters.endDate ? 
                      formatDate(filters.startDate) : 
                      `${formatDate(filters.startDate)} - ${formatDate(filters.endDate)}`
                  ) : filters.startDate ? 
                    `Từ ${formatDate(filters.startDate)}` : 
                    `Đến ${formatDate(filters.endDate)}`
                  }
                  <button 
                    onClick={() => {
                      setFilters({...filters, startDate: '', endDate: ''});
                      setActiveDateRange('all');
                      setPage(0);
                    }}
                    className="ml-1 text-blue-500 hover:text-blue-700" 
                    title="Xóa bộ lọc ngày"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {/* Show search term if active */}
              {searchTerm && (
                <div className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full flex items-center">
                  <Search size={14} className="mr-1" />
                  <span>Tìm: "{searchTerm}"</span>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setPage(0);
                    }}
                    className="ml-1 text-blue-500 hover:text-blue-700" 
                    title="Xóa bộ lọc tìm kiếm"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Filter size={16} className="mr-1" />
                Bộ lọc
              </button>
              {showFilters && <FilterModal />}
            </div>
          </div>
        </div>
      </div>
      
      {/* Transaction List */}
      <div className="overflow-y-auto" style={{ maxHeight: '650px', height: '650px' }}>
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="inline-flex items-center p-2 bg-red-50 rounded-full mb-4">
              <AlertCircle className="text-red-500 h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-red-800">Không thể tải dữ liệu</h3>
            <p className="text-red-600 mt-2">{error}</p>
            <button
              onClick={fetchTransactions}
              className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
            >
              Thử lại
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-6 text-center">
            <div className="inline-flex items-center p-2 bg-blue-50 rounded-full mb-4">
              <AlertCircle className="text-blue-500 h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Không có dữ liệu</h3>
            <p className="text-gray-600 mt-2">Không tìm thấy giao dịch tồn kho nào.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {transactions.map(transaction => {
              const typeInfo = getTransactionTypeInfo(transaction.transactionType);
              return (
                <div 
                  key={transaction.inventoryTransactionId} 
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 m-3"
                >
                  <div className="flex flex-wrap items-center mb-2 gap-2">
                    <span className={`mr-2 px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color} flex items-center`}>
                      {typeInfo.icon}
                      <span className="ml-1">{typeInfo.text}</span>
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      {(() => {
                        try {
                          // Try to parse and format the date, with fallback if invalid
                          if (!transaction.transactionDate) return 'N/A';
                          
                          const date = new Date(transaction.transactionDate);
                          if (isNaN(date.getTime())) {
                            console.error('Invalid transaction date:', transaction.transactionDate);
                            return 'N/A';
                          }
                          
                          return date.toLocaleString('vi-VN', {
                            year: 'numeric', 
                            month: '2-digit', 
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          });
                        } catch (error) {
                          console.error('Error formatting transaction date:', error);
                          return 'N/A';
                        }
                      })()}
                    </div>
                    <div className="ml-auto flex items-center">
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        #{transaction.inventoryTransactionId}
                      </span>
                    </div>
                  </div>
                  
                  <div 
                    className="text-sm text-gray-800"
                    dangerouslySetInnerHTML={{ __html: createTransactionDescription(transaction) }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {!loading && !error && transactions.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 relative z-30">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-700 mr-1">
                Hiển thị 
                <span className="relative mx-1">
                  <button 
                    ref={pageSizeButtonRef}
                    onClick={() => setIsEditingPageSize(!isEditingPageSize)}
                    className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 mx-1 focus:outline-none"
                  >
                    <span className="border-b border-blue-600">{pageSize}</span>
                    <svg 
                      className={`w-4 h-4 ml-0.5 transition-transform duration-200 ${isEditingPageSize ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  {isEditingPageSize && pageSizeButtonRef.current && (
                    ReactDOM.createPortal(
                      <div 
                        className="fixed shadow-lg rounded-md border border-gray-200 w-36 py-1 bg-white z-50 animate-fadeIn"
                        style={{
                          left: pageSizeButtonRef.current.getBoundingClientRect().left - 18,
                          top: pageSizeButtonRef.current.getBoundingClientRect().top - 170,
                        }}
                      >
                        {[10, 20, 50, 100].map(size => (
                          <div 
                            key={size} 
                            className={`px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer ${size === pageSize ? 'bg-blue-50 text-blue-700' : ''}`}
                            onClick={() => {
                              setPageSize(size);
                              setPage(0);
                              setIsEditingPageSize(false);
                            }}
                          >
                            {size} mục/trang
                          </div>
                        ))}
                        <div className="px-3 py-2 border-t border-gray-100">
                          <label className="block text-xs text-gray-500 mb-1">Tuỳ chỉnh</label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              min="1"
                              className="w-full p-1 text-sm border border-gray-300 rounded-md"
                              placeholder="Nhập số..."
                              onBlur={(e) => {
                                const value = parseInt(e.target.value, 10);
                                if (!isNaN(value) && value > 0) {
                                  setPageSize(value);
                                  setPage(0);
                                }
                                setIsEditingPageSize(false);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const value = parseInt(e.target.value, 10);
                                  if (!isNaN(value) && value > 0) {
                                    setPageSize(value);
                                    setPage(0);
                                  }
                                  setIsEditingPageSize(false);
                                } else if (e.key === 'Escape') {
                                  setIsEditingPageSize(false);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>,
                      document.body
                    )
                  )}
                </span>
                / <span className="font-medium">{totalItems}</span> giao dịch
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Pagination controls */}
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(0)}
                  disabled={page === 0}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <span className="sr-only">First</span>
                  <ChevronLeft size={15} className="h-5 w-5" />
                  <ChevronLeft size={15} className="h-5 w-5 -ml-2" />
                </button>
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft size={18} className="h-5 w-5" />
                </button>
                
                {/* Editable page number */}
                <div className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm">
                  {isEditingPage ? (
                    <input
                      type="text"
                      value={currentPageInput}
                      onChange={handlePageInputChange}
                      onBlur={handlePageInputBlur}
                      onKeyDown={handlePageInputKeyDown}
                      className="w-12 text-center border-b border-black focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => setIsEditingPage(true)}
                      className="font-medium text-gray-700 hover:text-blue-500"
                    >
                      <span className="border-b border-black">{page + 1}</span>
                    </button>
                  )}
                  <span className="text-gray-600 mx-1">/</span>
                  <span className="text-gray-600">{totalPages}</span>
                </div>
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages - 1}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page >= totalPages - 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight size={18} className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={page >= totalPages - 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page >= totalPages - 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <span className="sr-only">Last</span>
                  <ChevronRight size={15} className="h-5 w-5" />
                  <ChevronRight size={15} className="h-5 w-5 -ml-2" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTransactionLog;

// Add default props
InventoryTransactionLog.defaultProps = {
  hideTitle: false,
  productId: null,
  productVariantId: null
}; 