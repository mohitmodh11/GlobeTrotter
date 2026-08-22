import { api } from './api';

export const activityService = {
  async getActivities(params = {}) {
    return api.get('/activities', params);
  },

  async getActivityById(activityId) {
    return api.get(`/activities/${activityId}`);
  },

  async createActivity(activityData) {
    return api.post('/activities', {
      cityId: activityData.cityId || activityData.city_id || null,
      name: activityData.name,
      type: activityData.type,
      description: activityData.description || '',
      cost: activityData.cost || 0,
      duration: activityData.duration || 0,
      image: activityData.image || null,
    });
  },

  async getStopActivities(stopId) {
    return api.get(`/activities/stops/${stopId}`);
  },

  async addActivityToStop(stopId, data) {
    return api.post(`/activities/stops/${stopId}`, {
      activityId: data.activityId || data.activity_id,
      activityDate: data.activityDate || data.activity_date || data.date || null,
      startTime: data.startTime || data.start_time || null,
      endTime: data.endTime || data.end_time || null,
      customCost: data.customCost !== undefined ? data.customCost : data.cost,
      activityOrder: data.activityOrder || data.activity_order || 0,
    });
  },

  async updateStopActivity(id, data) {
    return api.put(`/activities/stop-activities/${id}`, {
      activityDate: data.activityDate || data.activity_date || data.date,
      startTime: data.startTime || data.start_time,
      endTime: data.endTime || data.end_time,
      customCost: data.customCost !== undefined ? data.customCost : data.cost,
    });
  },

  async deleteStopActivity(id) {
    return api.delete(`/activities/stop-activities/${id}`);
  },

  async reorderStopActivities(stopId, activityIds) {
    return api.put(`/activities/stops/${stopId}/reorder`, { activityIds });
  },
};
