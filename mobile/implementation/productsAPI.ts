// src/api/productsAPI.ts
// Products API Integration

import apiClient from './apiClient';
import { API_ENDPOINTS } from './api.constants';
import { handleApiError } from './apiClient';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  lowStockThreshold?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
  isActive?: boolean;
  lowStockThreshold?: number;
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  stock?: number;
  isActive?: boolean;
  lowStockThreshold?: number;
}

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.GET_ALL);
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.GET_BY_ID(id));
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Create product
export const createProduct = async (data: CreateProductDto): Promise<Product> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, data);
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Update product
export const updateProduct = async (
  id: string,
  data: UpdateProductDto
): Promise<Product> => {
  try {
    const response = await apiClient.put(
      API_ENDPOINTS.PRODUCTS.UPDATE(id),
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Get low stock products
export const getLowStockProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.LOW_STOCK);
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Export products to CSV (returns blob URL)
export const exportProductsToCSV = async (): Promise<string> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.EXPORT_CSV, {
      responseType: 'blob',
    });
    // For React Native, you might need to handle blob differently
    // This is a placeholder for CSV export functionality
    return 'CSV export initiated';
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};
