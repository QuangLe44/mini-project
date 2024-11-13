// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  access_token: string | null;
  authenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  getUserInfo: () => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [access_token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [user, setUser] = useState<User | null>(null);

  let authenticated: boolean = !!access_token;

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

      const access_token = response.data.access_token;
      localStorage.setItem('access_token', access_token);
      setToken(access_token);
      authenticated = !!access_token;

      if (!access_token) {
        throw new Error("Invalid credentials");
      } 

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

      const access_token = response.data.access_token;
      localStorage.setItem('access_token', access_token);
      setToken(access_token);
      authenticated = !!access_token;

      if (!access_token) {
        throw new Error("Invalid sign up");
      }

    } catch (error) {
      throw error;
    }
  };

  const getUserInfo = async (): Promise<User | null> => {
    try {
        const response = await axios.post<User>('http://laravel.test/api/me', {}, {
                headers: {
                  Authorization: "Bearer " + access_token,
                },
            }
        );

        const userData = response.data;
        setUser(userData);
        return userData;
    } catch (error) {
        console.error('Error fetching user info:', error);
        setUser(null);
        return null;
    }
};

  const logout = () => {
    localStorage.removeItem('access_token');   
    setToken(null);
    authenticated = !!access_token;
    return <Navigate to="/" replace />
  };

  const value = {
    access_token,
    user,
    authenticated,
    login,
    register,
    getUserInfo,
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
