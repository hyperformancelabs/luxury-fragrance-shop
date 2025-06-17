import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';

/**
 * TableToolbar – Standard toolbar displayed above every data table.
 *
 * Props:
 *  - searchValue: string
 *  - onSearchChange: (e) => void
 *  - onSearchSubmit: (e) => void  // Typically same as onSearchChange when user presses Enter
 *  - placeholder?: string
 *  - onFilter?: () => void
 *  - addLabel?: string (default: 'Thêm')
 *  - onAdd: () => void
 *  - extraActions?: ReactNode // rendered left of "Thêm" button, visible when not null
 *  - searchInputClass?: string // optional additional class names applied to search input
 */
const TableToolbar = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  placeholder = 'Tìm kiếm...',
  onFilter = () => {},
  addLabel = 'Thêm',
  onAdd,
  extraActions = null,
  searchInputClass = '',
}) => {
  return (
    <div className="p-4 border-b flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
      {/* Search + Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <form onSubmit={onSearchSubmit} className="flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={placeholder}
              value={searchValue}
              onChange={onSearchChange}
              className={`${searchInputClass} pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>
        </form>
        <button
          type="button"
          onClick={(e)=>onFilter && onFilter(e)}
          className="p-2 rounded-lg border bg-white text-gray-600 hover:bg-gray-100 focus:outline-none"
        >
          <Filter size={20} />
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {extraActions}
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 focus:outline-none"
          >
            <Plus size={18} className="mr-1" />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default TableToolbar; 