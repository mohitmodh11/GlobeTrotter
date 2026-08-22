import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { MapPin, Star, Bookmark, Plus, ArrowRight } from 'lucide-react';

export const RecommendedDestinations = () => {
  const { cities } = useTrips();
  const { user, toggleSaveDestination } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Top 4 recommended cities
  const recommended = cities.slice(0, 4);

  const handleBookmark = (city) => {
    toggleSaveDestination(city.id);
    const isSaved = user?.savedDestinations?.includes(city.id);
    addToast(
      isSaved
        ? `Removed ${city.name} from saved destinations`
        : `Saved ${city.name} to wishlist!`,
      'info'
    );
  };

  const handleStartTripWithCity = (city) => {
    navigate('/trips/new', { state: { initialCity: city.name, initialCountry: city.country } });
  };

  return (
    <div style={{ marginBottom: '36px' }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">Trending Destinations</h2>
          <p className="section-subtitle">Discover top-rated cities for your next adventure</p>
        </div>
        <Link
          to="/cities"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#15803d',
          }}
        >
          Explore All Cities <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid-4">
        {recommended.map((city) => {
          const isSaved = user?.savedDestinations?.includes(city.id);
          return (
            <div
              key={city.id}
              className="card card-hover"
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '14px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: '160px', width: '100%', overflow: 'hidden' }}>
                <img
                  src={city.image}
                  alt={city.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmark(city);
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #cbd5e1',
                    color: isSaved ? '#15803d' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label="Save to wishlist"
                >
                  <Bookmark size={15} fill={isSaved ? '#15803d' : 'none'} />
                </button>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: '#ffffff',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Star size={11} fill="#f59e0b" color="#f59e0b" />
                  {city.popularity}% Popularity
                </div>
              </div>

              {/* Body */}
              <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a' }}>
                    {city.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d' }}>
                    {city.costIndex}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
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

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    paddingTop: '10px',
                    borderTop: '1px solid #f1f5f9',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Avg Daily Cost</span>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                      ~{formatCurrency(city.costPerDay, 'INR')}/day
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Plus}
                    onClick={() => handleStartTripWithCity(city)}
                  >
                    Plan Trip
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
