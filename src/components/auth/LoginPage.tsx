import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../common/Input';
import { Monitor, ArrowRight, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();

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

  return (
    <div className="min-h-screen flex flex-col justify-between bg-blueGray-800 text-blueGray-100">
      {/* Top Navbar */}
      <nav className="top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-4 py-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <div className="flex items-center gap-2 text-white font-bold text-sm uppercase py-2">
              <div className="w-7 h-7 rounded bg-lightBlue-500 text-white flex items-center justify-center shadow">
                <Monitor className="w-4 h-4" aria-hidden="true" />
              </div>
              <span>NatlusLab</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Centered Auth Card */}
      <main className="container mx-auto px-4 h-full flex-1 flex items-center justify-center pt-20 pb-12">
        <div className="w-full lg:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-2xl rounded-lg bg-blueGray-100 border border-blueGray-700">
            {/* Card Header */}
            <div className="rounded-t mb-0 px-6 py-6 border-b border-blueGray-200">
              <div className="flex items-center justify-center gap-2 text-blueGray-600">
                <div className="w-10 h-10 rounded-full bg-blueGray-800 flex items-center justify-center shadow">
                  <Lock className="w-5 h-5 text-lightBlue-400" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-blueGray-700 font-bold text-sm uppercase tracking-wider">
                    Masuk ke Sistem
                  </h1>
                  <p className="text-blueGray-500 text-xs">
                    Sistem Manajemen Inventaris Laboratorium
                  </p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="flex-auto px-4 lg:px-8 py-8 pt-6">
              {errorMessage && (
                <div
                  role="alert"
                  className="mb-4 p-3 bg-red-100 text-red-900 border border-red-300 rounded text-xs font-semibold"
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
                  placeholder="Masukkan username Anda"
                  required
                  autoComplete="username"
                />

                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  required
                  autoComplete="current-password"
                />

                <div className="text-center mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-xs font-bold uppercase px-6 py-3.5 rounded shadow hover:shadow-lg outline-none focus:outline-none w-full ease-linear transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-60"
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

      {/* Footer */}
      <footer className="pb-4">
        <div className="container mx-auto px-4">
          <hr className="mb-4 border-b-1 border-blueGray-700" />
          <div className="flex flex-wrap items-center md:justify-between justify-center text-xs text-blueGray-400">
            <div>
              &copy; 2026 NatlusLab - Sistem Manajemen Inventaris Laboratorium
            </div>
            <div className="mt-2 md:mt-0 font-medium">
              <a
                href="https://lab.natlus.my.id"
                target="_blank"
                rel="noreferrer"
                className="hover:text-lightBlue-400 underline transition-colors"
              >
                lab.natlus.my.id
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
