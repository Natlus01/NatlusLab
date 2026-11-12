import * as XLSX from 'xlsx';
import { Item, Transaction } from '../types';

export const exportItemsToExcel = (items: Item[]) => {
  const rows = items.map((it, idx) => ({
    No: idx + 1,
    'Kode Barang': it.code,
    'Nama Perangkat': it.name,
    Kategori: it.category,
    'Stok Tersedia (Unit)': it.stock,
    'Sedang Dipinjam (Unit)': it.borrowedCount,
    'Total Aset (Unit)': it.totalStock,
    'Status Ketersediaan': it.stock === 0 ? 'HABIS' : it.stock < 3 ? 'MENIPIS' : 'TERSEDIA',
    'Tanggal Terdaftar': new Date(it.createdAt).toLocaleDateString('id-ID'),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventaris Lab');
  XLSX.writeFile(workbook, `Rekap_Inventaris_Lab_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportTransactionsToExcel = (transactions: Transaction[]) => {
  const rows = transactions.map((t, idx) => ({
    No: idx + 1,
    'Kode Transaksi': t.transactionCode,
    'Nama Peminjam': t.borrowerName,
    'Kode Barang': t.itemCode,
    'Nama Barang': t.itemName,
    'Jumlah (Unit)': t.quantity,
    'Tanggal Pinjam': t.borrowDate,
    'Tanggal Kembali': t.returnDate || '-',
    Status: t.status,
    'Diproses Oleh': t.processedByUserName,
    'Diterima Oleh': t.returnedByUserName || '-',
    Catatan: t.notes || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat Sirkulasi');
  XLSX.writeFile(workbook, `Rekap_Transaksi_Lab_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
