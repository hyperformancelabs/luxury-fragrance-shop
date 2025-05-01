import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Filter, ChevronDown, ChevronUp, MoreHorizontal, Upload, Download, AlertCircle } from 'lucide-react';

const Products = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const products = [
    {
      id: 1,
      name: 'Nước hoa XYZ',
      sku: 'NH-XYZ-50',
      size: '50ml',
      price: '1,250,000',
      cost: '950,000',
      stock: 15,
      category: 'Nước hoa nữ',
      status: 'active',
      lastUpdated: '10/04/2025',
    },
    {
      id: 2,
      name: 'Nước hoa ABC',
      sku: 'NH-ABC-100',
      size: '100ml',
      price: '2,150,000',
      cost: '1,720,000',
      stock: 5,
      category: 'Nước hoa nam',
      status: 'low_stock',
      lastUpdated: '08/04/2025',
    },
    {
      id: 3,
      name: 'Nước hoa Premium',
      sku: 'NH-PREM-75',
      size: '75ml',
      price: '3,500,000',
      cost: '2,800,000',
      stock: 8,
      category: 'Nước hoa nữ',
      status: 'active',
      lastUpdated: '11/04/2025',
    },
    {
      id: 4,
      name: 'Nước hoa Classic',
      sku: 'NH-CLAS-30',
      size: '30ml',
      price: '950,000',
      cost: '760,000',
      stock: 0,
      category: 'Nước hoa unisex',
      status: 'out_of_stock',
      lastUpdated: '05/04/2025',
    },
    {
      id: 5,
      name: 'Nước hoa Elegance',
      sku: 'NH-ELEG-50',
      size: '50ml',
      price: '1,850,000',
      cost: '1,480,000',
      stock: 12,
      category: 'Nước hoa nữ',
      status: 'active',
      lastUpdated: '09/04/2025',
    },
    {
      id: 6,
      name: 'Nước hoa Luxury',
      sku: 'NH-LUX-100',
      size: '100ml',
      price: '4,250,000',
      cost: '3,400,000',
      stock: 3,
      category: 'Nước hoa nam',
      status: 'low_stock',
      lastUpdated: '12/04/2025',
    }
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p.id));
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? 
      <ChevronUp size={16} className="ml-1" /> : 
      <ChevronDown size={16} className="ml-1" />;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Còn hàng</span>;
      case 'low_stock':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Sắp hết</span>;
      case 'out_of_stock':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Hết hàng</span>;
      default:
        return null;
    }
  };

  const filteredProducts = filterStatus === 'all' 
    ? products 
    : products.filter(p => p.status === filterStatus);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="">
        <div className=" mx-auto px-6 py-3">
          <h1 className="text-xl font-bold text-gray-800">Quản lý sản phẩm</h1>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
                <Plus size={18} className="mr-1" />
                Thêm sản phẩm
              </button>
              
              <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg flex items-center" disabled={selectedProducts.length === 0}>
                <Edit size={18} className="mr-1" />
                Sửa
              </button>
              
              <button className="text-red-600 border border-red-300 px-4 py-2 rounded-lg flex items-center" disabled={selectedProducts.length === 0}>
                <Trash2 size={18} className="mr-1" />
                Xóa
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
            <div className="w-full md:w-1/3 flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm theo tên, mã sản phẩm..." 
                className="ml-2 w-full bg-transparent outline-none"
              />
            </div>
            
            <div className="flex flex-wrap items-center space-x-2">
              <div className="flex items-center">
                <select 
                  className="bg-gray-100 rounded px-3 py-2 text-sm border-0"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Còn hàng</option>
                  <option value="low_stock">Sắp hết hàng</option>
                  <option value="out_of_stock">Hết hàng</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <select className="bg-gray-100 rounded px-3 py-2 text-sm border-0">
                  <option>Tất cả danh mục</option>
                  <option>Nước hoa nam</option>
                  <option>Nước hoa nữ</option>
                  <option>Nước hoa unisex</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Tổng sản phẩm</p>
                <h3 className="text-2xl font-bold">{products.length}</h3>
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
                <p className="text-gray-500">Còn hàng</p>
                <h3 className="text-2xl font-bold">{products.filter(p => p.status === 'active').length}</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Sắp hết hàng</p>
                <h3 className="text-2xl font-bold">{products.filter(p => p.status === 'low_stock').length}</h3>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Hết hàng</p>
                <h3 className="text-2xl font-bold">{products.filter(p => p.status === 'out_of_stock').length}</h3>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="w-12 px-4 py-3">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      onChange={handleSelectAll}
                      checked={selectedProducts.length === products.length}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Ảnh</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Tên sản phẩm
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('sku')}>
                    <div className="flex items-center">
                      Mã SP
                      {getSortIcon('sku')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('price')}>
                    <div className="flex items-center">
                      Giá bán
                      {getSortIcon('price')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('stock')}>
                    <div className="flex items-center">
                      Tồn kho
                      {getSortIcon('stock')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('lastUpdated')}>
                    <div className="flex items-center">
                      Cập nhật
                      {getSortIcon('lastUpdated')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <img src="/api/placeholder/50/50" alt={product.name} className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.size}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900">₫{product.price}</div>
                      <div className="text-xs text-gray-500">Giá vốn: ₫{product.cost}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : product.stock < 10 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {product.lastUpdated}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-4 py-3 flex items-center justify-between border-t">
            <div className="flex items-center text-sm text-gray-500">
              <span>Hiển thị 1-{filteredProducts.length} trong {products.length} sản phẩm</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50" disabled>
                Trước
              </button>
              <span className="px-3 py-1 border rounded bg-blue-600 text-white">1</span>
              <button className="px-3 py-1 border rounded hover:bg-gray-100">2</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-100">3</button>
              <button className="px-3 py-1 border rounded bg-gray-100 text-gray-600 hover:bg-gray-200">
                Sau
              </button>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="mt-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Có {products.filter(p => p.status === 'low_stock').length} sản phẩm sắp hết hàng cần được nhập thêm.
                  <span className="font-medium ml-1 underline cursor-pointer">Xem chi tiết</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;