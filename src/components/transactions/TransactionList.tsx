import React, { useState, useMemo } from 'react';
import { Transaction, User, Item } from '../../types';
import { SearchBar } from '../common/SearchBar';
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
      {/* Header bar and action controls */}
      <div className="p-5 rounded-lg border border-blueGray-200 dark:border-blueGray-700 bg-white dark:bg-blueGray-800 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h6 className="text-xs uppercase font-bold text-blueGray-400">
              Sirkulasi Peralatan Laboratorium
            </h6>
            <h1 className="text-xl font-bold uppercase tracking-tight text-blueGray-800 dark:text-blueGray-100 mt-0.5">
              {title}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setIsBorrowOpen(true)}
            className="bg-lightBlue-500 hover:bg-lightBlue-600 text-white font-bold uppercase text-xs px-4 py-2.5 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Catat Peminjaman Baru</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-blueGray-100 dark:border-blueGray-700">
          <div className="md:col-span-2">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Cari kode (TRX-...), peminjam, atau nama barang..."
              ariaLabel="Cari riwayat transaksi"
            />
          </div>
          <div>
            <div className="flex rounded border border-blueGray-200 dark:border-blueGray-700 p-1 bg-blueGray-50 dark:bg-blueGray-900">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`flex-1 py-1 px-2 text-xs font-bold uppercase rounded transition-colors cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-white dark:bg-blueGray-800 text-blueGray-800 dark:text-blueGray-100 shadow-xs'
                    : 'text-blueGray-400 hover:text-blueGray-700 dark:hover:text-blueGray-200'
                }`}
              >
                Semua ({transactions.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('DIPINJAM')}
                className={`flex-1 py-1 px-2 text-xs font-bold uppercase rounded transition-colors cursor-pointer ${
                  statusFilter === 'DIPINJAM'
                    ? 'bg-white dark:bg-blueGray-800 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-blueGray-400 hover:text-blueGray-700 dark:hover:text-blueGray-200'
                }`}
              >
                Dipinjam ({transactions.filter((t) => t.status === 'DIPINJAM').length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('SELESAI')}
                className={`flex-1 py-1 px-2 text-xs font-bold uppercase rounded transition-colors cursor-pointer ${
                  statusFilter === 'SELESAI'
                    ? 'bg-white dark:bg-blueGray-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-blueGray-400 hover:text-blueGray-700 dark:hover:text-blueGray-200'
                }`}
              >
                Selesai ({transactions.filter((t) => t.status === 'SELESAI').length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <div
          role="status"
          className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800 rounded text-xs font-semibold"
        >
          {notification}
        </div>
      )}

      {/* Notus CardTable */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<History className="w-8 h-8 text-blueGray-400" />}
          title="Tidak Ada Catatan Transaksi"
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
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white dark:bg-blueGray-800 border border-blueGray-100 dark:border-blueGray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="items-center w-full bg-transparent border-collapse text-left text-xs">
              <thead>
                <tr>
                  <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100 dark:bg-blueGray-700/80 dark:text-blueGray-300 dark:border-blueGray-600">
                    Kode Transaksi
                  </th>
                  <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100 dark:bg-blueGray-700/80 dark:text-blueGray-300 dark:border-blueGray-600">
                    Peminjam
                  </th>
                  <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100 dark:bg-blueGray-700/80 dark:text-blueGray-300 dark:border-blueGray-600">
                    Peralatan
                  </th>
                  <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-center bg-blueGray-50 text-blueGray-500 border-blueGray-100 dark:bg-blueGray-700/80 dark:text-blueGray-300 dark:border-blueGray-600">
                    Jumlah
                  </th>
                  <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100 dark:bg-blueGray-700/80 dark:text-blueGray-300 dark:border-blueGray-600">
                    Tgl Pinjam
                  </th>
                  <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100 dark:bg-blueGray-700/80 dark:text-blueGray-300 dark:border-blueGray-600">
                    Tgl Kembali
                  </th>
                  <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-center bg-blueGray-50 text-blueGray-500 border-blueGray-100 dark:bg-blueGray-700/80 dark:text-blueGray-300 dark:border-blueGray-600">
                    Status
                  </th>
                  <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-right bg-blueGray-50 text-blueGray-500 border-blueGray-100 dark:bg-blueGray-700/80 dark:text-blueGray-300 dark:border-blueGray-600">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blueGray-100 dark:divide-blueGray-700">
                {filtered.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-blueGray-50/70 dark:hover:bg-blueGray-700/40 transition-colors"
                  >
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-mono font-bold text-lightBlue-600 dark:text-lightBlue-400">
                      {trx.transactionCode}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="font-bold text-blueGray-800 dark:text-blueGray-100">
                        {trx.borrowerName}
                      </div>
                      {trx.notes && (
                        <div className="text-[11px] text-blueGray-400 truncate max-w-xs mt-0.5">
                          {trx.notes}
                        </div>
                      )}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <span className="font-semibold text-blueGray-700 dark:text-blueGray-200">
                        {trx.itemName}
                      </span>
                      <span className="text-[11px] text-blueGray-400 font-mono ml-1.5">
                        ({trx.itemCode})
                      </span>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center font-bold tabular-nums">
                      {trx.quantity}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 tabular-nums text-blueGray-600 dark:text-blueGray-300">
                      {trx.borrowDate}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 tabular-nums text-blueGray-600 dark:text-blueGray-300">
                      {trx.returnDate ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          {trx.returnDate}
                        </span>
                      ) : (
                        <span className="text-blueGray-400 italic">Belum kembali</span>
                      )}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                      <Badge
                        variant={trx.status === 'DIPINJAM' ? 'warning' : 'success'}
                        className="text-[10px]"
                      >
                        {trx.status === 'DIPINJAM' ? 'Dipinjam' : 'Selesai'}
                      </Badge>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                      {trx.status === 'DIPINJAM' ? (
                        <button
                          type="button"
                          onClick={() => handleReturnAction(trx)}
                          className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold uppercase text-[10px] px-3 py-1.5 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer inline-flex items-center gap-1 min-h-[32px]"
                        >
                          <ArrowDownLeft className="w-3 h-3" aria-hidden="true" />
                          <span>Kembalikan</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-blueGray-400 font-semibold">
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

      <ReturnModal
        isOpen={!!selectedForReturn}
        onClose={() => setSelectedForReturn(null)}
        transaction={selectedForReturn}
        currentUser={currentUser}
        onReturnSubmit={handleProcessReturn}
      />

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
