import React, { useState, useMemo } from 'react';
import { Transaction, User } from '../../types';
import { SearchBar } from '../common/SearchBar';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { ReturnModal } from './ReturnModal';
import { exportTransactionsToExcel } from '../../utils/excelExporter';
import { generateBorrowReceiptPDF } from '../../utils/pdfGenerator';
import {
  ArrowDownLeft,
  Clock,
  PackageX,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  Calendar,
  UserCheck,
} from 'lucide-react';

interface ReturnViewProps {
  transactions: Transaction[];
  currentUser: User;
  onReturnSubmit: (params: {
    transactionId: string;
    returnDate: string;
    returnedByUser: User;
    returnNotes?: string;
  }) => { success: boolean; message: string };
}

export const ReturnView: React.FC<ReturnViewProps> = ({
  transactions,
  currentUser,
  onReturnSubmit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForReturn, setSelectedForReturn] = useState<Transaction | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Hanya ambil transaksi yang statusnya DIPINJAM (belum kembali)
  const activeBorrowedList = useMemo(() => {
    return transactions.filter((t) => t.status === 'DIPINJAM');
  }, [transactions]);

  const filtered = useMemo(() => {
    return activeBorrowedList.filter((trx) => {
      return (
        trx.transactionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.itemCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [activeBorrowedList, searchTerm]);

  const totalBorrowedUnits = activeBorrowedList.reduce((sum, t) => sum + t.quantity, 0);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
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
      {/* Top Banner & Active Stats */}
      <div className="p-6 rounded-lg border border-blueGray-200 bg-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h6 className="text-xs uppercase font-bold text-amber-600 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Monitoring Pengembalian Alat Lab</span>
            </h6>
            <h1 className="text-xl font-bold uppercase tracking-tight text-blueGray-800 mt-0.5">
              Daftar Unit yang Sedang Dipinjam
            </h1>
            <p className="text-xs text-blueGray-500 mt-1">
              Khusus memverifikasi barang yang masih beredar di luar laboratorium dan memulihkan stok inventaris saat dikembalikan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeBorrowedList.length > 0 && (
              <button
                type="button"
                onClick={() => exportTransactionsToExcel(activeBorrowedList)}
                title="Unduh daftar barang yang sedang dipinjam (Excel)"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer flex items-center gap-1.5 min-h-[40px]"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Ekspor Excel</span>
              </button>
            )}
          </div>
        </div>

        {/* 2 Summary KPI Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-blueGray-100">
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-amber-800 tracking-wider">
                Transaksi Peminjaman Aktif
              </div>
              <div className="text-xl font-extrabold text-amber-900 mt-0.5">
                {activeBorrowedList.length} Transaksi
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold">
              {activeBorrowedList.length}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-lightBlue-50 border border-lightBlue-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-lightBlue-800 tracking-wider">
                Total Fisik Unit di Luar Lab
              </div>
              <div className="text-xl font-extrabold text-lightBlue-900 mt-0.5">
                {totalBorrowedUnits} Unit Barang
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-lightBlue-200 text-lightBlue-800 flex items-center justify-center font-bold">
              {totalBorrowedUnits}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {activeBorrowedList.length > 0 && (
          <div className="pt-2">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Cari nama peminjam, kode transaksi (TRX-...), atau nama alat..."
              ariaLabel="Cari barang yang sedang dipinjam"
            />
          </div>
        )}
      </div>

      {notification && (
        <div
          role="status"
          className="p-3.5 rounded-lg text-xs font-semibold border bg-emerald-50 text-emerald-900 border-emerald-200 flex items-center gap-2 shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Table Section */}
      {activeBorrowedList.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="w-12 h-12 text-emerald-500" />}
          title="Semua Peralatan Laboratorium Lengkap di Tempat"
          description="Saat ini tidak ada unit barang laboratorium yang sedang dipinjam. Seluruh aset tersedia penuh di ruang lab."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<PackageX className="w-12 h-12 text-blueGray-400" />}
          title="Data Tidak Ditemukan"
          description={`Tidak ada data peminjaman aktif yang cocok dengan kata kunci "${searchTerm}".`}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-lg border border-blueGray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-blueGray-200 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blueGray-700">
              Menampilkan {filtered.length} Unit Peminjaman Menunggu Pengembalian
            </h2>
            <span className="text-[11px] text-amber-600 font-bold uppercase">
              Perlu Verifikasi Fisik
            </span>
          </div>

          <div className="block w-full overflow-x-auto">
            <table className="items-center w-full bg-transparent border-collapse">
              <thead>
                <tr>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Kode Transaksi
                  </th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Peminjam
                  </th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Perangkat
                  </th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Jumlah
                  </th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Tanggal Pinjam
                  </th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Status
                  </th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Aksi Verifikasi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blueGray-100">
                {filtered.map((trx) => (
                  <tr key={trx.id} className="hover:bg-blueGray-50 transition-colors">
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-mono font-bold text-lightBlue-600">
                      {trx.transactionCode}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="font-bold text-blueGray-800">
                        {trx.borrowerName}
                      </div>
                      <div className="text-[11px] text-blueGray-400 flex items-center gap-1 mt-0.5">
                        <UserCheck className="w-3 h-3 text-blueGray-400" />
                        <span>Petugas: {trx.processedByUserName}</span>
                      </div>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <span className="font-bold text-blueGray-800">
                        {trx.itemName}
                      </span>
                      <span className="text-[11px] text-blueGray-400 font-mono ml-1.5">
                        ({trx.itemCode})
                      </span>
                      {trx.notes && (
                        <div className="text-[10px] text-blueGray-400 truncate max-w-xs mt-0.5 italic">
                          "{trx.notes}"
                        </div>
                      )}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center font-bold tabular-nums">
                      <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-extrabold">
                        {trx.quantity} unit
                      </span>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-blueGray-600 tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blueGray-400" />
                        {trx.borrowDate}
                      </span>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                      <Badge variant="warning" className="text-[10px]">
                        Sedang Dipinjam
                      </Badge>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => generateBorrowReceiptPDF(trx)}
                          title="Cetak ulang bukti peminjaman"
                          className="p-1.5 text-blueGray-600 hover:text-lightBlue-600 hover:bg-lightBlue-50 rounded transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center border border-blueGray-200"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedForReturn(trx)}
                          className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold uppercase text-[10px] px-3 py-1.5 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer inline-flex items-center gap-1.5 min-h-[32px]"
                        >
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          <span>Proses Pengembalian</span>
                        </button>
                      </div>
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
    </div>
  );
};
