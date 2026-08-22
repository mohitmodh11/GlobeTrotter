import React from 'react';

export const Badge = ({ children, variant = 'green', className = '', ...props }) => {
  const variantClass = {
    green: 'badge-green',
    'solid-green': 'badge-solid-green',
    gray: 'badge-gray',
    warning: 'badge-warning',
    danger: 'badge-danger',
  }[variant] || 'badge-green';

  return (
    <span className={`badge ${variantClass} ${className}`} {...props}>
      {children}
    </span>
  );
};
