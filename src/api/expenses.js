import { apiClient, downloadFile } from './client';
import { API_CONFIG } from '../config/api.config';

export const expensesApi = {
  async getExpenses(params) {
    return apiClient(API_CONFIG.ENDPOINTS.EXPENSES.LIST, { params });
  },

  async getExpenseSummary(params) {
    return apiClient(API_CONFIG.ENDPOINTS.EXPENSES.SUMMARY, { params });
  },

  async createExpense(payload) {
    return apiClient(API_CONFIG.ENDPOINTS.EXPENSES.CREATE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateExpense(id, payload) {
    return apiClient(API_CONFIG.ENDPOINTS.EXPENSES.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteExpense(id) {
    return apiClient(API_CONFIG.ENDPOINTS.EXPENSES.DELETE(id), {
      method: 'DELETE',
    });
  },

  async downloadExcel(params) {
    return downloadFile(API_CONFIG.ENDPOINTS.EXPENSES.EXPORT_EXCEL, 'Expenses_Records.xlsx', params);
  },
};
