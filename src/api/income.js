import { apiClient, downloadFile } from './client';
import { API_CONFIG } from '../config/api.config';

export const incomeApi = {
  async getIncomes(params) {
    return apiClient(API_CONFIG.ENDPOINTS.INCOME.LIST, { params });
  },

  async getIncomeSummary(params) {
    return apiClient(API_CONFIG.ENDPOINTS.INCOME.SUMMARY, { params });
  },

  async createIncome(payload) {
    return apiClient(API_CONFIG.ENDPOINTS.INCOME.CREATE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateIncome(id, payload) {
    return apiClient(API_CONFIG.ENDPOINTS.INCOME.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteIncome(id) {
    return apiClient(API_CONFIG.ENDPOINTS.INCOME.DELETE(id), {
      method: 'DELETE',
    });
  },

  async downloadExcel(params) {
    return downloadFile(API_CONFIG.ENDPOINTS.INCOME.EXPORT_EXCEL, 'Income_Records.xlsx', params);
  },
};
