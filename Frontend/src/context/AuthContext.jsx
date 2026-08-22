import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: 'user-default-1',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  role: 'traveler', // 'traveler' | 'admin'
  homeCity: 'Mumbai, India',
  bio: 'Passionate globetrotter, photographer, and chai lover. Exploring 30 countries before 30.',
  currency: 'INR',
  units: 'km',
  travelStyles: ['Culture & History', 'Food & Wine', 'Nature Trails', 'Photography'],
  savedDestinations: ['city-1', 'city-2', 'city-5', 'city-6'],
};

const DEMO_ADMIN = {
  id: 'user-admin-1',
  name: 'Sarah Connor (Admin)',
  email: 'admin@globetrotter.io',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  role: 'admin',
  homeCity: 'Bengaluru, India',
  bio: 'GlobeTrotter Lead Platform Administrator & Travel Curator.',
  currency: 'INR',
  units: 'km',
  travelStyles: ['Solo Travel', 'Adventure', 'Culture'],
  savedDestinations: ['city-1', 'city-3', 'city-8'],
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('globetrotter_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (!parsed.currency || parsed.currency === 'USD')) {
          parsed.currency = 'INR';
        }
        return parsed;
      }
      return DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem('globetrotter_user', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('globetrotter_user');
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = async (email, password) => {
    if (email === 'admin@globetrotter.io') {
      setUser(DEMO_ADMIN);
      return { success: true, user: DEMO_ADMIN };
    }
    const loggedUser = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
      name: email ? email.split('@')[0].replace('.', ' ') : DEFAULT_USER.name,
      currency: 'INR',
    };
    setUser(loggedUser);
    return { success: true, user: loggedUser };
  };

  const signup = async (name, email, password) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name: name || 'New Traveler',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      role: 'traveler',
      homeCity: 'Delhi, India',
      bio: 'Ready to discover the world with GlobeTrotter!',
      currency: 'INR',
      units: 'km',
      travelStyles: ['Sightseeing', 'Food & Dining'],
      savedDestinations: ['city-1'],
    };
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const demoLogin = (role = 'traveler') => {
    if (role === 'admin') {
      setUser(DEMO_ADMIN);
    } else {
      setUser(DEFAULT_USER);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      return updated;
    });
  };

  const toggleSaveDestination = (cityId) => {
    setUser((prev) => {
      if (!prev) return prev;
      const isSaved = prev.savedDestinations?.includes(cityId);
      const savedDestinations = isSaved
        ? prev.savedDestinations.filter((id) => id !== cityId)
        : [...(prev.savedDestinations || []), cityId];
      return { ...prev, savedDestinations };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        demoLogin,
        logout,
        updateProfile,
        toggleSaveDestination,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
