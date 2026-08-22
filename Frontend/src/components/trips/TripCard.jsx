import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatDateRange, calculateDaysBetween } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  Calendar,
  MapPin,
  Share2,
  Edit,
  Trash2,
  Copy,
  ArrowRight,
  MoreVertical,
  Layers,
  Clock,
} from 'lucide-react';

export const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  const { deleteTrip, duplicateTrip } = useTrips();
  const { addToast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const durationDays = calculateDaysBetween(trip.startDate, trip.endDate);
  const totalStopsCount = trip.stops?.length || 0;
  const totalActivitiesCount = (trip.stops || []).reduce(
    (acc, s) => acc + (s.activities?.length || 0),
    0
  );

  // Total calculated cost
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
  const customExpensesCost = (trip.expenses || []).reduce(
    (acc, e) => acc + (Number(e.amount) || 0),
    0
  );
  const totalEstimatedCost = Math.max(stayCost + transportCost + activityCost, customExpensesCost);
  const budgetPercentage = trip.targetBudget
    ? Math.min(Math.round((totalEstimatedCost / trip.targetBudget) * 100), 100)
    : 0;

  const handleDelete = () => {
    deleteTrip(trip.id);
    addToast(`Trip "${trip.name}" was deleted`, 'info');
  };

  const handleDuplicate = () => {
    const cloned = duplicateTrip(trip.id);
    if (cloned) {
      addToast(`Trip duplicated as "${cloned.name}"`, 'success');
      navigate(`/trips/${cloned.id}/builder`);
    }
  };

  const statusVariant = {
    Upcoming: 'green',
    'In Progress': 'solid-green',
    Completed: 'gray',
    Draft: 'warning',
  }[trip.status] || 'green';

  return (
    <div
      className="card card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
      }}
    >
      {/* Cover Image Container */}
      <div
        style={{
          position: 'relative',
          height: '180px',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#f1f5f9',
        }}
      >
        <img
          src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80'}
          alt={trip.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80';
          }}
        />

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Badge variant={statusVariant} style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {trip.status}
          </Badge>
          <span
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#0f172a',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
            }}
          >
            {durationDays} Days
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <div>
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: '#0f172a',
                lineHeight: 1.3,
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/trips/${trip.id}`)}
            >
              {trip.name}
            </h3>
            <p
              style={{
                fontSize: '0.8125rem',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '4px',
              }}
            >
              <Calendar size={13} />
              {formatDateRange(trip.startDate, trip.endDate)}
            </p>
          </div>

          {/* Quick Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex',
              }}
              aria-label="Trip actions"
            >
              <MoreVertical size={18} />
            </button>

            {isMenuOpen && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 50 }}
                  onClick={() => setIsMenuOpen(false)}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '28px',
                    width: '170px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                    padding: '4px',
                    zIndex: 60,
                  }}
                >
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/trips/${trip.id}/builder`);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      fontSize: '0.8125rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#334155',
                      borderRadius: '4px',
                    }}
                    className="dropdown-item"
                  >
                    <Edit size={14} /> Itinerary Builder
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleDuplicate();
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      fontSize: '0.8125rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#334155',
                      borderRadius: '4px',
                    }}
                    className="dropdown-item"
                  >
                    <Copy size={14} /> Duplicate Trip
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsDeleteModalOpen(true);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      fontSize: '0.8125rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#dc2626',
                      borderRadius: '4px',
                    }}
                    className="dropdown-item"
                  >
                    <Trash2 size={14} /> Delete Trip
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stops Sequence */}
        <div style={{ margin: '14px 0', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
          {totalStopsCount > 0 ? (
            trip.stops.map((stop, idx) => (
              <span
                key={stop.id || idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                  padding: '2px 8px',
                  borderRadius: '6px',
                }}
              >
                <MapPin size={11} />
                {stop.cityName}
                {idx < trip.stops.length - 1 && (
                  <ArrowRight size={10} style={{ marginLeft: '2px', color: '#15803d' }} />
                )}
              </span>
            ))
          ) : (
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No stops added yet</span>
          )}
        </div>

        {/* Metrics Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            padding: '10px 12px',
            backgroundColor: '#f8fafc',
            border: '1px solid #f1f5f9',
            borderRadius: '10px',
            marginBottom: '16px',
            marginTop: 'auto',
          }}
        >
          <div>
            <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Activities
            </span>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
              {totalActivitiesCount} planned
            </p>
          </div>
          <div>
            <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Est. Cost
            </span>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#15803d' }}>
              {formatCurrency(totalEstimatedCost, trip.currency)}
            </p>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: '#64748b',
              marginBottom: '4px',
            }}
          >
            <span>Target: {formatCurrency(trip.targetBudget, trip.currency)}</span>
            <span style={{ fontWeight: 600, color: budgetPercentage > 90 ? '#dc2626' : '#15803d' }}>
              {budgetPercentage}%
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#e2e8f0',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${budgetPercentage}%`,
                height: '100%',
                backgroundColor: budgetPercentage > 100 ? '#dc2626' : '#15803d',
                borderRadius: '9999px',
              }}
            />
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '12px',
          }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/trips/${trip.id}`)}
          >
            View Itinerary
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/trips/${trip.id}/builder`)}
          >
            Edit Builder
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Trip"
        message={`Are you sure you want to delete "${trip.name}"? All associated stops, activities, and budget expenses will be permanently removed.`}
        confirmText="Delete Trip"
      />
    </div>
  );
};
