import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { useToast } from '../../context/ToastContext';
import { TripCalendar } from '../../components/calendar/TripCalendar';
import { Timeline } from '../../components/calendar/Timeline';
import { AddActivity } from '../../components/itinerary/AddActivity';
import { Button } from '../../components/common/Button';
import { formatDateRange, calculateDaysBetween, addDays } from '../../utils/dateUtils';
import {
  CalendarDays,
  ArrowLeft,
  Edit,
  CreditCard,
  Eye,
  Plus,
} from 'lucide-react';

export const CalendarPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTripById, toggleActivityStatus, deleteActivity } = useTrips();
  const { addToast } = useToast();

  const trip = getTripById(id);

  const [selectedDate, setSelectedDate] = useState(() => trip?.startDate || '');
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [selectedCityName, setSelectedCityName] = useState(() => trip?.stops?.[0]?.cityName || 'Day 1');
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);

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

  const stops = trip.stops || [];

  // Find stop matching selectedDate
  const currentStop =
    stops.find((s) => selectedDate >= s.arrivalDate && selectedDate <= s.departureDate) ||
    stops[0];

  // Activities for selectedDate
  const dayActivities = (currentStop?.activities || []).filter(
    (a) => a.date === selectedDate || (!a.date && a.dayNumber === selectedDayNumber)
  );

  const handleSelectDate = (date, dayIndex, cityName) => {
    setSelectedDate(date);
    setSelectedDayNumber(dayIndex);
    setSelectedCityName(cityName);
  };

  const handleToggleActivity = (actId) => {
    if (!currentStop) return;
    toggleActivityStatus(trip.id, currentStop.id, actId);
  };

  const handleDeleteActivity = (actId) => {
    if (!currentStop) return;
    deleteActivity(trip.id, currentStop.id, actId);
    addToast('Activity removed from schedule', 'info');
  };

  return (
    <div>
      {/* Top Header Controls */}
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
            Interactive Calendar & Timeline
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="outline"
            size="sm"
            icon={Edit}
            onClick={() => navigate(`/trips/${trip.id}/builder`)}
          >
            Builder
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={CreditCard}
            onClick={() => navigate(`/trips/${trip.id}/budget`)}
          >
            Budget
          </Button>
        </div>
      </div>

      {/* Grid: Calendar & Day Timeline */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Calendar View */}
        <TripCalendar
          trip={trip}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          onOpenAddActivity={() => setIsAddActivityOpen(true)}
        />

        {/* Selected Day Timeline */}
        <Timeline
          selectedDate={selectedDate}
          selectedDayNumber={selectedDayNumber}
          selectedCityName={selectedCityName}
          activities={dayActivities}
          tripCurrency={trip.currency}
          onOpenAddActivity={() => setIsAddActivityOpen(true)}
          onToggleActivity={handleToggleActivity}
          onDeleteActivity={handleDeleteActivity}
        />
      </div>

      {/* Add Activity Modal */}
      {currentStop && (
        <AddActivity
          isOpen={isAddActivityOpen}
          onClose={() => setIsAddActivityOpen(false)}
          tripId={trip.id}
          stopId={currentStop.id}
          defaultDate={selectedDate}
          defaultDayNumber={selectedDayNumber}
          cityName={currentStop.cityName}
          tripCurrency={trip.currency}
        />
      )}
    </div>
  );
};
