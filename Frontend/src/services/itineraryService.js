import { api } from './api';

export const itineraryService = {
  async getItinerary(tripId) {
    return api.get(`/trips/${tripId}/itinerary`);
  },

  async getCalendar(tripId) {
    return api.get(`/trips/${tripId}/calendar`);
  },
};
