import React from 'react';
import { Button } from './Button';
import { Compass } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Compass,
  title = 'No items found',
  description = 'Get started by creating your first item.',
  actionLabel,
  onAction,
}) => {
  return (
    <div
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        border: '1px dashed #cbd5e1',
        borderRadius: '14px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '20px 0',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#15803d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '6px', color: '#0f172a' }}>
        {title}
      </h3>
      <p
        style={{
          fontSize: '0.875rem',
          color: '#64748b',
          maxWidth: '400px',
          marginBottom: actionLabel ? '20px' : 0,
        }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
