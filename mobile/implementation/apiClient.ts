// src/api/apiClient.ts
// Axios HTTP Client Configuration with Token Management

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../constants/api';
import { getToken, saveToken, removeToken } from '../utils/storage';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Remove invalid token
      await removeToken();

      // Redirect to login (this will be handled by navigation)
      // You can emit an event or use navigation here
      console.log('Unauthorized - Token expired or invalid');

      // Optionally attempt token refresh
      // if (!originalRequest._retry) {
      //   originalRequest._retry = true;
      //   try {
      //     const newToken = await refreshToken();
      //     await saveToken(newToken);
      //     if (originalRequest.headers) {
      //       originalRequest.headers.Authorization = `Bearer ${newToken}`;
      //     }
      //     return apiClient(originalRequest);
      //   } catch (refreshError) {
      //     return Promise.reject(refreshError);
      //   }
      // }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        isNetworkError: true,
      });
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    
    console.error('API Error:', {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url,
    });

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// Helper function to handle API responses
export const handleApiError = (error: any): string => {
  if (error.isNetworkError) {
    return 'Network error. Please check your connection.';
  }

  if (error.status === 400) {
    return error.message || 'Invalid request. Please check your input.';
  }

  if (error.status === 401) {
    return 'Session expired. Please login again.';
  }

  if (error.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (error.status === 404) {
    return 'Resource not found.';
  }

  if (error.status === 500) {
    return 'Server error. Please try again later.';
  }

  return error.message || 'An unexpected error occurred.';
};

export default apiClient;
