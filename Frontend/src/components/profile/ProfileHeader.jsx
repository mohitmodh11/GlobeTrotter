import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { UserAvatar, getInitials } from '../common/UserAvatar';
import { User, Mail, MapPin, Edit, Save, Upload, Trash2, Camera, Sparkles } from 'lucide-react';

export const ProfileHeader = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [homeCity, setHomeCity] = useState(user?.homeCity || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);

  // Sync state if user changes in auth
  const startEditing = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setHomeCity(user?.homeCity || '');
    setBio(user?.bio || '');
    setAvatar(user?.avatar || null);
    setIsEditing(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (PNG, JPG, JPEG, WEBP).', 'error');
      return;
    }

    // Limit size to ~5MB
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size should be less than 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        setAvatar(dataUrl);
        addToast('Photo loaded! Click "Save Profile Changes" to apply.', 'success');
      }
    };
    reader.onerror = () => {
      addToast('Failed to read image file. Please try another image.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    addToast('Profile picture reset to name initials.', 'info');
  };

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
      avatar: avatar || null,
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
          {/* Avatar with dynamic initials fallback */}
          <div style={{ position: 'relative' }}>
            <UserAvatar
              name={user?.name}
              avatar={user?.avatar}
              size="xl"
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
          onClick={() => {
            if (isEditing) {
              setIsEditing(false);
            } else {
              startEditing();
            }
          }}
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

          {/* Profile Photo Upload & Initials Option */}
          <div
            style={{
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
            }}
          >
            <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>
              Profile Picture
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {/* Preview */}
              <div style={{ position: 'relative' }}>
                <UserAvatar
                  name={name}
                  avatar={avatar}
                  size="lg"
                />
              </div>

              {/* Upload & Reset Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-photo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    icon={Upload}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Photo from File
                  </Button>

                  {avatar && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={handleRemovePhoto}
                      style={{ color: '#dc2626' }}
                    >
                      Use Name Initials ({getInitials(name)})
                    </Button>
                  )}
                </div>

                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {avatar
                    ? 'Custom photo active. You can upload a new photo or switch back to your name initials.'
                    : `No photo uploaded. Your profile picture automatically displays initials "${getInitials(name)}".`}
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <Input
              label="Full Name"
              id="prof-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
              placeholder="e.g. Adam Smit"
              required
            />
            <Input
              label="Email Address"
              id="prof-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              placeholder="e.g. adamsmit@example.com"
              required
            />
            <Input
              label="Home City & Country"
              id="prof-homecity"
              placeholder="e.g. Mumbai, India"
              value={homeCity}
              onChange={(e) => setHomeCity(e.target.value)}
              icon={MapPin}
            />
          </div>

          <div className="form-group" style={{ marginTop: '14px' }}>
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
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
