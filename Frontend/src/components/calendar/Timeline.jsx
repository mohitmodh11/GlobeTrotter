import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatCurrency';
import { Clock, MapPin, DollarSign, Plus, CheckCircle, Circle, Trash2 } from 'lucide-react';

export const Timeline = ({
  selectedDate,
  selectedDayNumber,
  selectedCityName,
  activities = [],
  tripCurrency = 'INR',
  onOpenAddActivity,
  onToggleActivity,
  onDeleteActivity,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '16px',
          marginBottom: '20px',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 800,
                backgroundColor: '#15803d',
                color: '#ffffff',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              Day {selectedDayNumber}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: '#f0fdf4',
                color: '#15803d',
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid #bbf7d0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <MapPin size={11} /> {selectedCityName}
            </span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            {formatDate(selectedDate, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={onOpenAddActivity}
        >
          Add Activity to Day {selectedDayNumber}
        </Button>
      </div>

      {/* Vertical Timeline Track */}
      {activities.length > 0 ? (
        <div className="timeline-track">
          {activities.map((act, idx) => (
            <div
              key={act.id || idx}
              style={{
                position: 'relative',
                marginBottom: '20px',
                paddingBottom: idx < activities.length - 1 ? '12px' : 0,
              }}
            >
              <div className="timeline-dot" />

              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginLeft: '12px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={12} /> {act.exactTime || act.timeSlot}
                    </span>
                    <Badge variant="green">{act.category}</Badge>
                  </div>

                  <h4
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: act.isCompleted ? '#64748b' : '#0f172a',
                      textDecoration: act.isCompleted ? 'line-through' : 'none',
                    }}
                  >
                    {act.title}
                  </h4>

                  {act.notes && (
                    <p style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '6px', lineHeight: '1.4' }}>
                      {act.notes}
                    </p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', fontSize: '0.75rem' }}>
                    <span style={{ fontWeight: 700, color: '#15803d' }}>
                      {act.cost > 0 ? formatCurrency(act.cost, tripCurrency) : 'Free Admission'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => onToggleActivity(act.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: act.isCompleted ? '#15803d' : '#94a3b8',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                    title={act.isCompleted ? 'Mark as planned' : 'Mark as completed'}
                  >
                    {act.isCompleted ? <CheckCircle size={18} fill="#dcfce7" /> : <Circle size={18} />}
                  </button>
                  <button
                    onClick={() => onDeleteActivity(act.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                    title="Delete activity"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: '36px',
            textAlign: 'center',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1',
          }}
        >
          <Clock size={24} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
            No activities scheduled for this date
          </h4>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '4px', marginBottom: '16px' }}>
            Add morning, afternoon, or evening sights to organize this day's itinerary.
          </p>
          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={onOpenAddActivity}
          >
            Schedule First Activity
          </Button>
        </div>
      )}
    </div>
  );
};
