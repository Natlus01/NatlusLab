import React from 'react';
import { Item, Transaction } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from './StatCard';
import { RecentActivity } from './RecentActivity';
import { StockOverview } from './StockOverview';
import { Button } from '../common/Button';
import {
  Package,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  Layers,
} from 'lucide-react';
import { ActiveTab } from '../layout/Sidebar';

interface DashboardViewProps {
  items: Item[];
  transactions: Transaction[];
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenBorrowModal: () => void;
  onOpenAddItemModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  items,
  transactions,
  onNavigateTab,
  onOpenBorrowModal,
  onOpenAddItemModal,
}) => {
  const { currentUser, isAdmin } = useAuth();

  // Metrics calculations (Section C.2)
  const totalItemTypes = items.length;
  const totalUnitsOwned = items.reduce((acc, item) => acc + item.totalStock, 0);
  const totalAvailableStock = items.reduce((acc, item) => acc + item.stock, 0);
  const totalBorrowedStock = items.reduce((acc, item) => acc + item.borrowedCount, 0);
  const totalTransactionsCount = transactions.length;

  return (
    <div className="space-y-6">
      {/* Welcome & Role greeting banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white shadow-sm">
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-teal-400">
            {isAdmin ? 'Dashboard Pengelola Utama' : 'Dashboard Operasional Petugas'}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Selamat Datang, {currentUser?.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Sistem Pemantauan Inventaris & Peminjaman Peralatan Laboratorium Komputer.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenBorrowModal}
            icon={<ArrowUpRight className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
          >
            Pinjam Barang
          </Button>
          {isAdmin && (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenAddItemModal}
              icon={<Plus className="w-4 h-4" />}
              className="text-xs"
            >
              Tambah Barang
            </Button>
          )}
        </div>
      </div>

      {/* 4 Stat Cards required by Section C.2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Aset Barang"
          value={totalItemTypes}
          unit="jenis"
          icon={<Package className="w-5 h-5" />}
          description={`Total fisik: ${totalUnitsOwned} unit terdaftar`}
          variant="teal"
        />
        <StatCard
          label="Barang Tersedia"
          value={totalAvailableStock}
          unit="unit"
          icon={<CheckCircle2 className="w-5 h-5" />}
          description="Siap digunakan di laboratorium"
          variant="emerald"
        />
        <StatCard
          label="Barang Dipinjam"
          value={totalBorrowedStock}
          unit="unit"
          icon={<Clock className="w-5 h-5" />}
          description="Sedang dalam status sirkulasi"
          variant="amber"
        />
        <StatCard
          label="Total Transaksi"
          value={totalTransactionsCount}
          unit="catatan"
          icon={<Layers className="w-5 h-5" />}
          description="Akumulasi riwayat peminjaman"
          variant="sky"
        />
      </div>

      {/* Two columns: Recent Activities + Stock Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity
          transactions={transactions}
          onViewAll={() => onNavigateTab('transactions')}
        />
        <StockOverview
          items={items}
          onSelectItem={() => onNavigateTab('items')}
        />
      </div>
    </div>
  );
};
