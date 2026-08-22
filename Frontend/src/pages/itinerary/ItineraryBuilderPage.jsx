import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { ItineraryBuilder } from '../../components/itinerary/ItineraryBuilder';
import { Button } from '../../components/common/Button';
import { Compass } from 'lucide-react';

export const ItineraryBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTripById } = useTrips();

  const trip = getTripById(id);

  if (!trip) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Itinerary not found</h2>
        <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '16px' }}>
          We could not locate the trip you are trying to edit.
        </p>
        <Button variant="primary" onClick={() => navigate('/trips')}>
          Back to My Trips
        </Button>
      </div>
    );
  }

  return <ItineraryBuilder trip={trip} />;
};
