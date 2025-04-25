import React from 'react';

const DefaultContent = ({ title }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
    <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-64">
      <p className="text-gray-500">Nội dung cho {title} đang được phát triển</p>
    </div>
  </div>
);

export default DefaultContent;
