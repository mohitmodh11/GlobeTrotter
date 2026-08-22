import React, { useState } from 'react';
import { useTrips } from '../../context/TripContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ACTIVITY_CATEGORIES, TIME_SLOTS } from '../../utils/constants';
import { formatCurrency, getCurrencySymbol } from '../../utils/formatCurrency';
import { Sparkles, Clock, MapPin, Plus } from 'lucide-react';

export const AddActivity = ({
  isOpen,
  onClose,
  tripId,
  stopId,
  defaultDate,
  defaultDayNumber = 1,
  cityName = '',
  tripCurrency = 'INR',
}) => {
  const { addActivityToStop, activities } = useTrips();
  const { addToast } = useToast();

  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('sightseeing');
  const [timeSlot, setTimeSlot] = useState('morning');
  const [exactTime, setExactTime] = useState('09:30');
  const [cost, setCost] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Filter preset activities matching this city or general
  const matchingPresets = activities.filter(
    (a) => !cityName || a.cityName.toLowerCase() === cityName.toLowerCase()
  );

  const handlePresetSelect = (e) => {
    const actId = e.target.value;
    setSelectedPresetId(actId);
    if (actId) {
      const act = activities.find((a) => a.id === actId);
      if (act) {
        setTitle(act.title);
        setCategory(act.category);
        setCost(act.cost || 0);
        setLocation(act.location || '');
        setNotes(act.description || '');
      }
    } else {
      setTitle('');
      setCost('');
      setLocation('');
      setNotes('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('Please enter an activity title', 'error');
      return;
    }

    const activityData = {
      dayNumber: defaultDayNumber,
      date: defaultDate,
      timeSlot,
      exactTime,
      title: title.trim(),
      category,
      cost: Number(cost) || 0,
      location: location.trim(),
      notes: notes.trim(),
      isCompleted: false,
    };

    addActivityToStop(tripId, stopId, activityData);
    addToast(`Added "${title}" to itinerary!`, 'success');

    // Reset Form
    setTitle('');
    setSelectedPresetId('');
    setCost('');
    setLocation('');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Activity – Day ${defaultDayNumber}`}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} icon={Plus}>
            Add to Itinerary
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {matchingPresets.length > 0 && (
          <div className="form-group">
            <label className="form-label" htmlFor="act-preset">
              Choose from curated activities in {cityName || 'destination'}:
            </label>
            <select
              id="act-preset"
              className="form-select"
              value={selectedPresetId}
              onChange={handlePresetSelect}
            >
              <option value="">-- Or enter custom activity --</option>
              {matchingPresets.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.title} ({formatCurrency(act.cost, tripCurrency)} • {act.duration})
                </option>
              ))}
            </select>
          </div>
        )}

        <Input
          label="Activity Title"
          id="act-title"
          placeholder="e.g. Louvre Museum & Mona Lisa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          icon={Sparkles}
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="act-time-slot">
              Time of Day
            </label>
            <select
              id="act-time-slot"
              className="form-select"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
            >
              {TIME_SLOTS.map((ts) => (
                <option key={ts.id} value={ts.id}>
                  {ts.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Specific Time"
            id="act-time"
            type="time"
            value={exactTime}
            onChange={(e) => setExactTime(e.target.value)}
            icon={Clock}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="act-category">
              Category
            </label>
            <select
              id="act-category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {ACTIVITY_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label={`Cost (${getCurrencySymbol(tripCurrency)})`}
            id="act-cost"
            type="number"
            min="0"
            placeholder="0 for free"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            prefix={getCurrencySymbol(tripCurrency)}
          />
        </div>

        <Input
          label="Location / Meeting Point"
          id="act-location"
          placeholder="e.g. Metro station entrance, 12 Rue de Rivoli"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          icon={MapPin}
          optional
        />

        <div className="form-group">
          <label className="form-label" htmlFor="act-notes">
            <span>Notes / Tips</span>
            <span className="optional">(Optional)</span>
          </label>
          <textarea
            id="act-notes"
            className="form-textarea"
            placeholder="Ticket booking reference, opening hours, photography rules..."
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};
