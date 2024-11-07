// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  access_token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [access_token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
  
      const response = await axios.post('http://laravel.test/api/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { access_token } = response.data;

      if (!access_token) {
        throw new Error("Invalid credentials");
      }

      setToken(access_token);
      // setUser(newUser);

      localStorage.setItem('authToken', access_token);
      // localStorage.setItem('user', JSON.stringify(newUser.id));

    } catch (error) {
      throw error;
    }

  };

  const register = async (name: string, email: string, password: string, passwordConfirm: string) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('password_confirmation', passwordConfirm);

      const response = await axios.post('http://laravel.test/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { access_token } = response.data;

      if (!access_token) {
        throw new Error("Invalid sign up");
      }

      setToken(access_token);
      // setUser(user);

      localStorage.setItem('authToken', access_token);
      // localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      throw error;
    }

  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const value = {
    user,
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
