import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../common/Input';
import { Monitor, Sun, Moon, Shield, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col justify-between bg-blueGray-800 text-blueGray-100 transition-colors">
      {/* Notus Auth Top Navbar */}
      <nav className="top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-4 py-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <div className="flex items-center gap-2 text-white font-bold text-sm uppercase py-2">
              <div className="w-7 h-7 rounded bg-lightBlue-500 text-white flex items-center justify-center shadow">
                <Monitor className="w-4 h-4" aria-hidden="true" />
              </div>
              <span>LabFlow Inventaris</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenSubmissionModal}
              className="bg-lightBlue-600 hover:bg-lightBlue-700 text-white text-xs font-bold uppercase px-3 py-1.5 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer min-h-[40px]"
            >
              Info Pengumpulan & Demo
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
              className="p-2 text-blueGray-300 hover:text-white rounded cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-blueGray-300" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Notus Centered Auth Card */}
      <main className="container mx-auto px-4 h-full flex-1 flex items-center justify-center pt-20 pb-12">
        <div className="w-full lg:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-2xl rounded-lg bg-blueGray-100 dark:bg-blueGray-900 border border-blueGray-700">
            {/* Card Header (Notus Quick OAuth style for Dosen / Examiner) */}
            <div className="rounded-t mb-0 px-6 py-6 border-b border-blueGray-200 dark:border-blueGray-700">
              <div className="text-center mb-3">
                <h6 className="text-blueGray-500 dark:text-blueGray-400 text-xs font-bold uppercase tracking-wider">
                  Pengujian Akun Cepat (Coding Talent Challenge)
                </h6>
              </div>
              <div className="btn-wrapper text-center flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="bg-white active:bg-blueGray-50 text-blueGray-700 font-bold px-3 py-2 rounded outline-none focus:outline-none uppercase shadow hover:shadow-md inline-flex items-center text-xs ease-linear transition-all duration-150 cursor-pointer min-h-[44px]"
                >
                  <Shield className="w-4 h-4 mr-1 text-lightBlue-600" aria-hidden="true" />
                  <span>Demo Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('staff')}
                  className="bg-white active:bg-blueGray-50 text-blueGray-700 font-bold px-3 py-2 rounded outline-none focus:outline-none uppercase shadow hover:shadow-md inline-flex items-center text-xs ease-linear transition-all duration-150 cursor-pointer min-h-[44px]"
                >
                  <Monitor className="w-4 h-4 mr-1 text-emerald-600" aria-hidden="true" />
                  <span>Demo Staff</span>
                </button>
              </div>
              <p className="text-[11px] text-center text-blueGray-400 mt-2">
                admin/admin123 atau staff/staff123
              </p>
            </div>

            {/* Form Body */}
            <div className="flex-auto px-4 lg:px-8 py-8 pt-6">
              <div className="text-blueGray-400 text-center mb-5 font-bold text-xs uppercase tracking-wider">
                <span>Atau Masuk dengan Kredensial</span>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="mb-4 p-3 bg-red-100 text-red-900 border border-red-300 dark:bg-red-950/60 dark:text-red-200 dark:border-red-800 rounded text-xs font-semibold"
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
                  placeholder="admin atau staff"
                  required
                  autoComplete="username"
                />

                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123 atau staff123"
                  required
                  autoComplete="current-password"
                />

                <div className="text-center mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-xs font-bold uppercase px-6 py-3.5 rounded shadow hover:shadow-lg outline-none focus:outline-none w-full ease-linear transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <span>{isLoading ? 'Memeriksa...' : 'Masuk ke Sistem'}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer (Notus Auth Footer) */}
      <footer className="pb-4">
        <div className="container mx-auto px-4">
          <hr className="mb-4 border-b-1 border-blueGray-700" />
          <div className="flex flex-wrap items-center md:justify-between justify-center text-xs text-blueGray-400">
            <div>
              &copy; 2026 LabFlow - Creative Tim Notus NextJS Design Style
            </div>
            <div className="mt-2 md:mt-0">
              Laboratorium Komputer &bull; Coding Talent Challenge
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
