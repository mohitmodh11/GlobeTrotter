import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { StopCard } from './StopCard';
import { AddStop } from './AddStop';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { formatDateRange, calculateDaysBetween, addDays } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  Plus,
  MapPin,
  Calendar,
  Eye,
  CreditCard,
  CalendarDays,
  Share2,
  Settings,
  ArrowLeft,
} from 'lucide-react';

export const ItineraryBuilder = ({ trip }) => {
  const navigate = useNavigate();
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);

  const durationDays = calculateDaysBetween(trip.startDate, trip.endDate);
  const stops = trip.stops || [];

  // Determine default next arrival date
  const lastStop = stops[stops.length - 1];
  const nextArrivalDate = lastStop ? lastStop.departureDate : trip.startDate;

  // Compute live costs
  const stayCost = stops.reduce(
    (acc, s) => acc + (Number(s.accommodation?.cost) || 0),
    0
  );
  const transportCost = stops.reduce(
    (acc, s) => acc + (Number(s.transportToNext?.cost) || 0),
    0
  );
  const activityCost = stops.reduce(
    (acc, s) =>
      acc + (s.activities || []).reduce((aAcc, a) => aAcc + (Number(a.cost) || 0), 0),
    0
  );
  const customExpensesCost = (trip.expenses || []).reduce(
    (acc, e) => acc + (Number(e.amount) || 0),
    0
  );
  const totalEstimatedCost = Math.max(stayCost + transportCost + activityCost, customExpensesCost);
  const remainingBudget = (trip.targetBudget || 0) - totalEstimatedCost;
  const isOverbudget = remainingBudget < 0;

  return (
    <div>
      {/* Top Breadcrumb & Action Bar */}
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
            onClick={() => navigate('/trips')}
          >
            My Trips
          </Button>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
            Itinerary Builder
          </span>
        </div>

        {/* Quick Screen Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={() => navigate(`/trips/${trip.id}`)}
          >
            Itinerary View
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={CreditCard}
            onClick={() => navigate(`/trips/${trip.id}/budget`)}
          >
            Budget & Costs
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={CalendarDays}
            onClick={() => navigate(`/trips/${trip.id}/calendar`)}
          >
            Calendar
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Settings}
            onClick={() => navigate(`/trips/${trip.id}/edit`)}
          >
            Settings
          </Button>
        </div>
      </div>

      {/* Trip Header Banner */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#15803d',
                  backgroundColor: '#f0fdf4',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: '1px solid #bbf7d0',
                }}
              >
                {trip.category?.toUpperCase() || 'TRIP'}
              </span>
              <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                {formatDateRange(trip.startDate, trip.endDate)} ({durationDays} Days)
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
              {trip.name}
            </h1>
            {trip.description && (
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px', maxWidth: '700px' }}>
                {trip.description}
              </p>
            )}
          </div>

          {/* Quick Budget Tally */}
          <div
            style={{
              backgroundColor: isOverbudget ? '#fef2f2' : '#f0fdf4',
              border: `1px solid ${isOverbudget ? '#fecaca' : '#bbf7d0'}`,
              borderRadius: '12px',
              padding: '14px 20px',
              textAlign: 'right',
              minWidth: '220px',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isOverbudget ? '#b91c1c' : '#166534' }}>
              Est. Total / Target Budget
            </span>
            <p
              style={{
                fontSize: '1.375rem',
                fontWeight: 800,
                color: isOverbudget ? '#dc2626' : '#15803d',
                lineHeight: 1.2,
              }}
            >
              {formatCurrency(totalEstimatedCost, trip.currency)}
              <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
                {' '}/ {formatCurrency(trip.targetBudget, trip.currency)}
              </span>
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                color: isOverbudget ? '#b91c1c' : '#166534',
                marginTop: '2px',
                fontWeight: 600,
              }}
            >
              {isOverbudget
                ? `Over budget by ${formatCurrency(Math.abs(remainingBudget), trip.currency)}`
                : `${formatCurrency(remainingBudget, trip.currency)} remaining`}
            </p>
          </div>
        </div>
      </div>

      {/* Stops Builder Workspace */}
      <div style={{ marginBottom: '24px' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Itinerary Stops & Schedule</h2>
            <p className="section-subtitle">
              Add cities, organize day plans, schedule activities, and manage transportation.
            </p>
          </div>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddStopOpen(true)}
          >
            Add Another Stop
          </Button>
        </div>

        {stops.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {stops.map((stop, idx) => (
              <StopCard
                key={stop.id || idx}
                stop={stop}
                index={idx}
                totalStops={stops.length}
                tripId={trip.id}
                tripCurrency={trip.currency}
                tripStartDate={trip.startDate}
              />
            ))}

            {/* Bottom Add Stop CTA */}
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <Button
                variant="outline"
                size="lg"
                icon={Plus}
                onClick={() => setIsAddStopOpen(true)}
              >
                Add Another Destination Stop
              </Button>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={MapPin}
            title="No destination stops in this trip yet"
            description="Start building your journey by adding your first city stop."
            actionLabel="Add First Stop"
            onAction={() => setIsAddStopOpen(true)}
          />
        )}
      </div>

      {/* Add Stop Modal */}
      <AddStop
        isOpen={isAddStopOpen}
        onClose={() => setIsAddStopOpen(false)}
        tripId={trip.id}
        defaultArrivalDate={nextArrivalDate}
        tripCurrency={trip.currency}
      />
    </div>
  );
};
