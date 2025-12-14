// src/utils/storage.ts
// AsyncStorage Helper Functions for Token and Data Management

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
const STORAGE_KEYS = {
  TOKEN: '@salon_auth_token',
  USER: '@salon_user_data',
  REFRESH_TOKEN: '@salon_refresh_token',
  REMEMBER_ME: '@salon_remember_me',
};

// Token Management
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error removing token:', error);
    throw error;
  }
};

// Refresh Token Management
export const saveRefreshToken = async (refreshToken: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  } catch (error) {
    console.error('Error saving refresh token:', error);
    throw error;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

export const removeRefreshToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error removing refresh token:', error);
    throw error;
  }
};

// User Data Management
export const saveUser = async (user: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

export const getUser = async (): Promise<any | null> => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error removing user:', error);
    throw error;
  }
};

// Remember Me
export const saveRememberMe = async (email: string, password: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.REMEMBER_ME,
      JSON.stringify({ email, password })
    );
  } catch (error) {
    console.error('Error saving remember me:', error);
    throw error;
  }
};

export const getRememberMe = async (): Promise<{ email: string; password: string } | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting remember me:', error);
    return null;
  }
};

export const removeRememberMe = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
  } catch (error) {
    console.error('Error removing remember me:', error);
    throw error;
  }
};

// Clear All Storage (Logout)
export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.USER,
      STORAGE_KEYS.REFRESH_TOKEN,
    ]);
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

// Generic Storage Functions
export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting item ${key}:`, error);
    throw error;
  }
};

export const getItem = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    return null;
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key}:`, error);
    throw error;
  }
};
