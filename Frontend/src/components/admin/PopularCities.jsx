import React from 'react';
import { MOCK_ADMIN_STATS } from '../../utils/mockData';
import { MapPin, TrendingUp } from 'lucide-react';

export const PopularCities = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px',
        marginBottom: '28px',
      }}
    >
      {/* Top Destinations */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>
            Top Trending Cities & Destinations
          </h3>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d' }}>
            Live Platform Data
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {MOCK_ADMIN_STATS.popularDestinations.map((dest, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: idx === 0 ? '#15803d' : '#e2e8f0',
                    color: idx === 0 ? '#ffffff' : '#475569',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {idx + 1}
                </span>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
                    {dest.name}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{dest.country}</p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>
                  {dest.tripsCount.toLocaleString()} trips
                </span>
                <p style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700 }}>
                  {dest.growth}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Categories Breakdown */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>
            Popular Activity Categories
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>User Scheduled</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {MOCK_ADMIN_STATS.activityCategories.map((cat, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>{cat.category}</span>
                <span style={{ fontWeight: 700, color: '#15803d' }}>
                  {cat.percentage}% ({cat.count.toLocaleString()})
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${cat.percentage}%`,
                    height: '100%',
                    backgroundColor: idx % 2 === 0 ? '#15803d' : '#16a34a',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
