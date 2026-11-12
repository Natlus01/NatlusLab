import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Users,
  Database,
  X,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'items'
  | 'borrow'
  | 'return'
  | 'transactions'
  | 'users'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { isAdmin } = useAuth();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'items',
      label: 'Daftar Barang',
      icon: <Package className="w-5 h-5 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'borrow',
      label: 'Peminjaman',
      icon: <ArrowUpRight className="w-5 h-5 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'return',
      label: 'Pengembalian',
      icon: <ArrowDownLeft className="w-5 h-5 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'transactions',
      label: 'Riwayat Transaksi',
      icon: <History className="w-5 h-5 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'users',
      label: 'Kelola Akun Staff',
      icon: <Users className="w-5 h-5 shrink-0" aria-hidden="true" />,
      adminOnly: true,
    },
    {
      id: 'settings',
      label: 'Backup & Pengaturan',
      icon: <Database className="w-5 h-5 shrink-0" aria-hidden="true" />,
      adminOnly: true,
    },
  ];

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  const handleSelect = (tab: ActiveTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-40 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col justify-between shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navigasi Utama"
      >
        <div>
          {/* Mobile drawer header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 md:hidden">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              Menu Navigasi
            </span>
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Tutup menu navigasi"
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <p className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Operasional Lab
            </p>
            {visibleItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left min-h-[44px] cursor-pointer ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border-l-4 border-teal-600 dark:border-teal-500 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <span className={isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            <p className="font-semibold text-slate-700 dark:text-slate-300">LabFlow v1.0.0</p>
            <p>Laboratorium Komputer</p>
          </div>
        </div>
      </aside>
    </>
  );
};
