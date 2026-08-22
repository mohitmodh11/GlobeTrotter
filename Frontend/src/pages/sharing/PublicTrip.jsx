import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { DaySection } from '../../components/itinerary/DaySection';
import { formatDateRange, calculateDaysBetween, addDays } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  Compass,
  Copy,
  Check,
  Share2,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Globe,
  MessageCircle,
  Mail,
  Send,
} from 'lucide-react';

export const PublicTrip = () => {
  const { shareCode } = useParams();
  const navigate = useNavigate();
  const { getTripByShareCode, copyTripToMyAccount } = useTrips();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [copiedLink, setCopiedLink] = useState(false);
  const trip = getTripByShareCode(shareCode);

  if (!trip) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '40px 20px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <Globe size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
          Shared Itinerary Not Found
        </h2>
        <p style={{ color: '#64748b', marginTop: '6px', maxWidth: '420px', marginBottom: '20px' }}>
          The public itinerary link may be invalid, expired, or the trip privacy has been updated.
        </p>
        <Link to="/dashboard">
          <Button variant="primary">Explore GlobeTrotter</Button>
        </Link>
      </div>
    );
  }

  const durationDays = calculateDaysBetween(trip.startDate, trip.endDate);
  const stops = trip.stops || [];

  // Build day schedule
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    addToast('Public link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCloneTrip = () => {
    const cloned = copyTripToMyAccount(trip);
    addToast(`"${trip.name}" cloned into your itineraries!`, 'success');
    navigate(`/trips/${cloned.id}/builder`);
  };

  const shareTitle = encodeURIComponent(`Check out this travel itinerary: ${trip.name}`);
  const currentUrl = encodeURIComponent(window.location.href);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Top Banner with Clone Action */}
      <div
        style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '14px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            }}
          >
            <Compass size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
              Public Shared Travel Itinerary
            </span>
            <p style={{ fontSize: '0.875rem', color: '#334155' }}>
              Created by a fellow GlobeTrotter adventurer. You can clone and customize it freely!
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          icon={Copy}
          onClick={handleCloneTrip}
        >
          Copy Trip to My Account
        </Button>
      </div>

      {/* Hero Card */}
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
        <div style={{ position: 'relative', height: '240px', width: '100%' }}>
          <img
            src={trip.coverImage}
            alt={trip.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '24px',
            }}
          >
            <div style={{ color: '#ffffff' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <span
                  style={{
                    backgroundColor: '#15803d',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                  }}
                >
                  {trip.category}
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                  }}
                >
                  {durationDays} Days
                </span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
                {trip.name}
              </h1>
              <p style={{ fontSize: '0.9375rem', color: '#e2e8f0', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} />
                {formatDateRange(trip.startDate, trip.endDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Route & Social Share bar */}
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
          {/* Stops Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b' }}>
              Destinations:
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

          {/* Social Share Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Share:</span>
            <Button
              variant="outline"
              size="sm"
              icon={copiedLink ? Check : Copy}
              onClick={handleCopyLink}
            >
              {copiedLink ? 'Copied' : 'Copy Link'}
            </Button>
            <a
              href={`https://api.whatsapp.com/send?text=${shareTitle}%20${currentUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              title="Share on WhatsApp"
            >
              <MessageCircle size={14} color="#15803d" />
            </a>
            <a
              href={`mailto:?subject=${shareTitle}&body=${currentUrl}`}
              className="btn btn-secondary btn-sm"
              title="Share via Email"
            >
              <Mail size={14} color="#475569" />
            </a>
          </div>
        </div>
      </div>

      {/* Description if present */}
      {trip.description && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
            About This Journey
          </h3>
          <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: '1.6' }}>
            {trip.description}
          </p>
        </div>
      )}

      {/* Day by Day Schedule */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
        Complete Day-by-Day Schedule
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {allDaysSchedule.map((day) => (
          <DaySection
            key={day.dayNumber}
            dayNumber={day.dayNumber}
            date={day.date}
            cityName={day.cityName}
            country={day.country}
            activities={day.activities}
            tripCurrency={trip.currency}
            readOnly={true}
          />
        ))}
      </div>

      {/* Bottom CTA to Clone */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '28px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '32px',
        }}
      >
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          Inspired by this itinerary?
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '16px', maxWidth: '460px', margin: '0 auto 16px' }}>
          Copy this complete plan to your account to adjust dates, customize stops, or add your own favorite activities!
        </p>
        <Button
          variant="primary"
          size="lg"
          icon={Copy}
          onClick={handleCloneTrip}
        >
          Clone & Plan This Trip
        </Button>
      </div>
    </div>
  );
};
