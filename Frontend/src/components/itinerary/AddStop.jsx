import React, { useState } from 'react';
import { useTrips } from '../../context/TripContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { TRANSPORT_MODES } from '../../utils/constants';
import { getCurrencySymbol } from '../../utils/formatCurrency';
import { MapPin, Calendar, Building, Plus } from 'lucide-react';

export const AddStop = ({
  isOpen,
  onClose,
  tripId,
  defaultArrivalDate,
  tripCurrency = 'INR',
}) => {
  const { addStop, cities } = useTrips();
  const { addToast } = useToast();

  const [selectedCityId, setSelectedCityId] = useState('');
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [arrivalDate, setArrivalDate] = useState(defaultArrivalDate || '');
  const [departureDate, setDepartureDate] = useState(defaultArrivalDate || '');

  // Accommodation
  const [hotelName, setHotelName] = useState('');
  const [hotelCost, setHotelCost] = useState('');
  const [hotelNotes, setHotelNotes] = useState('');

  // Transport to next stop
  const [transportMode, setTransportMode] = useState('train');
  const [transportProvider, setTransportProvider] = useState('');
  const [transportCost, setTransportCost] = useState('');
  const [transportDuration, setTransportDuration] = useState('');

  const handleCitySelect = (e) => {
    const cId = e.target.value;
    setSelectedCityId(cId);
    if (cId) {
      const city = cities.find((c) => c.id === cId);
      if (city) {
        setCityName(city.name);
        setCountry(city.country);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cityName.trim()) {
      addToast('City name is required', 'error');
      return;
    }
    if (!arrivalDate || !departureDate) {
      addToast('Arrival and departure dates are required', 'error');
      return;
    }
    if (new Date(departureDate) < new Date(arrivalDate)) {
      addToast('Departure date cannot be before arrival date', 'error');
      return;
    }

    const stopData = {
      cityName: cityName.trim(),
      country: country.trim(),
      arrivalDate,
      departureDate,
      accommodation: hotelName.trim()
        ? {
            hotelName: hotelName.trim(),
            cost: Number(hotelCost) || 0,
            notes: hotelNotes.trim(),
          }
        : null,
      transportToNext: transportProvider.trim()
        ? {
            mode: transportMode,
            provider: transportProvider.trim(),
            cost: Number(transportCost) || 0,
            duration: transportDuration.trim(),
          }
        : null,
      activities: [],
    };

    addStop(tripId, stopData);
    addToast(`Added ${cityName} to your itinerary!`, 'success');

    // Reset Form
    setSelectedCityId('');
    setCityName('');
    setCountry('');
    setHotelName('');
    setHotelCost('');
    setHotelNotes('');
    setTransportProvider('');
    setTransportCost('');
    setTransportDuration('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Destination Stop"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} icon={Plus}>
            Add Stop
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* City Picker */}
        <div className="form-group">
          <label className="form-label" htmlFor="city-preset">
            Select from Top Destinations <span className="optional">(Or type custom below)</span>
          </label>
          <select
            id="city-preset"
            className="form-select"
            value={selectedCityId}
            onChange={handleCitySelect}
          >
            <option value="">-- Choose a recommended city --</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}, {c.country} ({c.costIndex})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
          <Input
            label="City Name"
            id="stop-city-name"
            placeholder="e.g. Barcelona"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            icon={MapPin}
            required
          />
          <Input
            label="Country"
            id="stop-country"
            placeholder="e.g. Spain"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            label="Arrival Date"
            id="stop-arrival"
            type="date"
            value={arrivalDate}
            onChange={(e) => setArrivalDate(e.target.value)}
            icon={Calendar}
            required
          />
          <Input
            label="Departure Date"
            id="stop-departure"
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            icon={Calendar}
            required
          />
        </div>

        {/* Accommodation Section */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '14px',
          }}
        >
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building size={16} color="#15803d" /> Accommodation / Stay (Optional)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '8px' }}>
            <Input
              label="Hotel / Place Name"
              id="stop-hotel"
              placeholder="e.g. Grand Hotel Central"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
            />
            <Input
              label={`Total Cost (${getCurrencySymbol(tripCurrency)})`}
              id="stop-hotel-cost"
              type="number"
              min="0"
              placeholder="15000"
              value={hotelCost}
              onChange={(e) => setHotelCost(e.target.value)}
              prefix={getCurrencySymbol(tripCurrency)}
            />
          </div>
          <Input
            label="Notes / Confirmation #"
            id="stop-hotel-notes"
            placeholder="Check-in 3 PM, reservation ref #12345"
            value={hotelNotes}
            onChange={(e) => setHotelNotes(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};
