import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { CreateTripForm } from '../../components/trips/CreateTripForm';
import { Button } from '../../components/common/Button';
import { ArrowLeft } from 'lucide-react';

export const EditTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTripById } = useTrips();

  const trip = getTripById(id);

  if (!trip) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Trip not found</h2>
        <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '16px' }}>
          The itinerary you are trying to edit does not exist.
        </p>
        <Button variant="primary" onClick={() => navigate('/trips')}>
          Back to My Trips
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate(`/trips/${id}`)}
          style={{ marginBottom: '12px' }}
        >
          Back to Itinerary
        </Button>
        <h1 className="section-title" style={{ fontSize: '1.75rem' }}>
          Edit Trip Settings
        </h1>
        <p className="section-subtitle">
          Update trip name, budget limits, travel dates, and cover styling.
        </p>
      </div>

      <CreateTripForm initialData={trip} isEdit={true} />
    </div>
  );
};
