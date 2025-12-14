// src/api/authAPI.ts
// Authentication API Integration

import apiClient, { handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { saveToken, saveUser, clearAllStorage } from '../utils/storage';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

// Login
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    // Save token and user data
    await saveToken(response.data.token);
    await saveUser(response.data.user);

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Register
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      {
        ...data,
        role: data.role || 'Staff', // Default role
      }
    );

    // Save token and user data
    await saveToken(response.data.token);
    await saveUser(response.data.user);

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get Current User
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    await saveUser(response.data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    // Clear local storage
    await clearAllStorage();
    
    // Optionally call backend logout endpoint if you have one
    // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    console.error('Logout error:', error);
    // Clear storage even if API call fails
    await clearAllStorage();
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
