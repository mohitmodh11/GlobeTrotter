import React, { useState } from 'react';
import { formatDate, calculateDaysBetween, addDays } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatCurrency';
import { Calendar as CalendarIcon, MapPin, Clock, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export const TripCalendar = ({
  trip,
  selectedDate,
  onSelectDate,
  onOpenAddActivity,
}) => {
  const durationDays = calculateDaysBetween(trip.startDate, trip.endDate);
  const stops = trip.stops || [];

  // Generate day-by-day dates
  const days = [];
  for (let i = 0; i < durationDays; i++) {
    const dDate = addDays(trip.startDate, i);

    // Find corresponding stop and activities for this date
    let matchedStop = null;
    let dayActivities = [];

    stops.forEach((s) => {
      const stopActs = (s.activities || []).filter(
        (a) => a.date === dDate || (!a.date && a.dayNumber === i + 1)
      );
      if (stopActs.length > 0) {
        dayActivities = [...dayActivities, ...stopActs];
      }
      if (dDate >= s.arrivalDate && dDate <= s.departureDate) {
        matchedStop = s;
      }
    });

    days.push({
      dayIndex: i + 1,
      date: dDate,
      cityName: matchedStop?.cityName || 'In Transit',
      activities: dayActivities,
    });
  }

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Trip Schedule Calendar
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Click on any day to inspect and plan hourly activities
          </p>
        </div>

        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#15803d',
            backgroundColor: '#f0fdf4',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid #bbf7d0',
          }}
        >
          {durationDays} Total Days
        </span>
      </div>

      {/* Calendar Days Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '12px',
        }}
      >
        {days.map((d) => {
          const isSelected = d.date === selectedDate;
          return (
            <div
              key={d.dayIndex}
              onClick={() => onSelectDate(d.date, d.dayIndex, d.cityName)}
              style={{
                border: isSelected ? '2px solid #15803d' : '1px solid #e2e8f0',
                backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '120px',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = '#bbf7d0';
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: isSelected ? '#15803d' : '#0f172a',
                  }}
                >
                  Day {d.dayIndex}
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                  {formatDate(d.date, { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '8px' }}>
                <MapPin size={10} color="#15803d" />
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#166534',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {d.cityName}
                </span>
              </div>

              {/* Activity Pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'auto' }}>
                {d.activities.slice(0, 2).map((act) => (
                  <div
                    key={act.id}
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      backgroundColor: isSelected ? '#ffffff' : '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: '#334155',
                    }}
                    title={act.title}
                  >
                    {act.title}
                  </div>
                ))}
                {d.activities.length > 2 && (
                  <span style={{ fontSize: '0.625rem', color: '#15803d', fontWeight: 700 }}>
                    +{d.activities.length - 2} more
                  </span>
                )}
                {d.activities.length === 0 && (
                  <span style={{ fontSize: '0.6875rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    Free day
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
