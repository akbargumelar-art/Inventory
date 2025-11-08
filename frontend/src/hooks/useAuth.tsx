import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { apiClient } from '../services/apiClient';

interface AuthState {
  token: string | null;
  user: User | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({ token: null, user: null });

  useEffect(() => {
    const storedAuth = sessionStorage.getItem('auth');
    if (storedAuth) {
      const { token, user } = JSON.parse(storedAuth);
      setAuth({ token, user });
    }
  }, []);

  const login = async (username: string, password?: string): Promise<boolean> => {
    try {
      const response = await apiClient.post<{ token: string; user: User }>('/auth/login', { username, password });
      if (response.token && response.user) {
        const authData = { token: response.token, user: response.user };
        setAuth(authData);
        sessionStorage.setItem('auth', JSON.stringify(authData));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    sessionStorage.removeItem('auth');
  };
  
  const updateProfile = async (updatedData: Partial<User>): Promise<void> => {
    try {
        const updatedUser = await apiClient.put<User>('/profile', updatedData);
        const storedAuth = sessionStorage.getItem('auth');
        if (storedAuth) {
            const { token } = JSON.parse(storedAuth);
            const newAuthData = { token, user: updatedUser };
            setAuth(newAuthData);
            sessionStorage.setItem('auth', JSON.stringify(newAuthData));
        }
    } catch (error) {
        console.error("Profile update failed:", error);
        throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!auth.token, user: auth.user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};