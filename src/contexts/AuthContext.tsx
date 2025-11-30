import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@/services/api";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: "Admin" | "Staff";
}

interface AuthContextType {
  user: User | null;
  userRole: "admin" | "staff" | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "staff" | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token and get user data
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
      setUserRole(response.data.role.toLowerCase() as "admin" | "staff");
    } catch (error) {
      console.error("Failed to fetch user:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem("token", response.token);
      setUser({
        id: response.userId,
        email: response.email,
        fullName: response.fullName,
        role: response.role as "Admin" | "Staff"
      });
      setUserRole(response.role.toLowerCase() as "admin" | "staff");
      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data || error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await authAPI.register(email, password, fullName);
      localStorage.setItem("token", response.token);
      setUser({
        id: response.userId,
        email: response.email,
        fullName: response.fullName,
        role: response.role as "Admin" | "Staff"
      });
      setUserRole(response.role.toLowerCase() as "admin" | "staff");
      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data || error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    setUser(null);
    setUserRole(null);
    navigate("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
