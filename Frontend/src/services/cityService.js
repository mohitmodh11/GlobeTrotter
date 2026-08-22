import { api } from './api';

export const cityService = {
  async searchCities(query) {
    if (!query || query.trim().length < 2) {
      return { success: true, count: 0, data: [] };
    }
    return api.get('/cities/search', { q: query.trim() });
  },

  async getCityById(cityId) {
    return api.get(`/cities/${cityId}`);
  },

  async saveCity(cityData) {
    return api.post('/cities', {
      name: cityData.name,
      country: cityData.country,
      countryCode: cityData.countryCode || cityData.country_code || null,
      state: cityData.state || cityData.region || null,
      latitude: cityData.latitude || 0,
      longitude: cityData.longitude || 0,
      timezone: cityData.timezone || null,
      population: cityData.population || 0,
    });
  },
};
