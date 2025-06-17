import React, { useEffect, useState } from 'react';
import { Edit, Trash2, History, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, PackagePlus, PackageX, Clock, XCircle, Filter } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import materialService from '../services/MaterialService';
import MaterialFormModal from '../Components/MaterialFormModal';
import MaterialTransactionLog from '../Components/MaterialTransactionLog';
import MaterialOperationModal from '../Components/MaterialOperationModal';
import {
  PageHeader,
  TableToolbar,
  DataTable,
  PaginationFooter,
} from '../Components/common';

// Helper to evaluate stock status
const getStockStatus = (qty, reorder) => {
  const q = Number(qty);
  const r = Number(reorder || 0);
  if (r === 0) return 'in-stock';
  if (q < r) return 'below-warning';
  if (q === r) return 'at-warning';
  return 'in-stock';
};

const StatusBadge = ({ quantityInStock, reorderLevel }) => {
  const status = getStockStatus(quantityInStock, reorderLevel);
  const map = {
    'below-warning': { text: 'Thiếu hàng', color: 'bg-red-100 text-red-800' },
    'at-warning': { text: 'Cảnh báo', color: 'bg-yellow-100 text-yellow-800' },
    'in-stock': { text: 'OK', color: 'bg-green-100 text-green-800' }
  };
  return <span className={`${map[status].color} px-2 py-1 text-xs rounded-full font-medium`}>{map[status].text}</span>;
};

