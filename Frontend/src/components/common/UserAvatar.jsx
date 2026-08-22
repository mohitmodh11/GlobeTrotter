import React, { useState } from 'react';

/**
 * Extracts initials from a user's full name.
 * e.g. "Adam Smit" => "AS", "Manan Patel (Admin)" => "MP"
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'GT';
  const cleaned = name.replace(/\([^)]*\)/g, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'GT';
  if (parts.length === 1) {
    return parts[0].substring(0, Math.min(2, parts[0].length)).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const UserAvatar = ({
  user,
  name,
  avatar,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | number
  style = {},
  className = '',
  border = true,
}) => {
  const [imageError, setImageError] = useState(false);

  const userName = name || user?.name || 'Traveler';
  const avatarUrl = avatar !== undefined ? avatar : user?.avatar;
  const initials = getInitials(userName);

  const sizeMap = {
    sm: { px: 32, font: '0.8125rem', border: '1.5px solid #15803d' },
    md: { px: 40, font: '0.9375rem', border: '2px solid #15803d' },
    lg: { px: 56, font: '1.25rem', border: '2.5px solid #15803d' },
    xl: { px: 84, font: '1.75rem', border: '3px solid #15803d' },
  };

  const dim = typeof size === 'number' ? size : sizeMap[size]?.px || 40;
  const fontSize = typeof size === 'number' ? `${dim * 0.4}px` : sizeMap[size]?.font || '1rem';
  const defaultBorder = sizeMap[size]?.border || '2px solid #15803d';

  // If valid avatar URL exists and hasn't failed loading
  if (avatarUrl && !imageError) {
    return (
      <img
        src={avatarUrl}
        alt={userName}
        onError={() => setImageError(true)}
        className={className}
        style={{
          width: `${dim}px`,
          height: `${dim}px`,
          minWidth: `${dim}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          border: border ? defaultBorder : 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
          ...style,
        }}
      />
    );
  }

  // Fallback / Default: Circular Initials Avatar
  return (
    <div
      className={className}
      style={{
        width: `${dim}px`,
        height: `${dim}px`,
        minWidth: `${dim}px`,
        borderRadius: '50%',
        backgroundColor: '#15803d',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize,
        fontFamily: 'var(--font-heading, "Plus Jakarta Sans", sans-serif)',
        letterSpacing: '0.02em',
        border: border ? defaultBorder : 'none',
        boxShadow: '0 2px 4px rgba(21, 128, 61, 0.2)',
        userSelect: 'none',
        textTransform: 'uppercase',
        ...style,
      }}
      title={userName}
      aria-label={userName}
    >
      {initials}
    </div>
  );
};
