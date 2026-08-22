import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { IndianRupee } from '../common/IndianRupee';
import { Plus, Plane, MapPin, Calendar, Sparkles } from 'lucide-react';

export const WelcomeSection = ({ trips: propTrips }) => {
  const { user } = useAuth();
  const { trips: contextTrips } = useTrips();
  const navigate = useNavigate();

  // Use live trips from TripContext if not provided in props
  const trips = propTrips !== undefined ? propTrips : (contextTrips || []);

  // Aggregate stats based on user's travel plans
  const totalTrips = trips.length;
  const totalStops = trips.reduce((acc, t) => acc + (t.stops?.length || 0), 0);
  const totalActivities = trips.reduce(
    (acc, t) =>
      acc +
      (t.stops?.reduce((stopAcc, s) => stopAcc + (s.activities?.length || 0), 0) || 0),
    0
  );
  const totalPlannedBudget = trips.reduce(
    (acc, t) => acc + (Number(t.targetBudget) || 0),
    0
  );

  const stats = [
    { label: 'Travel Plans', value: totalTrips, icon: Plane, color: '#15803d', bg: '#f0fdf4' },
    { label: 'Destinations Visited', value: totalStops, icon: MapPin, color: '#15803d', bg: '#f0fdf4' },
    { label: 'Activities Planned', value: totalActivities, icon: Calendar, color: '#15803d', bg: '#f0fdf4' },
    {
      label: 'Total Budgeted',
      value: formatCurrency(totalPlannedBudget, user?.currency || 'INR'),
      icon: IndianRupee,
      color: '#15803d',
      bg: '#f0fdf4',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#15803d',
                backgroundColor: '#f0fdf4',
                padding: '3px 10px',
                borderRadius: '9999px',
                border: '1px solid #bbf7d0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={13} /> Welcome back
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Hello, {user?.name || 'Traveler'}! ✈️
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#64748b', marginTop: '4px' }}>
            Where is your next adventure taking you? Create and customize your day-by-day travel plans.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          icon={Plus}
          onClick={() => navigate('/trips/new')}
        >
          Plan New Trip
        </Button>
      </div>

      {/* Quick Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          borderTop: '1px solid #f1f5f9',
          paddingTop: '20px',
        }}
      >
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: st.bg,
                  border: '1px solid #bbf7d0',
                  color: st.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={20} />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  {st.label}
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                  {st.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
