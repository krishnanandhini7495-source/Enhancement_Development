// src/api/invoicesAPI.ts
// Invoices API Integration

import apiClient from './apiClient';
import { API_ENDPOINTS } from './api.constants';
import { handleApiError } from './apiClient';

export interface InvoiceService {
  serviceId: string;
  serviceName: string;
  staffId?: string;
  staffName?: string;
  price: number;
}

export interface InvoiceProduct {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Payment {
  method: string; // 'Cash', 'Card', 'UPI', 'PhonePe', 'GooglePay', 'Paytm'
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  services: InvoiceService[];
  products: InvoiceProduct[];
  payments: Payment[];
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceDto {
  customerName: string;
  customerPhone: string;
  services: InvoiceService[];
  products: InvoiceProduct[];
  payments: Payment[];
  discount: number;
}

export interface UpdateInvoiceDto {
  customerName?: string;
  customerPhone?: string;
  services?: InvoiceService[];
  products?: InvoiceProduct[];
  payments?: Payment[];
  discount?: number;
}

// Get all invoices
export const getAllInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.INVOICES.GET_ALL);
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Get invoice by ID
export const getInvoiceById = async (id: string): Promise<Invoice> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.INVOICES.GET_BY_ID(id));
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Get invoice by invoice number
export const getInvoiceByNumber = async (invoiceNumber: string): Promise<Invoice> => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.INVOICES.GET_BY_NUMBER(invoiceNumber)
    );
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Create invoice
export const createInvoice = async (data: CreateInvoiceDto): Promise<Invoice> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.INVOICES.CREATE, data);
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Update invoice
export const updateInvoice = async (
  id: string,
  data: UpdateInvoiceDto
): Promise<Invoice> => {
  try {
    const response = await apiClient.put(
      API_ENDPOINTS.INVOICES.UPDATE(id),
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Delete invoice
export const deleteInvoice = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(API_ENDPOINTS.INVOICES.DELETE(id));
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

// Get invoices by date range
export const getInvoicesByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Invoice[]> => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.INVOICES.GET_BY_DATE_RANGE,
      {
        params: { startDate, endDate },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};
