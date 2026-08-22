import { api } from './api';

export const expenseService = {
  async getTripExpenses(tripId) {
    return api.get(`/trips/${tripId}/expenses`);
  },

  async addExpense(tripId, data) {
    return api.post(`/trips/${tripId}/expenses`, {
      category: data.category,
      amount: Number(data.amount) || 0,
      description: data.description || '',
      expenseDate: data.expenseDate || data.expense_date || data.date || null,
      stopId: data.stopId || data.stop_id || null,
    });
  },

  async getBudgetSummary(tripId) {
    return api.get(`/trips/${tripId}/budget`);
  },

  async updateExpense(expenseId, data) {
    return api.put(`/expenses/${expenseId}`, {
      category: data.category,
      amount: data.amount !== undefined ? Number(data.amount) : undefined,
      description: data.description,
      expenseDate: data.expenseDate || data.expense_date || data.date,
      stopId: data.stopId || data.stop_id,
    });
  },

  async deleteExpense(expenseId) {
    return api.delete(`/expenses/${expenseId}`);
  },
};
