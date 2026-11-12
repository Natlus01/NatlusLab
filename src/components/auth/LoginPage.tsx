import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Monitor, Sun, Moon, Shield, KeyRound, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onOpenSubmissionModal: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onOpenSubmissionModal }) => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const res = login(username, password);
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const handleQuickDemo = (demoUser: 'admin' | 'staff') => {
    setUsername(demoUser);
    setPassword(`${demoUser}123`);
    setErrorMessage('');
    login(demoUser, `${demoUser}123`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-700 dark:bg-teal-600 text-white flex items-center justify-center shadow-xs">
            <Monitor className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
              LabFlow
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-500 dark:text-slate-400 ml-2 border-l border-slate-300 dark:border-slate-700 pl-2">
              Laboratory Inventory & Borrowing System
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={onOpenSubmissionModal}
            className="text-xs text-teal-800 dark:text-teal-200"
          >
            Info Pengumpulan & Demo
          </Button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 mx-auto flex items-center justify-center mb-3">
              <KeyRound className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Masuk ke Sistem Laboratorium
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gunakan akun Administrator atau Staff operasional Anda
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-3 bg-rose-50 text-rose-900 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-200 dark:border-rose-800 rounded-lg text-xs leading-relaxed"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              required
              autoComplete="username"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              autoComplete="current-password"
            />

            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={isLoading}
              className="w-full text-sm font-semibold mt-2"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? 'Memeriksa Kredensial...' : 'Masuk ke Sistem'}
            </Button>
          </form>

          {/* Quick Demo Login Shortcuts for Examiners / Lecturers */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">
              Akses Cepat Pengujian Demo (Poin G)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2.5 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50/60 dark:bg-teal-950/40 text-left hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900 dark:text-teal-200">
                  <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Demo Admin</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  admin / admin123
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('staff')}
                className="p-2.5 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50/60 dark:bg-sky-950/40 text-left hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900 dark:text-sky-200">
                  <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Demo Staff</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  staff / staff123
                </p>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
        <p>&copy; 2026 LabFlow - Laboratory Inventory & Borrowing System</p>
      </footer>
    </div>
  );
};
