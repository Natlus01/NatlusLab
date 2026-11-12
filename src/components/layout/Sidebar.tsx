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
  Monitor,
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

  const operationalNavs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 mr-2" aria-hidden="true" />,
    },
    {
      id: 'items',
      label: 'Data Barang',
      icon: <Package className="w-4 h-4 mr-2" aria-hidden="true" />,
    },
  ];

  const transactionNavs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'borrow',
      label: 'Peminjaman',
      icon: <ArrowUpRight className="w-4 h-4 mr-2" aria-hidden="true" />,
    },
    {
      id: 'return',
      label: 'Pengembalian',
      icon: <ArrowDownLeft className="w-4 h-4 mr-2" aria-hidden="true" />,
    },
    {
      id: 'transactions',
      label: 'Riwayat Transaksi',
      icon: <History className="w-4 h-4 mr-2" aria-hidden="true" />,
    },
  ];

  const adminNavs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'users',
      label: 'Kelola Staff',
      icon: <Users className="w-4 h-4 mr-2" aria-hidden="true" />,
    },
    {
      id: 'settings',
      label: 'Backup & Pengaturan',
      icon: <Database className="w-4 h-4 mr-2" aria-hidden="true" />,
    },
  ];

  const handleSelect = (tab: ActiveTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-blueGray-900/60 md:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Notus Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 z-40 md:z-10 h-screen md:h-auto w-64 bg-white shadow-xl border-r border-blueGray-200 transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col justify-between shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navigasi Notus"
      >
        <div className="p-6 overflow-y-auto">
          {/* Brand Header (Notus style) */}
          <div className="flex items-center justify-between pb-4 border-b border-blueGray-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-lightBlue-600 text-white flex items-center justify-center shadow">
                <Monitor className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold uppercase tracking-wider text-blueGray-700 block">
                  LabFlow
                </span>
                <span className="text-[10px] text-blueGray-400 font-semibold tracking-wide uppercase">
                  Notus Dashboard
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Tutup menu navigasi"
              className="md:hidden p-1.5 text-blueGray-500 hover:text-blueGray-800 rounded cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Section 1: Operasional Lab */}
          <div className="pt-6">
            <h6 className="md:min-w-full text-blueGray-400 text-xs uppercase font-bold block pt-1 pb-3 no-underline">
              Inventaris & Dashboard
            </h6>
            <ul className="md:flex-col md:min-w-full flex flex-col list-none space-y-1">
              {operationalNavs.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id} className="items-center">
                    <button
                      type="button"
                      onClick={() => handleSelect(item.id)}
                      className={`text-xs uppercase py-2.5 px-3 font-bold block w-full text-left rounded transition-colors flex items-center min-h-[44px] cursor-pointer ${
                        isActive
                          ? 'text-lightBlue-600 bg-lightBlue-50 shadow-xs'
                          : 'text-blueGray-700 hover:text-blueGray-500 hover:bg-blueGray-50'
                      }`}
                    >
                      <span className={isActive ? 'text-lightBlue-600' : 'text-blueGray-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <hr className="my-4 md:min-w-full border-blueGray-200" />

          {/* Section 2: Transaksi & Sirkulasi */}
          <div>
            <h6 className="md:min-w-full text-blueGray-400 text-xs uppercase font-bold block pt-1 pb-3 no-underline">
              Sirkulasi & Peminjaman
            </h6>
            <ul className="md:flex-col md:min-w-full flex flex-col list-none space-y-1">
              {transactionNavs.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id} className="items-center">
                    <button
                      type="button"
                      onClick={() => handleSelect(item.id)}
                      className={`text-xs uppercase py-2.5 px-3 font-bold block w-full text-left rounded transition-colors flex items-center min-h-[44px] cursor-pointer ${
                        isActive
                          ? 'text-lightBlue-600 bg-lightBlue-50 shadow-xs'
                          : 'text-blueGray-700 hover:text-blueGray-500 hover:bg-blueGray-50'
                      }`}
                    >
                      <span className={isActive ? 'text-lightBlue-600' : 'text-blueGray-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Section 3: Admin Only */}
          {isAdmin && (
            <>
              <hr className="my-4 md:min-w-full border-blueGray-200" />
              <div>
                <h6 className="md:min-w-full text-blueGray-400 text-xs uppercase font-bold block pt-1 pb-3 no-underline">
                  Administrasi Sistem
                </h6>
                <ul className="md:flex-col md:min-w-full flex flex-col list-none space-y-1">
                  {adminNavs.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <li key={item.id} className="items-center">
                        <button
                          type="button"
                          onClick={() => handleSelect(item.id)}
                          className={`text-xs uppercase py-2.5 px-3 font-bold block w-full text-left rounded transition-colors flex items-center min-h-[44px] cursor-pointer ${
                            isActive
                              ? 'text-lightBlue-600 bg-lightBlue-50 shadow-xs'
                              : 'text-blueGray-700 hover:text-blueGray-500 hover:bg-blueGray-50'
                          }`}
                        >
                          <span className={isActive ? 'text-lightBlue-600' : 'text-blueGray-400'}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-blueGray-200 bg-blueGray-50">
          <p className="text-[11px] font-bold text-blueGray-600 uppercase">
            Laboratorium Komputer
          </p>
          <p className="text-[10px] text-blueGray-400">Coding Talent Challenge</p>
        </div>
      </aside>
    </>
  );
};
