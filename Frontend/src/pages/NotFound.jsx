import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Compass, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '70vh',
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
          width: '72px',
          height: '72px',
          borderRadius: '16px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#15803d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <Compass size={36} />
      </div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
        404 - Page Not Found
      </h1>
      <p style={{ color: '#64748b', maxWidth: '440px', marginBottom: '24px', fontSize: '0.9375rem' }}>
        Looks like you wandered off the map! The travel page or itinerary you are looking for does not exist.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" size="lg" icon={Home}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
