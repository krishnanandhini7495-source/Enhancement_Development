import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Backend API URL

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/Auth/login', { email, password });
    return response.data;
  },
  register: async (email: string, password: string, fullName: string, role: string = 'Staff') => {
    const response = await apiClient.post('/Auth/register', { email, password, fullName, role });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await apiClient.get('/Auth/me');
    return response;
  },
};

// Staff API
export const staffAPI = {
  getAll: async () => {
    const response = await apiClient.get('/Staff');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/Staff/${id}`);
    return response.data;
  },
  create: async (data: { 
    name: string; 
    phone?: string; 
    email?: string; 
    address?: string; 
    aadharNumber?: string;
    staffCategory?: string;
    bankName?: string;
    bankAccountNumber?: string;
    ifscCode?: string;
    basicSalary?: number;
    salaryEffectiveDate?: string;
  }) => {
    const response = await apiClient.post('/Staff', data);
    return response.data;
  },
  update: async (id: string, data: { 
    name: string; 
    phone?: string; 
    email?: string; 
    address?: string; 
    aadharNumber?: string;
    staffCategory?: string;
    bankName?: string;
    bankAccountNumber?: string;
    ifscCode?: string;
    basicSalary?: number;
    salaryEffectiveDate?: string;
    active: boolean;
  }) => {
    const response = await apiClient.put(`/Staff/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/Staff/${id}`);
  },
};

// Services API
export const servicesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/Services');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/Services/${id}`);
    return response.data;
  },
  create: async (data: { name: string; basePrice: number }) => {
    const response = await apiClient.post('/Services', data);
    return response.data;
  },
  update: async (id: string, data: { name: string; basePrice: number; active: boolean }) => {
    const response = await apiClient.put(`/Services/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/Services/${id}`);
  },
};

// Products API
export const productsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/Products');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/Products/${id}`);
    return response.data;
  },
  create: async (data: { 
    name: string; 
    price: number; 
    stockQuantity: number;
    openingStockQuantity?: number;
    openingStockDate?: string;
    currentStockQuantity?: number;
    currentStockDate?: string;
    productWeightUnit?: string;
    productWeight?: number;
  }) => {
    const response = await apiClient.post('/Products', data);
    return response.data;
  },
  update: async (id: string, data: { 
    name: string; 
    price: number; 
    stockQuantity: number; 
    active: boolean;
    openingStockQuantity?: number;
    openingStockDate?: string;
    currentStockQuantity?: number;
    currentStockDate?: string;
    productWeightUnit?: string;
    productWeight?: number;
  }) => {
    const response = await apiClient.put(`/Products/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/Products/${id}`);
  },
  getLowStock: async () => {
    const response = await apiClient.get('/Products/low-stock');
    return response.data;
  },
  exportToCsv: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/Products/export/csv`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Export failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};

// Invoices API
export const invoicesAPI = {
  getAll: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await apiClient.get(`/Invoices?${params.toString()}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/Invoices/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/Invoices', data);
    return response.data;
  },
  exportToCsv: async (startDate?: string, endDate?: string, search?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (search) params.append('search', search);
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/Invoices/export/csv?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to export CSV');
    }
    
    return response.blob();
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await apiClient.get('/Dashboard/stats');
    return response;
  },
};

// Customer API
export const customerAPI = {
  search: async (query: string) => {
    const response = await apiClient.get(`/Customers/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },
  getHistory: async (phone: string) => {
    const response = await apiClient.get(`/Customers/history/${encodeURIComponent(phone)}`);
    return response.data;
  },
};

// Export apiClient as named export for use in other services
export const api = apiClient;

export default apiClient;
