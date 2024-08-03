'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export interface IUser {
  id: number;
  name: string;
  email: string;
  description: string;
  profile_picture_url: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user') || '';

    if (token && user !== '') {
      setIsAuthenticated(true);
      setUser(JSON.parse(user));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:4000/v1/auth/login', { email, password });
      const data = response.data;
      setIsAuthenticated(true);
      setUser(data.data.user);
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      router.push('/');
    } catch (error) {
      throw Error(error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
