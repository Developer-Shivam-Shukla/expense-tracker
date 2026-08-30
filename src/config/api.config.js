// Backend API Configuration
// Connected to MongoDB & Express API endpoints

export const API_CONFIG = {
  // Base URL for backend API requests (leave empty to use relative /api proxy)
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  
  // Local storage keys
  TOKEN_KEY: 'vaultflow_jwt_token',
  USER_KEY: 'vaultflow_user_data',

  // API Endpoints Mapping
  ENDPOINTS: {
    // Auth & User Endpoints (/api/user)
    AUTH: {
      LOGIN: '/api/user/login',
      REGISTER: '/api/user/register',
      ME: '/api/user/getUser',
      UPDATE_PROFILE: '/api/user/profile',
      CHANGE_PASSWORD: '/api/user/change-password',
    },
    // Income Endpoints (/api/income)
    INCOME: {
      LIST: '/api/income/get',
      SUMMARY: '/api/income/summary',
      CREATE: '/api/income/add',
      UPDATE: (id) => `/api/income/update/${id}`,
      DELETE: (id) => `/api/income/delete/${id}`,
      EXPORT_EXCEL: '/api/income/download/excel',
    },
    // Expense Endpoints (/api/expense)
    EXPENSES: {
      LIST: '/api/expense/get',
      SUMMARY: '/api/expense/summary',
      CREATE: '/api/expense/add',
      UPDATE: (id) => `/api/expense/update/${id}`,
      DELETE: (id) => `/api/expense/delete/${id}`,
      EXPORT_EXCEL: '/api/expense/download/excel',
    },
    // Dashboard & Reports (/api/dashboard)
    DASHBOARD: {
      OVERVIEW: '/api/dashboard/overview',
      EXPORT_WORKBOOK: '/api/dashboard/export',
      RESET_DEMO: '/api/dashboard/reset-demo',
    },
  },
};
