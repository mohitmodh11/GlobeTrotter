import React from 'react';
import { AnalyticsCards } from '../../components/admin/AnalyticsCards';
import { PopularCities } from '../../components/admin/PopularCities';
import { UserTable } from '../../components/admin/UserTable';
import { Shield } from 'lucide-react';

export const AdminDashboard = () => {
  return (
    <div>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#15803d',
                backgroundColor: '#f0fdf4',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid #bbf7d0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Shield size={12} /> Platform Admin Control
            </span>
          </div>
          <h1 className="section-title" style={{ fontSize: '1.75rem' }}>
            Admin & Analytics Overview
          </h1>
          <p className="section-subtitle">
            Monitor platform usage, popular itinerary trends, destination adoption, and user activity.
          </p>
        </div>
      </div>

      <AnalyticsCards />
      <PopularCities />
      <UserTable />
    </div>
  );
};
