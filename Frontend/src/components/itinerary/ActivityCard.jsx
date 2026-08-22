import React from 'react';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { Clock, CheckCircle, Circle, Trash2, MapPin, Tag } from 'lucide-react';

export const ActivityCard = ({
  activity,
  tripCurrency = 'INR',
  onToggleStatus,
  onDelete,
  readOnly = false,
}) => {
  const categoryVariant = {
    sightseeing: 'green',
    food: 'gray',
    adventure: 'solid-green',
    culture: 'gray',
    relaxation: 'green',
    shopping: 'gray',
  }[activity.category] || 'green';

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '12px',
        transition: 'all 0.15s ease',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
        {/* Toggle Complete Checkbox */}
        {!readOnly && (
          <button
            onClick={onToggleStatus}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activity.isCompleted ? '#15803d' : '#94a3b8',
              padding: '2px',
              marginTop: '2px',
              display: 'flex',
            }}
            title={activity.isCompleted ? 'Mark as planned' : 'Mark as completed'}
          >
            {activity.isCompleted ? (
              <CheckCircle size={18} fill="#dcfce7" />
            ) : (
              <Circle size={18} />
            )}
          </button>
        )}

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: activity.isCompleted ? '#64748b' : '#0f172a',
                textDecoration: activity.isCompleted ? 'line-through' : 'none',
              }}
            >
              {activity.title}
            </span>
            <Badge variant={categoryVariant}>
              {activity.category}
            </Badge>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.75rem',
              color: '#64748b',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <Clock size={12} />
              {activity.exactTime || 'Flexible Time'}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600, color: '#15803d' }}>
              {activity.cost > 0 ? formatCurrency(activity.cost, tripCurrency) : 'Free Entry'}
            </span>
          </div>

          {activity.notes && (
            <p
              style={{
                fontSize: '0.8125rem',
                color: '#475569',
                marginTop: '6px',
                lineHeight: '1.4',
                backgroundColor: '#f8fafc',
                padding: '6px 8px',
                borderRadius: '6px',
                border: '1px solid #f1f5f9',
              }}
            >
              {activity.notes}
            </p>
          )}
        </div>
      </div>

      {/* Delete button */}
      {!readOnly && onDelete && (
        <button
          onClick={onDelete}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
          }}
          title="Delete activity"
          onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
};
