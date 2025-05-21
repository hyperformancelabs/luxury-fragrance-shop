import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit, Trash2, Filter, ChevronDown, ChevronUp, MoreHorizontal, Upload, Download, XCircle, Check, X, FileEdit, Layers, PlusCircle, ChevronLeft, ChevronRight, Clock, List, Settings, DollarSign } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import AutocompleteInput from '../components/AutocompleteInput';
import BrandFormModal from '../components/BrandFormModal';
import ProductFormModal from '../components/ProductFormModal';
import ProductVariantFormModal from '../components/ProductVariantFormModal';
import DeleteVariantConfirmDialog from '../components/DeleteVariantConfirmDialog';
import InventoryTransactionLog from '../components/InventoryTransactionLog';
import InventoryTransactionModal from '../Components/InventoryTransactionModal';
import inventoryTransactionService from '../services/inventoryTransactionService';
import InventoryTransactionSettings from '../Components/InventoryTransactionSettings';
import productService from '../services/productService';

// Service cho brand
const brandService = {
  getAllBrands: async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/emp/brands');
      return response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  }
};

// Helper function to determine stock status based on reorder level
const getStockStatus = (quantity, reorderLevel) => {
  // Convert inputs to numbers to ensure proper comparison
  const qtyNum = Number(quantity);
  const reorderNum = Number(reorderLevel);
  
  // When quantity equals reorder level (including when both are zero), show yellow
  if (qtyNum === reorderNum) {
    return 'at-warning'; // At warning level - yellow color
  } else if (qtyNum < reorderNum) {
    return 'below-warning'; // Below warning level - red color
  } else {
    return 'in-stock'; // Sufficient stock - green color
  }
};

// Components con
const StatusBadge = ({ status, reorderLevel }) => {
  const getStatusColor = () => {
    // Always use the consistent getStockStatus logic
    const stockStatus = getStockStatus(status, reorderLevel !== undefined ? reorderLevel : 0);
    
    switch (stockStatus) {
      case 'below-warning':
        return { text: 'text-red-600', weight: 'font-medium' }; // Red - below reorder level
      case 'at-warning':
        return { text: 'text-yellow-600', weight: 'font-medium' }; // Yellow - at reorder level
      case 'in-stock':
        return { text: 'text-green-600', weight: 'font-medium' }; // Green - above reorder level
      default:
        return { text: 'text-gray-600', weight: 'font-normal' };
    }
  };
  
  const { text, weight } = getStatusColor();
  
  return (
    <span className={`${text} ${weight}`}>
      {status}
    </span>
  );
};

