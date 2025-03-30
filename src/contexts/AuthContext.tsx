import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
// Define what a User looks like
interface User {
  id: number;
  username: string;
}

// Define what our context will provide
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// Create the context with undefined as initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Define props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Implement the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to refresh the JWT token
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    if (!refreshToken) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      const response = await api.post('/api/token/refresh/', {
        refresh: refreshToken,
      });

      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Function to check if user is authenticated
  const checkAuth = async () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    if (!accessToken) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(accessToken) as any;
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        await refreshToken();
      } else {
        setIsAuthenticated(true);
        setUser({
          id: decoded.user_id,
          username: decoded.username,
        });
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status when component mounts
  useEffect(() => {
    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/api/token/', {
        username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        setIsAuthenticated(true);
        const decoded = jwtDecode(response.data.access) as any;
        setUser({
          id: decoded.user_id,
          username: decoded.username,
        });
      }
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (username: string, password: string) => {
    try {
      const response = await api.post('/api/user/register/', {
        username,
        password,
      });

      if (response.status === 201) {
        await login(username, password);
      }
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setIsAuthenticated(false);
    setUser(null);
  };

  // Create the context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
  };

  // Provide the context to children
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 