import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { User, Mail, MapPin, Edit, Save, Camera } from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
];

export const ProfileHeader = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [homeCity, setHomeCity] = useState(user?.homeCity || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || AVATAR_PRESETS[0]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Name cannot be empty', 'error');
      return;
    }
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      homeCity: homeCity.trim(),
      bio: bio.trim(),
      avatar,
    });
    addToast('Profile updated successfully!', 'success');
    setIsEditing(false);
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
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flex: 1, minWidth: '280px' }}>
          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            <img
              src={avatar}
              alt={user?.name}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #15803d',
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                {user?.name}
              </h2>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#15803d',
                  backgroundColor: '#f0fdf4',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: '1px solid #bbf7d0',
                  textTransform: 'uppercase',
                }}
              >
                {user?.role}
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '2px' }}>
              {user?.email} • {user?.homeCity || 'Location not set'}
            </p>

            <p style={{ fontSize: '0.875rem', color: '#334155', marginTop: '8px', maxWidth: '600px', lineHeight: '1.5' }}>
              {user?.bio || 'No bio provided yet.'}
            </p>
          </div>
        </div>

        <Button
          variant={isEditing ? 'secondary' : 'outline'}
          size="sm"
          icon={isEditing ? null : Edit}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <form onSubmit={handleSave} style={{ marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>
            Edit Personal Details
          </h3>

          {/* Avatar Presets Selector */}
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Choose Profile Avatar</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              {AVATAR_PRESETS.map((pUrl, idx) => (
                <img
                  key={idx}
                  src={pUrl}
                  alt={`Avatar ${idx + 1}`}
                  onClick={() => setAvatar(pUrl)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: avatar === pUrl ? '3px solid #15803d' : '2px solid #e2e8f0',
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <Input
              label="Full Name"
              id="prof-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
              required
            />
            <Input
              label="Email Address"
              id="prof-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />
            <Input
              label="Home City & Country"
              id="prof-homecity"
              placeholder="e.g. San Francisco, USA"
              value={homeCity}
              onChange={(e) => setHomeCity(e.target.value)}
              icon={MapPin}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prof-bio">
              About / Travel Bio
            </label>
            <textarea
              id="prof-bio"
              className="form-textarea"
              placeholder="Tell others what you love exploring..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Save}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
