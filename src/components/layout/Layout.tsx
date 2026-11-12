import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar, ActiveTab } from './Sidebar';
import { SubmissionModal } from '../submission/SubmissionModal';

interface LayoutProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  activeTab,
  onSelectTab,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);

  const getPageTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard & Analitik Laboratorium';
      case 'items':
        return 'Data Inventaris Barang';
      case 'borrow':
        return 'Pencatatan Peminjaman';
      case 'return':
        return 'Pengembalian Barang';
      case 'transactions':
        return 'Riwayat Sirkulasi Peralatan';
      case 'users':
        return 'Manajemen Akun Staff';
      case 'settings':
        return 'Pengaturan & Cadangan Data';
      default:
        return 'LabFlow Inventaris';
    }
  };

  return (
    <div className="min-h-screen bg-blueGray-100 dark:bg-blueGray-900 text-blueGray-800 dark:text-blueGray-100 flex flex-col md:flex-row transition-colors">
      {/* Notus Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="relative flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
          onOpenSubmissionModal={() => setIsSubmissionOpen(true)}
          pageTitle={getPageTitle(activeTab)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Notus Admin Footer */}
        <footer className="block py-4 border-t border-blueGray-200 dark:border-blueGray-800 bg-white dark:bg-blueGray-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center md:justify-between justify-center text-xs text-blueGray-500">
              <div className="w-full md:w-6/12 text-center md:text-left">
                &copy; 2026 <strong>LabFlow</strong> (Inspirasi Desain Notus Tailwind CSS oleh Creative Tim)
              </div>
              <div className="w-full md:w-6/12 text-center md:text-right mt-2 md:mt-0 font-medium">
                Laboratorium Komputer &bull; Coding Talent Challenge
              </div>
            </div>
          </div>
        </footer>
      </div>

      <SubmissionModal
        isOpen={isSubmissionOpen}
        onClose={() => setIsSubmissionOpen(false)}
      />
    </div>
  );
};
