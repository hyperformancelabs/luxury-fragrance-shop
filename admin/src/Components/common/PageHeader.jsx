import React from 'react';

/**
 * PageHeader – A consistently-styled per-screen heading used across the Admin UI.
 *
 * Props:
 *  - title: string – main heading text.
 *  - subtitle?: string – optional subtitle text.
 *  - children?: ReactNode – optional nodes rendered on the same line (e.g. stats badges).
 */
const PageHeader = ({ title, subtitle, children }) => (
  <header className="bg-white shadow">
    <div className="px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap mr-4">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children && <div className="mt-3 sm:mt-0">{children}</div>}
    </div>
  </header>
);

export default PageHeader; 