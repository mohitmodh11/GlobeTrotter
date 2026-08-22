import { api } from './api';

export const shareService = {
  async generateShareLink(tripId) {
    return api.post(`/trips/${tripId}/share`);
  },

  async removeShareLink(tripId) {
    return api.delete(`/trips/${tripId}/share`);
  },

  async getPublicTrip(shareId) {
    return api.get(`/public/trips/${shareId}`);
  },

  async copyPublicTrip(shareId) {
    return api.post(`/public/trips/${shareId}/copy`);
  },
};
