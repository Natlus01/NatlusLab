import React from 'react';
import { Item, Transaction } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from './StatCard';
import { RecentActivity } from './RecentActivity';
import { StockOverview } from './StockOverview';
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

  const totalItemTypes = items.length;
  const totalUnitsOwned = items.reduce((acc, item) => acc + item.totalStock, 0);
  const totalAvailableStock = items.reduce((acc, item) => acc + item.stock, 0);
  const totalBorrowedStock = items.reduce((acc, item) => acc + item.borrowedCount, 0);
  const totalTransactionsCount = transactions.length;

  return (
    <div className="space-y-6">
      {/* Notus Header Banner & Stats (HeaderStats.js style) */}
      <div className="relative bg-blueGray-800 dark:bg-slate-900 rounded-xl p-6 sm:p-8 shadow-lg text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-blueGray-700">
          <div>
            <h6 className="text-xs uppercase font-bold text-lightBlue-400 tracking-wider">
              {isAdmin ? 'Pengelola Utama Laboratorium' : 'Petugas Operasional'}
            </h6>
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mt-1">
              Selamat Datang, {currentUser?.name}
            </h1>
            <p className="text-xs text-blueGray-300 mt-1">
              Pemantauan sirkulasi aset laboratorium, ketersediaan unit, dan status peminjaman.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenBorrowModal}
              className="bg-white text-blueGray-800 active:bg-blueGray-100 font-bold uppercase text-xs px-4 py-2.5 rounded shadow hover:shadow-md outline-none focus:outline-none transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-lightBlue-600" aria-hidden="true" />
              <span>Pinjam Barang</span>
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={onOpenAddItemModal}
                className="bg-lightBlue-500 hover:bg-lightBlue-600 text-white active:bg-lightBlue-700 font-bold uppercase text-xs px-4 py-2.5 rounded shadow hover:shadow-md outline-none focus:outline-none transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Tambah Barang</span>
              </button>
            )}
          </div>
        </div>

        {/* Notus 4 Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <StatCard
            label="Total Jenis Barang"
            value={totalItemTypes}
            unit="jenis"
            icon={<Package className="w-6 h-6" />}
            description={`${totalUnitsOwned} total unit fisik`}
            variant="lightBlue"
          />
          <StatCard
            label="Barang Tersedia"
            value={totalAvailableStock}
            unit="unit"
            icon={<CheckCircle2 className="w-6 h-6" />}
            description="Siap dipinjamkan di lab"
            variant="emerald"
          />
          <StatCard
            label="Barang Dipinjam"
            value={totalBorrowedStock}
            unit="unit"
            icon={<Clock className="w-6 h-6" />}
            description="Sedang dalam sirkulasi"
            variant="orange"
          />
          <StatCard
            label="Total Transaksi"
            value={totalTransactionsCount}
            unit="catatan"
            icon={<Layers className="w-6 h-6" />}
            description="Akumulasi riwayat sirkulasi"
            variant="red"
          />
        </div>
      </div>

      {/* Main Content Grid: Recent Transactions and Stock Overview */}
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
