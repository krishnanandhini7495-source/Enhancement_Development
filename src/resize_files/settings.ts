// Settings API for salon configuration

export interface BranchAddress {
  branchName: string;
  address: string;
}

export interface SalonSettings {
  salonName: string;
  mainAddress: string;
  branchAddresses?: BranchAddress[];
  phone: string;
  email: string;
  gstNumber?: string;
}

const defaultSettings: SalonSettings = {
  salonName: "Salon",
  mainAddress: "Main Branch",
  phone: "",
  email: "",
};

export const settingsAPI = {
  get: async (): Promise<SalonSettings> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Try to get from localStorage or return defaults
    const stored = localStorage.getItem("salonSettings");
    if (stored) {
      return JSON.parse(stored);
    }
    return defaultSettings;
  },
  save: async (settings: SalonSettings): Promise<SalonSettings> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    localStorage.setItem("salonSettings", JSON.stringify(settings));
    return settings;
  },
};
