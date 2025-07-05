import React from 'react';

// Tailwind color classes
const colorClasses = {
  blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300',
  green: 'bg-green-600 hover:bg-green-700 focus:ring-green-300',
  yellow: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300',
  red: 'bg-red-600 hover:bg-red-700 focus:ring-red-300',
  gray: 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-300'
};

const ActionButton = ({
  children,
  onClick,
  color = 'blue',
  className = '',
  type = 'button',
  ariaLabel = ''
}) => {
  const safeColorClass = colorClasses[color] || colorClasses.blue;

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel || undefined}
      className={`inline-flex justify-center items-center text-sm font-semibold text-white rounded-md px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm ${safeColorClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default ActionButton;
