import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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
// Simpan flag bahwa sesi valid di sessionStorage (hilang saat tab ditutup)
const SESSION_ALIVE_KEY = 'labflow_session_alive';
// Waktu idle sebelum auto logout (15 menit)
const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
// Daftar event yang dianggap sebagai aktivitas user
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      // Cek apakah sesi masih hidup di tab ini (sessionStorage)
      const sessionAlive = sessionStorage.getItem(SESSION_ALIVE_KEY);
      if (!sessionAlive) {
        // Tab baru atau tab ditutup lalu dibuka lagi → hapus sesi
        localStorage.removeItem(AUTH_KEY);
        return null;
      }
      const saved = localStorage.getItem(AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    storageService.init();
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(SESSION_ALIVE_KEY);
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
  }, []);

  // Reset idle timer setiap ada aktivitas
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      logout();
    }, IDLE_TIMEOUT_MS);
  }, [logout]);

  // Pasang dan lepas listener aktivitas
  useEffect(() => {
    if (!currentUser) {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      return;
    }

    // Mulai timer saat user sudah login
    resetIdleTimer();

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, resetIdleTimer, { passive: true });
    });

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [currentUser, resetIdleTimer]);

  // Logout otomatis saat tab/window ditutup (pagehide lebih reliable dari beforeunload)
  useEffect(() => {
    const handlePageHide = () => {
      // Jangan hapus sessionStorage — browser yang urus.
      // sessionStorage otomatis hilang saat tab ditutup, bukan saat navigasi biasa.
    };
    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
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
    // Tandai sesi ini hidup di tab ini
    sessionStorage.setItem(SESSION_ALIVE_KEY, '1');
    return { success: true, message: `Selamat datang, ${found.name}!` };
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
