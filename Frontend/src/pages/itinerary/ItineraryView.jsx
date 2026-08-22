import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { useToast } from '../../context/ToastContext';
import { DaySection } from '../../components/itinerary/DaySection';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatDateRange, calculateDaysBetween, addDays } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  Calendar,
  MapPin,
  Edit,
  Share2,
  Printer,
  CreditCard,
  CalendarDays,
  LayoutList,
  Building,
  Layers,
  Map,
  ArrowRight,
  Plane,
  Train,
  Car,
  Bus,
  Ship,
  Check,
  Copy,
  ArrowLeft,
} from 'lucide-react';

export const ItineraryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTripById } = useTrips();
  const { addToast } = useToast();

  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'cities' | 'route'
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const trip = getTripById(id);

  if (!trip) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Itinerary not found</h2>
        <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '16px' }}>
          We could not locate this itinerary.
        </p>
        <Button variant="primary" onClick={() => navigate('/trips')}>
          Back to My Trips
        </Button>
      </div>
    );
  }

  const durationDays = calculateDaysBetween(trip.startDate, trip.endDate);
  const stops = trip.stops || [];

  // Build day-wise chronological schedule
  const allDaysSchedule = [];
  let currentDayCounter = 1;

  stops.forEach((stop) => {
    const stopDays = calculateDaysBetween(stop.arrivalDate, stop.departureDate);
    for (let i = 0; i < stopDays; i++) {
      const dDate = addDays(stop.arrivalDate, i);
      const acts = (stop.activities || []).filter(
        (a) => a.date === dDate || (!a.date && a.dayNumber === i + 1)
      );

      allDaysSchedule.push({
        dayNumber: currentDayCounter,
        date: dDate,
        cityName: stop.cityName,
        country: stop.country,
        activities: acts,
      });
      currentDayCounter++;
    }
  });

  // Calculate totals
  const stayCost = stops.reduce((acc, s) => acc + (Number(s.accommodation?.cost) || 0), 0);
  const transportCost = stops.reduce((acc, s) => acc + (Number(s.transportToNext?.cost) || 0), 0);
  const activityCost = stops.reduce(
    (acc, s) =>
      acc + (s.activities || []).reduce((aAcc, a) => aAcc + (Number(a.cost) || 0), 0),
    0
  );
  const totalCost = stayCost + transportCost + activityCost;

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/share/${trip.shareCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    addToast('Public shareable link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handlePrint = () => {
    window.print();
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
    <div>
      {/* Top Breadcrumb & Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
        className="no-print"
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
            Itinerary Overview
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            size="sm"
            icon={Edit}
            onClick={() => navigate(`/trips/${trip.id}/builder`)}
          >
            Edit in Builder
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
            icon={Share2}
            onClick={() => setIsShareModalOpen(true)}
          >
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Printer}
            onClick={handlePrint}
          >
            Print
          </Button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ position: 'relative', height: '240px', width: '100%', backgroundColor: '#0f172a' }}>
          <img
            src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80'}
            alt={trip.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80';
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.45)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '24px',
            }}
          >
            <div style={{ color: '#ffffff' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: '#15803d',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                  }}
                >
                  {trip.category}
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                  }}
                >
                  {trip.status}
                </span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                {trip.name}
              </h1>
              <p style={{ fontSize: '0.9375rem', color: '#f1f5f9', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} />
                {formatDateRange(trip.startDate, trip.endDate)} ({durationDays} Days / {durationDays - 1} Nights)
              </p>
            </div>
          </div>
        </div>

        {/* Hero Metadata Details */}
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Stops List */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b' }}>
              Route:
            </span>
            {stops.map((stop, idx) => (
              <span
                key={stop.id || idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  backgroundColor: '#f0fdf4',
                  color: '#166534',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  border: '1px solid #bbf7d0',
                }}
              >
                <MapPin size={12} />
                {stop.cityName}
                {idx < stops.length - 1 && (
                  <ArrowRight size={12} style={{ marginLeft: '4px', color: '#15803d' }} />
                )}
              </span>
            ))}
          </div>

          {/* Quick Financial pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Estimated Trip Cost</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>
                {formatCurrency(totalCost, trip.currency)}
              </p>
            </div>
            <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '16px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Target Budget</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {formatCurrency(trip.targetBudget, trip.currency)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Selector Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
        }}
        className="no-print"
      >
        <div className="tabs-container">
          <button
            className={`tab-btn ${viewMode === 'timeline' ? 'active' : ''}`}
            onClick={() => setViewMode('timeline')}
          >
            <LayoutList size={16} /> Day-by-Day Timeline
          </button>
          <button
            className={`tab-btn ${viewMode === 'cities' ? 'active' : ''}`}
            onClick={() => setViewMode('cities')}
          >
            <Building size={16} /> Grouped by Cities
          </button>
          <button
            className={`tab-btn ${viewMode === 'route' ? 'active' : ''}`}
            onClick={() => setViewMode('route')}
          >
            <Map size={16} /> Route & Transit Map
          </button>
        </div>
      </div>

      {/* Mode 1: Day-by-Day Chronological View */}
      {viewMode === 'timeline' && (
        <div>
          {allDaysSchedule.length > 0 ? (
            allDaysSchedule.map((day) => (
              <DaySection
                key={day.dayNumber}
                dayNumber={day.dayNumber}
                date={day.date}
                cityName={day.cityName}
                country={day.country}
                activities={day.activities}
                tripCurrency={trip.currency}
              />
            ))
          ) : (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                border: '1px dashed #cbd5e1',
                borderRadius: '12px',
              }}
            >
              <p style={{ color: '#64748b', marginBottom: '14px' }}>
                No stops or activities scheduled yet in this itinerary.
              </p>
              <Button
                variant="primary"
                icon={Edit}
                onClick={() => navigate(`/trips/${trip.id}/builder`)}
              >
                Open Itinerary Builder
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Grouped by Cities */}
      {viewMode === 'cities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {stops.map((stop, idx) => {
            const stopDays = calculateDaysBetween(stop.arrivalDate, stop.departureDate);
            const stopActivities = stop.activities || [];
            const stopActCost = stopActivities.reduce(
              (acc, a) => acc + (Number(a.cost) || 0),
              0
            );

            return (
              <div
                key={stop.id || idx}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '24px',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '16px',
                    paddingBottom: '14px',
                    borderBottom: '1px solid #f1f5f9',
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
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                        {stop.cityName} ({stop.country})
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                        {formatDateRange(stop.arrivalDate, stop.departureDate)} • {stopDays} Days
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Stop Total</span>
                    <p style={{ fontSize: '1.125rem', fontWeight: 800, color: '#15803d' }}>
                      {formatCurrency(
                        (stop.accommodation?.cost || 0) +
                          stopActCost +
                          (stop.transportToNext?.cost || 0),
                        trip.currency
                      )}
                    </p>
                  </div>
                </div>

                {/* Accommodation Box */}
                {stop.accommodation?.hotelName && (
                  <div
                    style={{
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Building size={18} color="#15803d" />
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
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
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#15803d' }}>
                        {formatCurrency(stop.accommodation.cost, trip.currency)}
                      </span>
                    )}
                  </div>
                )}

                {/* Activities in this stop */}
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
                  Activities ({stopActivities.length})
                </h4>
                {stopActivities.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                    {stopActivities.map((act) => (
                      <div
                        key={act.id}
                        style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '10px 14px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                            {act.title}
                          </span>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#15803d' }}>
                            {act.cost > 0 ? formatCurrency(act.cost, trip.currency) : 'Free'}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                          Day {act.dayNumber} • {act.exactTime || act.timeSlot} • {act.category}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.8125rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    No specific activities scheduled in {stop.cityName}.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Mode 3: Route & Transit Map */}
      {viewMode === 'route' && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
            Multi-City Journey Flow
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '24px' }}>
            Chronological route connecting each destination stop with travel transit details.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stops.map((stop, idx) => (
              <div key={stop.id || idx}>
                {/* Stop Node */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#15803d',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>
                      {stop.cityName}, {stop.country}
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: '#475569' }}>
                      Stay: {formatDateRange(stop.arrivalDate, stop.departureDate)} ({calculateDaysBetween(stop.arrivalDate, stop.departureDate)} Days)
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Activities</span>
                    <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#15803d' }}>
                      {stop.activities?.length || 0} planned
                    </p>
                  </div>
                </div>

                {/* Transit Connection to Next Stop */}
                {idx < stops.length - 1 && (
                  <div
                    style={{
                      margin: '10px 0 10px 20px',
                      paddingLeft: '24px',
                      borderLeft: '2px dashed #15803d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px 12px 24px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {stop.transportToNext ? (
                        React.createElement(getTransportIcon(stop.transportToNext.mode), {
                          size: 16,
                          color: '#15803d',
                        })
                      ) : (
                        <Train size={16} color="#15803d" />
                      )}
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                        Transit to {stops[idx + 1]?.cityName}:{' '}
                        {stop.transportToNext?.provider || 'Direct connection'}
                        {stop.transportToNext?.duration ? ` (${stop.transportToNext.duration})` : ''}
                      </span>
                    </div>
                    {stop.transportToNext?.cost > 0 && (
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#15803d' }}>
                        {formatCurrency(stop.transportToNext.cost, trip.currency)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Your Itinerary"
        size="sm"
        footer={
          <Button variant="primary" onClick={() => setIsShareModalOpen(false)}>
            Done
          </Button>
        }
      >
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '16px' }}>
          Anyone with this public link can view your itinerary, explore your day-by-day plan, or copy it to their own account.
        </p>

        <div className="form-group">
          <label className="form-label">Public Itinerary URL</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              readOnly
              className="form-input"
              value={`${window.location.origin}/share/${trip.shareCode}`}
            />
            <Button
              variant={copiedLink ? 'primary' : 'outline'}
              icon={copiedLink ? Check : Copy}
              onClick={handleCopyShareLink}
            >
              {copiedLink ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link
            to={`/share/${trip.shareCode}`}
            target="_blank"
            style={{ fontSize: '0.875rem', fontWeight: 600, color: '#15803d' }}
          >
            Preview Public View in New Tab →
          </Link>
        </div>
      </Modal>
    </div>
  );
};
