import React from 'react';
import { CreateTripForm } from '../../components/trips/CreateTripForm';
import { Plus } from 'lucide-react';

export const CreateTrip = () => {
  return (
    <div>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.75rem' }}>
            Plan a New Journey
          </h1>
          <p className="section-subtitle">
            Configure your multi-city trip details, set target budget, and build day-by-day itineraries.
          </p>
        </div>
      </div>

      <CreateTripForm />
    </div>
  );
};
