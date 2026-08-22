import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ message = 'Loading...', size = 'md' }) => {
  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 36 : 28;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        gap: '12px',
        color: '#15803d',
      }}
    >
      <Loader2
        size={iconSize}
        style={{
          animation: 'spin 1s linear infinite',
        }}
      />
      {message && <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{message}</span>}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
