// src/api/servicesAPI.ts
// Services API Integration

import apiClient from './apiClient';
import { API_ENDPOINTS } from './api.constants';
import { handleApiError } from './apiClient';

export interface Service {
  id: string;
  name: string;
  basePrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceDto {
  name: string;
  basePrice: number;
  isActive?: boolean;
}

export interface UpdateServiceDto {
  name?: string;
  basePrice?: number;
  isActive?: boolean;
}

// Get all services
export const getAllServices = async (): Promise<Service[]> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.SERVICES.GET_ALL);
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Get service by ID
export const getServiceById = async (id: string): Promise<Service> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.SERVICES.GET_BY_ID(id));
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Create service
export const createService = async (data: CreateServiceDto): Promise<Service> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.SERVICES.CREATE, data);
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Update service
export const updateService = async (
  id: string,
  data: UpdateServiceDto
): Promise<Service> => {
  try {
    const response = await apiClient.put(
      API_ENDPOINTS.SERVICES.UPDATE(id),
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Delete service
export const deleteService = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(API_ENDPOINTS.SERVICES.DELETE(id));
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};
