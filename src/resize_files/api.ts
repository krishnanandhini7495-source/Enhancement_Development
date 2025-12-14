// Mock API services for billing system
// Replace these with actual API calls when backend is connected

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientPhone: string;
  invoiceDate: string;
  services: any[];
  products: any[];
  payments: any[];
  total: number;
}

export interface Service {
  id: string;
  name: string;
  basePrice: number;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  active: boolean;
}

export interface Staff {
  id: string;
  name: string;
  active: boolean;
}

// Mock data
const mockServices: Service[] = [
  { id: "1", name: "Haircut", basePrice: 300, active: true },
  { id: "2", name: "Hair Color", basePrice: 1500, active: true },
  { id: "3", name: "Facial", basePrice: 800, active: true },
  { id: "4", name: "Manicure", basePrice: 400, active: true },
  { id: "5", name: "Pedicure", basePrice: 500, active: true },
];

const mockProducts: Product[] = [
  { id: "1", name: "Shampoo", price: 250, active: true },
  { id: "2", name: "Conditioner", price: 300, active: true },
  { id: "3", name: "Hair Oil", price: 180, active: true },
];

const mockStaff: Staff[] = [
  { id: "1", name: "Rahul", active: true },
  { id: "2", name: "Priya", active: true },
  { id: "3", name: "Amit", active: true },
];

export const invoicesAPI = {
  create: async (data: any): Promise<Invoice> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const invoice: Invoice = {
      id: crypto.randomUUID(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      ...data,
      total: 0,
    };
    return invoice;
  },
  getAll: async (): Promise<Invoice[]> => {
    return [];
  },
};

export const servicesAPI = {
  getAll: async (): Promise<Service[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockServices;
  },
};

export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts;
  },
};

export const staffAPI = {
  getAll: async (): Promise<Staff[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockStaff;
  },
};

export const customerAPI = {
  search: async (query: string): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Return empty array for mock - replace with actual search
    return [];
  },
};
