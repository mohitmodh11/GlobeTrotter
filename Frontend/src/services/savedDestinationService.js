import { api } from './api';

export const savedDestinationService = {
  async getMySavedDestinations() {
    return api.get('/saved-destinations');
  },

  async addSavedDestination(cityId) {
    return api.post('/saved-destinations', { cityId });
  },

  async deleteSavedDestination(cityId) {
    return api.delete(`/saved-destinations/${cityId}`);
  },
};
