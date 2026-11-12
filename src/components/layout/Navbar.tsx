import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Monitor, Sun, Moon, LogOut, Menu, FileText } from 'lucide-react';
import { Badge } from '../common/Badge';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  onOpenSubmissionModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  onOpenSubmissionModal,
}) => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Initial letter badge instead of fake AI avatar according to R-23
  const userInitial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile menu toggle + Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleMobileMenu}
              aria-label="Buka menu navigasi"
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-teal-700 dark:bg-teal-600 text-white flex items-center justify-center shadow-sm">
                <Monitor className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  LabFlow
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-500 dark:text-slate-400 ml-2 border-l border-slate-300 dark:border-slate-700 pl-2">
                  Laboratorium Komputer
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick actions, Theme toggle, User badge, Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Submission information button */}
            <button
              type="button"
              onClick={onOpenSubmissionModal}
              title="Informasi Pengumpulan & Akun Demo"
              aria-label="Informasi Pengumpulan & Akun Demo"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors cursor-pointer min-h-[44px]"
            >
              <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span className="hidden sm:inline">Info Pengumpulan</span>
            </button>

            {/* Theme Toggle (Light / Dark mode) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" aria-hidden="true" />
              )}
            </button>

            {/* User Profile Info */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div
                  className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center select-none"
                  aria-hidden="true"
                >
                  {userInitial}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    @{currentUser.username}
                  </span>
                </div>
                <Badge variant={isAdmin ? 'success' : 'info'} className="text-[10px] py-0 px-1.5 hidden md:inline-flex">
                  {currentUser.role}
                </Badge>
              </div>
            )}

            {/* Logout button */}
            <button
              type="button"
              onClick={logout}
              title="Keluar dari sistem"
              aria-label="Keluar dari sistem"
              className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <LogOut className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
