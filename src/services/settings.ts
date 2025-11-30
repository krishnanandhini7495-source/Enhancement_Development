import { api } from "./api";

export interface BranchDetails {
  branchName: string;
  address: string;
  email: string;
  phone: string;
}

export interface SalonSettings {
  id: string;
  salonName: string;
  mainAddress: string;
  branchAddresses: BranchDetails[];
  phone: string;
  email?: string;
  logoUrl?: string;
}

export interface UpdateSalonSettings {
  salonName: string;
  mainAddress: string;
  branchAddresses: BranchDetails[];
  phone: string;
  email?: string;
  logoUrl?: string;
}

export const settingsAPI = {
  get: async (): Promise<SalonSettings> => {
    const response = await api.get("/Settings");
    return response.data;
  },

  update: async (settings: UpdateSalonSettings): Promise<SalonSettings> => {
    const response = await api.put("/Settings", settings);
    return response.data;
  },
};
