import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, Menu, FileText } from 'lucide-react';
import { Badge } from '../common/Badge';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  onOpenSubmissionModal: () => void;
  pageTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  onOpenSubmissionModal,
  pageTitle = 'Dashboard Inventaris Lab',
}) => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const userInitial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="w-full bg-blueGray-800 border-b border-blueGray-700 text-white z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Toggle & Page Title (Notus style) */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onToggleMobileMenu}
              aria-label="Buka menu navigasi"
              className="md:hidden p-2 text-blueGray-300 hover:text-white hover:bg-blueGray-700 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm uppercase font-bold tracking-wider text-white">
                {pageTitle}
              </span>
            </div>
            <div className="sm:hidden flex items-center gap-2">
              <span className="text-sm font-bold uppercase tracking-wider text-white">
                LabFlow
              </span>
            </div>
          </div>

          {/* Right: Actions, Theme Toggle, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenSubmissionModal}
              title="Informasi Pengumpulan & Akun Demo"
              aria-label="Informasi Pengumpulan & Akun Demo"
              className="bg-lightBlue-600 hover:bg-lightBlue-700 text-white text-xs font-bold uppercase px-3 py-2 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer min-h-[40px] flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden md:inline">Info Pengumpulan</span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
              className="p-2 text-blueGray-300 hover:text-white hover:bg-blueGray-700 rounded transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-5 h-5 text-blueGray-300" aria-hidden="true" />
              )}
            </button>

            {/* User profile dropdown / pill */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-3 border-l border-blueGray-700">
                <div
                  className="w-8 h-8 rounded-full bg-lightBlue-500 text-white font-bold text-xs flex items-center justify-center shadow select-none"
                  aria-hidden="true"
                >
                  {userInitial}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-blueGray-300">
                    @{currentUser.username}
                  </span>
                </div>
                <Badge variant={isAdmin ? 'success' : 'info'} className="text-[10px] py-0 px-2 hidden sm:inline-flex">
                  {currentUser.role}
                </Badge>
              </div>
            )}

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              title="Keluar dari sistem"
              aria-label="Keluar dari sistem"
              className="p-2 text-blueGray-400 hover:text-red-400 hover:bg-blueGray-700 rounded transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
