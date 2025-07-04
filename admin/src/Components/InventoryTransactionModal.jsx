import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Calendar, FileText, CheckCircle, AlertCircle, Settings, DollarSign, Star, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const InventoryTransactionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productVariantId, 
  productName, 
  volume,
  beforeQuantity,
  afterQuantity,
  allowedTypes = ['adjust'],
  prefilledType = '',
  otherChanges = false,
  costPrice = '',
  changedFields = [],
  changedFieldsInfo = []
}) => {
  const [transactionType, setTransactionType] = useState('');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultReasons, setDefaultReasons] = useState({});
  const [priorityReasons, setPriorityReasons] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [transactionCostPrice, setTransactionCostPrice] = useState(costPrice || '');
  const [currentPage, setCurrentPage] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showCostPrice, setShowCostPrice] = useState(true);
  const [costPriceLabel, setCostPriceLabel] = useState('Giá nhập (tùy chọn)');
  const [transactionErrors, setTransactionErrors] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  
  const reasonInputRef = useRef(null);

  const quantityDiff = afterQuantity - beforeQuantity;
  const isQuantityChange = beforeQuantity !== afterQuantity;

  // Helper function to get appropriate cost price label and default value
  const getCostPriceConfig = (field, type) => {
    // Get the last used price from localStorage if available
    const lastUsedPrice = localStorage.getItem('last_used_price') || costPrice || '';
    
    // Try to find the field info from changedFieldsInfo if available
    const fieldInfo = changedFieldsInfo?.find(info => info.field === field);
    
    const config = {
      show: false,
      label: 'Giá nhập (tùy chọn)',
      defaultValue: lastUsedPrice
    };
    
    // Determine cost price visibility and label based on field and transaction type
    if (field === 'price') {
      config.show = true;
      config.label = 'Giá gốc mới (VNĐ)';
      config.defaultValue = fieldInfo?.afterValue?.toString() || lastUsedPrice;
    } else if (field === 'discountPrice') {
      config.show = true;
      config.label = 'Giá ưu đãi mới (VNĐ)';
      // For discount price, use the after value from changedFieldsInfo if available
      config.defaultValue = fieldInfo?.afterValue?.toString() || lastUsedPrice;
    } else if (field === 'quantityInStock') {
      if (type === 'import') {
        config.show = true;
        config.label = 'Giá nhập (VNĐ/sản phẩm)';
      } else if (type === 'export') {
        config.show = true;
        config.label = 'Giá xuất (VNĐ/sản phẩm)';
      } else if (type === 'sell') {
        config.show = true;
        config.label = 'Giá bán (VNĐ/sản phẩm)';
      }
    }
    
    return config;
  };

  // Create a list of transactions from changed fields
  useEffect(() => {
    if (changedFields && changedFields.length > 0) {
      // Get default adjust type from localStorage
      const defaultAdjustType = localStorage.getItem('inventory_default_adjust_type') || 'adjust';
      
      const transactionsToLog = changedFields.map(field => {
        const fieldType = field === 'quantityInStock' && quantityDiff !== 0 
          ? quantityDiff > 0 
            ? localStorage.getItem('inventory_default_increase_type') || 'import'
            : localStorage.getItem('inventory_default_decrease_type') || 'sell'
          : defaultAdjustType;
        
        // Get field-specific reasons
        const reasonTemplate = getDefaultReasonForField(field, fieldType);
        
        // Get before/after values from props if available
        const fieldInfo = otherChanges && Array.isArray(changedFieldsInfo) 
          ? changedFieldsInfo.find(info => info.field === field)
          : null;
          
        // Prepare transaction with field-specific information
        const transaction = {
          field: field,
          type: fieldType,
          reason: reasonTemplate,
          costPriceConfig: getCostPriceConfig(field, fieldType)
        };
        
        // Add before/after values based on field type
        if (field === 'quantityInStock') {
          transaction.beforeValue = beforeQuantity;
          transaction.afterValue = afterQuantity;
        } else if (fieldInfo) {
          // Use values from fieldInfo if available
          transaction.beforeValue = fieldInfo.beforeValue;
          transaction.afterValue = fieldInfo.afterValue;
        }
        
        return transaction;
      });
      
      setTransactions(transactionsToLog);
      
      // Set initial transaction type and reason from first transaction
      if (transactionsToLog.length > 0) {
        setTransactionType(transactionsToLog[0].type);
        
        // Try to get a starred reason for this transaction type
        const currentPriorityReasons = JSON.parse(localStorage.getItem('inventory_priority_reasons') || '{}')[transactionsToLog[0].type] || [];
        if (currentPriorityReasons.length > 0) {
          // Use the first starred reason if available
          setReason(currentPriorityReasons[0]);
          transactionsToLog[0].reason = currentPriorityReasons[0];
        } else {
          // Otherwise use the default reason
          setReason(transactionsToLog[0].reason);
        }
        
        // Set cost price visibility and label
        setShowCostPrice(transactionsToLog[0].costPriceConfig.show);
        setCostPriceLabel(transactionsToLog[0].costPriceConfig.label);
        setTransactionCostPrice(transactionsToLog[0].costPriceConfig.defaultValue);
      }
    } else {
      // Standard transaction (usually quantity change)
      const type = prefilledType || (isQuantityChange 
        ? (quantityDiff > 0 
          ? localStorage.getItem('inventory_default_increase_type') || 'import'
          : localStorage.getItem('inventory_default_decrease_type') || 'sell')
        : 'adjust');
      
      // Try to get a starred reason for this transaction type
      const currentPriorityReasons = JSON.parse(localStorage.getItem('inventory_priority_reasons') || '{}')[type] || [];
      const defaultReason = isQuantityChange 
        ? `Điều chỉnh số lượng tồn kho từ ${beforeQuantity} thành ${afterQuantity}`
        : '';
      
      const initialReason = currentPriorityReasons.length > 0 ? currentPriorityReasons[0] : defaultReason;
      
      const transaction = {
        field: isQuantityChange ? 'quantityInStock' : 'other',
        type: type,
        reason: initialReason,
        costPriceConfig: getCostPriceConfig(isQuantityChange ? 'quantityInStock' : 'other', type)
      };
      
      // Add before/after values for quantity changes
      if (isQuantityChange) {
        transaction.beforeValue = beforeQuantity;
        transaction.afterValue = afterQuantity;
      }
      
      setTransactions([transaction]);
      
      setTransactionType(type);
      setReason(initialReason);
    }
  }, [changedFields, prefilledType, quantityDiff, isQuantityChange, costPrice, otherChanges, changedFieldsInfo]);

  // Get default reason template for a specific field
  const getDefaultReasonForField = (field, type) => {
    const fieldDisplayName = getFieldDisplayName(field);
    
    // Try to find before/after values from fieldInfo
    const fieldInfo = changedFieldsInfo?.find(info => info.field === field);
    const beforeValue = fieldInfo?.beforeValue;
    const afterValue = fieldInfo?.afterValue;
    
    // Format the change display with correct formatting based on field type
    const getChangeDescription = (field, before, after) => {
      if (before === undefined || after === undefined) return '';
      
      const diff = field === 'quantityInStock' ? after - before : null;
      let diffDisplay = '';
      
      if (diff !== null) {
        if (diff > 0) diffDisplay = ` (+${diff})`;
        else if (diff < 0) diffDisplay = ` (${diff})`;
      }
      
      // Format based on field type
      if (field === 'price' || field === 'discountPrice' || field === 'costPrice') {
        return `: ${before.toLocaleString('vi-VN')} → ${after.toLocaleString('vi-VN')}${diffDisplay}`;
      } else {
        return `: ${before} → ${after}${diffDisplay}`;
      }
    };
    
    // Build the reason based on field type
    switch (field) {
      case 'volume':
        return `Thay đổi dung tích${getChangeDescription(field, beforeValue, afterValue)}`;
      case 'price':
        return `Thay đổi giá gốc${getChangeDescription(field, beforeValue, afterValue)}`;
      case 'discountPrice':
        if (type === 'adjust' && afterValue === 0) {
          return `Hủy giá ưu đãi sản phẩm`;
        }
        return `Thay đổi giá ưu đãi${getChangeDescription(field, beforeValue, afterValue)}`;
      case 'quantityInStock': 
        const diff = afterValue - beforeValue;
        if (diff > 0) {
          return `Tăng số lượng tồn kho${getChangeDescription(field, beforeValue, afterValue)}`;
        } else if (diff < 0) {
          return `Giảm số lượng tồn kho${getChangeDescription(field, beforeValue, afterValue)}`;
        }
        return `Cập nhật số lượng tồn kho${getChangeDescription(field, beforeValue, afterValue)}`;
      case 'reorderLevel':
        return `Thay đổi mức cảnh báo${getChangeDescription(field, beforeValue, afterValue)}`;
      default:
        return `Cập nhật ${fieldDisplayName}${getChangeDescription(field, beforeValue, afterValue)}`;
    }
  };

  const getFieldDisplayName = (field) => {
    switch(field) {
      case 'volume': return 'dung tích';
      case 'price': return 'giá gốc';
      case 'discountPrice': return 'giá ưu đãi';
      case 'quantityInStock': return 'số lượng tồn kho';
      case 'reorderLevel': return 'mức cảnh báo';
      case 'costPrice': return 'giá nhập';
      default: return field;
    }
  };

  // Initialize default reasons based on transaction types and context
  useEffect(() => {
    // First try to load from localStorage
    const savedReasons = JSON.parse(localStorage.getItem('inventory_default_reasons') || '{}');
    const savedPriorityReasons = JSON.parse(localStorage.getItem('inventory_priority_reasons') || '{}');
    
    // If not found in localStorage, use these defaults
    const defaultReasonsList = {
      'adjust': [
        'Điều chỉnh hàng tồn kho sau kiểm kê',
        'Cập nhật dữ liệu tồn kho',
        'Chỉnh sửa số liệu do nhập sai',
        'Điều chỉnh do sai lệch thực tế'
      ],
      'import': [
        'Nhập thêm hàng từ nhà cung cấp',
        'Bổ sung sản phẩm vào kho',
        'Nhận thêm hàng để đáp ứng nhu cầu',
        'Hoàn trả từ khách hàng'
      ],
      'export': [
        'Xuất hàng cho đối tác',
        'Tặng mẫu thử nghiệm',
        'Loại bỏ sản phẩm lỗi/hết hạn',
        'Chuyển kho'
      ],
      'sell': [
        'Bán trực tiếp tại cửa hàng',
        'Đã bán nhưng chưa cập nhật vào hệ thống',
        'Điều chỉnh sau đơn hàng offline',
        'Bán cho khách hàng VIP'
      ],
      'delete': [
        'Xóa phiên bản sản phẩm',
        'Sản phẩm không còn kinh doanh',
        'Sản phẩm đã ngừng sản xuất',
        'Hợp nhất phiên bản sản phẩm'
      ]
    };
    
    // Merge saved reasons with defaults, prioritizing saved ones
    const mergedReasons = {};
    Object.keys(defaultReasonsList).forEach(type => {
      mergedReasons[type] = [...(savedReasons[type] || []), ...defaultReasonsList[type]];
      // Remove duplicates
      mergedReasons[type] = [...new Set(mergedReasons[type])];
    });
    
    setDefaultReasons(mergedReasons);
    setPriorityReasons(savedPriorityReasons);
  }, []);

  // Update current transaction details when changing page
  useEffect(() => {
    if (transactions.length > currentPage) {
      const currentTransaction = transactions[currentPage];
      setTransactionType(currentTransaction.type || 'adjust');
      setReason(currentTransaction.reason || '');
      
      // Update cost price settings
      setShowCostPrice(currentTransaction.costPriceConfig?.show || false);
      setCostPriceLabel(currentTransaction.costPriceConfig?.label || 'Giá nhập (tùy chọn)');
      setTransactionCostPrice(currentTransaction.costPriceConfig?.defaultValue || '');
      
      // Update filtered suggestions based on current transaction type
      if (currentTransaction.type) {
        setFilteredSuggestions(defaultReasons[currentTransaction.type] || []);
      }
    }
  }, [currentPage, transactions, defaultReasons]);

  const handleReasonChange = (e) => {
    const value = e.target.value;
    setReason(value);
    
    // Update current transaction
    const updatedTransactions = [...transactions];
    if (updatedTransactions[currentPage]) {
      updatedTransactions[currentPage].reason = value;
      setTransactions(updatedTransactions);
    }
    
    // Filter suggestions based on input
    if (value.trim() !== '') {
      const filtered = (defaultReasons[transactionType] || []).filter(
        suggestion => suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions(defaultReasons[transactionType] || []);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setReason(suggestion);
    
    // Update current transaction
    const updatedTransactions = [...transactions];
    if (updatedTransactions[currentPage]) {
      updatedTransactions[currentPage].reason = suggestion;
      setTransactions(updatedTransactions);
    }
    
    setShowSuggestions(false);
  };

  const handleCostPriceChange = (e) => {
    const value = e.target.value;
    setTransactionCostPrice(value);
    
    // Save the last used price to localStorage for future auto-fill
    if (value) {
      localStorage.setItem('last_used_price', value);
    }
    
    // Update current transaction
    const updatedTransactions = [...transactions];
    if (updatedTransactions[currentPage] && updatedTransactions[currentPage].costPriceConfig) {
      updatedTransactions[currentPage].costPriceConfig.defaultValue = value;
      setTransactions(updatedTransactions);
    }
  };

  const handleConfirm = async () => {
    if (transactions.length === 0) {
      toast.error('Không có thay đổi để ghi nhận');
      return;
    }
    
    // Validate all fields before proceeding
    setIsValidating(true);
    const errors = [];
    
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      
      if (!transaction.reason || transaction.reason.trim() === '') {
        errors.push({
          index: i,
          field: 'reason',
          message: `Vui lòng nhập lý do cho thay đổi ${i + 1} (${getFieldDisplayName(transaction.field)})`
        });
      }
      
      // Additional validations can be added here if needed
    }
    
    // If there are errors, update state and stop submission
    if (errors.length > 0) {
      setTransactionErrors(errors);
      // Navigate to the first page with an error
      const firstErrorPage = errors[0].index;
      setCurrentPage(firstErrorPage);
      toast.error(errors[0].message);
      setIsValidating(false);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare all transactions first
      const transactionPayloads = transactions.map(transaction => {
        // Ensure all fields have proper types
        const transactionData = {
          productVariantId: parseInt(productVariantId),
          transactionType: transaction.type,
          reason: transaction.reason || '',
          note: note || '',
          field: transaction.field || 'other' // Ensure field is always provided
          // Let backend handle the transaction date
        };
        
        // Ensure quantity is a positive number (API requirement)
        const calculatedQuantity = transaction.field === 'quantityInStock' ? Math.abs(parseInt(quantityDiff) || 0) : 0;
        transactionData.quantity = calculatedQuantity > 0 ? calculatedQuantity : 1; // Default to 1 if not positive
        
        // Add before/after values for proper tracking
        if (transaction.field === 'quantityInStock') {
          // Use transaction's values if available, otherwise use component props
          transactionData.beforeValue = transaction.beforeValue !== undefined ? parseInt(transaction.beforeValue) : parseInt(beforeQuantity);
          transactionData.afterValue = transaction.afterValue !== undefined ? parseInt(transaction.afterValue) : parseInt(afterQuantity);
        } else if (transaction.field === 'price' || transaction.field === 'discountPrice') {
          // For price fields, use float values
          if (transaction.beforeValue !== undefined) transactionData.beforeValue = parseFloat(transaction.beforeValue);
          if (transaction.afterValue !== undefined) transactionData.afterValue = parseFloat(transaction.afterValue);
        } else if (transaction.field === 'volume' || transaction.field === 'reorderLevel') {
          // For numeric fields, use integer values
          if (transaction.beforeValue !== undefined) transactionData.beforeValue = parseInt(transaction.beforeValue);
          if (transaction.afterValue !== undefined) transactionData.afterValue = parseInt(transaction.afterValue);
        }
        
        // Add cost price if provided and relevant for this transaction
        if (transaction.costPriceConfig?.show && transaction.costPriceConfig.defaultValue) {
          const costPriceValue = parseFloat(transaction.costPriceConfig.defaultValue);
          if (!isNaN(costPriceValue) && costPriceValue > 0) {
            transactionData.costPrice = costPriceValue;
          }
        }
        
        return transactionData;
      });
      
      // Log what we're about to send
      console.log(`Sending ${transactionPayloads.length} transactions:`, transactionPayloads);
      
      // Using a transaction-like approach: either all succeed or none
      try {
        // Create all transactions
        const results = await Promise.all(transactionPayloads.map(payload => onConfirm(payload)));
        
        toast.success(`Đã ghi nhận ${results.length} thay đổi vào lịch sử`);
        onClose();
      } catch (error) {
        // If any transaction fails, we consider the whole operation failed
        console.error('Error in transaction batch:', error);
        toast.error('Không thể ghi nhận các thay đổi. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      toast.error('Có lỗi xảy ra khi ghi nhận giao dịch');
    } finally {
      setIsSubmitting(false);
      setIsValidating(false);
    }
  };

  const handleClearReason = () => {
    setReason('');
    
    // Update current transaction
    const updatedTransactions = [...transactions];
    if (updatedTransactions[currentPage]) {
      updatedTransactions[currentPage].reason = '';
      setTransactions(updatedTransactions);
    }
    
    reasonInputRef.current?.focus();
  };

  const handleAddCustomReason = () => {
    if (reason && transactionType && !defaultReasons[transactionType]?.includes(reason)) {
      const updatedReasons = {...defaultReasons};
      updatedReasons[transactionType] = [reason, ...(updatedReasons[transactionType] || [])];
      
      setDefaultReasons(updatedReasons);
      
      // Save to localStorage
      localStorage.setItem('inventory_default_reasons', JSON.stringify(updatedReasons));
      
      toast.success('Đã thêm lý do vào danh sách gợi ý');
    }
  };
  
  const handleTogglePriorityReason = (reasonText) => {
    const updatedPriorities = {...priorityReasons};
    
    if (!updatedPriorities[transactionType]) {
      updatedPriorities[transactionType] = [];
    }
    
    if (updatedPriorities[transactionType].includes(reasonText)) {
      // Remove from priority list
      updatedPriorities[transactionType] = updatedPriorities[transactionType].filter(r => r !== reasonText);
      toast.success('Đã bỏ đánh dấu lý do ưu tiên');
    } else {
      // Add to priority list
      updatedPriorities[transactionType].push(reasonText);
      toast.success('Đã đánh dấu lý do ưu tiên');
    }
    
    setPriorityReasons(updatedPriorities);
    localStorage.setItem('inventory_priority_reasons', JSON.stringify(updatedPriorities));
  };
  
  const handleRemoveCustomReason = (reasonToRemove) => {
    // Don't remove default reasons
    const defaultReasonsList = {
      'adjust': [
        'Điều chỉnh hàng tồn kho sau kiểm kê',
        'Cập nhật dữ liệu tồn kho',
        'Chỉnh sửa số liệu do nhập sai',
        'Điều chỉnh do sai lệch thực tế'
      ],
      'import': [
        'Nhập thêm hàng từ nhà cung cấp',
        'Bổ sung sản phẩm vào kho',
        'Nhận thêm hàng để đáp ứng nhu cầu',
        'Hoàn trả từ khách hàng'
      ],
      'export': [
        'Xuất hàng cho đối tác',
        'Tặng mẫu thử nghiệm',
        'Loại bỏ sản phẩm lỗi/hết hạn',
        'Chuyển kho'
      ],
      'sell': [
        'Bán trực tiếp tại cửa hàng',
        'Đã bán nhưng chưa cập nhật vào hệ thống',
        'Điều chỉnh sau đơn hàng offline',
        'Bán cho khách hàng VIP'
      ],
      'delete': [
        'Xóa phiên bản sản phẩm',
        'Sản phẩm không còn kinh doanh',
        'Sản phẩm đã ngừng sản xuất',
        'Hợp nhất phiên bản sản phẩm'
      ]
    };
    
    // Check if reason is in the default list
    if (Object.values(defaultReasonsList).some(list => list.includes(reasonToRemove))) {
      toast.error('Không thể xóa lý do mặc định');
      return;
    }
    
    const updatedReasons = {...defaultReasons};
    
    // Find the type that contains this reason
    for (const type in updatedReasons) {
      if (updatedReasons[type].includes(reasonToRemove)) {
        updatedReasons[type] = updatedReasons[type].filter(r => r !== reasonToRemove);
      }
    }
    
    setDefaultReasons(updatedReasons);
    
    // Also remove from priority reasons if it exists there
    const updatedPriorities = {...priorityReasons};
    for (const type in updatedPriorities) {
      if (updatedPriorities[type]?.includes(reasonToRemove)) {
        updatedPriorities[type] = updatedPriorities[type].filter(r => r !== reasonToRemove);
      }
    }
    setPriorityReasons(updatedPriorities);
    
    // Save to localStorage
    localStorage.setItem('inventory_default_reasons', JSON.stringify(updatedReasons));
    localStorage.setItem('inventory_priority_reasons', JSON.stringify(updatedPriorities));
    
    toast.success('Đã xóa lý do khỏi danh sách gợi ý');
  };

  // Order suggestions with priority reasons first
  const getSortedSuggestions = () => {
    const currentPriorityReasons = priorityReasons[transactionType] || [];
    const allReasons = filteredSuggestions || [];
    
    // Sort reasons - priority ones first, then the rest
    return [
      ...allReasons.filter(r => currentPriorityReasons.includes(r)),
      ...allReasons.filter(r => !currentPriorityReasons.includes(r))
    ];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Ghi nhận lịch sử thay đổi
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1" style={{ minHeight: '50vh', maxHeight: '60vh' }}>
          {transactions.length > 1 && (
            <div className="mb-4 bg-blue-50 p-3 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-blue-700">Trạng thái xác nhận</h3>
              </div>
              <div className="flex items-center justify-center gap-2 my-2">
                {transactions.map((transaction, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={`relative flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                      idx === currentPage 
                        ? 'bg-blue-600 text-white' 
                        : transaction.reason && transaction.reason.trim() !== ''
                          ? 'bg-green-500 text-white hover:bg-green-600' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    title={`${getFieldDisplayName(transaction.field || 'other')}`}
                  >
                    {idx + 1}
                    {transactionErrors.some(err => err.index === idx) && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className={`flex items-center p-1 text-xs rounded ${currentPage === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'}`}
                >
                  <ChevronLeft size={14} />
                  <span className="ml-1">Trước</span>
                </button>
                <div className="text-sm font-medium text-gray-700">
                  {getFieldDisplayName(transactions[currentPage]?.field || 'other')}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(transactions.length - 1, prev + 1))}
                  disabled={currentPage === transactions.length - 1}
                  className={`flex items-center p-1 text-xs rounded ${currentPage === transactions.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'}`}
                >
                  <span className="mr-1">Tiếp</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">
              Sản phẩm: <span className="font-medium text-gray-700">{productName} ({volume}ml)</span>
            </p>
            
            {/* For quantity changes, show the before/after information */}
            {isQuantityChange && transactions[currentPage]?.field === 'quantityInStock' && (
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="text-gray-500">Thay đổi số lượng:</span>
                <span className={`font-medium ${quantityDiff > 0 ? 'text-green-600' : quantityDiff < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                  {beforeQuantity} → {afterQuantity} ({quantityDiff > 0 ? `+${quantityDiff}` : quantityDiff})
                </span>
              </div>
            )}
            
            {/* For other fields, show the before/after information if available */}
            {transactions[currentPage]?.field && 
             transactions[currentPage]?.field !== 'quantityInStock' && 
             transactions[currentPage]?.beforeValue !== undefined && 
             transactions[currentPage]?.afterValue !== undefined && (
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="text-gray-500">Thay đổi {getFieldDisplayName(transactions[currentPage].field)}:</span>
                <span className="font-medium text-gray-700">
                  {transactions[currentPage].field === 'price' || transactions[currentPage].field === 'discountPrice' 
                    ? `${Number(transactions[currentPage].beforeValue).toLocaleString('vi-VN')} → ${Number(transactions[currentPage].afterValue).toLocaleString('vi-VN')} (${
                        transactions[currentPage].afterValue > transactions[currentPage].beforeValue 
                          ? `+${Number(transactions[currentPage].afterValue - transactions[currentPage].beforeValue).toLocaleString('vi-VN')}` 
                          : Number(transactions[currentPage].afterValue - transactions[currentPage].beforeValue).toLocaleString('vi-VN')
                      })`
                    : `${transactions[currentPage].beforeValue} → ${transactions[currentPage].afterValue} (${
                        transactions[currentPage].afterValue > transactions[currentPage].beforeValue 
                          ? `+${transactions[currentPage].afterValue - transactions[currentPage].beforeValue}` 
                          : transactions[currentPage].afterValue - transactions[currentPage].beforeValue
                      })`
                  }
                </span>
              </div>
            )}
            
            {transactions.length > 1 && (
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="text-gray-500">Đang ghi nhận:</span>
                <span className="font-medium text-blue-700">
                  Thay đổi {getFieldDisplayName(transactions[currentPage]?.field || 'other')}
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại giao dịch</label>
              <select
                value={transactionType}
                onChange={(e) => {
                  setTransactionType(e.target.value);
                  
                  // Update current transaction
                  const updatedTransactions = [...transactions];
                  if (updatedTransactions[currentPage]) {
                    updatedTransactions[currentPage].type = e.target.value;
                    
                    // Update cost price config for the new transaction type
                    updatedTransactions[currentPage].costPriceConfig = getCostPriceConfig(
                      updatedTransactions[currentPage].field,
                      e.target.value
                    );
                    
                    setTransactions(updatedTransactions);
                    
                    // Update cost price visibility and label
                    setShowCostPrice(updatedTransactions[currentPage].costPriceConfig.show);
                    setCostPriceLabel(updatedTransactions[currentPage].costPriceConfig.label);
                  }
                  
                  // Clear any errors for this page
                  setTransactionErrors(prev => prev.filter(err => err.index !== currentPage));
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={transactions.length > 1 && transactions[currentPage]?.field === 'quantityInStock'}
              >
                {allowedTypes.includes('adjust') && (
                  <option value="adjust">Điều chỉnh (Adjust)</option>
                )}
                {allowedTypes.includes('import') && (
                  <option value="import">Nhập kho (Import)</option>
                )}
                {allowedTypes.includes('export') && (
                  <option value="export">Xuất kho (Export)</option>
                )}
                {allowedTypes.includes('sell') && (
                  <option value="sell">Bán hàng (Sell)</option>
                )}
                {allowedTypes.includes('delete') && (
                  <option value="delete">Xóa (Delete)</option>
                )}
              </select>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lí do
                {transactionErrors.some(err => err.index === currentPage && err.field === 'reason') && (
                  <span className="ml-2 text-red-500 text-xs">* Bắt buộc</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={reason}
                  onChange={handleReasonChange}
                  placeholder="Nhập lí do giao dịch..."
                  className={`w-full p-2 pr-8 border ${
                    transactionErrors.some(err => err.index === currentPage && err.field === 'reason')
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  } rounded-md focus:outline-none focus:ring-2`}
                  ref={reasonInputRef}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {reason && (
                  <button
                    onClick={handleClearReason}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              {showSuggestions && getSortedSuggestions().length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {getSortedSuggestions().map((suggestion, index) => {
                    const isPriority = (priorityReasons[transactionType] || []).includes(suggestion);
                    
                    return (
                      <div key={index} className="group relative">
                        <div
                          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center ${isPriority ? 'bg-yellow-50' : ''}`}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {isPriority && (
                            <Star size={14} className="text-yellow-500 mr-1.5 flex-shrink-0" />
                          )}
                          <span className="flex-1 mr-2">{suggestion}</span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTogglePriorityReason(suggestion);
                              }}
                              className={`text-gray-400 hover:${isPriority ? 'text-gray-600' : 'text-yellow-500'} mr-2`}
                              title={isPriority ? "Bỏ đánh dấu ưu tiên" : "Đánh dấu ưu tiên"}
                            >
                              <Star size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveCustomReason(suggestion);
                              }}
                              className="text-gray-400 hover:text-red-500"
                              title="Xóa lý do này"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {reason && !defaultReasons[transactionType]?.includes(reason) && (
                <div className="mt-1 flex justify-end">
                  <button
                    onClick={handleAddCustomReason}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Lưu lý do này cho lần sau
                  </button>
                </div>
              )}
            </div>
            
            {showCostPrice && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <DollarSign size={16} className="mr-1" />
                    {costPriceLabel}
                  </div>
                </label>
                <input
                  type="number"
                  value={transactionCostPrice}
                  onChange={handleCostPriceChange}
                  placeholder="Nhập giá nếu có..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1000"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (tùy chọn)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập ghi chú bổ sung nếu cần..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
          {transactions.length > 1 && (
            <div className="flex items-center text-sm text-gray-500">
              Bước {currentPage + 1} / {transactions.length}
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } flex items-center`}
            >
              {isSubmitting ? (
                <>
                  <Loader size={18} className="animate-spin mr-2" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircle size={18} className="mr-2" />
                  Xác nhận
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTransactionModal; 