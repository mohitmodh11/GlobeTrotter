import React, { useState } from 'react';
import { useTrips } from '../../context/TripContext';
import { useToast } from '../../context/ToastContext';
import { ActivityCard } from './ActivityCard';
import { AddActivity } from './AddActivity';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatDateRange, calculateDaysBetween, addDays } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  MapPin,
  Calendar,
  Building,
  Plane,
  Train,
  Car,
  Bus,
  Ship,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  DollarSign,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const StopCard = ({
  stop,
  index,
  totalStops,
  tripId,
  tripCurrency = 'INR',
  tripStartDate,
}) => {
  const {
    deleteStop,
    reorderStops,
    deleteActivity,
    toggleActivityStatus,
  } = useTrips();
  const { addToast } = useToast();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [selectedDayDate, setSelectedDayDate] = useState(stop.arrivalDate);

  const stopDuration = calculateDaysBetween(stop.arrivalDate, stop.departureDate);

  // Group activities for this stop by day
  const daysList = [];
  for (let i = 0; i < stopDuration; i++) {
    const dDate = addDays(stop.arrivalDate, i);
    const dayActs = (stop.activities || []).filter(
      (a) => a.date === dDate || (!a.date && a.dayNumber === i + 1)
    );
    daysList.push({
      dayIndex: i + 1,
      date: dDate,
      activities: dayActs,
    });
  }

  const handleDeleteStop = () => {
    deleteStop(tripId, stop.id);
    addToast(`Removed ${stop.cityName} from itinerary`, 'info');
  };

  const handleOpenAddActivity = (dayIndex, date) => {
    setSelectedDayNumber(dayIndex);
    setSelectedDayDate(date);
    setIsAddActivityOpen(true);
  };

  const getTransportIcon = (mode) => {
    switch (mode) {
      case 'flight':
        return Plane;
      case 'train':
        return Train;
      case 'car':
        return Car;
      case 'bus':
        return Bus;
      case 'ferry':
        return Ship;
      default:
        return Train;
    }
  };

  return (
    <div className="stop-card-item">
      {/* Stop Header */}
      <div
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: '#f8fafc',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#15803d',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.9375rem',
            }}
          >
            {index + 1}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {stop.cityName}
              </h3>
              {stop.country && (
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  ({stop.country})
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Calendar size={13} />
              {formatDateRange(stop.arrivalDate, stop.departureDate)} • {stopDuration} Days
            </p>
          </div>
        </div>

        {/* Reorder and Delete actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {index > 0 && (
            <button
              onClick={() => reorderStops(tripId, index, index - 1)}
              style={{
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                borderRadius: '6px',
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
              title="Move Up"
            >
              <ArrowUp size={14} /> Move Up
            </button>
          )}

          {index < totalStops - 1 && (
            <button
              onClick={() => reorderStops(tripId, index, index + 1)}
              style={{
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                borderRadius: '6px',
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
              title="Move Down"
            >
              <ArrowDown size={14} /> Move Down
            </button>
          )}

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            style={{
              border: '1px solid #fecaca',
              background: '#ffffff',
              color: '#dc2626',
              borderRadius: '6px',
              padding: '6px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Delete Stop"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Stop Body: Accommodation and Day Sections */}
      <div style={{ padding: '20px' }}>
        {/* Accommodation Summary Box */}
        {stop.accommodation?.hotelName && (
          <div
            style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #bbf7d0',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Building size={16} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                  Hotel / Accommodation
                </span>
                <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
                  {stop.accommodation.hotelName}
                </p>
                {stop.accommodation.notes && (
                  <p style={{ fontSize: '0.75rem', color: '#475569' }}>
                    {stop.accommodation.notes}
                  </p>
                )}
              </div>
            </div>

            {stop.accommodation.cost > 0 && (
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Stay Cost</span>
                <p style={{ fontSize: '1rem', fontWeight: 800, color: '#15803d' }}>
                  {formatCurrency(stop.accommodation.cost, tripCurrency)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Days & Activities List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {daysList.map((day) => (
            <div
              key={day.dayIndex}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '14px',
                backgroundColor: '#f8fafc',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 800,
                      color: '#15803d',
                      backgroundColor: '#f0fdf4',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      border: '1px solid #bbf7d0',
                    }}
                  >
                    Day {day.dayIndex}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 500 }}>
                    {day.date}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={() => handleOpenAddActivity(day.dayIndex, day.date)}
                >
                  Add Activity
                </Button>
              </div>

              {/* Activities on this day */}
              {day.activities.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {day.activities.map((act) => (
                    <ActivityCard
                      key={act.id}
                      activity={act}
                      tripCurrency={tripCurrency}
                      onToggleStatus={() => toggleActivityStatus(tripId, stop.id, act.id)}
                      onDelete={() => deleteActivity(tripId, stop.id, act.id)}
                    />
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8', fontStyle: 'italic', padding: '6px 0' }}>
                  No activities planned yet for this day. Click "+ Add Activity" to schedule sightseeing, meals, or adventures.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Inter-City Transport connector (if configured) */}
      {stop.transportToNext && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px dashed #cbd5e1',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {React.createElement(getTransportIcon(stop.transportToNext.mode), {
              size: 18,
              color: '#15803d',
            })}
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
              Transit to next destination ({stop.transportToNext.provider || 'Travel'})
            </span>
            {stop.transportToNext.duration && (
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                • Duration: {stop.transportToNext.duration}
              </span>
            )}
          </div>

          {stop.transportToNext.cost > 0 && (
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#15803d' }}>
              {formatCurrency(stop.transportToNext.cost, tripCurrency)}
            </span>
          )}
        </div>
      )}

      {/* Add Activity Modal */}
      <AddActivity
        isOpen={isAddActivityOpen}
        onClose={() => setIsAddActivityOpen(false)}
        tripId={tripId}
        stopId={stop.id}
        defaultDate={selectedDayDate}
        defaultDayNumber={selectedDayNumber}
        cityName={stop.cityName}
        tripCurrency={tripCurrency}
      />

      {/* Delete Stop Modal */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteStop}
        title={`Delete ${stop.cityName} Stop`}
        message={`Are you sure you want to remove ${stop.cityName} and all its scheduled activities from your itinerary?`}
        confirmText="Delete Stop"
      />
    </div>
  );
};
