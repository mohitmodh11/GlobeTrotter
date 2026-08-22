import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { IndianRupee } from '../common/IndianRupee';
import { AlertCircle, ArrowUpRight, CheckCircle2, TrendingUp } from 'lucide-react';

export const BudgetHighlights = () => {
  const { trips } = useTrips();
  const navigate = useNavigate();

  if (trips.length === 0) return null;

  // Aggregate stats
  const totalTargetBudget = trips.reduce((acc, t) => acc + (Number(t.targetBudget) || 0), 0);

  const calculateTripTotalCost = (trip) => {
    const stayCost = (trip.stops || []).reduce(
      (acc, s) => acc + (Number(s.accommodation?.cost) || 0),
      0
    );
    const transportCost = (trip.stops || []).reduce(
      (acc, s) => acc + (Number(s.transportToNext?.cost) || 0),
      0
    );
    const activityCost = (trip.stops || []).reduce(
      (acc, s) =>
        acc + (s.activities || []).reduce((aAcc, a) => aAcc + (Number(a.cost) || 0), 0),
      0
    );
    const customCost = (trip.expenses || []).reduce(
      (acc, e) => acc + (Number(e.amount) || 0),
      0
    );
    return Math.max(stayCost + transportCost + activityCost, customCost);
  };

  const totalEstimatedSpend = trips.reduce((acc, t) => acc + calculateTripTotalCost(t), 0);
  const remainingBudget = totalTargetBudget - totalEstimatedSpend;
  const isOverbudget = remainingBudget < 0;

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
      <div className="section-header" style={{ marginBottom: '16px' }}>
        <div>
          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>
            Travel Financial Overview
          </h2>
          <p className="section-subtitle">Snapshot of budgets and estimated expenses</p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        {/* Card 1 */}
        <div
          style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>
              Total Budget Allocated
            </span>
            <IndianRupee size={16} color="#15803d" />
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            {formatCurrency(totalTargetBudget, 'INR')}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Across {trips.length} travel plans
          </p>
        </div>

        {/* Card 2 */}
        <div
          style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>
              Estimated Expenses
            </span>
            <TrendingUp size={16} color="#16a34a" />
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d' }}>
            {formatCurrency(totalEstimatedSpend, 'INR')}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Accommodation, activities & travel
          </p>
        </div>

        {/* Card 3 */}
        <div
          style={{
            padding: '16px',
            backgroundColor: isOverbudget ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${isOverbudget ? '#fecaca' : '#bbf7d0'}`,
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '0.8125rem',
                color: isOverbudget ? '#b91c1c' : '#166534',
                fontWeight: 600,
              }}
            >
              {isOverbudget ? 'Budget Deficit' : 'Safe Budget Surplus'}
            </span>
            {isOverbudget ? (
              <AlertCircle size={16} color="#dc2626" />
            ) : (
              <CheckCircle2 size={16} color="#15803d" />
            )}
          </div>
          <p
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: isOverbudget ? '#dc2626' : '#15803d',
            }}
          >
            {formatCurrency(Math.abs(remainingBudget), 'INR')}
          </p>
          <p
            style={{
              fontSize: '0.75rem',
              color: isOverbudget ? '#b91c1c' : '#166534',
              marginTop: '4px',
            }}
          >
            {isOverbudget
              ? 'Warning: Total expenses exceed target budget'
              : 'Well within overall planned budget limits'}
          </p>
        </div>
      </div>

      {/* Trips list with budget bars */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
          Per-Trip Financial Health
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {trips.map((trip) => {
            const cost = calculateTripTotalCost(trip);
            const percent = trip.targetBudget
              ? Math.round((cost / trip.targetBudget) * 100)
              : 0;
            const tripOverbudget = percent > 100;

            return (
              <div
                key={trip.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              >
                <div style={{ minWidth: '180px' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                    {trip.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {formatCurrency(cost, trip.currency)} of {formatCurrency(trip.targetBudget, trip.currency)}
                  </p>
                </div>

                <div style={{ flex: 1, minWidth: '160px', maxWidth: '300px' }}>
                  <div
                    style={{
                      height: '6px',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(percent, 100)}%`,
                        height: '100%',
                        backgroundColor: tripOverbudget ? '#dc2626' : '#15803d',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: tripOverbudget ? '#dc2626' : '#15803d',
                    }}
                  >
                    {percent}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={ArrowUpRight}
                    onClick={() => navigate(`/trips/${trip.id}/budget`)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
