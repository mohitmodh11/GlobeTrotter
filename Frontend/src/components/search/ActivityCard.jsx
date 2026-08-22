import React, { useState } from 'react';
import { useTrips } from '../../context/TripContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  Sparkles,
  Clock,
  MapPin,
  Star,
  Plus,
  Calendar,
} from 'lucide-react';

export const ActivityCard = ({ activity }) => {
  const { trips, addActivityToStop } = useTrips();
  const { addToast } = useToast();

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddToTripModalOpen, setIsAddToTripModalOpen] = useState(false);

  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id || '');
  const targetTrip = trips.find((t) => t.id === selectedTripId);
  const stops = targetTrip?.stops || [];
  const [selectedStopId, setSelectedStopId] = useState(stops[0]?.id || '');
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);

  const categoryVariant = {
    sightseeing: 'green',
    food: 'gray',
    adventure: 'solid-green',
    culture: 'gray',
    relaxation: 'green',
    shopping: 'gray',
  }[activity.category] || 'green';

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!selectedTripId || !selectedStopId) {
      addToast('Please select a trip and stop to add this activity', 'error');
      return;
    }

    const selectedStop = stops.find((s) => s.id === selectedStopId);

    addActivityToStop(selectedTripId, selectedStopId, {
      title: activity.title,
      category: activity.category,
      cost: activity.cost || 0,
      timeSlot: 'morning',
      exactTime: '10:00',
      dayNumber: Number(selectedDayNumber),
      notes: `${activity.description || ''} (Location: ${activity.location || ''})`,
    });

    addToast(
      `Added "${activity.title}" to ${selectedStop?.cityName || 'trip'}!`,
      'success'
    );
    setIsAddToTripModalOpen(false);
  };

  return (
    <>
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
        {/* Activity Image */}
        <div style={{ position: 'relative', height: '170px', width: '100%', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
          <img
            src={activity.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'}
            alt={activity.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#0f172a',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <MapPin size={11} color="#15803d" />
            {activity.cityName}
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Star size={12} fill="#f59e0b" color="#f59e0b" />
            {activity.rating} ({activity.reviews})
          </div>
        </div>

        {/* Body */}
        <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
            <h3
              style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', cursor: 'pointer', lineHeight: 1.3 }}
              onClick={() => setIsDetailsModalOpen(true)}
            >
              {activity.title}
            </h3>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <Badge variant={categoryVariant}>
              {activity.category}
            </Badge>
          </div>

          <p
            style={{
              fontSize: '0.8125rem',
              color: '#475569',
              lineHeight: '1.4',
              marginBottom: '12px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {activity.description}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.75rem',
              color: '#64748b',
              marginBottom: '14px',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              {activity.duration}
            </span>
            {activity.location && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <MapPin size={12} />
                {activity.location}
              </span>
            )}
          </div>

          {/* Bottom Row */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '12px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Estimated Price</span>
              <p style={{ fontSize: '1rem', fontWeight: 800, color: '#15803d' }}>
                {activity.cost > 0 ? formatCurrency(activity.cost, 'INR') : 'Free'}
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddToTripModalOpen(true)}
            >
              Add to Trip
            </Button>
          </div>
        </div>
      </div>

      {/* Activity Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={activity.title}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDetailsModalOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => {
                setIsDetailsModalOpen(false);
                setIsAddToTripModalOpen(true);
              }}
            >
              Add to Itinerary
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ height: '200px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
            <img
              src={activity.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'}
              alt={activity.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Badge variant={categoryVariant}>{activity.category}</Badge>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#15803d' }}>
              {activity.cost > 0 ? formatCurrency(activity.cost, 'INR') : 'Free Entry'}
            </span>
          </div>

          <p style={{ fontSize: '0.9375rem', color: '#334155', lineHeight: '1.6' }}>
            {activity.description}
          </p>

          <div
            style={{
              padding: '14px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                Destination City
              </span>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                {activity.cityName}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                Estimated Duration
              </span>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                {activity.duration}
              </p>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                Meeting Point / Location
              </span>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                {activity.location || 'Central meeting point'}
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add Activity to Trip Modal */}
      <Modal
        isOpen={isAddToTripModalOpen}
        onClose={() => setIsAddToTripModalOpen(false)}
        title="Add Activity to Itinerary"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddToTripModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddActivity}>
              Confirm & Schedule
            </Button>
          </>
        }
      >
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '14px' }}>
          Schedule <strong>{activity.title}</strong> in one of your upcoming trip stops:
        </p>

        {trips.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="act-select-trip">
                1. Select Trip
              </label>
              <select
                id="act-select-trip"
                className="form-select"
                value={selectedTripId}
                onChange={(e) => {
                  setSelectedTripId(e.target.value);
                  const t = trips.find((item) => item.id === e.target.value);
                  setSelectedStopId(t?.stops?.[0]?.id || '');
                }}
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {stops.length > 0 ? (
              <div className="form-group">
                <label className="form-label" htmlFor="act-select-stop">
                  2. Select City Stop
                </label>
                <select
                  id="act-select-stop"
                  className="form-select"
                  value={selectedStopId}
                  onChange={(e) => setSelectedStopId(e.target.value)}
                >
                  {stops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.cityName} ({s.arrivalDate})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p style={{ fontSize: '0.8125rem', color: '#dc2626' }}>
                This trip has no city stops yet. Please add a stop in builder first.
              </p>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="act-select-day">
                3. Day Number
              </label>
              <input
                id="act-select-day"
                type="number"
                min="1"
                max="30"
                className="form-input"
                value={selectedDayNumber}
                onChange={(e) => setSelectedDayNumber(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            No trips available. Please create a trip first!
          </p>
        )}
      </Modal>
    </>
  );
};
