import { api } from './api';

export const adminService = {
  async getAnalytics() {
    return api.get('/admin/analytics');
  },

  async getUsers() {
    return api.get('/admin/users');
  },

  async deleteUser(userId) {
    return api.delete(`/admin/users/${userId}`);
  },

  async getPopularCities() {
    return api.get('/admin/popular-cities');
  },

  async getPopularActivities() {
    return api.get('/admin/popular-activities');
  },

  async getTripAnalytics() {
    return api.get('/admin/trip-analytics');
  },
};
