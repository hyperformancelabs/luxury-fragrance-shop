import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Filter, ChevronDown, ChevronUp, RefreshCw, AlertTriangle, Download, Package, Truck, BarChart2 } from 'lucide-react';

const Materials = () => {
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterCapacity, setFilterCapacity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initial bottle materials data
  const materials = [
    {
      id: 1,
      name: 'Chai nhựa trong',
      type: 'bottle',
      capacity: '500ml',
      sku: 'BT-500-CLR',
      stockQty: 5250,
      reservedQty: 1500,
      threshold: 1000,
      location: 'Kho A - Kệ 12',
      lastRestock: '05/04/2025',
      supplier: 'PlasticPro Vietnam',
      price: '3,800',
      status: 'in-stock'
    },
    {
      id: 2,
      name: 'Chai thủy tinh',
      type: 'bottle',
      capacity: '330ml',
      sku: 'BG-330-AMB',
      stockQty: 3200,
      reservedQty: 2200,
      threshold: 1500,
      location: 'Kho B - Kệ 05',
      lastRestock: '28/03/2025',
      supplier: 'GlassTech Co.',
      price: '6,500',
      status: 'in-stock'
    },
    {
      id: 3,
      name: 'Chai nhựa xanh',
      type: 'bottle',
      capacity: '1L',
      sku: 'BT-1000-BLU',
      stockQty: 1800,
      reservedQty: 1000,
      threshold: 800,
      location: 'Kho A - Kệ 14',
      lastRestock: '10/04/2025',
      supplier: 'PlasticPro Vietnam',
      price: '5,200',
      status: 'in-stock'
    },
    {
      id: 4,
      name: 'Nắp nhựa vặn',
      type: 'cap',
      capacity: 'Thông dụng',
      sku: 'CP-STD-BLK',
      stockQty: 12000,
      reservedQty: 5000,
      threshold: 3000,
      location: 'Kho C - Kệ 02',
      lastRestock: '08/04/2025',
      supplier: 'CapExpert Ltd.',
      price: '800',
      status: 'in-stock'
    },
    {
      id: 5,
      name: 'Nắp nhôm vặn',
      type: 'cap',
      capacity: 'Premium',
      sku: 'CP-ALU-PRE',
      stockQty: 4500,
      reservedQty: 2000,
      threshold: 1500,
      location: 'Kho C - Kệ 03',
      lastRestock: '02/04/2025',
      supplier: 'MetalCaps Co.',
      price: '1,500',
      status: 'in-stock'
    },
    {
      id: 6,
      name: 'Chai thủy tinh',
      type: 'bottle',
      capacity: '750ml',
      sku: 'BG-750-CLR',
      stockQty: 950,
      reservedQty: 400,
      threshold: 1000,
      location: 'Kho B - Kệ 08',
      lastRestock: '20/03/2025',
      supplier: 'GlassTech Co.',
      price: '7,800',
      status: 'low-stock'
    },
    {
      id: 7,
      name: 'Chai nhựa nâu',
      type: 'bottle',
      capacity: '250ml',
      sku: 'BT-250-BRN',
      stockQty: 3800,
      reservedQty: 800,
      threshold: 1200,
      location: 'Kho A - Kệ 11',
      lastRestock: '01/04/2025',
      supplier: 'PlasticPro Vietnam',
      price: '2,900',
      status: 'in-stock'
    },
    {
      id: 8,
      name: 'Nắp spray',
      type: 'cap',
      capacity: 'Thông dụng',
      sku: 'CP-SPR-WHT',
      stockQty: 7800,
      reservedQty: 3000,
      threshold: 2500,
      location: 'Kho C - Kệ 05',
      lastRestock: '03/04/2025',
      supplier: 'SprayTech Solutions',
      price: '2,200',
      status: 'in-stock'
    },
    {
      id: 9,
      name: 'Chai thủy tinh nhỏ giọt',
      type: 'bottle',
      capacity: '30ml',
      sku: 'BG-30-DRP',
      stockQty: 8500,
      reservedQty: 2500,
      threshold: 3000,
      location: 'Kho B - Kệ 02',
      lastRestock: '08/04/2025',
      supplier: 'GlassTech Co.',
      price: '4,200',
      status: 'in-stock'
    },
    {
      id: 10,
      name: 'Chai nhựa vuông',
      type: 'bottle',
      capacity: '100ml',
      sku: 'BT-100-SQR',
      stockQty: 0,
      reservedQty: 0,
      threshold: 800,
      location: 'Kho A - Kệ 10',
      lastRestock: '15/02/2025',
      supplier: 'PlasticPro Vietnam',
      price: '1,900',
      status: 'out-of-stock'
    },
    {
      id: 11,
      name: 'Nắp bơm kem',
      type: 'cap',
      capacity: 'Premium',
      sku: 'CP-PMP-LUX',
      stockQty: 450,
      reservedQty: 200,
      threshold: 500,
      location: 'Kho C - Kệ 06',
      lastRestock: '25/03/2025',
      supplier: 'PumpTech Ltd.',
      price: '3,600',
      status: 'low-stock'
    },
    {
      id: 12,
      name: 'Chai nhựa dẹp',
      type: 'bottle',
      capacity: '200ml',
      sku: 'BT-200-FLT',
      stockQty: 2600,
      reservedQty: 600,
      threshold: 1000,
      location: 'Kho A - Kệ 13',
      lastRestock: '07/04/2025',
      supplier: 'PlasticPro Vietnam',
      price: '2,500',
      status: 'in-stock'
    }
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMaterials(materials.map(c => c.id));
    } else {
      setSelectedMaterials([]);
    }
  };

  const handleSelectMaterial = (id) => {
    if (selectedMaterials.includes(id)) {
      setSelectedMaterials(selectedMaterials.filter(c => c !== id));
    } else {
      setSelectedMaterials([...selectedMaterials, id]);
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

  const getStatusBadge = (status, stockQty, threshold) => {
    switch (status) {
      case 'in-stock':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Còn hàng</span>;
      case 'low-stock':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Sắp hết</span>;
      case 'out-of-stock':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Hết hàng</span>;
      default:
        if (stockQty <= 0) {
          return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Hết hàng</span>;
        } else if (stockQty < threshold) {
          return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Sắp hết</span>;
        } else {
          return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Còn hàng</span>;
        }
    }
  };

  const filterMaterials = () => {
    let filtered = materials;
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(material => 
        material.name.toLowerCase().includes(query) || 
        material.sku.toLowerCase().includes(query) ||
        material.supplier.toLowerCase().includes(query)
      );
    }
    
    // Apply capacity filter
    if (filterCapacity !== 'all') {
      filtered = filtered.filter(m => m.capacity === filterCapacity);
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(m => m.type === filterType);
    }
    
    return filtered;
  };

  const filteredMaterials = filterMaterials();
  
  // Calculate stats
  const materialStats = {
    total: materials.length,
    bottles: materials.filter(m => m.type === 'bottle').length,
    caps: materials.filter(m => m.type === 'cap').length,
    lowStock: materials.filter(m => m.stockQty < m.threshold).length,
    outOfStock: materials.filter(m => m.stockQty === 0).length
  };

  // Get unique capacities for filter options
  const capacities = [...new Set(materials.map(m => m.capacity))];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-3">
          <h1 className="text-xl font-bold text-gray-800">Quản lý vật liệu đóng gói</h1>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
                <Plus size={18} className="mr-1" />
                Thêm vật liệu
              </button>
              
              <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg flex items-center" disabled={selectedMaterials.length === 0}>
                <Edit size={18} className="mr-1" />
                Sửa
              </button>
              
              <button className="text-red-600 border border-red-300 px-4 py-2 rounded-lg flex items-center" disabled={selectedMaterials.length === 0}>
                <Trash2 size={18} className="mr-1" />
                Xóa
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button className="text-green-600 border border-green-300 px-4 py-2 rounded-lg flex items-center">
                <RefreshCw size={18} className="mr-1" />
                Nhập hàng
              </button>
              
              <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg flex items-center">
                <Download size={18} className="mr-1" />
                Xuất báo cáo
              </button>
            </div>
          </div>
          
          <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
            <div className="w-full md:w-1/3 flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm theo tên, mã SKU, nhà cung cấp..." 
                className="ml-2 w-full bg-transparent outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center space-x-2">
              <div className="flex items-center">
                <select 
                  className="bg-gray-100 rounded px-3 py-2 text-sm border-0"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">Tất cả loại</option>
                  <option value="bottle">Chai</option>
                  <option value="cap">Nắp</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <select 
                  className="bg-gray-100 rounded px-3 py-2 text-sm border-0"
                  value={filterCapacity}
                  onChange={(e) => setFilterCapacity(e.target.value)}
                >
                  <option value="all">Tất cả dung tích</option>
                  {capacities.map(capacity => (
                    <option key={capacity} value={capacity}>{capacity}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-t-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Tổng vật liệu</p>
                <h3 className="text-2xl font-bold">{materialStats.total}</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 border-t-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Loại chai</p>
                <h3 className="text-2xl font-bold">{materialStats.bottles}</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2h8M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 border-t-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Loại nắp</p>
                <h3 className="text-2xl font-bold">{materialStats.caps}</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8"></circle>
                  <path d="M12 8v8"></path>
                  <path d="M8 12h8"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 border-t-4 border-yellow-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Sắp hết hàng</p>
                <h3 className="text-2xl font-bold">{materialStats.lowStock}</h3>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 border-t-4 border-red-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Hết hàng</p>
                <h3 className="text-2xl font-bold">{materialStats.outOfStock}</h3>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Materials Table */}
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
                      checked={selectedMaterials.length === filteredMaterials.length && filteredMaterials.length > 0}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Tên vật liệu
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('type')}>
                    <div className="flex items-center">
                      Loại
                      {getSortIcon('type')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('capacity')}>
                    <div className="flex items-center">
                      Dung tích
                      {getSortIcon('capacity')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('stockQty')}>
                    <div className="flex items-center">
                      Số lượng
                      {getSortIcon('stockQty')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đã đặt
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vị trí
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('price')}>
                    <div className="flex items-center">
                      Đơn giá (VNĐ)
                      {getSortIcon('price')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMaterials.map(material => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={selectedMaterials.includes(material.id)}
                        onChange={() => handleSelectMaterial(material.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className={`h-10 w-10 rounded-full ${material.type === 'bottle' ? 'bg-green-200' : 'bg-purple-200'} flex items-center justify-center text-gray-700 font-medium`}>
                            {material.type === 'bottle' ? 'B' : 'C'}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{material.name}</div>
                          <div className="text-sm text-gray-500">{material.supplier}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {material.type === 'bottle' ? 'Chai' : 'Nắp'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {material.capacity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono">
                      {material.sku}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      {material.stockQty.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {material.reservedQty.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {material.location}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      ₫{material.price}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(material.status, material.stockQty, material.threshold)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <RefreshCw size={18} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <Edit size={18} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy vật liệu</h3>
              <p className="mt-1 text-sm text-gray-500">Không có vật liệu nào phù hợp với điều kiện tìm kiếm.</p>
              <div className="mt-6">
                <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Thêm vật liệu mới
                </button>
              </div>
            </div>
          )}
          
          <div className="px-4 py-3 flex items-center justify-between border-t">
            <div className="flex items-center text-sm text-gray-500">
              <span>Hiển thị 1-{filteredMaterials.length} trong {filteredMaterials.length} vật liệu</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50" disabled>
                Trước
              </button>
              <span className="px-3 py-1 border rounded bg-blue-600 text-white">1</span>
              <button className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50" disabled={filteredMaterials.length <= 10}>2</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50" disabled={filteredMaterials.length <= 20}>3</button>
              <button className="px-3 py-1 border rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50" disabled={filteredMaterials.length <= 10}>
                Sau
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity and Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="M12 5v14"></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                    <p className="text-sm font-medium">Đã nhập thêm 2,000 chai nhựa trong</p>
                      <p className="text-xs text-gray-500">11:23 sáng, 12/04/2025</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">1 giờ trước</span>
                </div>
              </div>
              
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Đã xuất 800 nắp nhựa vặn</p>
                      <p className="text-xs text-gray-500">09:45 sáng, 12/04/2025</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">3 giờ trước</span>
                </div>
              </div>
              
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <AlertTriangle size={16} className="text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Cảnh báo: Chai thủy tinh 750ml sắp hết</p>
                      <p className="text-xs text-gray-500">16:30 chiều, 11/04/2025</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">hôm qua</span>
                </div>
              </div>
              
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <RefreshCw size={16} className="text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Đã đặt hàng: 5,000 chai thủy tinh 330ml</p>
                      <p className="text-xs text-gray-500">10:15 sáng, 11/04/2025</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">hôm qua</span>
                </div>
              </div>
              
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="M12 5v14"></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Đã nhập kho: 1,500 nắp spray</p>
                      <p className="text-xs text-gray-500">15:40 chiều, 10/04/2025</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">2 ngày trước</span>
                </div>
              </div>
              
              <div className="p-4 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Xem tất cả hoạt động
                </button>
              </div>
            </div>
          </div>
          
          {/* Analytics */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Phân tích</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stock Levels Chart */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Mức tồn kho theo loại</h4>
                  <select className="text-sm bg-gray-100 rounded border-0 px-2 py-1">
                    <option>7 ngày qua</option>
                    <option>30 ngày qua</option>
                    <option>3 tháng qua</option>
                  </select>
                </div>
                <div className="h-64 flex items-center justify-center">
                  {/* This would be replaced with an actual chart component */}
                  <div className="text-center">
                    <BarChart2 size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Biểu đồ mức tồn kho được hiển thị ở đây</p>
                  </div>
                </div>
              </div>
              
              {/* Top Materials */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Vật liệu sử dụng nhiều nhất</h4>
                  <select className="text-sm bg-gray-100 rounded border-0 px-2 py-1">
                    <option>Tháng này</option>
                    <option>Quý này</option>
                    <option>Năm nay</option>
                  </select>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-medium mr-3">
                      B
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Chai thủy tinh 330ml</span>
                        <span className="text-sm font-medium">4,500</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-800 font-medium mr-3">
                      C
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Nắp nhựa vặn</span>
                        <span className="text-sm font-medium">3,800</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-medium mr-3">
                      B
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Chai nhựa trong 500ml</span>
                        <span className="text-sm font-medium">3,200</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-800 font-medium mr-3">
                      C
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Nắp spray</span>
                        <span className="text-sm font-medium">2,900</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '55%' }}></div>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-medium mr-3">
                      B
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Chai thủy tinh nhỏ giọt 30ml</span>
                        <span className="text-sm font-medium">2,300</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              
              {/* Inventory Value */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Giá trị tồn kho</h4>
                  <div className="flex items-center text-green-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                    <span className="text-sm font-medium ml-1">8.3%</span>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">₫285,650,000</div>
                <p className="text-gray-500 text-sm">So với ₫263,805,000 tháng trước</p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Chai lọ</span>
                    <span className="font-medium">₫205,300,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Nắp các loại</span>
                    <span className="font-medium">₫80,350,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
              </div>
              
              {/* Upcoming Orders */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Đơn hàng sắp tới</h4>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">3 đơn hàng</span>
                </div>
                <ul className="space-y-3">
                  <li className="border-b pb-3">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Chai thủy tinh 750ml</span>
                      <span className="text-blue-600 text-sm">13/04/2025</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">GlassTech Co.</span>
                      <span>3,000 sản phẩm</span>
                    </div>
                  </li>
                  <li className="border-b pb-3">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Nắp nhôm vặn Premium</span>
                      <span className="text-blue-600 text-sm">15/04/2025</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">MetalCaps Co.</span>
                      <span>5,000 sản phẩm</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Chai nhựa vuông 100ml</span>
                      <span className="text-blue-600 text-sm">18/04/2025</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">PlasticPro Vietnam</span>
                      <span>2,500 sản phẩm</span>
                    </div>
                  </li>
                </ul>
                <div className="mt-4 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Xem tất cả đơn hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materials;