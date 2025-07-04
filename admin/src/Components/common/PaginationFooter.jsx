import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * PaginationFooter – Standard footer used at bottom of DataTable.
 *
 * Props:
 *  - page: number (1-based)
 *  - pageSize: number
 *  - totalItems: number
 *  - onPageChange: (newPage) => void
 */
const PaginationFooter = ({ page, pageSize, totalItems, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) {
    // Show first, last, current, and neighbours – hide others for large datasets
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (
      (i === 2 && page > 3) ||
      (i === totalPages - 1 && page < totalPages - 2)
    ) {
      pages.push('ellipsis-' + i);
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-3 text-sm text-gray-700">
      <span className="mb-2 md:mb-0">
        Hiển thị {from}-{to} trong {totalItems} mục
      </span>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p) => (
          typeof p === 'number' ? (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 border rounded ${p === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}
            >
              {p}
            </button>
          ) : (
            <span key={p} className="px-2">…</span>
          )
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default PaginationFooter; 