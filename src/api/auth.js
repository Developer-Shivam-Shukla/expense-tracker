import { apiClient } from './client';
import { API_CONFIG } from '../config/api.config';

export const authApi = {
  async register(payload) {
    return apiClient(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async login(payload) {
    return apiClient(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getMe() {
    return apiClient(API_CONFIG.ENDPOINTS.AUTH.ME);
  },

  async updateProfile(payload) {
    return apiClient(API_CONFIG.ENDPOINTS.AUTH.UPDATE_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async changePassword(payload) {
    return apiClient(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
