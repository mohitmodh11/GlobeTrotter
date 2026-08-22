import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_TRIPS, MOCK_CITIES, MOCK_ACTIVITIES } from '../utils/mockData';
import { getTripStatus } from '../utils/dateUtils';
import { tripService } from '../services/tripService';
import { stopService } from '../services/stopService';
import { activityService } from '../services/activityService';
import { expenseService } from '../services/expenseService';
import { itineraryService } from '../services/itineraryService';
import { shareService } from '../services/shareService';
import { getAuthToken } from '../services/api';

const TripContext = createContext(null);

export const normalizeTripFromApi = (apiTrip, stops = [], expenses = []) => {
  if (!apiTrip) return null;
  const startDate = apiTrip.start_date || apiTrip.startDate;
  const endDate = apiTrip.end_date || apiTrip.endDate;

  const normalizedStops = (stops || apiTrip.stops || []).map((s) => ({
    id: s.id,
    cityId: s.city_id || s.cityId,
    cityName: s.city_name || s.cityName || 'City',
    country: s.country || '',
    arrivalDate: s.start_date || s.arrivalDate,
    departureDate: s.end_date || s.departureDate,
    accommodation: s.accommodation || null,
    transportToNext: s.transportToNext || null,
    activities: (s.activities || []).map((a) => ({
      id: a.id,
      activityId: a.activity_id || a.id,
      title: a.name || a.title || 'Activity',
      name: a.name || a.title || 'Activity',
      type: a.type || 'sightseeing',
      category: a.type || a.category || 'sightseeing',
      date: a.activity_date || a.date,
      exactTime: a.start_time || a.exactTime || '10:00',
      startTime: a.start_time,
      endTime: a.end_time,
      cost: a.custom_cost !== null && a.custom_cost !== undefined ? a.custom_cost : (a.cost || 0),
      duration: a.duration || 1,
      notes: a.description || a.notes || '',
      isCompleted: false,
    })),
  }));

  const normalizedExpenses = (expenses || apiTrip.expenses || []).map((e) => ({
    id: e.id,
    stopId: e.stop_id || e.stopId,
    category: e.category || 'misc',
    amount: Number(e.amount) || 0,
    description: e.description || '',
    date: e.expense_date || e.date,
  }));

  return {
    id: apiTrip.id,
    name: apiTrip.name,
    description: apiTrip.description || '',
    startDate,
    endDate,
    targetBudget: Number(apiTrip.target_budget || apiTrip.targetBudget) || 280000,
    currency: 'INR',
    coverImage:
      apiTrip.cover_photo ||
      apiTrip.coverImage ||
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80',
    coverPhoto: apiTrip.cover_photo || apiTrip.coverPhoto,
    isPublic: Boolean(apiTrip.is_public),
    shareCode: apiTrip.share_id || apiTrip.shareCode || `TRIP-${apiTrip.id}`,
    status: getTripStatus(startDate, endDate),
    stops: normalizedStops,
    expenses: normalizedExpenses,
  };
};

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState(() => {
    try {
      const stored = localStorage.getItem('globetrotter_trips');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
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
  const [activities] = useState(MOCK_ACTIVITIES);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);

  // Fetch live trips from backend API when authenticated
  const fetchMyTrips = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      setIsLoadingTrips(true);
      const res = await tripService.getMyTrips();
      if (res?.success && Array.isArray(res.data)) {
        if (res.data.length > 0) {
          // Fetch full itinerary for each trip in parallel
          const fullTrips = await Promise.all(
            res.data.map(async (trip) => {
              try {
                const itineraryRes = await itineraryService.getItinerary(trip.id);
                const stops = itineraryRes?.data?.stops || [];
                const expensesRes = await expenseService.getTripExpenses(trip.id).catch(() => null);
                const expenses = expensesRes?.data || [];
                return normalizeTripFromApi(trip, stops, expenses);
              } catch {
                return normalizeTripFromApi(trip, [], []);
              }
            })
          );

          setTrips(fullTrips);
          localStorage.setItem('globetrotter_trips', JSON.stringify(fullTrips));
        }
      }
    } catch (err) {
      console.warn('Trips API sync note:', err.message);
    } finally {
      setIsLoadingTrips(false);
    }
  }, []);

  useEffect(() => {
    fetchMyTrips();
  }, [fetchMyTrips]);

  // Sync to local storage
  useEffect(() => {
    if (trips && trips.length > 0) {
      localStorage.setItem('globetrotter_trips', JSON.stringify(trips));
    }
  }, [trips]);

  // Trip CRUD
  const createTrip = async (tripData) => {
    let createdId = `trip-${Date.now()}`;
    let apiCreatedTrip = null;

    // 1. Try backend API
    try {
      const res = await tripService.createTrip({
        name: tripData.name,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        description: tripData.description || '',
      });

      if (res?.success && res?.data) {
        apiCreatedTrip = res.data;
        createdId = apiCreatedTrip.id;
      }
    } catch (err) {
      console.warn('Create trip API warning (using local):', err.message);
    }

    const newTrip = {
      id: createdId,
      name: tripData.name,
      description: tripData.description || '',
      category: tripData.category || 'leisure',
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      targetBudget: Number(tripData.targetBudget) || 150000,
      currency: tripData.currency || 'INR',
      coverImage:
        tripData.coverImage ||
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80',
      isPublic: false,
      shareCode: `TRIP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: getTripStatus(tripData.startDate, tripData.endDate),
      stops: tripData.stops || [],
      expenses: tripData.expenses || [],
    };

    setTrips((prev) => [newTrip, ...prev]);
    return newTrip;
  };

  const updateTrip = async (id, updatedFields) => {
    // 1. Try backend API if trip ID is numeric
    if (typeof id === 'number' || !isNaN(Number(id))) {
      try {
        await tripService.updateTrip(id, updatedFields).catch(() => {});
      } catch (err) {
        console.warn('Update trip API warning:', err);
      }
    }

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

  const deleteTrip = async (id) => {
    if (typeof id === 'number' || !isNaN(Number(id))) {
      try {
        await tripService.deleteTrip(id).catch(() => {});
      } catch (err) {
        console.warn('Delete trip API warning:', err);
      }
    }

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
    return trips.find((t) => String(t.id) === String(id)) || null;
  };

  const getTripByShareCode = (shareCode) => {
    return trips.find((t) => t.shareCode === shareCode || String(t.id) === String(shareCode)) || null;
  };

  // Stop Operations
  const addStop = async (tripId, stopData) => {
    let stopId = `stop-${Date.now()}`;

    // Try backend API
    if (typeof tripId === 'number' || !isNaN(Number(tripId))) {
      try {
        const res = await stopService.addTripStop(tripId, {
          cityId: stopData.cityId || 1,
          startDate: stopData.arrivalDate,
          endDate: stopData.departureDate,
        }).catch(() => null);

        if (res?.success && res?.data?.id) {
          stopId = res.data.id;
        }
      } catch (err) {
        console.warn('Add stop API warning:', err);
      }
    }

    const newStop = {
      id: stopId,
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
        if (String(t.id) === String(tripId)) {
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

  const updateStop = async (tripId, stopId, updatedFields) => {
    if (typeof stopId === 'number' || !isNaN(Number(stopId))) {
      try {
        await stopService.updateTripStop(stopId, {
          cityId: updatedFields.cityId || 1,
          startDate: updatedFields.arrivalDate,
          endDate: updatedFields.departureDate,
        }).catch(() => {});
      } catch (err) {
        console.warn('Update stop API warning:', err);
      }
    }

    setTrips((prev) =>
      prev.map((t) => {
        if (String(t.id) === String(tripId)) {
          return {
            ...t,
            stops: (t.stops || []).map((s) => (String(s.id) === String(stopId) ? { ...s, ...updatedFields } : s)),
          };
        }
        return t;
      })
    );
  };

  const deleteStop = async (tripId, stopId) => {
    if (typeof stopId === 'number' || !isNaN(Number(stopId))) {
      try {
        await stopService.deleteTripStop(stopId).catch(() => {});
      } catch (err) {
        console.warn('Delete stop API warning:', err);
      }
    }

    setTrips((prev) =>
      prev.map((t) => {
        if (String(t.id) === String(tripId)) {
          return {
            ...t,
            stops: (t.stops || []).filter((s) => String(s.id) !== String(stopId)),
          };
        }
        return t;
      })
    );
  };

  const reorderStops = (tripId, fromIndex, toIndex) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (String(t.id) === String(tripId)) {
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
  const addActivityToStop = async (tripId, stopId, activityData) => {
    let actId = `act-inst-${Date.now()}`;

    if (typeof stopId === 'number' || !isNaN(Number(stopId))) {
      try {
        const res = await activityService.addActivityToStop(stopId, {
          activityId: activityData.activityId || 1,
          activityDate: activityData.date,
          startTime: activityData.exactTime || activityData.startTime,
          customCost: activityData.cost,
        }).catch(() => null);

        if (res?.success && res?.data?.id) {
          actId = res.data.id;
        }
      } catch (err) {
        console.warn('Add activity API warning:', err);
      }
    }

    const newActivity = {
      id: actId,
      dayNumber: Number(activityData.dayNumber) || 1,
      date: activityData.date,
      timeSlot: activityData.timeSlot || 'morning',
      exactTime: activityData.exactTime || '10:00',
      title: activityData.title || activityData.name,
      name: activityData.title || activityData.name,
      category: activityData.category || 'sightseeing',
      cost: Number(activityData.cost) || 0,
      notes: activityData.notes || '',
      isCompleted: false,
    };

    setTrips((prev) =>
      prev.map((t) => {
        if (String(t.id) === String(tripId)) {
          return {
            ...t,
            stops: (t.stops || []).map((s) => {
              if (String(s.id) === String(stopId)) {
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

  const updateActivity = async (tripId, stopId, activityId, updatedFields) => {
    if (typeof activityId === 'number' || !isNaN(Number(activityId))) {
      try {
        await activityService.updateStopActivity(activityId, {
          activityDate: updatedFields.date,
          startTime: updatedFields.exactTime || updatedFields.startTime,
          customCost: updatedFields.cost,
        }).catch(() => {});
      } catch (err) {
        console.warn('Update activity API warning:', err);
      }
    }

    setTrips((prev) =>
      prev.map((t) => {
        if (String(t.id) === String(tripId)) {
          return {
            ...t,
            stops: (t.stops || []).map((s) => {
              if (String(s.id) === String(stopId)) {
                return {
                  ...s,
                  activities: (s.activities || []).map((a) =>
                    String(a.id) === String(activityId) ? { ...a, ...updatedFields } : a
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

  const deleteActivity = async (tripId, stopId, activityId) => {
    if (typeof activityId === 'number' || !isNaN(Number(activityId))) {
      try {
        await activityService.deleteStopActivity(activityId).catch(() => {});
      } catch (err) {
        console.warn('Delete activity API warning:', err);
      }
    }

    setTrips((prev) =>
      prev.map((t) => {
        if (String(t.id) === String(tripId)) {
          return {
            ...t,
            stops: (t.stops || []).map((s) => {
              if (String(s.id) === String(stopId)) {
                return {
                  ...s,
                  activities: (s.activities || []).filter((a) => String(a.id) !== String(activityId)),
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
        if (String(t.id) === String(tripId)) {
          return {
            ...t,
            stops: (t.stops || []).map((s) => {
              if (String(s.id) === String(stopId)) {
                return {
                  ...s,
                  activities: (s.activities || []).map((a) =>
                    String(a.id) === String(activityId) ? { ...a, isCompleted: !a.isCompleted } : a
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
  const addExpense = async (tripId, expenseData) => {
    let expId = `exp-${Date.now()}`;

    if (typeof tripId === 'number' || !isNaN(Number(tripId))) {
      try {
        const res = await expenseService.addExpense(tripId, {
          category: expenseData.category || 'misc',
          amount: Number(expenseData.amount) || 0,
          description: expenseData.description || '',
          expenseDate: expenseData.date || new Date().toISOString().split('T')[0],
        }).catch(() => null);

        if (res?.success && res?.data?.id) {
          expId = res.data.id;
        }
      } catch (err) {
        console.warn('Add expense API warning:', err);
      }
    }

    const newExpense = {
      id: expId,
      category: expenseData.category || 'misc',
      amount: Number(expenseData.amount) || 0,
      description: expenseData.description,
      date: expenseData.date || new Date().toISOString().split('T')[0],
    };

    setTrips((prev) =>
      prev.map((t) => {
        if (String(t.id) === String(tripId)) {
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

  const deleteExpense = async (tripId, expenseId) => {
    if (typeof expenseId === 'number' || !isNaN(Number(expenseId))) {
      try {
        await expenseService.deleteExpense(expenseId).catch(() => {});
      } catch (err) {
        console.warn('Delete expense API warning:', err);
      }
    }

    setTrips((prev) =>
      prev.map((t) => {
        if (String(t.id) === String(tripId)) {
          return {
            ...t,
            expenses: (t.expenses || []).filter((e) => String(e.id) !== String(expenseId)),
          };
        }
        return t;
      })
    );
  };

  const toggleTripPrivacy = async (tripId) => {
    if (typeof tripId === 'number' || !isNaN(Number(tripId))) {
      try {
        await shareService.generateShareLink(tripId).catch(() => {});
      } catch (err) {
        console.warn('Share API warning:', err);
      }
    }

    setTrips((prev) =>
      prev.map((t) => {
        if (String(t.id) === String(tripId)) {
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
        isLoadingTrips,
        fetchMyTrips,
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