// Component chính
const Products = () => {
  // State cho dữ liệu sản phẩm
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  // State cho sắp xếp và lọc
  const [sortField, setSortField] = useState('productId');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State cho brands
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  
  // State cho modal và các thao tác
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  
  // State hiện thị chi tiết variant và detail
  const [productVariants, setProductVariants] = useState([]);
  const [productDetails, setProductDetails] = useState({ details: {} });
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // State cho quản lý variant
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [showDeleteVariantConfirm, setShowDeleteVariantConfirm] = useState(false);
  const [variantToEdit, setVariantToEdit] = useState(null);
  const [variantToDelete, setVariantToDelete] = useState(null);
  const [variantFormData, setVariantFormData] = useState({
    volume: '',
    price: '',
    discountPrice: '',
    quantityInStock: '',
    reorderLevel: '0' // Default reorder level set to 0
  });
  
  // State cho form tạo/sửa sản phẩm
  const [formData, setFormData] = useState({
    productName: '',
    brandId: '',
    description: '',
    imageUrl: ''
  });
  
  // Tính toán thống kê
  const [statsData, setStatsData] = useState({
    totalProducts: 0,
    totalInventory: 0,
    inStockProducts: 0,
    lowStockProducts: 0,
    discountedProducts: 0
  });
  
  // Add state for bulk delete confirmation
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  
  // Add state for selected variants and inline editing
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [editingVariant, setEditingVariant] = useState(null);
  const [editFormData, setEditFormData] = useState({
    volume: '',
    price: '',
    discountPrice: '',
    quantityInStock: '',
    reorderLevel: ''
  });
  
  // Thêm refs để theo dõi các ô input đang được chỉnh sửa
  const volumeInputRef = useRef(null);
  const priceInputRef = useRef(null);
  const discountPriceInputRef = useRef(null);
  const quantityInputRef = useRef(null);
  const reorderLevelInputRef = useRef(null);
  
  // Thêm state để theo dõi ô input đang được focus
  const [focusedField, setFocusedField] = useState(null);
  
  // State cho hiển thị lịch sử giao dịch tồn kho
  const [showTransactionLog, setShowTransactionLog] = useState(false);
  const [transactionLogVariantId, setTransactionLogVariantId] = useState(null);
  
  // Add new state variables for inventory transaction modal
  const [showInventoryTransactionModal, setShowInventoryTransactionModal] = useState(false);
  const [pendingVariantUpdate, setPendingVariantUpdate] = useState(null);
  const [transactionContext, setTransactionContext] = useState({
    productName: '',
    volume: '',
    beforeQuantity: 0,
    afterQuantity: 0,
    allowedTypes: ['adjust'],
    otherChanges: false
  });
  
  // Add new state variable for inventory transaction settings modal
  const [showInventoryTransactionSettings, setShowInventoryTransactionSettings] = useState(false);
  
  // Add state to track changed fields for transaction logging
  const [changedFields, setChangedFields] = useState([]);
  
  // Add state for variant filters
  const [variantFilters, setVariantFilters] = useState({
    inStock: false,
    integerVolume: false,
    decimalVolume: false,
    needsRestock: false,
    discounted: false
  });
  
  // Add state for product filters
  const [productFilters, setProductFilters] = useState({
    inStock: false,
    discounted: false,
    minPrice: '',
    maxPrice: '',
    volume: ''
  });
  
  // Function to filter variants based on selected filters
  const getFilteredVariants = () => {
    if (!productVariants) return [];
    
    return productVariants.filter(variant => {
      // If no filters are active, show all variants
      if (!Object.values(variantFilters).some(value => value)) {
        return true;
      }
      
      let passesFilter = false;
      
      if (variantFilters.inStock && variant.quantityInStock > 0) {
        passesFilter = true;
      }
      
      if (variantFilters.integerVolume && Number.isInteger(variant.volume)) {
        passesFilter = true;
      }
      
      if (variantFilters.decimalVolume && !Number.isInteger(variant.volume)) {
        passesFilter = true;
      }
      
      if (variantFilters.needsRestock && 
          variant.reorderLevel !== null && 
          variant.quantityInStock <= variant.reorderLevel) {
        passesFilter = true;
      }
      
      if (variantFilters.discounted && 
          variant.discountPrice && 
          variant.discountPrice < variant.price) {
        passesFilter = true;
      }
      
      return passesFilter;
    });
  };
  
  // Toggle filter function
  const toggleFilter = (filterName) => {
    setVariantFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };
  
  // Thêm useEffect để giữ focus sau khi render
  useEffect(() => {
    // Sử dụng setTimeout để đảm bảo focus được áp dụng sau khi render
    if (editingVariant && focusedField) {
      setTimeout(() => {
        switch (focusedField) {
          case 'volume':
            volumeInputRef.current?.focus();
            break;
          case 'price':
            priceInputRef.current?.focus();
            break;
          case 'discountPrice':
            discountPriceInputRef.current?.focus();
            break;
          case 'quantityInStock':
            quantityInputRef.current?.focus();
            break;
          case 'reorderLevel':
            reorderLevelInputRef.current?.focus();
            break;
          default:
            break;
        }
      }, 0);
    }
  }, [editFormData, editingVariant, focusedField]);
  
  // Cập nhật hàm handleInlineEditChange để theo dõi field đang được focus
  const handleInlineEditChange = (e) => {
    const { name, value } = e.target;
    setFocusedField(name);
    
    // Save price to localStorage when it changes
    if (name === 'price' && value) {
      localStorage.setItem('last_used_price', value);
    }
    
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  
  // Các hàm xử lý thao tác
  const resetFormData = () => {
    setFormData({
      productName: '',
      brandId: '',
      description: '',
      imageUrl: ''
    });
  };
  
  // Fetch dữ liệu sản phẩm
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const filters = {};
      
      // Add search term filter if it exists
      if (searchTerm) filters.productName = searchTerm;
      
      // Add product filters
      if (productFilters.inStock) filters.inStock = true;
      if (productFilters.discounted) filters.discounted = true;
      if (productFilters.minPrice) filters.minPrice = parseInt(productFilters.minPrice);
      if (productFilters.maxPrice) filters.maxPrice = parseInt(productFilters.maxPrice);
      if (productFilters.volume) filters.volume = parseInt(productFilters.volume);
      
      const response = await productService.getAllProducts(
        page, 
        pageSize, 
        sortField, 
        sortDirection, 
        filters
      );
      
      if (response && response.status === 'success' && response.data) {
        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalItems(response.data.totalItems || 0);
        setError(null);
    } else {
        setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
      }
    } catch (err) {
      setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
      toast.error('Lỗi khi tải dữ liệu sản phẩm');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch danh sách thương hiệu
  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      const response = await brandService.getAllBrands();
      if (response && response.data) {
        setBrands(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
    } finally {
      setLoadingBrands(false);
    }
  };
  
  // Fetch variants của sản phẩm
  const fetchProductVariants = async (productId) => {
    setLoadingDetails(true);
    try {
      const response = await productService.getProductVariants(productId);
      if (response && response.data) {
        setProductVariants(response.data.variants || []);
      }
    } catch (err) {
      console.error(`Error fetching variants for product ${productId}:`, err);
      toast.error('Không thể tải thông tin phiên bản sản phẩm');
    } finally {
      setLoadingDetails(false);
    }
  };
  
  // Fetch details của sản phẩm
  const fetchProductDetails = async (productId) => {
    setLoadingDetails(true);
    try {
      const response = await productService.getProductDetails(productId);
      if (response && response.data) {
        setProductDetails(response.data || { details: {} });
      }
    } catch (err) {
      console.error(`Error fetching details for product ${productId}:`, err);
    } finally {
      setLoadingDetails(false);
    }
  };
  
  // Load data khi component mount hoặc các dependency thay đổi
  useEffect(() => {
    fetchProducts();
  }, [page, pageSize, sortField, sortDirection]);
  
  // Debounce search để không gọi API liên tục khi người dùng nhập
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(0); // Reset về trang đầu khi search thay đổi
      
      // Apply all filters together with the search term
      applyProductFilters({
        ...productFilters,
        searchTerm 
      });
    }, 300); // Debounce với 300ms delay
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);
  
  useEffect(() => {
    fetchBrands();
  }, []);
  
  // Handle sắp xếp
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Icon sắp xếp
  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? 
      <ChevronUp size={16} className="ml-1" /> : 
      <ChevronDown size={16} className="ml-1" />;
  };

  // Handle select/deselect sản phẩm
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p.productId));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(p => p !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  // Handlers cho các thao tác CRUD
  const handleAddProduct = () => {
    resetFormData();
    setProductToEdit(null);
    setShowProductForm(true);
  };
  
  const handleEditProduct = (product) => {
    setFormData({
      productName: product.productName,
      brandId: product.brandId.toString(),
      description: product.description || '',
      imageUrl: product.imageUrl || ''
    });
    setProductToEdit(product);
    setShowProductForm(true);
  };
  
  const handleViewVariants = (product) => {
    setSelectedProduct(product);
    fetchProductVariants(product.productId);
    setShowVariantModal(true);
  };
  
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    fetchProductDetails(product.productId);
    setShowDetailModal(true);
  };
  
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };
  
  const handleDeleteSelected = () => {
    if (selectedProducts.length > 0) {
      setShowBulkDeleteConfirm(true);
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCloseForm = () => {
    setShowProductForm(false);
    resetFormData();
    setProductToEdit(null);
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!formData.productName || formData.productName.trim() === '') {
        toast.error('Tên sản phẩm không được để trống');
        return;
      }
      
      if (!formData.brandId) {
        toast.error('Vui lòng chọn thương hiệu');
        return;
      }
      
      // Prepare clean data for submission
      const cleanData = {
        ...formData,
        productName: formData.productName.trim(),
        description: formData.description ? formData.description.trim() : '',
        imageUrl: formData.imageUrl ? formData.imageUrl.trim() : '',
        brandId: parseInt(formData.brandId)
      };
      
      if (productToEdit) {
        // Update sản phẩm
        const response = await productService.updateProduct(productToEdit.productId, cleanData);
        if (response && response.status === 'success') {
          toast.success('Cập nhật sản phẩm thành công');
          fetchProducts();
          handleCloseForm();
        } else {
          toast.error(response?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
        }
      } else {
        // Tạo sản phẩm mới
        const response = await productService.createProduct(cleanData);
        if (response && response.status === 'success') {
          toast.success('Thêm sản phẩm thành công');
          fetchProducts();
          handleCloseForm();
        } else {
          toast.error(response?.message || 'Có lỗi xảy ra khi thêm sản phẩm');
        }
      }
    } catch (err) {
      console.error('Lỗi khi thao tác với sản phẩm:', err);
      
      let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại sau.';
      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || 
                      err.response.data.error || 
                      'Lỗi từ máy chủ: ' + (err.response.status || '');
      }
      
      toast.error(errorMessage);
    }
  };
  
  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const response = await productService.deleteProduct(productToDelete.productId);
      if (response) {
        toast.success('Xóa sản phẩm thành công');
        fetchProducts();
        setShowDeleteConfirm(false);
        setProductToDelete(null);
      }
    } catch (err) {
      // Lỗi đã được xử lý trong productService.deleteProduct
      // và được truyền lên với message rõ ràng hơn
      const errorMessage = err.message || 'Có lỗi xảy ra khi xóa sản phẩm';
      toast.error(errorMessage);
      console.error('Error deleting product with ID', productToDelete.productId, ':', err);
      
      // Giữ dialog mở nếu lỗi liên quan đến đơn hàng
      if (errorMessage.includes('đơn hàng')) {
        // Không đóng dialog xóa nếu lỗi liên quan đến đơn hàng
      } else {
        setShowDeleteConfirm(false);
      }
    }
  };
  
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(0); // Reset về trang đầu khi search
      // fetchProducts sẽ được gọi qua useEffect
    }
  };
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  // Format hiển thị giá
  const formatPrice = (price) => {
    if (!price) return '0';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  
  // Kiểm tra 2 số có bằng nhau không (tính đến sai số)
  const isEqualPrice = (price1, price2) => {
    if (!price1 || !price2) return false;
    return Math.abs(parseFloat(price1) - parseFloat(price2)) < 0.01;
  };
  
  // Hiển thị giá sản phẩm
  const renderPrice = (product) => {
    // Nếu không có giá khuyến mãi
    if (!product.minDiscountPrice && !product.maxDiscountPrice) {
      // Trường hợp chỉ có 1 mức giá
      if (product.minPrice === product.maxPrice) {
        return (
          <div className="font-medium text-gray-900">{formatPrice(product.minPrice)}</div>
        );
      }
      // Trường hợp có nhiều mức giá
      return (
        <div className="font-medium text-gray-900">
          {formatPrice(product.minPrice)} - {formatPrice(product.maxPrice)}
        </div>
      );
    }
    
    // Trường hợp có giá khuyến mãi
    // Nếu chỉ có 1 mức giá
    if (product.minPrice === product.maxPrice) {
      // Nếu giá gốc = giá khuyến mãi thì không hiển thị "(=)"
      if (isEqualPrice(product.minPrice, product.minDiscountPrice)) {
        return (
          <div className="font-medium text-gray-900">{formatPrice(product.minPrice)}</div>
        );
      }
      // Nếu giá khuyến mãi khác giá gốc
      return (
        <div>
          <div className="font-medium">
            <span className="line-through text-gray-400">{formatPrice(product.minPrice)}</span>
          </div>
          <div className="text-green-600">
            {formatPrice(product.minDiscountPrice)}
          </div>
        </div>
      );
    }
    
    // Nếu có nhiều mức giá
    if (isEqualPrice(product.minPrice, product.minDiscountPrice) && isEqualPrice(product.maxPrice, product.maxDiscountPrice)) {
      // Nếu giá khuyến mãi bằng giá gốc ở cả 2 đầu khoảng giá
      return (
        <div className="font-medium text-gray-900">
          {formatPrice(product.minPrice)} - {formatPrice(product.maxPrice)}
        </div>
      );
    } else {
      // Nếu có khuyến mãi thật
      return (
        <div>
          <div className="line-through text-gray-400">
            {formatPrice(product.minPrice)} - {formatPrice(product.maxPrice)}
          </div>
          <div className="text-green-600">
            {formatPrice(product.minDiscountPrice)} - {formatPrice(product.maxDiscountPrice)}
          </div>
        </div>
      );
    }
  };
  
  // Components Modal
  const DeleteConfirmDialog = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">Xác nhận xóa</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa sản phẩm "{productToDelete?.productName}"? 
              Hành động này không thể hoàn tác.
            </p>
          </div>
          <div className="flex justify-center mt-4 gap-4">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 border border-transparent rounded-md font-medium text-white hover:bg-red-700 focus:outline-none"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  const VariantsModal = () => {
    const filteredVariants = getFilteredVariants();
    
    return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-5xl shadow-lg rounded-md bg-white" style={{ maxHeight: '80vh', height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-medium text-gray-900">
            Phiên bản sản phẩm: {selectedProduct?.productName}
          </h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowInventoryTransactionSettings(true)}
              className="text-blue-600 hover:text-blue-800 focus:outline-none"
              title="Cài đặt ghi nhận lịch sử thay đổi"
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={() => setShowVariantModal(false)}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <XCircle size={20} />
            </button>
          </div>
        </div>
        
        <div className="py-3 border-b">
          <div className="flex flex-wrap gap-2">
            <div className="text-sm text-gray-600 mr-2 mt-1">Lọc:</div>
            <button
              onClick={() => toggleFilter('inStock')}
              className={`px-2 py-1 rounded-md text-xs ${
                variantFilters.inStock 
                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              Còn tồn kho
            </button>
            <button
              onClick={() => toggleFilter('integerVolume')}
              className={`px-2 py-1 rounded-md text-xs ${
                variantFilters.integerVolume 
                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              Dung tích chẵn
            </button>
            <button
              onClick={() => toggleFilter('decimalVolume')}
              className={`px-2 py-1 rounded-md text-xs ${
                variantFilters.decimalVolume 
                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              Dung tích lẻ
            </button>
            <button
              onClick={() => toggleFilter('needsRestock')}
              className={`px-2 py-1 rounded-md text-xs ${
                variantFilters.needsRestock 
                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              Cần nhập hàng
            </button>
            <button
              onClick={() => toggleFilter('discounted')}
              className={`px-2 py-1 rounded-md text-xs ${
                variantFilters.discounted 
                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              Đang giảm giá
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loadingDetails ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredVariants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã phiên bản
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dung tích
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá gốc
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá ưu đãi
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tồn kho
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mức cảnh báo
                    </th>
                    <th className="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredVariants.map(variant => (
                    <tr key={variant.productVariantId} className={`hover:bg-gray-50 ${editingVariant === variant.productVariantId ? 'bg-blue-50' : ''}`}>
                      <td className="py-2 px-3 whitespace-nowrap text-sm text-gray-500">
                        #{variant.productVariantId}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap font-medium">
                        {editingVariant === variant.productVariantId ? (
                          <input
                            type="number"
                            name="volume"
                            value={editFormData.volume}
                            disabled={true}
                            className="w-20 px-2 py-1 border border-gray-200 bg-gray-100 rounded-md focus:outline-none text-gray-600 cursor-not-allowed"
                            title="Không thể thay đổi dung tích của phiên bản sản phẩm"
                          />
                        ) : (
                          `${variant.volume}ml`
                        )}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        {editingVariant === variant.productVariantId ? (
                          <input
                            type="number"
                            name="price"
                            value={editFormData.price}
                            onChange={handleInlineEditChange}
                            onFocus={() => setFocusedField('price')}
                            ref={priceInputRef}
                            min="0"
                            step="any"
                            className="w-28 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          formatPrice(variant.price)
                        )}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        {editingVariant === variant.productVariantId ? (
                          <input
                            type="number"
                            name="discountPrice"
                            value={editFormData.discountPrice}
                            onChange={handleInlineEditChange}
                            onFocus={() => setFocusedField('discountPrice')}
                            ref={discountPriceInputRef}
                            min="0"
                            step="any"
                            className="w-28 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : variant.discountPrice && !isEqualPrice(variant.price, variant.discountPrice) ? (
                          <span className="text-green-600">
                            {formatPrice(variant.discountPrice)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap font-medium">
                        {editingVariant === variant.productVariantId ? (
                          <input
                            type="number"
                            name="quantityInStock"
                            value={editFormData.quantityInStock}
                            onChange={handleInlineEditChange}
                            onFocus={() => setFocusedField('quantityInStock')}
                            ref={quantityInputRef}
                            min="0"
                            step="1"
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <StatusBadge status={variant.quantityInStock} reorderLevel={variant.reorderLevel} />
                        )}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-center">
                        {editingVariant === variant.productVariantId ? (
                          <input
                            type="number"
                            name="reorderLevel"
                            value={editFormData.reorderLevel}
                            onChange={handleInlineEditChange}
                            onFocus={() => setFocusedField('reorderLevel')}
                            ref={reorderLevelInputRef}
                            min="0"
                            step="1"
                            className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          variant.reorderLevel || 0
                        )}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-center">
                        {editingVariant === variant.productVariantId ? (
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={cancelInlineEdit}
                              className="text-gray-600 hover:text-gray-800 p-1"
                              title="Hủy thay đổi"
                            >
                              <X size={18} />
                            </button>
                            <button
                              onClick={saveInlineEdit}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Lưu thay đổi"
                            >
                              <Check size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleViewTransactionLog(variant)}
                              className="text-purple-600 hover:text-purple-800 p-1 rounded-lg hover:bg-purple-50"
                              title="Xem lịch sử giao dịch"
                            >
                              <Clock size={18} />
                            </button>
                            <button
                              onClick={() => handleEditVariant(variant)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-blue-50"
                              title="Sửa phiên bản"
                            >
                              <Edit size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {productVariants.length > 0 
                ? 'Không có phiên bản nào phù hợp với bộ lọc được chọn'
                : 'Chưa có phiên bản nào cho sản phẩm này'}
            </div>
          )}
        </div>
        
        <div className="border-t pt-4 mt-auto">
          <div className="flex justify-between">
            {filteredVariants.length !== productVariants.length && (
              <div className="text-sm text-gray-500 flex items-center">
                Hiển thị {filteredVariants.length}/{productVariants.length} phiên bản
              </div>
            )}
            
            <button
              onClick={handleAddVariant}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center ml-auto"
            >
              <PlusCircle size={18} className="mr-1" /> Thêm phiên bản
            </button>
          </div>
        </div>
      </div>
    </div>
  )};
  
  const DetailsModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-medium text-gray-900">
            Chi tiết sản phẩm: {selectedProduct?.productName}
          </h3>
          <button 
            onClick={() => setShowDetailModal(false)}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <XCircle size={20} />
          </button>
        </div>
        
        <div className="mt-4">
          {loadingDetails ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : productDetails && productDetails.details ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hiển thị các nhóm chi tiết sản phẩm */}
              {Object.entries(productDetails.details).map(([category, values]) => (
                <div key={category} className="border rounded-lg p-4">
                  <h4 className="font-medium text-sm uppercase tracking-wider text-gray-500 mb-2">
                    {category === 'tone_scent' ? 'Tông mùi hương' : 
                     category === 'style' ? 'Phong cách' :
                     category === 'top_note' ? 'Hương đầu' :
                     category === 'middle_note' ? 'Hương giữa' :
                     category === 'base_note' ? 'Hương cuối' :
                     category === 'longevity' ? 'Độ lưu hương' :
                     category === 'projection' ? 'Độ tỏa hương' :
                     category === 'season' ? 'Mùa phù hợp' :
                     category === 'time_of_day' ? 'Thời điểm phù hợp' :
                     category === 'suitable_age' ? 'Độ tuổi phù hợp' :
                     category === 'suitable_gender' ? 'Giới tính phù hợp' :
                     category}
                  </h4>
                  
                  <div className="flex flex-wrap gap-2 mt-1">
                    {values.map(value => (
                      <span key={value} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Chưa có thông tin chi tiết cho sản phẩm này
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={() => setShowDetailModal(false)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );

  // No longer needed - Using external ProductVariantFormModal component
  
  // No longer needed - Using external DeleteVariantConfirmDialog component

  // Cập nhật thông tin thống kê từ API
  const updateStats = async () => {
    try {
      // Cần lấy tất cả sản phẩm để tính toán thống kê chính xác
      const response = await productService.getAllProducts(0, totalItems || 1000, 'productId', 'asc', {});
      
      if (response && response.status === 'success' && response.data) {
        const allProducts = response.data.products || [];
        
        // Use the product service to calculate stats
        const stats = await productService.getProductStats(allProducts);
        setStatsData(stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  
  // Cập nhật thống kê khi cần thiết
  useEffect(() => {
    if (totalItems > 0) {
      updateStats();
    }
  }, [totalItems]);

  // Handlers cho product variant
  const resetVariantFormData = () => {
    // Get the last used price from localStorage if available
    const lastUsedPrice = localStorage.getItem('last_used_price') || '';
    
    setVariantFormData({
      volume: '',
      price: lastUsedPrice, // Auto-fill with last used price
      discountPrice: '',
      quantityInStock: '',
      reorderLevel: '0' // Default reorder level set to 0
    });
  };
  
  const handleAddVariant = () => {
    resetVariantFormData();
    setVariantToEdit(null);
    setShowVariantForm(true);
  };
  
  // This function is replaced by the inline editing functionality
  
  const handleDeleteVariant = (variant) => {
    setVariantToDelete(variant);
    setShowDeleteVariantConfirm(true);
  };
  
  const handleVariantFormChange = (e) => {
    const { name, value } = e.target;
    setVariantFormData({
      ...variantFormData,
      [name]: value
    });
  };
  
  const handleCloseVariantForm = () => {
    setShowVariantForm(false);
    resetVariantFormData();
    setVariantToEdit(null);
  };
  
  // Helper function to determine what fields have changed
  const detectChangedFields = (before, after) => {
    const changedFields = [];
    
    if (before.volume !== parseFloat(after.volume)) {
      changedFields.push('volume');
    }
    
    if (before.price !== parseFloat(after.price)) {
      changedFields.push('price');
    }
    
    // Check discountPrice specially since it might be null/undefined
    const beforeDiscountPrice = before.discountPrice || 0;
    const afterDiscountPrice = after.discountPrice ? parseFloat(after.discountPrice) : 0;
    if (beforeDiscountPrice !== afterDiscountPrice) {
      changedFields.push('discountPrice');
    }
    
    if (before.quantityInStock !== parseInt(after.quantityInStock)) {
      changedFields.push('quantityInStock');
    }
    
    if (before.reorderLevel !== parseInt(after.reorderLevel)) {
      changedFields.push('reorderLevel');
    }
    
    return changedFields;
  };

  // Update handleVariantFormSubmit to track changed fields
  const handleVariantFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Basic frontend validation
      const volume = parseFloat(variantFormData.volume);
      const price = parseFloat(variantFormData.price);
      const quantityInStock = parseInt(variantFormData.quantityInStock);
      const reorderLevel = parseInt(variantFormData.reorderLevel);
      
      // Validate volume
      if (isNaN(volume) || volume <= 0) {
        toast.error('Dung tích phải là một số dương');
        return;
      }
      
      // Validate price
      if (isNaN(price) || price < 0) {
        toast.error('Giá gốc phải là một số không âm');
        return;
      }
      
      // For discount price, if empty or not specified, use null
      let discountPrice = null;
      
      if (variantFormData.discountPrice && variantFormData.discountPrice.trim() !== '') {
        discountPrice = parseFloat(variantFormData.discountPrice);
        if (isNaN(discountPrice) || discountPrice < 0) {
          toast.error('Giá khuyến mãi phải là một số không âm');
          return;
        }
        
        // Validate that discount price is not higher than original price
        if (discountPrice > price) {
          toast.error('Giá khuyến mãi không thể cao hơn giá gốc');
          return;
        }
      }
      
      // Validate quantity in stock
      if (isNaN(quantityInStock) || quantityInStock < 0) {
        toast.error('Số lượng tồn kho phải là một số không âm');
        return;
      }
      
      // Validate reorder level
      if (isNaN(reorderLevel) || reorderLevel < 0) {
        toast.error('Mức cảnh báo phải là một số không âm');
        return;
      }
      
      // Prepare payload after validation
      const payload = {
        volume: volume,
        price: price,
        discountPrice: discountPrice,
        quantityInStock: quantityInStock,
        reorderLevel: reorderLevel
      };
      
      if (variantToEdit) {
        // Detect which fields have changed
        const fields = detectChangedFields(variantToEdit, payload);
        
        // Create detailed change information with before/after values
        const changedFieldsInfo = fields.map(field => ({
          field,
          beforeValue: variantToEdit[field],
          afterValue: payload[field]
        }));
        
        setChangedFields(fields);
        
        // Check if quantity changed
        const isQuantityChanged = variantToEdit.quantityInStock !== quantityInStock;
        const isOtherFieldsChanged = fields.length > 0 && !isQuantityChanged;
        
        // Only show transaction modal if there are changes
        if (isQuantityChanged || isOtherFieldsChanged) {
          // Determine allowed transaction types based on quantity change
          let allowedTypes = ['adjust'];
          if (isQuantityChanged) {
            if (quantityInStock > variantToEdit.quantityInStock) {
              allowedTypes = ['import', 'adjust'];
            } else if (quantityInStock < variantToEdit.quantityInStock) {
              allowedTypes = ['export', 'sell', 'adjust'];
            }
          }
          
          // Store pending update and show transaction modal
          setPendingVariantUpdate({
            productId: selectedProduct.productId,
            variantId: variantToEdit.productVariantId,
            payload: payload,
            isInlineEdit: false,
            changedFields: fields,
            changedFieldsInfo: changedFieldsInfo
          });
          
          setTransactionContext({
            productName: selectedProduct.productName,
            volume: variantToEdit.volume,
            beforeQuantity: variantToEdit.quantityInStock,
            afterQuantity: quantityInStock,
            allowedTypes: allowedTypes,
            otherChanges: isOtherFieldsChanged,
            changedFields: fields,
            changedFieldsInfo: changedFieldsInfo
          });
          
          setShowInventoryTransactionModal(true);
        } else {
          // No changes, just close form
          setShowVariantForm(false);
          resetVariantFormData();
          setVariantToEdit(null);
          setFocusedField(null);
        }
      } else {
        // For new variants, we always show the transaction modal if quantity > 0
        if (quantityInStock > 0) {
          // Store pending update and show transaction modal
          setPendingVariantUpdate({
            productId: selectedProduct.productId,
            payload: payload,
            isNew: true
          });
          
          setTransactionContext({
            productName: selectedProduct.productName,
            volume: volume,
            beforeQuantity: 0,
            afterQuantity: quantityInStock,
            allowedTypes: ['import', 'adjust'],
            otherChanges: false
          });
          
          setShowInventoryTransactionModal(true);
        } else {
          // If quantity is 0, just create without transaction
          const response = await productService.createProductVariant(
            selectedProduct.productId,
            payload
          );
          
          handleVariantCreationResponse(response);
        }
      }
    } catch (error) {
      console.error('Error in variant form submit:', error);
      toast.error('Có lỗi xảy ra khi xử lý biểu mẫu. Vui lòng thử lại sau.');
    }
  };
  
  // New function to handle transaction confirmation
  const handleTransactionConfirm = async (transactionData) => {
    try {
      console.log('Transaction data:', transactionData);
      
      // For variant updates, handle transactions appropriately based on source (inline vs modal)
      if (pendingVariantUpdate) {
        const { productId, variantId, payload, isInlineEdit, isNew, isDelete, quantityValue, changedFields, changedFieldsInfo } = pendingVariantUpdate;
        
        // Handle delete operation
        if (isDelete) {
          // Prepare transaction data for delete operation
          const finalTransactionData = Array.isArray(transactionData) ? transactionData[0] : transactionData;
          
          // Make sure product variant ID is set
          finalTransactionData.productVariantId = variantId;
          
          // Make sure quantity is positive (API requirement)
          if (!finalTransactionData.quantity || finalTransactionData.quantity <= 0) {
            finalTransactionData.quantity = quantityValue > 0 ? quantityValue : 1;
          }
          
          // Make sure it has field metadata
          if (!finalTransactionData.field) {
            finalTransactionData.field = 'quantityInStock';
          }
          
          // Make sure it has before/after values
          if (finalTransactionData.beforeValue === undefined && variantToDelete) {
            finalTransactionData.beforeValue = parseInt(variantToDelete.quantityInStock || 0);
          }
          
          if (finalTransactionData.afterValue === undefined) {
            finalTransactionData.afterValue = 0;
          }
          
          // Execute variant deletion with transaction data
          performVariantDeletion(finalTransactionData);
          
          // Close transaction modal
          setShowInventoryTransactionModal(false);
          setPendingVariantUpdate(null);
          return;
        }
        
        // Ensure proper numeric data types in the payload
        if (payload.volume) payload.volume = parseFloat(payload.volume);
        if (payload.price) payload.price = parseFloat(payload.price);
        if (payload.discountPrice) payload.discountPrice = parseFloat(payload.discountPrice);
        if (payload.quantityInStock) payload.quantityInStock = parseInt(payload.quantityInStock);
        if (payload.reorderLevel) payload.reorderLevel = parseInt(payload.reorderLevel);
        
        try {
          // Step 1: Perform the variant operation (create or update)
          let response;
          let newVariantId;
          
          if (isNew) {
            // For new variants, create variant
            response = await productService.createProductVariant(productId, payload);
            
            if (response && response.status === 'success') {
              newVariantId = response.data.productVariantId;
              
              // Successfully created, now handle transaction data
              if (Array.isArray(transactionData)) {
                // If it's an array of transaction data (from improved modal)
                for (const transaction of transactionData) {
                  transaction.productVariantId = newVariantId;
                }
              } else {
                // If it's a single transaction (from legacy code)
                transactionData.productVariantId = newVariantId;
                
                if (!transactionData.field) {
                  transactionData.field = 'quantityInStock';
                  transactionData.beforeValue = 0;
                  transactionData.afterValue = parseInt(payload.quantityInStock);
                }
              }
            } else {
              throw new Error(response?.message || 'Failed to create variant');
            }
          } else {
            // For existing variants, update variant
            response = await productService.updateProductVariant(
              productId,
              variantId,
              payload
            );
            
            if (response && response.status === 'success') {
              // Successfully updated, now handle transaction data
              if (Array.isArray(transactionData)) {
                // If it's an array of transaction data (from improved modal)
                for (const transaction of transactionData) {
                  transaction.productVariantId = variantId;
                  
                  // Ensure the transaction has proper before/after values
                  if (transaction.field && changedFieldsInfo) {
                    const fieldInfo = changedFieldsInfo.find(info => info.field === transaction.field);
                    if (fieldInfo && transaction.beforeValue === undefined) {
                      transaction.beforeValue = fieldInfo.beforeValue;
                    }
                    if (fieldInfo && transaction.afterValue === undefined) {
                      transaction.afterValue = fieldInfo.afterValue;
                    }
                  }
                }
              } else {
                // If it's a single transaction (from legacy code)
                transactionData.productVariantId = variantId;
                
                if (!transactionData.field && changedFields && changedFields.length > 0) {
                  transactionData.field = changedFields[0];
                  
                  if (changedFieldsInfo) {
                    const fieldInfo = changedFieldsInfo.find(info => info.field === transactionData.field);
                    if (fieldInfo) {
                      transactionData.beforeValue = fieldInfo.beforeValue;
                      transactionData.afterValue = fieldInfo.afterValue;
                    }
                  }
                }
              }
            } else {
              throw new Error(response?.message || 'Failed to update variant');
            }
          }
          
          // Step 2: Log the transaction(s)
          if (Array.isArray(transactionData)) {
            // Log payload for debugging
            console.log('Creating multiple inventory transactions:', transactionData);
            
            // Handle multiple transactions if provided as an array
            await Promise.all(transactionData.map(data => 
              inventoryTransactionService.createInventoryTransaction(data)
            ));
          } else {
            // Log payload for debugging
            console.log('Creating single inventory transaction:', transactionData);
            
            // Handle single transaction
            await inventoryTransactionService.createInventoryTransaction(transactionData);
          }
          
          // Step 3: Update UI state after successful operations
          setShowInventoryTransactionModal(false);
          setPendingVariantUpdate(null);
          
          if (isNew) {
            // For new variants, handle success response
            toast.success('Thêm phiên bản sản phẩm thành công!');
            fetchProductVariants(productId);
            setShowVariantForm(false);
            resetVariantFormData();
          } else if (isInlineEdit) {
            // For inline edits
            cancelInlineEdit();
            toast.success('Cập nhật phiên bản thành công!');
            fetchProductVariants(productId);
          } else {
            // For regular edits
            setShowVariantForm(false);
            resetVariantFormData();
            setVariantToEdit(null);
            setFocusedField(null);
            toast.success('Cập nhật phiên bản thành công!');
            fetchProductVariants(productId);
          }
        } catch (error) {
          console.error('Error in variant operation:', error);
          
          // Handle specific error codes
          if (error.response && error.response.status === 409) {
            toast.error('Xung đột dữ liệu: Phiên bản này đã được cập nhật bởi người khác. Vui lòng làm mới và thử lại.');
          } else {
            toast.error(error.message || 'Có lỗi xảy ra khi xử lý phiên bản sản phẩm');
          }
        }
      } else {
        console.error('No pending variant update found');
        toast.error('Không có thông tin cập nhật. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error in transaction confirmation:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi xử lý giao dịch');
    }
  };

  // Helper function for variant creation response handling
  const handleVariantCreationResponse = (response) => {
    if (response && response.status === 'success') {
      toast.success('Thêm phiên bản sản phẩm thành công!');
      
      // Refresh the variants list
      fetchProductVariants(selectedProduct.productId);
      
      // Close the form
      setShowVariantForm(false);
      resetVariantFormData();
      setVariantToEdit(null);
      setFocusedField(null);
    } else {
      toast.error(response?.message || 'Có lỗi xảy ra khi thêm phiên bản sản phẩm');
    }
  };
  
  const confirmDeleteVariant = async () => {
    if (!variantToDelete || !selectedProduct) return;
    
    // Get the default delete type from localStorage or use 'sell' as default
    const defaultDeleteType = localStorage.getItem('inventory_default_delete_type') || 'sell';
    const quantityValue = parseInt(variantToDelete.quantityInStock || 0);
    
    // If quantity is zero, we can delete without transaction modal
    if (quantityValue <= 0) {
      performVariantDeletion();
      return;
    }
    
    // Get discount price as the default for cost price
    const discountPrice = variantToDelete.discountPrice || variantToDelete.price || 0;
    
    // Set up transaction context for the modal
    setTransactionContext({
      productName: selectedProduct.productName,
      volume: variantToDelete.volume,
      beforeQuantity: quantityValue,
      afterQuantity: 0,
      allowedTypes: ['sell', 'export', 'adjust'], // Only allow appropriate types for deletion
      otherChanges: false,
      changedFields: ['quantityInStock'],
      changedFieldsInfo: [{
        field: 'quantityInStock',
        beforeValue: quantityValue,
        afterValue: 0
      }],
      costPrice: discountPrice.toString() // Provide the discount price as default cost price
    });
    
    // Set up pending variant update for when the transaction is confirmed
    setPendingVariantUpdate({
      productId: selectedProduct.productId,
      variantId: variantToDelete.productVariantId,
      isDelete: true, // Flag to identify that this is a delete operation
      quantityValue: quantityValue
    });
    
    // Show the modal
    setShowInventoryTransactionModal(true);
  };
  
  // New helper function to perform the actual variant deletion
  const performVariantDeletion = async (transactionData) => {
    try {
      // If we have transaction data, ensure it has the required fields
      if (transactionData) {
        // Make sure transaction has a reason
        if (!transactionData.reason || transactionData.reason.trim() === '') {
          transactionData.reason = 'Xóa phiên bản sản phẩm';
        }
        
        // Make sure it has proper field metadata
        if (!transactionData.field) {
          transactionData.field = 'quantityInStock';
        }
        
        // Make sure it has before/after values
        if (transactionData.beforeValue === undefined && variantToDelete) {
          transactionData.beforeValue = parseInt(variantToDelete.quantityInStock || 0);
        }
        
        if (transactionData.afterValue === undefined) {
          transactionData.afterValue = 0;
        }
      }
      
      // First try to delete the variant
      await productService.deleteProductVariant(
        selectedProduct.productId,
        variantToDelete.productVariantId
      );
      
      // If successful and we have transaction data, log the transaction
      if (transactionData) {
        try {
          // Create the transaction
          await inventoryTransactionService.createInventoryTransaction(transactionData);
          console.log('Variant deletion transaction created:', transactionData);
        } catch (transactionError) {
          console.error('Error creating deletion transaction (non-critical):', transactionError);
          // Continue with the operation even if transaction logging fails
        }
      }
      
      toast.success('Xóa phiên bản sản phẩm thành công!');
      
      // Refresh the variants list
      fetchProductVariants(selectedProduct.productId);
      
      // Close confirm dialog
      setShowDeleteVariantConfirm(false);
      setVariantToDelete(null);
    } catch (error) {
      console.error('Lỗi khi xóa phiên bản sản phẩm:', error);
      
      let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại sau.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    }
  };

  // Add function to confirm bulk deletion
  const confirmBulkDelete = async () => {
    try {
      // Create an array of promises for each delete operation
      const deletePromises = selectedProducts.map(productId => 
        productService.deleteProduct(productId)
      );
      
      // Wait for all delete operations to complete
      const results = await Promise.allSettled(deletePromises);
      
      // Count successful and failed operations
      const successful = results.filter(result => result.status === 'fulfilled' && result.value?.status === 'success').length;
      const failed = selectedProducts.length - successful;
      
      // Show appropriate toast message
      if (successful === selectedProducts.length) {
        toast.success(`Đã xóa thành công ${successful} sản phẩm!`);
      } else if (successful > 0) {
        toast.success(`Đã xóa thành công ${successful}/${selectedProducts.length} sản phẩm!`);
      }
      
      if (failed > 0) {
        toast.error(`Không thể xóa ${failed} sản phẩm. Vui lòng thử lại sau.`);
      }
      
      // Refresh product list
      fetchProducts();
      
      // Clear selected products
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Lỗi khi xóa sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setShowBulkDeleteConfirm(false);
    }
  };

  // Add BulkDeleteConfirmDialog component
  const BulkDeleteConfirmDialog = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">Xác nhận xóa hàng loạt</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa <span className="font-medium">{selectedProducts.length}</span> sản phẩm đã chọn? 
              Hành động này không thể hoàn tác.
            </p>
          </div>
          <div className="flex justify-center mt-4 gap-4">
            <button
              type="button"
              onClick={() => setShowBulkDeleteConfirm(false)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={confirmBulkDelete}
              className="px-4 py-2 bg-red-600 border border-transparent rounded-md font-medium text-white hover:bg-red-700 focus:outline-none"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Add function to handle variants selection
  const handleSelectAllVariants = (e) => {
    if (e.target.checked) {
      setSelectedVariants(productVariants.map(v => v.productVariantId));
    } else {
      setSelectedVariants([]);
    }
  };

  const handleSelectVariant = (id) => {
    if (selectedVariants.includes(id)) {
      setSelectedVariants(selectedVariants.filter(v => v !== id));
    } else {
      setSelectedVariants([...selectedVariants, id]);
    }
  };

  // Add bulk delete variants function
  const handleDeleteSelectedVariants = () => {
    if (selectedVariants.length > 0) {
      setShowBulkDeleteVariantConfirm(true);
    }
  };

  // Add state for bulk delete variant confirmation
  const [showBulkDeleteVariantConfirm, setShowBulkDeleteVariantConfirm] = useState(false);

  // Add function to confirm bulk variant deletion
  const confirmBulkDeleteVariants = async () => {
    try {
      const deletePromises = selectedVariants.map(variantId => 
        productService.deleteProductVariant(selectedProduct.productId, variantId)
      );
      
      const results = await Promise.allSettled(deletePromises);
      
      const successful = results.filter(result => result.status === 'fulfilled' && result.value?.status === 'success').length;
      const failed = selectedVariants.length - successful;
      
      if (successful === selectedVariants.length) {
        toast.success(`Đã xóa thành công ${successful} phiên bản sản phẩm!`);
      } else if (successful > 0) {
        toast.success(`Đã xóa thành công ${successful}/${selectedVariants.length} phiên bản sản phẩm!`);
      }
      
      if (failed > 0) {
        toast.error(`Không thể xóa ${failed} phiên bản sản phẩm. Vui lòng thử lại sau.`);
      }
      
      // Refresh variants list
      fetchProductVariants(selectedProduct.productId);
      
      // Clear selected variants
      setSelectedVariants([]);
    } catch (error) {
      console.error('Error deleting variants:', error);
      toast.error('Lỗi khi xóa phiên bản sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setShowBulkDeleteVariantConfirm(false);
    }
  };

  // Add function to start inline editing
  const startInlineEdit = (variant) => {
    // Save the current price to localStorage for future auto-fill
    if (variant.price) {
      localStorage.setItem('last_used_price', variant.price.toString());
    }
    
    setEditingVariant(variant.productVariantId);
    setEditFormData({
      volume: variant.volume.toString(),
      price: variant.price.toString(),
      discountPrice: variant.discountPrice ? variant.discountPrice.toString() : '',
      quantityInStock: variant.quantityInStock.toString(),
      reorderLevel: variant.reorderLevel !== null && variant.reorderLevel !== undefined 
        ? variant.reorderLevel.toString() 
        : '0'
    });
    // Thiết lập một trường focus mặc định khi bắt đầu chỉnh sửa
    setFocusedField('volume');
  };

  // Add function to cancel inline editing
  const cancelInlineEdit = () => {
    setEditingVariant(null);
    setEditFormData({
      volume: '',
      price: '',
      discountPrice: '',
      quantityInStock: '',
      reorderLevel: ''
    });
    setFocusedField(null);
  };

  // Add function to save inline edits
  const saveInlineEdit = async () => {
    try {
      // Get the current variant being edited
      const variant = productVariants.find(v => v.productVariantId === editingVariant);
      
      if (!variant) {
        toast.error('Không tìm thấy phiên bản sản phẩm đang chỉnh sửa');
        return;
      }
      
      // Basic frontend validation
      const volume = parseFloat(editFormData.volume);
      const price = parseFloat(editFormData.price);
      const quantityInStock = parseInt(editFormData.quantityInStock);
      const reorderLevel = parseInt(editFormData.reorderLevel);
      
      // Validate volume
      if (isNaN(volume) || volume <= 0) {
        toast.error('Dung tích phải là một số dương');
        return;
      }
      
      // Validate price
      if (isNaN(price) || price < 0) {
        toast.error('Giá gốc phải là một số không âm');
        return;
      }
      
      // For discount price, if empty or not specified, use null
      let discountPrice = null;
      
      if (editFormData.discountPrice && editFormData.discountPrice.trim() !== '') {
        discountPrice = parseFloat(editFormData.discountPrice);
        if (isNaN(discountPrice) || discountPrice < 0) {
          toast.error('Giá khuyến mãi phải là một số không âm');
          return;
        }
        
        // Validate that discount price is not higher than original price
        if (discountPrice > price) {
          toast.error('Giá khuyến mãi không thể cao hơn giá gốc');
          return;
        }
      }
      
      // Validate quantity in stock
      if (isNaN(quantityInStock) || quantityInStock < 0) {
        toast.error('Số lượng tồn kho phải là một số không âm');
        return;
      }
      
      // Validate reorder level
      if (isNaN(reorderLevel) || reorderLevel < 0) {
        toast.error('Mức cảnh báo phải là một số không âm');
        return;
      }

      // Don't allow editing the volume
      if (variant.volume !== volume) {
        toast.error('Không thể thay đổi dung tích của phiên bản sản phẩm');
        return;
      }
      
      // Prepare payload after validation
      const payload = {
        volume: variant.volume, // Keep original volume
        price: price,
        discountPrice: discountPrice,
        quantityInStock: quantityInStock,
        reorderLevel: reorderLevel
      };
      
      // Detect which fields have changed
      const fields = detectChangedFields(variant, payload);
      
      // Create detailed change information with before/after values
      const changedFieldsInfo = fields.map(field => ({
        field,
        beforeValue: variant[field],
        afterValue: payload[field]
      }));
      
      setChangedFields(fields);
      
      // Check if quantity changed or other fields changed
      const isQuantityChanged = variant.quantityInStock !== quantityInStock;
      const isOtherFieldsChanged = fields.length > 0 && !isQuantityChanged;
      
      // Check if we should skip confirmation
      const skipConfirmation = localStorage.getItem('inventory_skip_confirmation') === 'true';
      
      // Only show transaction modal if there are changes and skip confirmation is not enabled
      if ((isQuantityChanged || isOtherFieldsChanged) && !skipConfirmation) {
        // Determine allowed transaction types based on quantity change
        let allowedTypes = ['adjust'];
        if (isQuantityChanged) {
          if (quantityInStock > variant.quantityInStock) {
            allowedTypes = ['import', 'adjust'];
          } else if (quantityInStock < variant.quantityInStock) {
            allowedTypes = ['export', 'sell', 'adjust'];
          }
        }
        
        // Store pending update and show transaction modal
        setPendingVariantUpdate({
          productId: selectedProduct.productId,
          variantId: variant.productVariantId,
          payload: payload,
          isInlineEdit: true,
          changedFields: fields,
          changedFieldsInfo: changedFieldsInfo
        });
        
        setTransactionContext({
          productName: selectedProduct.productName,
          volume: variant.volume,
          beforeQuantity: variant.quantityInStock,
          afterQuantity: quantityInStock,
          allowedTypes: allowedTypes,
          otherChanges: isOtherFieldsChanged,
          changedFields: fields,
          changedFieldsInfo: changedFieldsInfo
        });
        
        setShowInventoryTransactionModal(true);
      } else if (isQuantityChanged || isOtherFieldsChanged) {
        // Skip confirmation is enabled, or there are no changes
        // Apply the update directly

        // Get the default transaction type based on quantity change
        let defaultType = 'adjust';
        if (isQuantityChanged) {
          if (quantityInStock > variant.quantityInStock) {
            defaultType = localStorage.getItem('inventory_default_increase_type') || 'import';
          } else if (quantityInStock < variant.quantityInStock) {
            defaultType = localStorage.getItem('inventory_default_decrease_type') || 'sell';
          }
        }

        try {
          // Update the product variant
          const response = await productService.updateProductVariant(
            selectedProduct.productId,
            variant.productVariantId,
            payload
          );

          if (response && response.status === 'success') {
            // Create a transaction for each changed field
            for (const fieldInfo of changedFieldsInfo) {
              // Create an appropriate reason based on the field
              const fieldDisplayName = getFieldDisplayName(fieldInfo.field);
              const diff = fieldInfo.field === 'quantityInStock' 
                ? quantityInStock - variant.quantityInStock 
                : null;
              
              let reason = `Thay đổi ${fieldDisplayName}`;
              if (fieldInfo.beforeValue !== undefined && fieldInfo.afterValue !== undefined) {
                if (fieldInfo.field === 'price' || fieldInfo.field === 'discountPrice') {
                  reason += `: ${Number(fieldInfo.beforeValue).toLocaleString('vi-VN')} → ${Number(fieldInfo.afterValue).toLocaleString('vi-VN')}`;
                  if (fieldInfo.afterValue != fieldInfo.beforeValue) {
                    const diffValue = Number(fieldInfo.afterValue - fieldInfo.beforeValue).toLocaleString('vi-VN');
                    reason += ` (${fieldInfo.afterValue > fieldInfo.beforeValue ? '+' + diffValue : diffValue})`;
                  }
                } else {
                  reason += `: ${fieldInfo.beforeValue} → ${fieldInfo.afterValue}`;
                  if (fieldInfo.afterValue != fieldInfo.beforeValue) {
                    reason += ` (${fieldInfo.afterValue > fieldInfo.beforeValue ? '+' + (fieldInfo.afterValue - fieldInfo.beforeValue) : (fieldInfo.afterValue - fieldInfo.beforeValue)})`;
                  }
                }
              }
              
              const transactionType = fieldInfo.field === 'quantityInStock' 
                ? diff > 0 
                  ? localStorage.getItem('inventory_default_increase_type') || 'import'
                  : localStorage.getItem('inventory_default_decrease_type') || 'sell'
                : defaultType;

              const transactionData = {
                productVariantId: variant.productVariantId,
                transactionType: transactionType,
                reason: reason,
                field: fieldInfo.field,
                beforeValue: fieldInfo.beforeValue,
                afterValue: fieldInfo.afterValue,
                quantity: fieldInfo.field === 'quantityInStock'
                  ? Math.abs(quantityInStock - variant.quantityInStock)
                  : 0
              };

              await inventoryTransactionService.createInventoryTransaction(transactionData);
            }

            // Reset UI state
            cancelInlineEdit();
            toast.success('Cập nhật phiên bản thành công!');
            fetchProductVariants(selectedProduct.productId);
          } else {
            throw new Error(response?.message || 'Failed to update variant');
          }
        } catch (error) {
          console.error('Error updating variant:', error);
          toast.error(error.message || 'Có lỗi xảy ra khi cập nhật phiên bản sản phẩm');
        }
      } else {
        // No changes, just close edit mode
        setEditingVariant(null);
        setEditFormData({
          volume: '',
          price: '',
          discountPrice: '',
          quantityInStock: '',
          reorderLevel: ''
        });
        setFocusedField(null);
      }
    } catch (error) {
      console.error('Error preparing variant update:', error);
      toast.error('Lỗi khi chuẩn bị cập nhật phiên bản sản phẩm. Vui lòng thử lại sau.');
    }
  };

  // Function handleInlineEditChange đã được định nghĩa ở dòng 488

  // Update the existing handleEditVariant function to use inline editing
  const handleEditVariant = (variant) => {
    startInlineEdit(variant);
  };

  // Add BulkDeleteVariantConfirmDialog component
  const BulkDeleteVariantConfirmDialog = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">Xác nhận xóa hàng loạt</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa <span className="font-medium">{selectedVariants.length}</span> phiên bản sản phẩm đã chọn của "{selectedProduct?.productName}"? 
              Hành động này không thể hoàn tác.
            </p>
          </div>
          <div className="flex justify-center mt-4 gap-4">
            <button
              type="button"
              onClick={() => setShowBulkDeleteVariantConfirm(false)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={confirmBulkDeleteVariants}
              className="px-4 py-2 bg-red-600 border border-transparent rounded-md font-medium text-white hover:bg-red-700 focus:outline-none"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Function để hiển thị lịch sử giao dịch của một sản phẩm
  const handleViewTransactionLog = (variant) => {
    setTransactionLogVariantId(variant.productVariantId);
    setShowTransactionLog(true);
  };
  
  // Function để hiển thị lịch sử giao dịch của tất cả phiên bản sản phẩm
  const handleViewAllTransactionLogs = (product) => {
    setSelectedProduct(product);
    setTransactionLogVariantId(null);
    setShowTransactionLog(true);
  };

  // Modal hiển thị lịch sử giao dịch tồn kho
  const TransactionLogModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedProduct 
              ? (transactionLogVariantId 
                ? `Lịch sử giao dịch - ${selectedProduct.productName} (${productVariants.find(v => v.productVariantId === transactionLogVariantId)?.volume}ml)` 
                : `Lịch sử giao dịch - ${selectedProduct.productName}`)
              : "Lịch sử giao dịch tồn kho"}
          </h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowTransactionLog(false)}
          >
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="flex-1">
          <InventoryTransactionLog 
            productId={selectedProduct?.productId}
            productVariantId={transactionLogVariantId}
          />
        </div>
      </div>
    </div>
  );

  // Add helper function to get display name for a field
  const getFieldDisplayName = (field) => {
    switch(field) {
      case 'volume': return 'dung tích';
      case 'price': return 'giá gốc';
      case 'discountPrice': return 'giá ưu đãi';
      case 'quantityInStock': return 'số lượng tồn kho';
      case 'reorderLevel': return 'mức cảnh báo';
      default: return field;
    }
  };

  // Function to toggle boolean filters
  const toggleProductFilter = (filterName) => {
    setProductFilters(prev => {
      const newFilters = {
        ...prev,
        [filterName]: !prev[filterName]
      };
      
      // Apply filters immediately
      applyProductFilters(newFilters);
      
      return newFilters;
    });
  };
  
  // Function to handle price filter changes
  const handlePriceFilterChange = (field, value) => {
    setProductFilters(prev => {
      const newFilters = {
        ...prev,
        [field]: value
      };
      
      // Apply filters with a small delay to prevent too many API calls while typing
      const timeoutId = setTimeout(() => {
        applyProductFilters(newFilters);
      }, 300);
      
      return newFilters;
    });
  };
  
  // Function to handle volume filter changes
  const handleVolumeFilterChange = (value) => {
    setProductFilters(prev => {
      const newFilters = {
        ...prev,
        volume: value
      };
      
      // Apply filters immediately
      applyProductFilters(newFilters);
      
      return newFilters;
    });
  };
  
  // Function to clear all product filters
  const clearProductFilters = () => {
    const clearedFilters = {
      inStock: false,
      discounted: false,
      minPrice: '',
      maxPrice: '',
      volume: ''
    };
    
    setProductFilters(clearedFilters);
    applyProductFilters(clearedFilters);
  };
  
  // Function to apply filters to product list
  const applyProductFilters = async (filters = productFilters) => {
    setLoading(true);
    try {
      // Prepare API filters object
      const apiFilters = {};
      
      // Only add search term if it exists
      if (searchTerm) {
        apiFilters.productName = searchTerm;
      }
      
      // Add in-stock filter
      if (filters.inStock) {
        apiFilters.inStock = true;
      }
      
      // Add discounted filter
      if (filters.discounted) {
        apiFilters.discounted = true;
      }
      
      // Add price range filters
      if (filters.minPrice) {
        apiFilters.minPrice = parseInt(filters.minPrice);
      }
      
      if (filters.maxPrice) {
        apiFilters.maxPrice = parseInt(filters.maxPrice);
      }
      
      // Add volume filter
      if (filters.volume) {
        apiFilters.volume = parseInt(filters.volume);
      }
      
      // Reset to first page
      setPage(0);
      
      // Fetch products with filters
      const response = await productService.getAllProducts(
        0, 
        pageSize, 
        sortField, 
        sortDirection, 
        apiFilters
      );
      
      if (response && response.status === 'success' && response.data) {
        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalItems(response.data.totalItems || 0);
        setError(null);
      } else {
        setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
      }
    } catch (err) {
      setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
      toast.error('Lỗi khi tải dữ liệu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      
      {/* Product Form Modal */}
      {showProductForm && (
        <ProductFormModal
          isOpen={showProductForm}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          formData={formData}
          onChange={handleFormChange}
          brands={brands}
          loadingBrands={loadingBrands}
          productToEdit={productToEdit}
          onAddBrand={() => setShowBrandForm(true)}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && <DeleteConfirmDialog />}
      
      {/* New Brand Form */}
      {showBrandForm && (
        <BrandFormModal
          isOpen={showBrandForm}
          onClose={() => setShowBrandForm(false)}
          onSubmit={(brandData) => {
            // Submit brand creation
            axios.post('http://localhost:8080/api/v1/emp/brands', brandData)
            .then(response => {
              if (response.data && response.data.status === 'success') {
                const newBrand = response.data.data;
                // Update brands list
                setBrands([...brands, newBrand]);
                // Update form data with new brand ID
                setFormData({
                  ...formData,
                  brandId: newBrand.brandId.toString()
                });
                toast.success(`Đã tạo thương hiệu "${brandData.brandName}" thành công`);
                setShowBrandForm(false);
              }
            })
            .catch(error => {
              console.error('Error creating brand:', error);
              toast.error(`Không thể tạo thương hiệu: ${error.response?.data?.message || error.message}`);
            });
          }}
        />
      )}
      
      {/* Variant Modal */}
      {showVariantModal && <VariantsModal />}
      
      {/* Detail Modal */}
      {showDetailModal && <DetailsModal />}
      
      {/* Transaction Log Modal */}
      {showTransactionLog && <TransactionLogModal />}
      
      {/* Variant Form Modal */}
      {showVariantForm && (
        <ProductVariantFormModal 
          isOpen={showVariantForm}
          onClose={handleCloseVariantForm}
          formData={variantFormData}
          onChange={handleVariantFormChange}
          onSubmit={handleVariantFormSubmit}
          variantToEdit={variantToEdit}
          productId={selectedProduct?.productId}
          productName={selectedProduct?.productName}
        />
      )}
      
      {/* Delete Variant Confirmation Dialog */}
      {showDeleteVariantConfirm && (
        <DeleteVariantConfirmDialog
          isOpen={showDeleteVariantConfirm}
          onClose={() => setShowDeleteVariantConfirm(false)}
          onConfirm={confirmDeleteVariant}
          variantToDelete={variantToDelete}
        />
      )}
      
      {/* Bulk Delete Confirmation Dialog */}
      {showBulkDeleteConfirm && <BulkDeleteConfirmDialog />}
      
      {/* Bulk Delete Variant Confirmation Dialog */}
      {showBulkDeleteVariantConfirm && <BulkDeleteVariantConfirmDialog />}
      
      {/* Inventory Transaction Modal */}
      {showInventoryTransactionModal && (
        <InventoryTransactionModal
          isOpen={showInventoryTransactionModal}
          onClose={() => {
            setShowInventoryTransactionModal(false);
            setPendingVariantUpdate(null);
            // Also clean up form state if needed
            if (pendingVariantUpdate?.isNew || pendingVariantUpdate?.isInlineEdit === false) {
              setShowVariantForm(false);
              resetVariantFormData();
              setVariantToEdit(null);
            } else if (pendingVariantUpdate?.isInlineEdit) {
              cancelInlineEdit();
            }
          }}
          onConfirm={handleTransactionConfirm}
          productVariantId={pendingVariantUpdate?.variantId}
          productName={transactionContext.productName}
          volume={transactionContext.volume}
          beforeQuantity={transactionContext.beforeQuantity}
          afterQuantity={transactionContext.afterQuantity}
          allowedTypes={transactionContext.allowedTypes}
          otherChanges={transactionContext.otherChanges}
          changedFields={transactionContext.changedFields || []}
          changedFieldsInfo={transactionContext.changedFieldsInfo || []}
        />
      )}
      
      {/* Inventory Transaction Settings Modal */}
      {showInventoryTransactionSettings && (
        <InventoryTransactionSettings
          isOpen={showInventoryTransactionSettings}
          onClose={() => setShowInventoryTransactionSettings(false)}
        />
      )}
      
      <header>
        <div className="mx-auto px-6 py-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800">Quản lý sản phẩm</h1>
            <button
              onClick={() => {
                setTransactionLogVariantId(null);
                setSelectedProduct(null);
                setShowTransactionLog(true);
              }}
              className="text-purple-600 hover:text-purple-800 rounded-full p-1 hover:bg-purple-50 transition-colors"
              title="Xem lịch sử giao dịch tồn kho"
            >
              <Clock size={20} />
            </button>
          </div>
        </div>
      </header>
      

      <div className="container mx-auto px-6 py-4">
        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-2">
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                onClick={handleAddProduct}
              >
                <Plus size={18} className="mr-1" />
                Thêm sản phẩm
              </button>
              <button 
                className={`border px-4 py-2 rounded-lg flex items-center ${selectedProducts.length > 0 ? 'text-red-600 border-red-300' : 'text-gray-400 border-gray-200 cursor-not-allowed'}`}
                disabled={selectedProducts.length === 0}
                onClick={handleDeleteSelected}
              >
                <Trash2 size={18} className="mr-1" />
                Xóa {selectedProducts.length > 0 && `(${selectedProducts.length})`}
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button className="text-gray-600 border border-gray-300 px-3 py-2 rounded-lg flex items-center">
                <Upload size={18} className="mr-1" />
                Nhập
              </button>
              
              <button className="text-gray-600 border border-gray-300 px-3 py-2 rounded-lg flex items-center">
                <Download size={18} className="mr-1" />
                Xuất
              </button>
            </div>
          </div>
          
          <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
            <div className="w-full md:w-1/2 flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm theo tên sản phẩm, thương hiệu..." 
                className="ml-2 w-full bg-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
              {searchTerm && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setPage(0);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => fetchProducts()}
                className="bg-gray-100 hover:bg-gray-200 rounded px-3 py-2 text-sm flex items-center"
                title="Làm mới dữ liệu"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" className="mr-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                  <path d="M8 16H3v5"></path>
                </svg>
                Làm mới
              </button>
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="px-4 pb-4 flex flex-wrap gap-3 border-t pt-4">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Bộ lọc:</span>
            </div>
            
            {/* In Stock Filter */}
            <div className="flex items-center">
              <input
                id="inStockFilter"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={productFilters.inStock}
                onChange={() => toggleProductFilter('inStock')}
              />
              <label htmlFor="inStockFilter" className="ml-2 text-sm text-gray-600">
                Còn tồn kho
              </label>
            </div>
            
            {/* Discounted Filter */}
            <div className="flex items-center">
              <input
                id="discountedFilter"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={productFilters.discounted}
                onChange={() => toggleProductFilter('discounted')}
              />
              <label htmlFor="discountedFilter" className="ml-2 text-sm text-gray-600">
                Đang giảm giá
              </label>
            </div>
            
            {/* Price Range Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Giá từ:</span>
              <input
                type="number"
                min="0"
                step="10000"
                value={productFilters.minPrice}
                onChange={(e) => handlePriceFilterChange('minPrice', e.target.value)}
                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="Thấp nhất"
              />
              <span className="text-sm text-gray-600">đến</span>
              <input
                type="number"
                min="0"
                step="10000"
                value={productFilters.maxPrice}
                onChange={(e) => handlePriceFilterChange('maxPrice', e.target.value)}
                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="Cao nhất"
              />
            </div>
            
            {/* Volume Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Dung tích:</span>
              <select
                value={productFilters.volume}
                onChange={(e) => handleVolumeFilterChange(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 rounded"
              >
                <option value="">Tất cả</option>
                <option value="5">5ml</option>
                <option value="10">10ml</option>
                <option value="30">30ml</option>
                <option value="50">50ml</option>
                <option value="100">100ml</option>
                <option value="200">200ml</option>
              </select>
            </div>
            
            {/* Clear Filters Button */}
            {Object.values(productFilters).some(v => 
               (typeof v === 'boolean' && v === true) || 
               (typeof v === 'string' && v !== '') ||
               (typeof v === 'number' && v > 0)
            ) && (
              <button
                onClick={clearProductFilters}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <X size={14} className="mr-1" />
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Tổng sản phẩm</p>
                <h3 className="text-2xl font-bold">{statsData.totalProducts || totalItems || 0}</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Tổng tồn kho</p>
                <h3 className="text-2xl font-bold">
                  {statsData.totalInventory || 0}
                </h3>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Sản phẩm tồn kho</p>
                <h3 className="text-2xl font-bold">{statsData.inStockProducts || 0}</h3>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <path d="M9 12h6"></path>
                  <path d="M9 16h6"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Sản phẩm khuyến mãi</p>
                <h3 className="text-2xl font-bold">{statsData.discountedProducts || 0}</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign size={24} className="text-green-500" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : products.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Không tìm thấy sản phẩm nào</div>
            ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="w-12 px-4 py-3">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      onChange={handleSelectAll}
                      checked={selectedProducts.length === products.length && products.length > 0}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Ảnh</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('productName')}>
                    <div className="flex items-center">
                      Tên sản phẩm
                      {getSortIcon('productName')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('brandName')}>
                    <div className="flex items-center">
                      Thương hiệu
                      {getSortIcon('brandName')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('minPrice')}>
                    <div className="flex items-center">
                      Giá bán
                      {getSortIcon('minPrice')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('volumes')}>
                    <div className="flex items-center">
                      Dung tích (ml)
                      {getSortIcon('volumes')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('totalInventory')}>
                    <div className="flex items-center">
                      Tồn kho
                      {getSortIcon('totalInventory')}
                    </div>
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map(product => (
                  <tr key={product.productId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={selectedProducts.includes(product.productId)}
                        onChange={() => handleSelectProduct(product.productId)}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.productName} 
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/50';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                      </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{product.productName}</div>
                      <div className="text-sm text-gray-500">ID: {product.productId}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {product.brandName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {renderPrice(product)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {product.volumes && product.volumes.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {product.volumes.map(volume => (
                            <span key={volume} className="px-2 py-1 bg-blue-50 text-xs rounded-full">
                              {volume}
                      </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Chưa có</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={product.totalInventory} reorderLevel={product.reorderLevel || 0} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        <button
                          onClick={() => handleViewVariants(product)} 
                          className="text-indigo-600 hover:text-indigo-800"
                          title="Xem phiên bản"
                        >
                          <Layers size={18} />
                          {product.totalInventory > 0 && product.variantCount > 0 && (
                            <span className="absolute -mt-2 -mr-2 bg-indigo-100 text-indigo-800 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                              {product.variantCount}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)} 
                          className="text-blue-600 hover:text-blue-800"
                          title="Sửa sản phẩm"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="text-red-600 hover:text-red-800"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
          
          {/* Pagination */}
          {!loading && !error && products.length > 0 && (
            <div className="px-4 py-3 flex flex-col md:flex-row md:justify-between border-t gap-3">
              <div className="flex items-center text-sm text-gray-500 flex-wrap gap-2">
                <span>
                  Hiển thị {products.length > 0 ? page * pageSize + 1 : 0}-
                  {Math.min((page + 1) * pageSize, totalItems)} trong {totalItems} sản phẩm
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-700">Hiển thị:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(0); // Reset về trang đầu khi thay đổi số item mỗi trang
                    }}
                    className="px-1 py-1 text-sm border rounded"
                  >
                    {[10, 20, 50, 100, 200, 300, 500, 1000].map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                    <option value={totalItems}>Tất cả</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-between md:justify-end items-center space-x-2">
                <div className="flex items-center">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className={`px-2 py-1 border rounded ${page === 0 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  <div className="flex items-center mx-1">
                    {/* First page button */}
                    <button
                      className={`px-3 py-1 border rounded ${page === 0 ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                      onClick={() => handlePageChange(0)}
                    >
                      1
                    </button>
                    
                    {/* Ellipsis if not near the beginning */}
                    {page > 2 && (
                      <span className="px-1 py-1">...</span>
                    )}
                    
                    {/* Pages near current page */}
                    {Array.from({ length: totalPages }).map((_, i) => {
                      // Display current page and one page before/after (if they exist)
                      // Skip first and last pages (displayed separately)
                      if (i !== 0 && i !== totalPages - 1) {
                        if (
                          (page === i) || // Current page
                          (page === i - 1) || // Page after current
                          (page === i + 1) // Page before current
                        ) {
                          return (
                            <button
                              key={i}
                              className={`px-3 py-1 border rounded ${page === i ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                              onClick={() => handlePageChange(i)}
                            >
                              {i + 1}
                            </button>
                          );
                        }
                      }
                      return null;
                    })}
                    
                    {/* Ellipsis if not near the end */}
                    {page < totalPages - 3 && (
                      <span className="px-1 py-1">...</span>
                    )}
                    
                    {/* Last page button (if more than one page) */}
                    {totalPages > 1 && (
                      <button
                        className={`px-3 py-1 border rounded ${page === totalPages - 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                        onClick={() => handlePageChange(totalPages - 1)}
                      >
                        {totalPages}
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                    className={`px-2 py-1 border rounded ${page >= totalPages - 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Đi đến trang */}
                <div className="inline-flex items-center ml-1">
                  <span className="mr-1 text-sm whitespace-nowrap">Đến trang:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    className="w-14 h-8 px-2 border rounded text-sm"
                    placeholder=""
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const pageNumber = parseInt(e.target.value, 10);
                        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
                          handlePageChange(pageNumber - 1);
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;