import React from 'react';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { SavedDestinations } from '../../components/profile/SavedDestinations';
import { Preferences } from '../../components/profile/Preferences';

export const Profile = () => {
  return (
    <div>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.75rem' }}>
            Account Profile & Settings
          </h1>
          <p className="section-subtitle">
            Manage your personal profile, travel style tags, saved destinations, and app preferences.
          </p>
        </div>
      </div>

      <ProfileHeader />
      <SavedDestinations />
      <Preferences />
    </div>
  );
};
