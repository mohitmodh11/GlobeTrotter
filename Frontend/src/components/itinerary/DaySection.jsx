import React from 'react';
import { ActivityCard } from './ActivityCard';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatCurrency';
import { Clock, MapPin, Calendar } from 'lucide-react';

export const DaySection = ({
  dayNumber,
  date,
  cityName,
  country,
  activities = [],
  tripCurrency = 'INR',
  readOnly = true,
}) => {
  const dayTotalCost = activities.reduce((acc, a) => acc + (Number(a.cost) || 0), 0);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Day Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          paddingBottom: '12px',
          marginBottom: '16px',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: 800,
              backgroundColor: '#15803d',
              color: '#ffffff',
              padding: '4px 12px',
              borderRadius: '8px',
            }}
          >
            Day {dayNumber}
          </span>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a' }}>
              {formatDate(date, { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
            {cityName && (
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#166534',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#f0fdf4',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  marginTop: '2px',
                }}
              >
                <MapPin size={11} /> {cityName}{country ? `, ${country}` : ''}
              </span>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Day Activity Total</span>
          <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#15803d' }}>
            {dayTotalCost > 0 ? formatCurrency(dayTotalCost, tripCurrency) : 'Free Entry (₹0)'}
          </p>
        </div>
      </div>

      {/* Activities Stream */}
      {activities.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activities.map((act) => (
            <ActivityCard
              key={act.id}
              activity={act}
              tripCurrency={tripCurrency}
              readOnly={readOnly}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '0.8125rem',
            color: '#94a3b8',
          }}
        >
          Free exploration / Leisure day with no scheduled tickets.
        </div>
      )}
    </div>
  );
};
