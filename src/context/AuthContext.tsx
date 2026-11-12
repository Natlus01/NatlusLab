import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  isAdmin: boolean;
  isStaff: boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'labflow_auth_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    storageService.init();
  }, []);

  const refreshUser = () => {
    if (!currentUser) return;
    const users = storageService.getUsers();
    const updated = users.find((u) => u.id === currentUser.id);
    if (updated) {
      if (!updated.isActive) {
        logout();
      } else {
        setCurrentUser(updated);
        localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
      }
    }
  };

  const login = (username: string, password: string): { success: boolean; message: string } => {
    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      return { success: false, message: 'Silakan isi username dan password Anda.' };
    }

    const users = storageService.getUsers();
    const found = users.find(
      (u) => u.username.toLowerCase() === trimmedUser.toLowerCase() && u.password === password
    );

    if (!found) {
      return { success: false, message: 'Username atau password tidak cocok.' };
    }

    if (!found.isActive) {
      return {
        success: false,
        message: 'Akun Anda telah dinonaktifkan oleh Administrator. Silakan hubungi pengelola lab.',
      };
    }

    setCurrentUser(found);
    localStorage.setItem(AUTH_KEY, JSON.stringify(found));
    return { success: true, message: `Selamat datang, ${found.name}!` };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  const isAdmin = currentUser?.role === 'ADMIN';
  const isStaff = currentUser?.role === 'STAFF';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAdmin,
        isStaff,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
