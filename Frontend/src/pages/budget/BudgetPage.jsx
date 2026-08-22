import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { BudgetChart } from '../../components/budget/BudgetChart';
import { CostBreakdown } from '../../components/budget/CostBreakdown';
import { AddExpense } from '../../components/budget/AddExpense';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateDaysBetween, formatDateRange } from '../../utils/dateUtils';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { IndianRupee } from '../../components/common/IndianRupee';
import {
  AlertTriangle,
  CheckCircle,
  CreditCard,
  Plus,
  ArrowLeft,
  Calendar,
  Layers,
  PieChart,
  TrendingUp,
} from 'lucide-react';

export const BudgetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTripById } = useTrips();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const trip = getTripById(id);

  if (!trip) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Trip not found</h2>
        <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '16px' }}>
          We could not locate this itinerary.
        </p>
        <Button variant="primary" onClick={() => navigate('/trips')}>
          Back to My Trips
        </Button>
      </div>
    );
  }

  const durationDays = calculateDaysBetween(trip.startDate, trip.endDate);
  const stops = trip.stops || [];

  // Compute category totals
  const stayCost = stops.reduce((acc, s) => acc + (Number(s.accommodation?.cost) || 0), 0);
  const transportCost = stops.reduce((acc, s) => acc + (Number(s.transportToNext?.cost) || 0), 0);
  const activityCost = stops.reduce(
    (acc, s) =>
      acc + (s.activities || []).reduce((aAcc, a) => aAcc + (Number(a.cost) || 0), 0),
    0
  );

  // Custom logged expenses
  const customStay = (trip.expenses || [])
    .filter((e) => e.category === 'stay')
    .reduce((acc, e) => acc + Number(e.amount), 0);
  const customTransport = (trip.expenses || [])
    .filter((e) => e.category === 'transport')
    .reduce((acc, e) => acc + Number(e.amount), 0);
  const customActivities = (trip.expenses || [])
    .filter((e) => e.category === 'activities')
    .reduce((acc, e) => acc + Number(e.amount), 0);
  const customFood = (trip.expenses || [])
    .filter((e) => e.category === 'food')
    .reduce((acc, e) => acc + Number(e.amount), 0);
  const customShopping = (trip.expenses || [])
    .filter((e) => e.category === 'shopping')
    .reduce((acc, e) => acc + Number(e.amount), 0);
  const customMisc = (trip.expenses || [])
    .filter((e) => e.category === 'misc')
    .reduce((acc, e) => acc + Number(e.amount), 0);

  const finalStay = Math.max(stayCost, customStay);
  const finalTransport = Math.max(transportCost, customTransport);
  const finalActivities = Math.max(activityCost, customActivities);
  const finalFood = customFood;
  const finalShopping = customShopping;
  const finalMisc = customMisc;

  const totalEstimatedCost =
    finalStay + finalTransport + finalActivities + finalFood + finalShopping + finalMisc;

  const targetBudget = Number(trip.targetBudget) || 2500;
  const remainingBudget = targetBudget - totalEstimatedCost;
  const isOverbudget = remainingBudget < 0;
  const avgCostPerDay = durationDays > 0 ? totalEstimatedCost / durationDays : totalEstimatedCost;

  const categoryBreakdown = [
    { label: 'Accommodation', amount: finalStay, color: '#15803d' },
    { label: 'Transport & Flights', amount: finalTransport, color: '#16a34a' },
    { label: 'Activities & Sightseeing', amount: finalActivities, color: '#22c55e' },
    { label: 'Food & Dining', amount: finalFood, color: '#475569' },
    { label: 'Shopping & Souvenirs', amount: finalShopping, color: '#64748b' },
    { label: 'Miscellaneous', amount: finalMisc, color: '#94a3b8' },
  ];

  return (
    <div>
      {/* Breadcrumb & Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate(`/trips/${trip.id}`)}
          >
            Itinerary Overview
          </Button>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
            Budget & Cost Breakdown
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsAddExpenseOpen(true)}
          >
            Log Custom Expense
          </Button>
        </div>
      </div>

      {/* Overbudget Warning Alert (if applicable) */}
      {isOverbudget && (
        <div className="alert alert-danger" style={{ marginBottom: '24px' }}>
          <AlertTriangle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#b91c1c' }}>
              Budget Limit Exceeded by {formatCurrency(Math.abs(remainingBudget), trip.currency)}
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#7f1d1d', marginTop: '2px' }}>
              Your planned expenditures ({formatCurrency(totalEstimatedCost, trip.currency)}) have exceeded your target budget limit ({formatCurrency(targetBudget, trip.currency)}). Consider adjusting accommodation or activities.
            </p>
          </div>
        </div>
      )}

      {/* Financial Key Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Metric 1: Target Budget */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '20px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Target Budget
          </span>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
            {formatCurrency(targetBudget, trip.currency)}
          </p>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Total planned budget allocation
          </span>
        </div>

        {/* Metric 2: Estimated Spend */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '20px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Total Estimated Cost
          </span>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: isOverbudget ? '#dc2626' : '#15803d', margin: '4px 0' }}>
            {formatCurrency(totalEstimatedCost, trip.currency)}
          </p>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            All stays, transport & activities
          </span>
        </div>

        {/* Metric 3: Remaining / Deficit */}
        <div
          style={{
            backgroundColor: isOverbudget ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${isOverbudget ? '#fecaca' : '#bbf7d0'}`,
            borderRadius: '14px',
            padding: '20px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: isOverbudget ? '#b91c1c' : '#166534',
              textTransform: 'uppercase',
            }}
          >
            {isOverbudget ? 'Budget Deficit' : 'Safe Remaining'}
          </span>
          <p
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: isOverbudget ? '#dc2626' : '#15803d',
              margin: '4px 0',
            }}
          >
            {formatCurrency(Math.abs(remainingBudget), trip.currency)}
          </p>
          <span style={{ fontSize: '0.75rem', color: isOverbudget ? '#991b1b' : '#166534' }}>
            {isOverbudget ? 'Over target threshold' : 'Available for extra dining & fun'}
          </span>
        </div>

        {/* Metric 4: Daily Average */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '20px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Average Cost / Day
          </span>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
            {formatCurrency(avgCostPerDay, trip.currency)}
          </p>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Calculated across {durationDays} total days
          </span>
        </div>
      </div>

      {/* Chart and Category Summary Split */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* Donut Chart Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Expense Distribution by Category
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '16px' }}>
            Visual breakdown of where your travel budget is spent
          </p>
          <BudgetChart categoryBreakdown={categoryBreakdown} currency={trip.currency} />
        </div>

        {/* Category Totals List Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Cost Breakdown by Area
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '16px' }}>
            Detailed totals per expense classification
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {categoryBreakdown.map((cat, idx) => (
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '3px',
                      backgroundColor: cat.color,
                    }}
                  />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                    {cat.label}
                  </span>
                </div>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
                  {formatCurrency(cat.amount, trip.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <CostBreakdown trip={trip} onOpenAddExpense={() => setIsAddExpenseOpen(true)} />

      {/* Add Custom Expense Modal */}
      <AddExpense
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        tripId={trip.id}
        currency={trip.currency}
      />
    </div>
  );
};
