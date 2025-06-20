"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

// Add these new interfaces for API responses
interface ProfileResponse {
  user: User;
}

interface LoginResponse {
  token: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        return false;
      }

      // Validate token with the backend
      const response = await axios.get<ProfileResponse>("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (response.data.user) {
        setUser(response.data.user);
        setToken(storedToken);
        return true;
      } else {
        // Clear invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
        return false;
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setToken(null);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post<LoginResponse>("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token: newToken } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", newToken);

      // Fetch user profile with the token
      const profileResponse = await axios.get<ProfileResponse>("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${newToken}` },
      });

      const userData = profileResponse.data.user;

      // Store user data
      setUser(userData);
      setToken(newToken);

      // Redirect to main page
      router.push("/main");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
      });

      // After registration, redirect to login
      router.push("/LogIn");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
