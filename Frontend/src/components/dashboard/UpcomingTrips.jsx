import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { TripCard } from '../trips/TripCard';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';
import { Plane, ArrowRight, Plus } from 'lucide-react';

export const UpcomingTrips = () => {
  const { trips } = useTrips();
  const navigate = useNavigate();

  // Pick upcoming or in-progress trips (top 3)
  const displayTrips = trips.slice(0, 3);

  return (
    <div style={{ marginBottom: '36px' }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">My Travel Plans</h2>
          <p className="section-subtitle">Your active, upcoming, and draft multi-city itineraries</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {trips.length > 0 && (
            <Link
              to="/trips"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#15803d',
              }}
            >
              View All ({trips.length}) <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {displayTrips.length > 0 ? (
        <div className="grid-3">
          {displayTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Plane}
          title="No travel itineraries yet"
          description="Ready to explore the world? Create your first personalized multi-city itinerary now!"
          actionLabel="Plan New Trip"
          onAction={() => navigate('/trips/new')}
        />
      )}
    </div>
  );
};
