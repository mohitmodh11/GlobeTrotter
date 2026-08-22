import React from 'react';
import { WelcomeSection } from '../../components/dashboard/WelcomeSection';
import { UpcomingTrips } from '../../components/dashboard/UpcomingTrips';
import { RecommendedDestinations } from '../../components/dashboard/RecommendedDestinations';
import { BudgetHighlights } from '../../components/dashboard/BudgetHighlights';

export const Dashboard = () => {
  return (
    <div>
      <WelcomeSection />
      <UpcomingTrips />
      <RecommendedDestinations />
      <BudgetHighlights />
    </div>
  );
};
