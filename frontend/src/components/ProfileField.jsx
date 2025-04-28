import React from 'react';

const ProfileField = ({ label, value, isEditMode, onChange }) => {
  return (
    <div className="flex flex-wrap items-center py-4 border-b">
      <div className="w-full md:w-1/3 font-medium text-gray-700 mb-2 md:mb-0">{label}:</div>
      <div className="w-full md:w-2/3">
        {isEditMode ? (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        ) : (
          <span className="font-medium">{value || 'Chưa cập nhật'}</span>
        )}
      </div>
    </div>
  );
};

export default ProfileField;
