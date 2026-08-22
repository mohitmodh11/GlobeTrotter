import { api } from './api';

export const stopService = {
  async getTripStops(tripId) {
    return api.get(`/trips/${tripId}/stops`);
  },

  async addTripStop(tripId, stopData) {
    return api.post(`/trips/${tripId}/stops`, {
      cityId: stopData.cityId || stopData.city_id,
      startDate: stopData.startDate || stopData.start_date,
      endDate: stopData.endDate || stopData.end_date,
      stopOrder: stopData.stopOrder || stopData.stop_order || 0,
    });
  },

  async updateTripStop(stopId, stopData) {
    return api.put(`/stops/${stopId}`, {
      cityId: stopData.cityId || stopData.city_id,
      startDate: stopData.startDate || stopData.start_date,
      endDate: stopData.endDate || stopData.end_date,
    });
  },

  async deleteTripStop(stopId) {
    return api.delete(`/stops/${stopId}`);
  },

  async reorderTripStops(tripId, stopIds) {
    return api.put(`/trips/${tripId}/stops/reorder`, { stopIds });
  },
};
