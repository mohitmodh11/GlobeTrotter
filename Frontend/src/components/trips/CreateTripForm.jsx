import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { TRIP_CATEGORIES, CURRENCIES } from '../../utils/constants';
import { addDays } from '../../utils/dateUtils';
import { getCurrencySymbol } from '../../utils/formatCurrency';
import {
  Compass,
  Calendar,
  Image as ImageIcon,
  MapPin,
  FileText,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';

const COVER_PRESETS = [
  { label: 'Europe Architecture', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Tokyo Skyline', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Tropical Island / Beach', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Swiss Alps Mountain', url: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Ancient Rome', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Kyoto Bamboo & Temples', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80' },
];

export const CreateTripForm = ({ initialData, isEdit = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createTrip, updateTrip, cities } = useTrips();
  const { addToast } = useToast();

  const initialCityName = location.state?.initialCity || '';
  const initialCountryName = location.state?.initialCountry || '';

  const today = new Date().toISOString().split('T')[0];
  const nextWeek = addDays(today, 7);

  const [name, setName] = useState(
    initialData?.name || (initialCityName ? `${initialCityName} Getaway` : '')
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || 'leisure');
  const [startDate, setStartDate] = useState(initialData?.startDate || today);
  const [endDate, setEndDate] = useState(initialData?.endDate || nextWeek);
  const [targetBudget, setTargetBudget] = useState(initialData?.targetBudget || 200000);
  const [currency, setCurrency] = useState(initialData?.currency || 'INR');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || COVER_PRESETS[0].url);
  const [customCoverUrl, setCustomCoverUrl] = useState('');

  // Initial stops list
  const [initialStops, setInitialStops] = useState(() => {
    if (initialData?.stops && initialData.stops.length > 0) {
      return initialData.stops;
    }
    if (initialCityName) {
      return [
        {
          id: `stop-${Date.now()}`,
          cityName: initialCityName,
          country: initialCountryName,
          arrivalDate: today,
          departureDate: nextWeek,
        },
      ];
    }
    return [
      {
        id: `stop-${Date.now()}`,
        cityName: 'Paris',
        country: 'France',
        arrivalDate: today,
        departureDate: addDays(today, 3),
      },
    ];
  });

  const [errors, setErrors] = useState({});

  const handleAddStopField = () => {
    const lastStop = initialStops[initialStops.length - 1];
    const newArrival = lastStop ? lastStop.departureDate : startDate;
    const newDeparture = addDays(newArrival, 3);

    setInitialStops([
      ...initialStops,
      {
        id: `stop-${Date.now()}-${Math.random().toString(36).substring(2, 4)}`,
        cityName: '',
        country: '',
        arrivalDate: newArrival,
        departureDate: newDeparture,
      },
    ]);
  };

  const handleRemoveStopField = (index) => {
    if (initialStops.length <= 1) return;
    setInitialStops(initialStops.filter((_, idx) => idx !== index));
  };

  const handleUpdateStopField = (index, field, value) => {
    const updated = [...initialStops];
    updated[index][field] = value;
    setInitialStops(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Trip name is required';
    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!endDate) newErrors.endDate = 'End date is required';
    if (new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      name,
      description,
      category,
      startDate,
      endDate,
      targetBudget: Number(targetBudget),
      currency,
      coverImage: customCoverUrl.trim() || coverImage,
      stops: isEdit
        ? initialData.stops
        : initialStops
            .filter((s) => s.cityName.trim() !== '')
            .map((s, idx) => ({
              id: s.id || `stop-${Date.now()}-${idx}`,
              cityName: s.cityName.trim(),
              country: s.country.trim(),
              arrivalDate: s.arrivalDate || startDate,
              departureDate: s.departureDate || endDate,
              accommodation: { hotelName: '', cost: 0, notes: '' },
              transportToNext: null,
              activities: [],
            })),
    };

    if (isEdit) {
      updateTrip(initialData.id, payload);
      addToast('Trip details updated successfully!', 'success');
      navigate(`/trips/${initialData.id}`);
    } else {
      const created = createTrip(payload);
      addToast(`Trip "${created.name}" created! Opening Itinerary Builder...`, 'success');
      navigate(`/trips/${created.id}/builder`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
        }}
      >
        {/* Left Column: Core Trip Details */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#f0fdf4',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Compass size={18} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
              1. Trip Overview
            </h2>
          </div>

          <Input
            label="Trip Name / Title"
            id="trip-name"
            placeholder="e.g. Grand European Adventure"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            error={errors.name}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="Start Date"
              id="trip-start"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: '' }));
              }}
              error={errors.startDate}
              icon={Calendar}
              required
            />
            <Input
              label="End Date"
              id="trip-end"
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: '' }));
              }}
              error={errors.endDate}
              icon={Calendar}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="trip-category">
              Trip Category & Travel Style
            </label>
            <select
              id="trip-category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {TRIP_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="trip-description">
              Description / Notes <span className="optional">(Optional)</span>
            </label>
            <textarea
              id="trip-description"
              className="form-textarea"
              placeholder="What are the goals of this trip? Packing notes, flight tickets, ideas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Budget section */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '18px', marginTop: '6px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>
              Target Budget
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
              <Input
                label={`Budget Limit (${getCurrencySymbol(currency)})`}
                id="target-budget"
                type="number"
                min="0"
                step="1000"
                value={targetBudget}
                onChange={(e) => setTargetBudget(e.target.value)}
                prefix={getCurrencySymbol(currency)}
                placeholder="200000"
                required
              />
              <div className="form-group">
                <label className="form-label" htmlFor="currency-select">
                  Currency
                </label>
                <select
                  id="currency-select"
                  className="form-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stops & Cover Photo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Initial Stops Config (Only during creation) */}
          {!isEdit && (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#f0fdf4',
                      color: '#15803d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                      2. Destination Stops
                    </h2>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      You can add more cities and detailed activities in the builder
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={handleAddStopField}
                >
                  Add City
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {initialStops.map((stop, idx) => (
                  <div
                    key={stop.id}
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '14px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#15803d',
                          backgroundColor: '#f0fdf4',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: '1px solid #bbf7d0',
                        }}
                      >
                        Stop #{idx + 1}
                      </span>
                      {initialStops.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStopField(idx)}
                          style={{
                            border: 'none',
                            background: 'none',
                            color: '#dc2626',
                            cursor: 'pointer',
                            padding: '2px',
                          }}
                          aria-label="Remove stop"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        placeholder="City name (e.g. Paris)"
                        className="form-input"
                        value={stop.cityName}
                        onChange={(e) => handleUpdateStopField(idx, 'cityName', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Country (e.g. France)"
                        className="form-input"
                        value={stop.country}
                        onChange={(e) => handleUpdateStopField(idx, 'country', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cover Photo Selector */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#f0fdf4',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ImageIcon size={18} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                {isEdit ? '2' : '3'}. Cover Photo
              </h2>
            </div>

            {/* Selected Cover Preview */}
            <div
              style={{
                height: '140px',
                borderRadius: '10px',
                overflow: 'hidden',
                marginBottom: '14px',
                border: '2px solid #15803d',
                position: 'relative',
              }}
            >
              <img
                src={customCoverUrl.trim() || coverImage || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80'}
                alt="Trip Cover Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80';
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  color: '#ffffff',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                Active Cover Image
              </span>
            </div>

            {/* Presets Grid */}
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
              Choose a Preset:
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              {COVER_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCoverImage(preset.url);
                    setCustomCoverUrl('');
                  }}
                  style={{
                    height: '60px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border:
                      coverImage === preset.url && !customCoverUrl
                        ? '3px solid #15803d'
                        : '1px solid #e2e8f0',
                  }}
                  title={preset.label}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>

            <Input
              label="Or Custom Image URL"
              id="custom-cover-url"
              placeholder="https://example.com/photo.jpg"
              value={customCoverUrl}
              onChange={(e) => setCustomCoverUrl(e.target.value)}
              optional
            />
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => navigate('/trips')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={isEdit ? Compass : Sparkles}
            >
              {isEdit ? 'Save Changes' : 'Create & Open Builder'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
