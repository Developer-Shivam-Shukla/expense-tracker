import { apiClient, downloadFile } from './client';
import { API_CONFIG } from '../config/api.config';

export const dashboardApi = {
  async getOverview() {
    return apiClient(API_CONFIG.ENDPOINTS.DASHBOARD.OVERVIEW);
  },

  async downloadFullReport() {
    return downloadFile(API_CONFIG.ENDPOINTS.DASHBOARD.EXPORT_WORKBOOK, 'VaultFlow_Financial_Report.xlsx');
  },

  async resetDemoData() {
    return apiClient(API_CONFIG.ENDPOINTS.DASHBOARD.RESET_DEMO, {
      method: 'POST',
    });
  },
};
