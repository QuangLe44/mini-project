// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Define the shape of the AuthContext
interface AuthContextType {
  access_token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user_id, setUserID] = useState<string | null>(null);
  const [access_token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const requestData = {
        email,
        password,
      };
  
      const response = await axios.post('http://laravel.test/api/auth/login', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { access_token, user_id } = response.data;

      if (!access_token) {
        throw new Error("Invalid credentials");
      }

      setToken(access_token);
      setUserID(user_id);

      localStorage.setItem('authToken', access_token);
      localStorage.setItem('userID', user_id);

    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    try {
      const requestData = {
        name,
        email,
        password,
        password_confirmation,
      };

      const response = await axios.post('http://laravel.test/api/auth/register', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { access_token, user_id } = response.data;

      if (!access_token) {
        throw new Error("Invalid sign up");
      }

      setToken(access_token);
      setUserID(user_id);

      localStorage.setItem('authToken', access_token);
      localStorage.setItem('userID', user_id);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUserID(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userID');
  };

  const value = {
    access_token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
