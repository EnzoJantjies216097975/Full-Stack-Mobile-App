import React from 'react';

export function Table({ children, className = '', ...props }) {
  return (
    <div className="overflow-x-auto">
      <table 
        className={`w-full border-collapse ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = '', ...props }) {
  return (
    <thead 
      className={`bg-gray-50 ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '', ...props }) {
  return (
    <tbody 
      className={className}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '', ...props }) {
  return (
    <tr 
      className={`border-b ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = '', ...props }) {
  return (
    <td 
      className={`px-4 py-3 ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}