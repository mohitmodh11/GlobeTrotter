import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Shield, Globe2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '36px 20px 24px',
        marginTop: 'auto',
      }}
      className="no-print"
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#15803d',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Compass size={18} />
            </div>
            <div>
              <span style={{ fontWeight: 800, color: '#15803d', fontSize: '1.1rem' }}>
                GlobeTrotter
              </span>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Simple, smart, multi-city travel planning and itinerary budgeting.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link to="/dashboard" style={{ fontSize: '0.875rem', color: '#475569' }}>
              Dashboard
            </Link>
            <Link to="/trips" style={{ fontSize: '0.875rem', color: '#475569' }}>
              My Trips
            </Link>
            <Link to="/cities" style={{ fontSize: '0.875rem', color: '#475569' }}>
              City Search
            </Link>
            <Link to="/activities" style={{ fontSize: '0.875rem', color: '#475569' }}>
              Activity Search
            </Link>
            <Link to="/profile" style={{ fontSize: '0.875rem', color: '#475569' }}>
              Preferences
            </Link>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid #f1f5f9',
            paddingTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8125rem',
            color: '#94a3b8',
          }}
        >
          <p>© {new Date().getFullYear()} GlobeTrotter. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#15803d',
                fontWeight: 600,
                backgroundColor: '#f0fdf4',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid #bbf7d0',
              }}
            >
              <Globe2 size={12} /> Solid White & Green Theme
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
