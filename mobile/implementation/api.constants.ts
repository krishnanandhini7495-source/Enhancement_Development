// src/constants/api.ts
// API Configuration for React Native Mobile App

/**
 * API Base URL Configuration
 * 
 * Development:
 * - Android Emulator: http://10.0.2.2:5000/api
 * - iOS Simulator: http://localhost:5000/api
 * - Physical Device: http://YOUR_COMPUTER_IP:5000/api (e.g., http://192.168.1.100:5000/api)
 * 
 * Production:
 * - Use your production API URL (e.g., https://api.yoursalon.com/api)
 */

import { Platform } from 'react-native';

// Change this to your computer's IP address when testing on physical devices
const LOCAL_IP = '192.168.1.100'; // Replace with your actual IP

const getBaseURL = (): string => {
  if (__DEV__) {
    // Development environment
    if (Platform.OS === 'android') {
      // Android emulator uses 10.0.2.2 to access host machine's localhost
      return 'http://10.0.2.2:5000/api';
    } else {
      // iOS simulator can use localhost
      return 'http://localhost:5000/api';
    }
  } else {
    // Production environment
    return 'https://api.yoursalon.com/api'; // Replace with your production URL
  }
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  TIMEOUT: 30000, // 30 seconds
};

// API Endpoints matching your .NET backend
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/Auth/login',
    REGISTER: '/Auth/register',
    ME: '/Auth/me',
    REFRESH_TOKEN: '/Auth/refresh',
  },

  // Services
  SERVICES: {
    GET_ALL: '/Services',
    GET_BY_ID: (id: string) => `/Services/${id}`,
    CREATE: '/Services',
    UPDATE: (id: string) => `/Services/${id}`,
    DELETE: (id: string) => `/Services/${id}`,
  },

  // Products
  PRODUCTS: {
    GET_ALL: '/Products',
    GET_BY_ID: (id: string) => `/Products/${id}`,
    CREATE: '/Products',
    UPDATE: (id: string) => `/Products/${id}`,
    DELETE: (id: string) => `/Products/${id}`,
    LOW_STOCK: '/Products/low-stock',
    EXPORT_CSV: '/Products/export/csv',
  },

  // Staff
  STAFF: {
    GET_ALL: '/Staff',
    GET_BY_ID: (id: string) => `/Staff/${id}`,
    CREATE: '/Staff',
    UPDATE: (id: string) => `/Staff/${id}`,
    DELETE: (id: string) => `/Staff/${id}`,
    EXPORT_CSV: '/Staff/export/csv',
  },

  // Invoices
  INVOICES: {
    GET_ALL: '/Invoices',
    GET_BY_ID: (id: string) => `/Invoices/${id}`,
    CREATE: '/Invoices',
    UPDATE: (id: string) => `/Invoices/${id}`,
    DELETE: (id: string) => `/Invoices/${id}`,
    GET_BY_NUMBER: (invoiceNumber: string) => `/Invoices/number/${invoiceNumber}`,
    GET_BY_DATE_RANGE: '/Invoices/date-range',
  },

  // Customers
  CUSTOMERS: {
    SEARCH: '/Customers/search',
    GET_HISTORY: (phone: string) => `/Customers/${phone}/history`,
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/Dashboard/stats',
  },

  // Settings
  SETTINGS: {
    GET: '/Settings',
    UPDATE: '/Settings',
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Request timeout duration
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Token refresh threshold (refresh when token expires in less than 5 minutes)
export const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds
