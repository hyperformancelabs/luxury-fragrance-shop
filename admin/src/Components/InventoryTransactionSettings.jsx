import React, { useState, useEffect } from 'react';
import { X, Plus, Settings, Save, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const InventoryTransactionSettings = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    defaultIncreaseType: localStorage.getItem('inventory_default_increase_type') || 'import',
    defaultDecreaseType: localStorage.getItem('inventory_default_decrease_type') || 'sell',
    defaultDeleteType: localStorage.getItem('inventory_default_delete_type') || 'delete',
    defaultAdjustType: localStorage.getItem('inventory_default_adjust_type') || 'adjust',
    skipConfirmation: localStorage.getItem('inventory_skip_confirmation') === 'true',
    defaultReasons: {},
    showCustomReasonsManager: false,
    reasonType: 'adjust',
    newReason: '',
    activeTab: 'general',
    priorityReasons: {}
  });

  const fieldSpecificReasons = {
    volume: [
      'Cập nhật dung tích sản phẩm',
      'Điều chỉnh dung tích theo quy cách mới',
      'Sửa lỗi nhập liệu dung tích',
    ],
    price: [
      'Cập nhật giá gốc sản phẩm',
      'Tăng giá do chi phí đầu vào tăng',
      'Giảm giá do chính sách mới',
      'Điều chỉnh giá theo thị trường',
    ],
    discountPrice: [
      'Cập nhật giá ưu đãi sản phẩm',
      'Áp dụng khuyến mãi mới',
      'Hủy giá ưu đãi sản phẩm',
      'Điều chỉnh giá ưu đãi theo chương trình',
    ],
    quantityInStock: [
      'Điều chỉnh số lượng tồn kho sau kiểm kê',
      'Cập nhật thực tế tồn kho',
      'Điều chỉnh do sai lệch đếm kho',
    ],
    reorderLevel: [
      'Cập nhật mức cảnh báo tồn kho',
      'Điều chỉnh ngưỡng đặt hàng lại',
      'Thay đổi mức tối thiểu cần duy trì',
    ],
  };

  // Load default reasons from localStorage
  useEffect(() => {
    const savedReasons = JSON.parse(localStorage.getItem('inventory_default_reasons') || '{}');
    const savedPriorityReasons = JSON.parse(localStorage.getItem('inventory_priority_reasons') || '{}');
    
    setSettings(prev => ({
      ...prev,
      defaultReasons: savedReasons,
      priorityReasons: savedPriorityReasons
    }));
  }, []);

  const saveSettings = () => {
    localStorage.setItem('inventory_default_increase_type', settings.defaultIncreaseType);
    localStorage.setItem('inventory_default_decrease_type', settings.defaultDecreaseType);
    localStorage.setItem('inventory_default_delete_type', settings.defaultDeleteType);
    localStorage.setItem('inventory_default_adjust_type', settings.defaultAdjustType);
    localStorage.setItem('inventory_skip_confirmation', settings.skipConfirmation.toString());
    localStorage.setItem('inventory_default_reasons', JSON.stringify(settings.defaultReasons));
    localStorage.setItem('inventory_priority_reasons', JSON.stringify(settings.priorityReasons));
    
    toast.success('Đã lưu cài đặt thành công');
    onClose();
  };

  const handleAddReason = () => {
    if (!settings.newReason.trim()) {
      toast.error('Vui lòng nhập lý do');
      return;
    }

    if (settings.defaultReasons[settings.reasonType]?.includes(settings.newReason)) {
      toast.error('Lý do này đã tồn tại');
      return;
    }

    const updatedReasons = {...settings.defaultReasons};
    if (!updatedReasons[settings.reasonType]) {
      updatedReasons[settings.reasonType] = [];
    }
    
    updatedReasons[settings.reasonType] = [
      settings.newReason,
      ...updatedReasons[settings.reasonType]
    ];

    setSettings({
      ...settings,
      defaultReasons: updatedReasons,
      newReason: ''
    });

    toast.success('Đã thêm lý do mới');
  };

  const handleTogglePriorityReason = (type, reason) => {
    const updatedPriorities = {...settings.priorityReasons};
    
    if (!updatedPriorities[type]) {
      updatedPriorities[type] = [];
    }
    
    if (updatedPriorities[type].includes(reason)) {
      // Remove from priority list
      updatedPriorities[type] = updatedPriorities[type].filter(r => r !== reason);
    } else {
      // Add to priority list
      updatedPriorities[type].push(reason);
    }
    
    setSettings({
      ...settings,
      priorityReasons: updatedPriorities
    });
  };

  const handleRemoveReason = (type, reason) => {
    // Define core default reasons that cannot be removed
    const coreDefaultReasons = {
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
      ],
      // Field-specific core reasons
      ...Object.keys(fieldSpecificReasons).reduce((acc, field) => {
        acc[field] = fieldSpecificReasons[field];
        return acc;
      }, {})
    };

    // Check if it's a core reason that cannot be removed
    const isCoreDefined = Object.values(coreDefaultReasons).some(list => 
      list && list.includes(reason)
    );
    if (isCoreDefined) {
      toast.error('Không thể xóa lý do mặc định hệ thống');
      return;
    }

    const updatedReasons = {...settings.defaultReasons};
    updatedReasons[type] = updatedReasons[type].filter(r => r !== reason);

    // Also remove from priority reasons if it exists there
    const updatedPriorities = {...settings.priorityReasons};
    if (updatedPriorities[type]?.includes(reason)) {
      updatedPriorities[type] = updatedPriorities[type].filter(r => r !== reason);
    }

    setSettings({
      ...settings,
      defaultReasons: updatedReasons,
      priorityReasons: updatedPriorities
    });

    toast.success('Đã xóa lý do');
  };

  const syncFieldReasons = () => {
    const updatedReasons = {...settings.defaultReasons};
    
    // Ensure all field-specific reasons exist
    Object.keys(fieldSpecificReasons).forEach(field => {
      if (!updatedReasons[field]) {
        updatedReasons[field] = [...fieldSpecificReasons[field]];
      } else {
        // Add any missing core reasons for this field
        fieldSpecificReasons[field].forEach(reason => {
          if (!updatedReasons[field].includes(reason)) {
            updatedReasons[field].push(reason);
          }
        });
      }
    });
    
    setSettings({
      ...settings,
      defaultReasons: updatedReasons
    });
    
    toast.success('Đã đồng bộ lý do mặc định cho các trường');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Settings className="mr-2" size={20} />
            Cài đặt ghi nhận lịch sử thay đổi
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-b">
          <div className="flex">
            <button
              className={`px-4 py-2 text-sm font-medium ${settings.activeTab === 'general' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSettings({...settings, activeTab: 'general'})}
            >
              Cài đặt chung
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${settings.activeTab === 'reason-type' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSettings({...settings, activeTab: 'reason-type', reasonType: 'adjust'})}
            >
              Lý do theo loại giao dịch
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${settings.activeTab === 'reason-field' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSettings({...settings, activeTab: 'reason-field', reasonType: 'volume'})}
            >
              Lý do theo trường dữ liệu
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* General Settings Tab */}
          {settings.activeTab === 'general' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Cài đặt mặc định</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giao dịch mặc định khi tăng số lượng
                  </label>
                  <select
                    value={settings.defaultIncreaseType}
                    onChange={(e) => setSettings({...settings, defaultIncreaseType: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="import">Nhập kho (Import)</option>
                    <option value="adjust">Điều chỉnh (Adjust)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giao dịch mặc định khi giảm số lượng
                  </label>
                  <select
                    value={settings.defaultDecreaseType}
                    onChange={(e) => setSettings({...settings, defaultDecreaseType: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="sell">Bán hàng (Sell)</option>
                    <option value="export">Xuất kho (Export)</option>
                    <option value="adjust">Điều chỉnh (Adjust)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giao dịch mặc định khi xóa phiên bản
                  </label>
                  <select
                    value={settings.defaultDeleteType}
                    onChange={(e) => setSettings({...settings, defaultDeleteType: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="delete">Xóa (Delete)</option>
                    <option value="export">Xuất kho (Export)</option>
                    <option value="adjust">Điều chỉnh (Adjust)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giao dịch mặc định khi sửa thông tin
                  </label>
                  <select
                    value={settings.defaultAdjustType}
                    onChange={(e) => setSettings({...settings, defaultAdjustType: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="adjust">Điều chỉnh (Adjust)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="skipConfirmation"
                    checked={settings.skipConfirmation}
                    onChange={(e) => setSettings({...settings, skipConfirmation: e.target.checked})}
                    className="mr-2 rounded"
                  />
                  <label htmlFor="skipConfirmation" className="text-sm font-medium text-gray-700">
                    Không hỏi xác nhận nội dung khi ghi nhận lịch sử thay đổi
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Khi bật tùy chọn này, hệ thống sẽ không hiển thị popup xác nhận khi sửa đổi sản phẩm. Chỉ áp dụng cho thao tác sửa, không áp dụng cho thao tác thêm mới.
                </p>
              </div>

              <div className="mt-4">
                <button 
                  onClick={syncFieldReasons}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                >
                  Đồng bộ lý do mặc định cho các trường
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Thao tác này sẽ thêm các lý do mặc định cho từng trường nếu chưa có
                </p>
              </div>
            </div>
          )}

          {/* Reason by Transaction Type Tab */}
          {settings.activeTab === 'reason-type' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-700">Quản lý lý do theo loại giao dịch</h3>
                
                <select
                  value={settings.reasonType}
                  onChange={(e) => setSettings({...settings, reasonType: e.target.value})}
                  className="p-1.5 border border-gray-300 rounded-md text-sm"
                >
                  <option value="adjust">Điều chỉnh (Adjust)</option>
                  <option value="import">Nhập kho (Import)</option>
                  <option value="export">Xuất kho (Export)</option>
                  <option value="sell">Bán hàng (Sell)</option>
                  <option value="delete">Xóa (Delete)</option>
                </select>
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  value={settings.newReason}
                  onChange={(e) => setSettings({...settings, newReason: e.target.value})}
                  placeholder="Nhập lý do mới..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddReason}
                  className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 flex items-center"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="mt-2 border rounded-md overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 border-b">
                  <h4 className="font-medium text-sm flex items-center">
                    <span>Danh sách lý do cho {settings.reasonType}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      (Đánh dấu sao cho lý do ưu tiên)
                    </span>
                  </h4>
                </div>
                <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                  {(settings.defaultReasons[settings.reasonType] || []).map((reason, index) => {
                    const isPriority = (settings.priorityReasons[settings.reasonType] || []).includes(reason);
                    
                    return (
                      <li key={index} className={`px-3 py-2 flex justify-between items-center group hover:bg-gray-50 ${isPriority ? 'bg-yellow-50' : ''}`}>
                        <span className="text-sm flex items-center">
                          <button
                            onClick={() => handleTogglePriorityReason(settings.reasonType, reason)}
                            className={`mr-2 ${isPriority ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}`}
                            title={isPriority ? 'Bỏ ưu tiên' : 'Đánh dấu ưu tiên'}
                          >
                            <Star size={16} />
                          </button>
                          {reason}
                        </span>
                        <button
                          onClick={() => handleRemoveReason(settings.reasonType, reason)}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Xóa lý do này"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    );
                  })}
                  {(!settings.defaultReasons[settings.reasonType] || settings.defaultReasons[settings.reasonType].length === 0) && (
                    <li className="px-3 py-2 text-sm text-gray-500 italic">
                      Chưa có lý do nào được định nghĩa
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Reason by Field Tab */}
          {settings.activeTab === 'reason-field' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-700">Quản lý lý do theo trường dữ liệu</h3>
                
                <select
                  value={settings.reasonType}
                  onChange={(e) => setSettings({...settings, reasonType: e.target.value})}
                  className="p-1.5 border border-gray-300 rounded-md text-sm"
                >
                  <option value="volume">Dung tích (Volume)</option>
                  <option value="price">Giá gốc (Price)</option>
                  <option value="discountPrice">Giá ưu đãi (Discount Price)</option>
                  <option value="quantityInStock">Số lượng tồn kho (Quantity)</option>
                  <option value="reorderLevel">Mức cảnh báo (Reorder Level)</option>
                </select>
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  value={settings.newReason}
                  onChange={(e) => setSettings({...settings, newReason: e.target.value})}
                  placeholder="Nhập lý do mới..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddReason}
                  className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 flex items-center"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="mt-2 border rounded-md overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 border-b">
                  <h4 className="font-medium text-sm flex items-center">
                    <span>Danh sách lý do cho {settings.reasonType}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      (Đánh dấu sao cho lý do ưu tiên)
                    </span>
                  </h4>
                </div>
                <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                  {(settings.defaultReasons[settings.reasonType] || []).map((reason, index) => {
                    const isPriority = (settings.priorityReasons[settings.reasonType] || []).includes(reason);
                    const isCore = fieldSpecificReasons[settings.reasonType]?.includes(reason);
                    
                    return (
                      <li key={index} className={`px-3 py-2 flex justify-between items-center group hover:bg-gray-50 ${isPriority ? 'bg-yellow-50' : ''}`}>
                        <span className="text-sm flex items-center">
                          <button
                            onClick={() => handleTogglePriorityReason(settings.reasonType, reason)}
                            className={`mr-2 ${isPriority ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}`}
                            title={isPriority ? 'Bỏ ưu tiên' : 'Đánh dấu ưu tiên'}
                          >
                            <Star size={16} />
                          </button>
                          <span className={isCore ? 'font-medium' : ''}>{reason}</span>
                        </span>
                        <button
                          onClick={() => handleRemoveReason(settings.reasonType, reason)}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Xóa lý do này"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    );
                  })}
                  {(!settings.defaultReasons[settings.reasonType] || settings.defaultReasons[settings.reasonType].length === 0) && (
                    <li className="px-3 py-2 text-sm text-gray-500 italic">
                      Chưa có lý do nào được định nghĩa
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="mt-4 bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                <p>Lý do theo trường dữ liệu sẽ được áp dụng khi thực hiện thao tác sửa đổi thông tin sản phẩm hoặc phiên bản sản phẩm.</p>
                <p className="mt-1">Ví dụ: Khi thay đổi giá gốc, hệ thống sẽ sử dụng lý do mặc định cho trường "Giá gốc".</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-2"
          >
            Hủy
          </button>
          <button
            onClick={saveSettings}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Save size={16} className="mr-1" />
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryTransactionSettings; 