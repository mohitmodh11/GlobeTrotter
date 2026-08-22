import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { formatCurrency } from '../../utils/formatCurrency';
import { Bookmark, MapPin, Plus, Trash2 } from 'lucide-react';

export const SavedDestinations = () => {
  const { user, toggleSaveDestination } = useAuth();
  const { cities } = useTrips();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const savedCityIds = user?.savedDestinations || [];
  const savedCities = cities.filter((c) => savedCityIds.includes(c.id));

  const handleRemove = (city) => {
    toggleSaveDestination(city.id);
    addToast(`Removed ${city.name} from wishlist`, 'info');
  };

  const handleStartTrip = (city) => {
    navigate('/trips/new', {
      state: { initialCity: city.name, initialCountry: city.country },
    });
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="section-header" style={{ marginBottom: '18px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Saved Destinations & Wishlist
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Cities and regions you want to visit on upcoming adventures
          </p>
        </div>
      </div>

      {savedCities.length > 0 ? (
        <div className="grid-3">
          {savedCities.map((city) => (
            <div
              key={city.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '120px', position: 'relative' }}>
                <img
                  src={city.image}
                  alt={city.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  onClick={() => handleRemove(city)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #cbd5e1',
                    color: '#dc2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Remove from saved"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  {city.name}, {city.country}
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '10px' }}>
                  ~{formatCurrency(city.costPerDay, 'INR')}/day • {city.costIndex}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Plus}
                    onClick={() => handleStartTrip(city)}
                    style={{ width: '100%' }}
                  >
                    Plan Trip Here
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No saved destinations yet"
          description="Browse world cities in City Search and click the bookmark icon to save them to your wishlist."
          actionLabel="Explore Cities"
          onAction={() => navigate('/cities')}
        />
      )}
    </div>
  );
};
