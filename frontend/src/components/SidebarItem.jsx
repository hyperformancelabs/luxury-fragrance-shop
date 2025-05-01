import React from 'react';

const SidebarItem = ({ icon, text, active = false, onClick }) => {
    return (
      <button 
        onClick={onClick} 
        className={`flex items-center w-full space-x-3 p-3 rounded-lg transition duration-200 ${
          active ? 'bg-black text-white font-medium' : 'hover:bg-gray-100'
        }`}
      >
        <span className={active ? 'text-white' : 'text-gray-500'}>{icon}</span>
        <span>{text}</span>
      </button>
    );
  };
  
  export default SidebarItem;
  