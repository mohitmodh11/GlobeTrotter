import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { savedDestinationService } from '../services/savedDestinationService';
import { getAuthToken, setAuthToken } from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: 1,
  name: 'Alex Morgan',
  username: 'alexmorgan',
  email: 'alex.morgan@example.com',
  avatar: null,
  role: 'user',
  homeCity: 'Mumbai, India',
  bio: 'Passionate globetrotter, photographer, and chai lover. Exploring 30 countries before 30.',
  currency: 'INR',
  units: 'km',
  travelStyles: ['Culture & History', 'Food & Wine', 'Nature Trails', 'Photography'],
  savedDestinations: ['city-1', 'city-2', 'city-5', 'city-6'],
};

const DEMO_ADMIN = {
  id: 2,
  name: 'Manan Patel (Admin)',
  username: 'admin',
  email: 'manan123@gmail.com',
  avatar: null,
  role: 'admin',
  homeCity: 'Bengaluru, India',
  bio: 'GlobeTrotter Lead Platform Administrator & Travel Curator.',
  currency: 'INR',
  units: 'km',
  travelStyles: ['Solo Travel', 'Adventure', 'Culture'],
  savedDestinations: ['city-1', 'city-3', 'city-8'],
};

const formatApiUser = (apiUser) => {
  if (!apiUser) return null;
  return {
    id: apiUser.id,
    name: apiUser.name || 'Traveler',
    username: apiUser.username || '',
    email: apiUser.email || '',
    avatar: apiUser.profile_image || apiUser.avatar || null,
    role: apiUser.role === 'admin' ? 'admin' : (apiUser.role || 'user'),
    language: apiUser.language || 'en',
    homeCity: apiUser.homeCity || 'Mumbai, India',
    bio: apiUser.bio || 'Passionate traveler exploring the world with GlobeTrotter.',
    currency: 'INR',
    units: 'km',
    travelStyles: apiUser.travelStyles || ['Culture & History', 'Nature Trails'],
    savedDestinations: apiUser.savedDestinations || [],
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('globetrotter_user');
      const token = localStorage.getItem('globetrotter_token');
      if (stored && token) {
        const parsed = JSON.parse(stored);
        if (parsed) {
          if (!parsed.currency || parsed.currency === 'USD') {
            parsed.currency = 'INR';
          }
          if (parsed.avatar && parsed.avatar.includes('unsplash.com')) {
            parsed.avatar = null;
          }
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  // Validate existing auth session on app startup if token is stored
  useEffect(() => {
    const checkAuthSession = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const res = await authService.getMe();
        if (res?.success && res?.data) {
          const formatted = formatApiUser(res.data);
          setUser(formatted);
          localStorage.setItem('globetrotter_user', JSON.stringify(formatted));
        }
      } catch (err) {
        console.warn('Auth session expired or invalid:', err.message);
        // Clean up expired session
        setAuthToken(null);
        setUser(null);
        localStorage.removeItem('globetrotter_user');
      }
    };

    checkAuthSession();
  }, []);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('globetrotter_user', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('globetrotter_user');
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = async (identifier, password) => {
    setIsLoading(true);
    try {
      // Direct call to Backend Login API
      const res = await authService.login({ identifier, password });

      if (res?.success && res?.data?.user) {
        const formatted = formatApiUser(res.data.user);
        setUser(formatted);
        localStorage.setItem('globetrotter_user', JSON.stringify(formatted));
        return { success: true, user: formatted };
      }

      throw new Error(res?.message || 'Login failed. Please verify your credentials.');
    } catch (apiError) {
      // Throw the exact backend error (e.g. 401 "Invalid username/email or password.")
      // Never silently bypass authentication
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name, email, password, username = '') => {
    setIsLoading(true);
    const finalUsername = username || (email ? email.split('@')[0] : `user_${Date.now()}`);

    try {
      // Direct call to Backend Register API
      const res = await authService.register({
        name,
        username: finalUsername,
        email,
        password,
        confirmPassword: password,
      });

      if (res?.success && res?.data?.user) {
        const formatted = formatApiUser(res.data.user);
        setUser(formatted);
        localStorage.setItem('globetrotter_user', JSON.stringify(formatted));
        return { success: true, user: formatted };
      }

      throw new Error(res?.message || 'Registration failed.');
    } catch (apiError) {
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = (role = 'traveler') => {
    const demoUser = role === 'admin' ? DEMO_ADMIN : DEFAULT_USER;
    setUser(demoUser);
    localStorage.setItem('globetrotter_user', JSON.stringify(demoUser));
    setAuthToken('demo_token_' + role);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      setAuthToken(null);
      setUser(null);
      localStorage.removeItem('globetrotter_token');
      localStorage.removeItem('globetrotter_user');
    }
  };

  const updateProfile = async (updatedFields) => {
    try {
      if (updatedFields.name || updatedFields.email) {
        await userService.updateProfile({
          name: updatedFields.name || user?.name,
          email: updatedFields.email || user?.email,
        }).catch((err) => console.warn('API updateProfile failed:', err.message));
      }
    } catch (err) {
      console.warn('Profile sync warning:', err);
    }

    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedFields };
      return updated;
    });
  };

  const toggleSaveDestination = async (cityId) => {
    const isSaved = user?.savedDestinations?.includes(cityId);

    try {
      if (isSaved) {
        await savedDestinationService.deleteSavedDestination(cityId).catch(() => {});
      } else {
        await savedDestinationService.addSavedDestination(cityId).catch(() => {});
      }
    } catch (err) {
      console.warn('Save destination API sync warning:', err);
    }

    setUser((prev) => {
      if (!prev) return prev;
      const currentlySaved = prev.savedDestinations?.includes(cityId);
      const savedDestinations = currentlySaved
        ? prev.savedDestinations.filter((id) => id !== cityId)
        : [...(prev.savedDestinations || []), cityId];
      return { ...prev, savedDestinations };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
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
