import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_TRIPS, MOCK_CITIES, MOCK_ACTIVITIES } from '../utils/mockData';
import { getTripStatus } from '../utils/dateUtils';

const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState(() => {
    try {
      const stored = localStorage.getItem('globetrotter_trips');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map((t) => {
            if (!t.currency || t.currency === 'USD') {
              return { ...t, currency: 'INR' };
            }
            return t;
          });
        }
      }
      return INITIAL_TRIPS;
    } catch {
      return INITIAL_TRIPS;
    }
  });

  const [cities] = useState(MOCK_CITIES);
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('globetrotter_trips', JSON.stringify(trips));
  }, [trips]);

  // Trip CRUD
  const createTrip = (tripData) => {
    const newTrip = {
      id: `trip-${Date.now()}`,
      name: tripData.name,
      description: tripData.description || '',
      category: tripData.category || 'leisure',
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      targetBudget: Number(tripData.targetBudget) || 150000,
      currency: tripData.currency || 'INR',
      coverImage: tripData.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80',
      isPublic: false,
      shareCode: `TRIP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: getTripStatus(tripData.startDate, tripData.endDate),
      stops: tripData.stops || [],
      expenses: tripData.expenses || [],
    };

    setTrips((prev) => [newTrip, ...prev]);
    return newTrip;
  };

  const updateTrip = (id, updatedFields) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updatedFields };
          updated.status = getTripStatus(updated.startDate, updated.endDate);
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTrip = (id) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const duplicateTrip = (id) => {
    const original = trips.find((t) => t.id === id);
    if (!original) return null;

    const clonedTrip = {
      ...JSON.parse(JSON.stringify(original)),
      id: `trip-${Date.now()}`,
      name: `${original.name} (Copy)`,
      isPublic: false,
      shareCode: `TRIP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };

    setTrips((prev) => [clonedTrip, ...prev]);
    return clonedTrip;
  };

  const getTripById = (id) => {
    return trips.find((t) => t.id === id) || null;
  };

  const getTripByShareCode = (shareCode) => {
    return trips.find((t) => t.shareCode === shareCode || t.id === shareCode) || null;
  };

  // Stop Operations
  const addStop = (tripId, stopData) => {
    const newStop = {
      id: `stop-${Date.now()}`,
      cityName: stopData.cityName,
      country: stopData.country || '',
      arrivalDate: stopData.arrivalDate,
      departureDate: stopData.departureDate,
      accommodation: stopData.accommodation || {
        hotelName: '',
        cost: 0,
        notes: '',
      },
      transportToNext: stopData.transportToNext || null,
      activities: [],
    };

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          return {
            ...t,
            stops: [...(t.stops || []), newStop],
          };
        }
        return t;
      })
    );

    return newStop;
  };

  const updateStop = (tripId, stopId, updatedFields) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          return {
            ...t,
            stops: (t.stops || []).map((s) => (s.id === stopId ? { ...s, ...updatedFields } : s)),
          };
        }
        return t;
      })
    );
  };

  const deleteStop = (tripId, stopId) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          return {
            ...t,
            stops: (t.stops || []).filter((s) => s.id !== stopId),
          };
        }
        return t;
      })
    );
  };

  const reorderStops = (tripId, fromIndex, toIndex) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          const stops = [...(t.stops || [])];
          const [moved] = stops.splice(fromIndex, 1);
          stops.splice(toIndex, 0, moved);
          return { ...t, stops };
        }
        return t;
      })
    );
  };

  // Activity Operations
  const addActivityToStop = (tripId, stopId, activityData) => {
    const newActivity = {
      id: `act-inst-${Date.now()}`,
      dayNumber: Number(activityData.dayNumber) || 1,
      date: activityData.date,
      timeSlot: activityData.timeSlot || 'morning',
      exactTime: activityData.exactTime || '10:00',
      title: activityData.title,
      category: activityData.category || 'sightseeing',
      cost: Number(activityData.cost) || 0,
      notes: activityData.notes || '',
      isCompleted: false,
    };

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          return {
            ...t,
            stops: (t.stops || []).map((s) => {
              if (s.id === stopId) {
                return {
                  ...s,
                  activities: [...(s.activities || []), newActivity],
                };
              }
              return s;
            }),
          };
        }
        return t;
      })
    );

    return newActivity;
  };

  const updateActivity = (tripId, stopId, activityId, updatedFields) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          return {
            ...t,
            stops: (t.stops || []).map((s) => {
              if (s.id === stopId) {
                return {
                  ...s,
                  activities: (s.activities || []).map((a) =>
                    a.id === activityId ? { ...a, ...updatedFields } : a
                  ),
                };
              }
              return s;
            }),
          };
        }
        return t;
      })
    );
  };

  const deleteActivity = (tripId, stopId, activityId) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          return {
            ...t,
            stops: (t.stops || []).map((s) => {
              if (s.id === stopId) {
                return {
                  ...s,
                  activities: (s.activities || []).filter((a) => a.id !== activityId),
                };
              }
              return s;
            }),
          };
        }
        return t;
      })
    );
  };

  const toggleActivityStatus = (tripId, stopId, activityId) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          return {
            ...t,
            stops: (t.stops || []).map((s) => {
              if (s.id === stopId) {
                return {
                  ...s,
                  activities: (s.activities || []).map((a) =>
                    a.id === activityId ? { ...a, isCompleted: !a.isCompleted } : a
                  ),
                };
              }
              return s;
            }),
          };
        }
        return t;
      })
    );
  };

  // Expense Operations
  const addExpense = (tripId, expenseData) => {
    const newExpense = {
      id: `exp-${Date.now()}`,
      category: expenseData.category || 'misc',
      amount: Number(expenseData.amount) || 0,
      description: expenseData.description,
      date: expenseData.date || new Date().toISOString().split('T')[0],
    };

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          return {
            ...t,
            expenses: [newExpense, ...(t.expenses || [])],
          };
        }
        return t;
      })
    );

    return newExpense;
  };

  const deleteExpense = (tripId, expenseId) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          return {
            ...t,
            expenses: (t.expenses || []).filter((e) => e.id !== expenseId),
          };
        }
        return t;
      })
    );
  };

  const toggleTripPrivacy = (tripId) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          return { ...t, isPublic: !t.isPublic };
        }
        return t;
      })
    );
  };

  const copyTripToMyAccount = (tripToClone) => {
    const cloned = {
      ...JSON.parse(JSON.stringify(tripToClone)),
      id: `trip-${Date.now()}`,
      name: `${tripToClone.name} (Saved Plan)`,
      isPublic: false,
      shareCode: `TRIP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };

    setTrips((prev) => [cloned, ...prev]);
    return cloned;
  };

  const resetToDemoData = () => {
    localStorage.setItem('globetrotter_trips', JSON.stringify(INITIAL_TRIPS));
    setTrips(INITIAL_TRIPS);
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        cities,
        activities,
        createTrip,
        updateTrip,
        deleteTrip,
        duplicateTrip,
        getTripById,
        getTripByShareCode,
        addStop,
        updateStop,
        deleteStop,
        reorderStops,
        addActivityToStop,
        updateActivity,
        deleteActivity,
        toggleActivityStatus,
        addExpense,
        deleteExpense,
        toggleTripPrivacy,
        copyTripToMyAccount,
        resetToDemoData,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
};
