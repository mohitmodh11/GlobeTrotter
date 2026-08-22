import { api } from './api';

export const tripService = {
  async getMyTrips() {
    return api.get('/trips');
  },

  async getTripById(tripId) {
    return api.get(`/trips/${tripId}`);
  },

  async createTrip(tripData) {
    if (tripData instanceof FormData) {
      return api.postForm('/trips', tripData);
    }
    return api.post('/trips', {
      name: tripData.name,
      startDate: tripData.startDate || tripData.start_date,
      endDate: tripData.endDate || tripData.end_date,
      description: tripData.description || '',
    });
  },

  async updateTrip(tripId, tripData) {
    return api.put(`/trips/${tripId}`, {
      name: tripData.name,
      startDate: tripData.startDate || tripData.start_date,
      endDate: tripData.endDate || tripData.end_date,
      description: tripData.description,
      coverPhoto: tripData.coverPhoto || tripData.cover_photo || tripData.coverImage,
    });
  },

  async deleteTrip(tripId) {
    return api.delete(`/trips/${tripId}`);
  },
};
