import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  MapPin,
  Star,
  Bookmark,
  Plus,
  Compass,
  Calendar,
  Globe,
  Info,
} from 'lucide-react';

export const CityCard = ({ city }) => {
  const navigate = useNavigate();
  const { trips, addStop } = useTrips();
  const { user, toggleSaveDestination } = useAuth();
  const { addToast } = useToast();

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddToTripModalOpen, setIsAddToTripModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id || '');

  const isSaved = user?.savedDestinations?.includes(city.id);

  const handleBookmark = () => {
    toggleSaveDestination(city.id);
    addToast(
      isSaved
        ? `Removed ${city.name} from saved destinations`
        : `Saved ${city.name} to wishlist!`,
      'info'
    );
  };

  const handleAddCityToExistingTrip = () => {
    if (!selectedTripId) {
      addToast('Please select a trip or start a new one', 'error');
      return;
    }
    const targetTrip = trips.find((t) => t.id === selectedTripId);
    if (!targetTrip) return;

    const lastStop = targetTrip.stops?.[targetTrip.stops.length - 1];
    const arrivalDate = lastStop ? lastStop.departureDate : targetTrip.startDate;
    const departureDate = targetTrip.endDate;

    addStop(selectedTripId, {
      cityName: city.name,
      country: city.country,
      arrivalDate,
      departureDate,
      accommodation: { hotelName: '', cost: 0, notes: '' },
      transportToNext: null,
    });

    addToast(`Added ${city.name} to "${targetTrip.name}"!`, 'success');
    setIsAddToTripModalOpen(false);
    navigate(`/trips/${selectedTripId}/builder`);
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
        {/* City Image */}
        <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
          <img
            src={city.image}
            alt={city.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />

          <button
            onClick={handleBookmark}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #cbd5e1',
              color: isSaved ? '#15803d' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="Save city"
          >
            <Bookmark size={16} fill={isSaved ? '#15803d' : 'none'} />
          </button>

          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Star size={12} fill="#f59e0b" color="#f59e0b" />
            {city.popularity}% Popularity
          </div>
        </div>

        {/* City Info */}
        <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
            <h3
              style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', cursor: 'pointer' }}
              onClick={() => setIsDetailsModalOpen(true)}
            >
              {city.name}
            </h3>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 800,
                color: '#15803d',
                backgroundColor: '#f0fdf4',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid #bbf7d0',
              }}
            >
              {city.costIndex}
            </span>
          </div>

          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '8px' }}>
            {city.country} • {city.region}
          </p>

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
            {city.description}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
            {city.tags?.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  backgroundColor: '#f8fafc',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bottom Metas & Actions */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '12px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Avg Daily</span>
              <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#15803d' }}>
                ~{formatCurrency(city.costPerDay, 'INR')}/day
              </p>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDetailsModalOpen(true)}
              >
                Details
              </Button>
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
      </div>

      {/* City Full Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={`${city.name}, ${city.country}`}
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
          <div style={{ height: '200px', borderRadius: '10px', overflow: 'hidden' }}>
            <img
              src={city.image}
              alt={city.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <p style={{ fontSize: '0.9375rem', color: '#334155', lineHeight: '1.6' }}>
            {city.description}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              padding: '14px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                Best Season to Visit
              </span>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                {city.bestSeason}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                Climate & Weather
              </span>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                {city.climate}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                Local Currency
              </span>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                {city.currency}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                Primary Language
              </span>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                {city.language}
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add to Trip Modal */}
      <Modal
        isOpen={isAddToTripModalOpen}
        onClose={() => setIsAddToTripModalOpen(false)}
        title={`Add ${city.name} to Trip`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddToTripModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddCityToExistingTrip}>
              Add to Selected Trip
            </Button>
          </>
        }
      >
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '14px' }}>
          Select which trip to attach <strong>{city.name}</strong> to:
        </p>

        {trips.length > 0 ? (
          <div className="form-group">
            <label className="form-label" htmlFor="select-target-trip">
              Your Active Trips
            </label>
            <select
              id="select-target-trip"
              className="form-select"
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.stops?.length || 0} stops)
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '16px' }}>
            You do not have any trips created yet.
          </p>
        )}

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '14px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => {
              setIsAddToTripModalOpen(false);
              navigate('/trips/new', {
                state: { initialCity: city.name, initialCountry: city.country },
              });
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#15803d',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            + Or Start a New Trip with {city.name}
          </button>
        </div>
      </Modal>
    </>
  );
};
