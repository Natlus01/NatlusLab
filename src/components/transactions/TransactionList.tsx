import React, { useState, useMemo } from 'react';
import { Transaction, User, Item } from '../../types';
import { SearchBar } from '../common/SearchBar';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { ReturnModal } from './ReturnModal';
import { BorrowModal } from './BorrowModal';
import {
  ArrowDownLeft,
  Plus,
  History,
  FileCheck2,
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  items: Item[];
  currentUser: User;
  onBorrowSubmit: (params: {
    borrowerName: string;
    itemId: string;
    quantity: number;
    borrowDate: string;
    processedByUser: User;
    notes?: string;
  }) => { success: boolean; message: string };
  onReturnSubmit: (params: {
    transactionId: string;
    returnDate: string;
    returnedByUser: User;
    returnNotes?: string;
  }) => { success: boolean; message: string };
  defaultFilter?: 'ALL' | 'DIPINJAM' | 'SELESAI';
  title?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  items,
  currentUser,
  onBorrowSubmit,
  onReturnSubmit,
  defaultFilter = 'ALL',
  title = 'Riwayat Transaksi Peminjaman & Pengembalian',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DIPINJAM' | 'SELESAI'>(defaultFilter);
  const [selectedForReturn, setSelectedForReturn] = useState<Transaction | null>(null);
  const [isBorrowOpen, setIsBorrowOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filtered = useMemo(() => {
    return transactions.filter((trx) => {
      const matchSearch =
        trx.transactionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.itemCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === 'ALL' ? true : trx.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [transactions, searchTerm, statusFilter]);

  const handleReturnAction = (trx: Transaction) => {
    setSelectedForReturn(trx);
  };

  const handleProcessReturn = (params: {
    transactionId: string;
    returnDate: string;
    returnedByUser: User;
    returnNotes?: string;
  }) => {
    const res = onReturnSubmit(params);
    if (res.success) {
      showNotification(res.message);
    }
    return res;
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Borrow button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pencatatan sirkulasi aset laboratorium, status peminjaman, dan pengembalian unit.
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsBorrowOpen(true)}
        >
          Catat Peminjaman Baru
        </Button>
      </div>

      {notification && (
        <div
          role="status"
          className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-medium"
        >
          {notification}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Cari kode (TRX-...), nama peminjam, atau nama barang..."
              ariaLabel="Cari riwayat transaksi"
            />
          </div>
          <div>
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-1 bg-slate-50 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                Semua ({transactions.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('DIPINJAM')}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'DIPINJAM'
                    ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                Dipinjam ({transactions.filter((t) => t.status === 'DIPINJAM').length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('SELESAI')}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'SELESAI'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                Selesai ({transactions.filter((t) => t.status === 'SELESAI').length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<History className="w-8 h-8" />}
          title="Tidak Ada Transaksi"
          description={
            statusFilter === 'DIPINJAM'
              ? 'Tidak ada barang yang sedang dalam status dipinjam saat ini.'
              : searchTerm
              ? 'Tidak ada transaksi yang cocok dengan kata kunci pencarian Anda.'
              : 'Belum ada transaksi peminjaman yang tercatat di sistem.'
          }
          actionLabel="Catat Peminjaman"
          onAction={() => setIsBorrowOpen(true)}
        />
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <tr>
                  <th scope="col" className="py-3.5 px-4">Kode Transaksi</th>
                  <th scope="col" className="py-3.5 px-4">Peminjam</th>
                  <th scope="col" className="py-3.5 px-4">Barang</th>
                  <th scope="col" className="py-3.5 px-4 text-center">Jumlah</th>
                  <th scope="col" className="py-3.5 px-4">Tgl Pinjam</th>
                  <th scope="col" className="py-3.5 px-4">Tgl Kembali</th>
                  <th scope="col" className="py-3.5 px-4 text-center">Status</th>
                  <th scope="col" className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-800 dark:text-teal-300">
                      {trx.transactionCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {trx.borrowerName}
                      </div>
                      {trx.notes && (
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          {trx.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {trx.itemName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono ml-1.5">
                        ({trx.itemCode})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold tabular-nums">
                      {trx.quantity}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-slate-600 dark:text-slate-300">
                      {trx.borrowDate}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-slate-600 dark:text-slate-300">
                      {trx.returnDate ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                          {trx.returnDate}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Belum kembali</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge
                        variant={trx.status === 'DIPINJAM' ? 'warning' : 'success'}
                        className="text-[10px]"
                      >
                        {trx.status === 'DIPINJAM' ? 'Dipinjam' : 'Selesai'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {trx.status === 'DIPINJAM' ? (
                        <Button
                          size="sm"
                          variant="primary"
                          icon={<ArrowDownLeft className="w-3.5 h-3.5" />}
                          onClick={() => handleReturnAction(trx)}
                          className="text-xs px-2.5"
                        >
                          Kembalikan
                        </Button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                          <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                          Tuntas
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Return Modal */}
      <ReturnModal
        isOpen={!!selectedForReturn}
        onClose={() => setSelectedForReturn(null)}
        transaction={selectedForReturn}
        currentUser={currentUser}
        onReturnSubmit={handleProcessReturn}
      />

      {/* Borrow Modal */}
      <BorrowModal
        isOpen={isBorrowOpen}
        onClose={() => setIsBorrowOpen(false)}
        items={items}
        currentUser={currentUser}
        onBorrowSubmit={onBorrowSubmit}
      />
    </div>
  );
};
