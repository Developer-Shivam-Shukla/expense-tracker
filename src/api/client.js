// Centralized API client with JWT bearer authentication and error handling
import { API_CONFIG } from '../config/api.config';

export function getStoredToken() {
  try {
    return localStorage.getItem(API_CONFIG.TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  try {
    localStorage.setItem(API_CONFIG.TOKEN_KEY, token);
  } catch (err) {
    console.error('Failed to save token to localStorage', err);
  }
}

export function removeStoredToken() {
  try {
    localStorage.removeItem(API_CONFIG.TOKEN_KEY);
  } catch (err) {
    console.error('Failed to remove token', err);
  }
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

let onUnauthorizedCallback = null;

export function setOnUnauthorizedHandler(callback) {
  onUnauthorizedCallback = callback;
}

export async function apiClient(endpoint, options = {}) {
  const { params, headers: customHeaders, ...customConfig } = options;

  let url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.BASE_URL}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };

  const response = await fetch(url, {
    ...customConfig,
    headers,
  });

  if (response.status === 401) {
    removeStoredToken();
    if (onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
    const errorData = await response.json().catch(() => ({ message: 'Session expired. Please log in again.' }));
    throw new ApiError(errorData.message || 'Session expired', 401, errorData);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unexpected error occurred.' }));
    throw new ApiError(errorData.message || `Request failed with status ${response.status}`, response.status, errorData);
  }

  return response.json();
}

// Helper for downloading binary files (like Excel .xlsx) with proper auth headers
export async function downloadFile(endpoint, defaultFilename, params) {
  let url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.BASE_URL}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += (url.includes('?') ? '&' : '?') + qs;
  }

  const token = getStoredToken();
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { headers });

  if (response.status === 401) {
    removeStoredToken();
    if (onUnauthorizedCallback) onUnauthorizedCallback();
    throw new ApiError('Authentication required to download file', 401);
  }

  if (!response.ok) {
    throw new ApiError('Failed to download file', response.status);
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;

  // Try to get filename from Content-Disposition header
  const disposition = response.headers.get('Content-Disposition');
  let filename = defaultFilename;
  if (disposition && disposition.includes('filename=')) {
    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }

  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
}
