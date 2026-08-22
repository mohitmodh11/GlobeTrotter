import { api } from './api';

export const userService = {
  async getProfile() {
    return api.get('/users/me');
  },

  async updateProfile(userData) {
    if (userData instanceof FormData) {
      return api.putForm('/users/me', userData);
    }
    return api.put('/users/me', userData);
  },

  async changeLanguage(language) {
    return api.put('/users/language', { language });
  },

  async deleteAccount() {
    return api.delete('/users/me');
  },
};
