import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Check, X } from 'lucide-react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

/**
 * Component hiển thị biểu tượng trợ giúp (?) với tooltip khi hover
 * @param {string} text - Nội dung tooltip
 * @param {string} className - Class CSS bổ sung
 */
export const FieldHelper = ({ text, className = '' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  return (
    <div className="relative inline-block">
      <span 
        className={`inline-flex items-center justify-center ml-2 text-gray-400 hover:text-blue-500 cursor-help transition-colors duration-200 ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Thông tin trợ giúp"
      >
        <HelpCircle size={16} strokeWidth={2} />
      </span>
      
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-gray-800 text-white text-xs rounded-md py-2 px-3 max-w-xs z-[9999] shadow-2xl animate-fadeIn"
          style={{ minWidth: '150px', maxWidth: '250px', pointerEvents: 'auto' }}
        >
          <div className="font-medium mb-1">Thông tin:</div>
          <div className="text-gray-200">{text}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  );
};

/**
 * Component hiển thị thanh độ mạnh mật khẩu với giao diện hiện đại
 * @param {string} password - Mật khẩu cần đánh giá
 */
export const PasswordStrengthMeter = ({ password }) => {
  // Tính toán độ mạnh của mật khẩu
  const strength = checkPasswordStrength(password);
  
  if (!password) return null;
  
  const getStrengthColor = (strength) => {
    if (strength <= 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    if (strength === 4) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  const getStrengthText = (strength) => {
    if (strength <= 1) return 'Yếu';
    if (strength === 2) return 'Trung bình';
    if (strength === 3) return 'Khá';
    if (strength === 4) return 'Mạnh';
    return 'Rất mạnh';
  };
  
  const getStrengthIcon = (strength) => {
    if (strength <= 1) return '⚠️'; // Cảnh báo
    if (strength === 2) return '🔒'; // Khóa
    if (strength === 3) return '🔓'; // Khóa mở
    if (strength === 4) return '✅'; // Dấu tích xanh
    return '💪'; // Cơ bắp
  };

  return (
    <div className="mt-2 password-strength-meter">
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden transition-all duration-300">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ease-out ${getStrengthColor(strength)}`} 
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <p className="text-xs flex items-center">
          <span className="mr-1">{getStrengthIcon(strength)}</span>
          <span className={`font-medium ${getStrengthColor(strength).replace('bg-', 'text-')}`}>
            {getStrengthText(strength)}
          </span>
        </p>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((level) => (
            <div 
              key={level} 
              className={`w-4 h-1 rounded-sm mx-0.5 ${level <= strength ? getStrengthColor(strength) : 'bg-gray-300'}`}
            ></div>
          ))}
        </div>
      </div>
      
      {strength <= 2 && (
        <p className="text-xs text-gray-500 mt-1">
          Thêm chữ hoa, số và ký tự đặc biệt để tăng độ bảo mật
        </p>
      )}
    </div>
  );
};

/**
 * Component hiển thị trường nhập số điện thoại với dropdown chọn mã vùng quốc tế
 * Sử dụng thư viện react-international-phone
 */
export const PhoneNumberInput = ({ value, onChange, onBlur, required, error }) => {
  const [phone, setPhone] = useState('');
  const [isValid] = useState(true); // validation managed by parent
  
  // Khởi tạo giá trị ban đầu
  useEffect(() => {
    if (value) {
      setPhone(value);
    }
  }, []);
  
  // Xử lý khi thay đổi số điện thoại: chỉ normalize
  const handlePhoneChange = (phoneValue, { country }) => {
    let normalized = phoneValue;
    // Remove leading zeros after country code, e.g. +840xxx => +84xxx
    const dial = country?.dialCode;
    if (dial && normalized.startsWith(`+${dial}0`)) {
      const regex = new RegExp(`^\\+${dial}0+`);
      normalized = normalized.replace(regex, `+${dial}`);
    }
    setPhone(normalized);
    if (onChange) onChange({ target: { name: 'phoneNumber', value: normalized } });
  };
  
  // Xử lý khi blur: chỉ gọi callback
  const handleBlur = (e) => {
    if (onBlur) onBlur(e);
  };

  
  return (
    <div className="phone-input-container">
      <PhoneInput
        defaultCountry="vn"
        value={phone}
        onChange={handlePhoneChange}
        onBlur={handleBlur}
        inputClassName={`w-full border ${error ? 'border-red-500' : isValid ? 'border-gray-300 focus:border-blue-500' : 'border-orange-300'} rounded-md transition-colors duration-200 py-2 pl-2 pr-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500`}
        containerClassName="relative flex items-center"
        buttonClassName="relative z-50 border-r-0 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 react-international-phone-country-selector-button px-4"
        dropdownClassName="max-h-60 overflow-y-auto shadow-lg rounded-md border border-gray-200 mt-1 z-50 bg-white"
        countrySelectorStyle={{ minWidth: 70, fontSize: 20 }} // Làm to hình cờ và mã vùng
        required={required}
        placeholder="Nhập số điện thoại"
      />
      
      {/* Biểu tượng xác thực đã bỏ hiển thị */}
      
      {/* Hiển thị thông báo lỗi */}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

/**
 * Kiểm tra độ mạnh của mật khẩu
 * @param {string} password - Mật khẩu cần kiểm tra
 * @returns {number} - Điểm đánh giá độ mạnh (0-5)
 */
export const checkPasswordStrength = (password) => {
  if (!password) return 0;
  
  let score = 0;
  // Độ dài tối thiểu
  if (password.length >= 6) score += 1;
  // Có chữ cái
  if (/[a-zA-Z]/.test(password)) score += 1;
  // Có số
  if (/\d/.test(password)) score += 1;
  // Có ký tự đặc biệt
  if (/[^a-zA-Z\d]/.test(password)) score += 1;
  // Độ dài tốt
  if (password.length >= 8) score += 1;
  
  return score;
};

/**
 * Chuẩn hóa họ tên: viết hoa chữ cái đầu mỗi từ và loại bỏ khoảng trắng thừa
 */
export const normalizeFullName = (fullName) => {
  if (!fullName) return '';
  
  // Loại bỏ khoảng trắng thừa
  const normalized = fullName.trim().replace(/\s+/g, ' ');
  
  // Viết hoa chữ cái đầu mỗi từ
  return normalized.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Chuẩn hóa địa chỉ: loại bỏ khoảng trắng thừa
 */
export const normalizeAddress = (address) => {
  if (!address) return '';
  return address.trim().replace(/\s+/g, ' ');
};
