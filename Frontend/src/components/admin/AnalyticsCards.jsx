import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { MOCK_ADMIN_STATS } from '../../utils/mockData';
import { formatCurrency } from '../../utils/formatCurrency';
import { IndianRupee } from '../common/IndianRupee';
import { Users, Plane, MapPin, Calendar, TrendingUp } from 'lucide-react';

export const AnalyticsCards = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getAnalytics();
        if (res?.success && res?.data) {
          setAnalytics(res.data);
        }
      } catch (err) {
        console.warn('Admin analytics API note:', err.message);
      }
    };
    fetchStats();
  }, []);

  const totalUsers = analytics ? (analytics.totalUsers ?? 0) : MOCK_ADMIN_STATS.totalUsers;
  const totalTrips = analytics ? (analytics.totalTrips ?? 0) : MOCK_ADMIN_STATS.totalTrips;
  const totalStops = analytics ? (analytics.totalCities ?? 0) : MOCK_ADMIN_STATS.totalStops;
  const totalExpenses = analytics ? (analytics.totalExpenses ?? 0) : MOCK_ADMIN_STATS.totalBudgetPlanned;

  const stats = [
    {
      label: 'Total Registered Users',
      value: Number(totalUsers).toLocaleString(),
      growth: '+14% this month',
      icon: Users,
    },
    {
      label: 'Trips & Itineraries Created',
      value: Number(totalTrips).toLocaleString(),
      growth: '+22% this month',
      icon: Plane,
    },
    {
      label: 'Destination Stops & Cities',
      value: Number(totalStops).toLocaleString(),
      growth: '+18% this month',
      icon: MapPin,
    },
    {
      label: 'Total Platform Expenses & Budget',
      value: formatCurrency(totalExpenses || 280000, 'INR'),
      growth: '+29% this month',
      icon: IndianRupee,
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}
    >
      {stats.map((st, idx) => {
        const Icon = st.icon;
        return (
          <div
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '20px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748b' }}>
                {st.label}
              </span>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={18} />
              </div>
            </div>
            <p style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              {st.value}
            </p>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '6px' }}>
              <TrendingUp size={12} /> {st.growth}
            </span>
          </div>
        );
      })}
    </div>
  );
};
