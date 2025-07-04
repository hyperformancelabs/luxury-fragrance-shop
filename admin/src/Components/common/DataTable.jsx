import React from 'react';

/**
 * DataTable – Uniform table styling wrapper. Handles:
 *   - Sticky header
 *   - Dividers & whitespace
 *   - Optional footer (e.g. pagination)
 *
 * Props:
 *  - children: table rows/content
 *  - footer?: ReactNode – Typically a PaginationFooter component
 *  - className?: string – Extra classes for <table>
 */
const DataTable = ({ children, footer = null, className = '' }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-gray-200 ${className}`}>{children}</table>
      </div>
      {footer && <div className="border-t bg-white">{footer}</div>}
    </div>
  );
};

export default DataTable; 