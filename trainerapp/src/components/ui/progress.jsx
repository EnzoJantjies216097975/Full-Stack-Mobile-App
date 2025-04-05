import React from 'react';

export function Progress({ value = 0, className = '', ...props }) {
  return (
    <div 
      className={`h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}
      {...props}
    >
      <div 
        className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}