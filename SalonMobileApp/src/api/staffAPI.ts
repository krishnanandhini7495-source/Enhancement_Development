// src/api/staffAPI.ts
// Staff API Integration

import apiClient from './apiClient';
import { API_ENDPOINTS } from './api.constants';
import { handleApiError } from './apiClient';

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  isActive: boolean;
  category?: string;
  baseSalary?: number;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  branchName?: string;
  createdAt: string;
  updatedAt: string;
  salaryHistories?: SalaryHistory[];
}

export interface SalaryHistory {
  id: string;
  staffId: string;
  amount: number;
  effectiveDate: string;
  notes?: string;
  createdAt: string;
}

export interface CreateStaffDto {
  name: string;
  phone: string;
  email?: string;
  role: string;
  isActive?: boolean;
  category?: string;
  baseSalary?: number;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  branchName?: string;
}

export interface UpdateStaffDto {
  name?: string;
  phone?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  category?: string;
  baseSalary?: number;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  branchName?: string;
}

// Get all staff members
export const getAllStaff = async (): Promise<StaffMember[]> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.STAFF.GET_ALL);
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Get staff by ID
export const getStaffById = async (id: string): Promise<StaffMember> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.STAFF.GET_BY_ID(id));
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Create staff member
export const createStaff = async (data: CreateStaffDto): Promise<StaffMember> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.STAFF.CREATE, data);
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Update staff member
export const updateStaff = async (
  id: string,
  data: UpdateStaffDto
): Promise<StaffMember> => {
  try {
    const response = await apiClient.put(API_ENDPOINTS.STAFF.UPDATE(id), data);
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Delete staff member
export const deleteStaff = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(API_ENDPOINTS.STAFF.DELETE(id));
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Export staff to CSV
export const exportStaffToCSV = async (): Promise<string> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.STAFF.EXPORT_CSV, {
      responseType: 'blob',
    });
    return 'CSV export initiated';
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};