const Materials = () => {
  // Data & loading
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & sorting & search
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [sortField, setSortField] = useState('materialId');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Selection & modals
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [materialToEdit, setMaterialToEdit] = useState(null);
  const [showTransactionLog, setShowTransactionLog] = useState(false);
  const [logMaterialId, setLogMaterialId] = useState(null);
  const [showOperationModal, setShowOperationModal] = useState(false);
  const [operationType, setOperationType] = useState('import');
  const [operationMaterial, setOperationMaterial] = useState(null);
  
  // Filters & filter popup anchor
  const [showFilters, setShowFilters] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [materialFilters, setMaterialFilters] = useState({
    inStock: false,
    needsRestock: false
  });

  // Form state for create/update
  const [formData, setFormData] = useState({
    materialName: '',
    description: '',
    unit: '',
    price: '',
    reorderLevel: ''
  });

  // Fetch materials whenever dependencies change
  useEffect(() => {
    fetchMaterials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sortField, sortDirection, searchTerm]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (searchTerm) filters.materialName = searchTerm;
      const res = await materialService.getAllMaterials(page, pageSize, sortField, sortDirection, filters);
      if (res.status === 'success') {
        const data = res.data;
        setMaterials(data.items || data.materials || []);
        setTotalPages(data.totalPages || 0);
        setTotalItems(data.totalElements || 0);
      } else {
        setError(res.message || 'Failed to fetch materials');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Sorting handler
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const getSortIcon = (field) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp size={16} className="ml-1" /> : 
      <ChevronDown size={16} className="ml-1" />;
  };

  // Search handler (simple real-time without debounce for simplicity)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  // Table selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMaterials(materials.map((m) => m.materialId));
    } else {
      setSelectedMaterials([]);
    }
  };
  
  const handleSelectMaterial = (id) => {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // Add / Edit
  const openAddMaterial = () => {
    setMaterialToEdit(null);
    setFormData({ materialName: '', description: '', unit: '', price: '', reorderLevel: '' });
    setShowFormModal(true);
  };

  const openEditMaterial = (material) => {
    setMaterialToEdit(material);
    setFormData({
      materialName: material.materialName,
      description: material.description || '',
      unit: material.unit,
      price: material.price,
      reorderLevel: material.reorderLevel || ''
    });
    setShowFormModal(true);
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.materialName || !formData.unit) {
        toast.error('Tên vật tư và đơn vị tính là bắt buộc');
        return;
      }
      let resp;
      if (materialToEdit) {
        resp = await materialService.updateMaterial(materialToEdit.materialId, formData);
      } else {
        resp = await materialService.createMaterial(formData);
      }
      if (resp.status === 'success') {
        toast.success(materialToEdit ? 'Cập nhật thành công!' : 'Thêm vật tư thành công!');
        setShowFormModal(false);
        fetchMaterials();
      } else {
        throw new Error(resp.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Có lỗi xảy ra');
    }
  };

  // Delete
  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('Bạn có chắc muốn xoá vật tư này?')) return;
    try {
      const resp = await materialService.deleteMaterial(materialId);
      if (resp.status === 'success') {
        toast.success('Đã xoá vật tư');
        fetchMaterials();
      } else throw new Error(resp.message);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Có lỗi khi xoá');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMaterials.length === 0) return;
    if (!window.confirm(`Xoá ${selectedMaterials.length} vật tư đã chọn?`)) return;
    try {
      const resp = await materialService.deleteMaterialsBulk(selectedMaterials);
      if (resp.status === 'success') {
        toast.success('Đã xoá các vật tư được chọn');
        setSelectedMaterials([]);
        fetchMaterials();
      } else throw new Error(resp.message);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Có lỗi khi xoá');
    }
  };

  // Inventory operation
  const openOperationModal = (material, type) => {
    setOperationMaterial(material);
    setOperationType(type);
    setShowOperationModal(true);
  };

  // Transaction log for single material
  const openTransactionLog = (material) => {
    setLogMaterialId(material.materialId);
    setShowTransactionLog(true);
  };

  // Transaction log for all materials
  const openAllTransactionLog = () => {
    setLogMaterialId(null);
    setShowTransactionLog(true);
  };

  // Filter handlers
  const toggleMaterialFilter = (filterName) => {
    setMaterialFilters(prev => {
      const newFilters = {
        ...prev,
        [filterName]: !prev[filterName]
      };
      return newFilters;
    });
  };

  // Toggle filter popup
  const handleFilterToggle = (e) => {
    setShowFilters(prev => !prev);
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      setFilterAnchor({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX });
    }
  };

  // Apply filters (no API call needed, just close popup)
  const applyFilters = () => {
    setShowFilters(false);
  };

  const clearFilters = () => {
    setMaterialFilters({ inStock: false, needsRestock: false });
    setShowFilters(false);
  };

  // Apply filters to the material list
  const getFilteredMaterials = () => {
    if (!materialFilters.inStock && !materialFilters.needsRestock) {
      return materials;
    }

    return materials.filter(material => {
      // In-stock filter
      if (materialFilters.inStock && material.quantityInStock <= 0) {
        return false;
      }
      
      // Needs restock filter
      if (materialFilters.needsRestock && 
          (material.reorderLevel === null || material.reorderLevel === undefined || 
           material.quantityInStock > material.reorderLevel)) {
        return false;
      }
      
      return true;
    });
  };

  const filteredMaterials = getFilteredMaterials();

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      
      {/* Page Header */}
      <PageHeader 
        title="Quản lý vật tư"
        subtitle="Theo dõi và quản lý kho vật tư của hệ thống"
      >
        <div className="flex items-center space-x-2">
          <button
            onClick={openAllTransactionLog}
            className="text-purple-600 hover:text-purple-800 rounded-full p-2 hover:bg-purple-50 transition-colors"
            title="Xem lịch sử giao dịch tồn kho"
          >
            <Clock size={20} />
          </button>
        </div>
      </PageHeader>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
        {/* Unified toolbar + optional filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <TableToolbar
            searchValue={searchTerm}
            onSearchChange={handleSearchChange}
            onSearchSubmit={(e) => {
              e.preventDefault();
              setPage(0);
              fetchMaterials();
            }}
            onFilter={handleFilterToggle}
            addLabel="Thêm vật tư"
            onAdd={openAddMaterial}
            placeholder="Tìm kiếm vật tư..."
            extraActions={
              <>
                {selectedMaterials.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center px-4 py-2 border text-red-600 border-red-300 rounded-lg"
                  >
                    <Trash2 size={16} className="mr-1" /> Xoá {selectedMaterials.length}
                  </button>
                )}
              </>
            }
          />

          {/* Filter Popup */}
          {showFilters && (
            <div
              className="fixed z-50 bg-white border rounded-md shadow-lg p-4"
              style={{ top: filterAnchor?.top, left: filterAnchor?.left, width: '260px' }}
            >
              <h4 className="font-medium mb-2 flex items-center">
                <Filter size={16} className="mr-2" /> Bộ lọc vật tư
              </h4>
              <div className="mb-3 space-y-2">
                <label className="flex items-center text-sm space-x-2">
                  <input
                    type="checkbox"
                    checked={materialFilters.inStock}
                    onChange={() => toggleMaterialFilter('inStock')}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>Còn tồn kho</span>
                </label>
                <label className="flex items-center text-sm space-x-2">
                  <input
                    type="checkbox"
                    checked={materialFilters.needsRestock}
                    onChange={() => toggleMaterialFilter('needsRestock')}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>Cần nhập thêm</span>
                </label>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-sm border rounded"
                >Bỏ lọc</button>
                <button
                  onClick={applyFilters}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
                >Áp dụng</button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <DataTable>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input 
                  type="checkbox" 
                  className="rounded"
                  onChange={handleSelectAll}
                  checked={selectedMaterials.length === filteredMaterials.length && filteredMaterials.length > 0}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('materialName')}>
                <div className="flex items-center">
                  Tên vật tư
                  {getSortIcon('materialName')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('unit')}>
                <div className="flex items-center">
                  Đơn vị
                  {getSortIcon('unit')}
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('quantityInStock')}>
                <div className="flex items-center justify-end">
                  Tồn kho
                  {getSortIcon('quantityInStock')}
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('reorderLevel')}>
                <div className="flex items-center justify-end">
                  Cảnh báo
                  {getSortIcon('reorderLevel')}
                </div>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('price')}>
                <div className="flex items-center justify-end">
                  Giá (VNĐ)
                  {getSortIcon('price')}
                </div>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nhập/Xuất</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-gray-500">Đang tải...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-red-600">{error}</td>
              </tr>
            ) : filteredMaterials.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-gray-500">Không có dữ liệu</td>
              </tr>
            ) : (
              filteredMaterials.map((mat) => (
                <tr key={mat.materialId} className={`hover:bg-gray-50 ${selectedMaterials.includes(mat.materialId) ? 'bg-blue-50' : ''}`}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={selectedMaterials.includes(mat.materialId)}
                      onChange={() => handleSelectMaterial(mat.materialId)}
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{mat.materialName}</div>
                    <div className="text-sm text-gray-500">ID: {mat.materialId}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{mat.unit}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">{mat.quantityInStock}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">{mat.reorderLevel || '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <StatusBadge quantityInStock={mat.quantityInStock} reorderLevel={mat.reorderLevel} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">{formatCurrency(mat.price)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center space-x-1">
                    <button 
                      title="Nhập kho" 
                      onClick={() => openOperationModal(mat, 'import')}
                      className="text-green-600 hover:text-green-800 p-1 hover:bg-green-100 rounded-full"
                    >
                      <PackagePlus size={16} />
                    </button>
                    <button 
                      title="Xuất kho" 
                      onClick={() => openOperationModal(mat, 'export')}
                      className="text-teal-600 hover:text-teal-800 p-1 hover:bg-teal-100 rounded-full"
                    >
                      <PackageX size={16} />
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center space-x-1">
                    <button 
                      title="Sửa" 
                      onClick={() => openEditMaterial(mat)}
                      className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-100 rounded-full"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      title="Lịch sử" 
                      onClick={() => openTransactionLog(mat)}
                      className="text-amber-600 hover:text-amber-800 p-1 hover:bg-amber-100 rounded-full"
                    >
                      <History size={16} />
                    </button>
                    <button 
                      title="Xoá" 
                      onClick={() => handleDeleteMaterial(mat.materialId)}
                      className="text-red-600 hover:text-red-800 p-1 hover:bg-red-100 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </DataTable>

        {/* Pagination */}
        {!loading && filteredMaterials.length > 0 && (
          <div className="px-4 py-3 flex flex-col md:flex-row md:justify-between border-t gap-3 bg-white">
            <div className="flex items-center text-sm text-gray-500 flex-wrap gap-2">
              <span>Hiển thị</span>
              <select
                value={pageSize}
                onChange={(e)=>{setPageSize(Number(e.target.value)); setPage(0);}}
                className="px-1 py-1 text-sm border rounded"
              >
                {[10,20,50,100,200,500].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
                <option value={totalItems}>Tất cả</option>
              </select>
              <span>mỗi trang trong {totalItems} vật tư</span>
            </div>
            <div className="flex justify-between md:justify-end items-center space-x-2">
              <div className="flex items-center">
                <button
                  onClick={()=>setPage(prev=>Math.max(0, prev-1))}
                  disabled={page===0}
                  className={`px-2 py-1 border rounded ${page===0?'text-gray-400 cursor-not-allowed':'hover:bg-gray-50'}`}
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center mx-1">
                  <button className={`px-3 py-1 border rounded ${page===0?'bg-blue-600 text-white':'hover:bg-gray-50'}`} onClick={()=>setPage(0)}>1</button>
                  {page+1 > 3 && <span className="px-1">...</span>}
                  {Array.from({length: totalPages}).map((_,i)=>{
                    if(i!==0 && i!== totalPages-1){
                      if(Math.abs((page+1)-(i+1))<=1){
                        return (
                          <button key={i} className={`px-3 py-1 border rounded ${page===i?'bg-blue-600 text-white':'hover:bg-gray-50'}`} onClick={()=>setPage(i)}>{i+1}</button>
                        );
                      }
                    }
                    return null;
                  })}
                  {page+1 < totalPages-2 && <span className="px-1">...</span>}
                  {totalPages>1 && (
                    <button className={`px-3 py-1 border rounded ${page===totalPages-1?'bg-blue-600 text-white':'hover:bg-gray-50'}`} onClick={()=>setPage(totalPages-1)}>{totalPages}</button>
                  )}
                </div>
                <button
                  onClick={()=>setPage(prev=>Math.min(totalPages-1, prev+1))}
                  disabled={page>=totalPages-1}
                  className={`px-2 py-1 border rounded ${page>=totalPages-1?'text-gray-400 cursor-not-allowed':'hover:bg-gray-50'}`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="inline-flex items-center ml-1">
                <span className="mr-1 text-sm whitespace-nowrap">Đến trang:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  className="w-14 h-8 px-2 border rounded text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const num = parseInt(e.target.value, 10);
                      if (!isNaN(num) && num >= 1 && num <= totalPages) {
                        setPage(num - 1);
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

      {/* Modals */}
      <MaterialFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
        materialToEdit={materialToEdit}
      />

      {showTransactionLog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-4 w-full max-w-6xl">
            <div className="bg-white rounded-md shadow-lg">
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <h3 className="text-lg font-medium text-gray-900">Lịch sử giao dịch vật tư</h3>
                <button onClick={() => setShowTransactionLog(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={20} />
                </button>
              </div>
              <MaterialTransactionLog materialId={logMaterialId} hideTitle={true} />
            </div>
          </div>
        </div>
      )}

      <MaterialOperationModal
        isOpen={showOperationModal}
        onClose={() => setShowOperationModal(false)}
        operationType={operationType}
        material={operationMaterial}
        onSuccess={() => {
          fetchMaterials();
        }}
      />
    </div>
  );
};

export default Materials;