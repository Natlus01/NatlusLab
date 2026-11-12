import React, { useState, useEffect } from 'react';
import { Transaction, User } from '../../types';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  currentUser: User;
  onReturnSubmit: (params: {
    transactionId: string;
    returnDate: string;
    returnedByUser: User;
    returnNotes?: string;
  }) => { success: boolean; message: string };
}

export const ReturnModal: React.FC<ReturnModalProps> = ({
  isOpen,
  onClose,
  transaction,
  currentUser,
  onReturnSubmit,
}) => {
  const [returnDate, setReturnDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [returnNotes, setReturnNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setReturnDate(new Date().toISOString().split('T')[0]);
    setReturnNotes('');
    setErrorMessage('');
  }, [isOpen, transaction]);

  if (!transaction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnDate) {
      setErrorMessage('Tanggal pengembalian wajib diisi.');
      return;
    }

    const res = onReturnSubmit({
      transactionId: transaction.id,
      returnDate,
      returnedByUser: currentUser,
      returnNotes: returnNotes.trim(),
    });

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Proses Pengembalian Barang"
      description="Verifikasi kondisi dan kembalikan unit inventaris ke stok lab"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-800 dark:text-rose-200">
            {errorMessage}
          </div>
        )}

        {/* Transaction Summary Card */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-teal-800 dark:text-teal-300">
              {transaction.transactionCode}
            </span>
            <Badge variant="warning" className="text-[10px]">
              Sedang Dipinjam
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-slate-500 block">Nama Peminjam:</span>
              <strong className="text-slate-900 dark:text-slate-100">{transaction.borrowerName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Peralatan:</span>
              <strong className="text-slate-900 dark:text-slate-100">
                {transaction.quantity} unit {transaction.itemName}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Tanggal Pinjam:</span>
              <span className="tabular-nums font-medium">{transaction.borrowDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Diproses Oleh:</span>
              <span>{transaction.processedByUserName}</span>
            </div>
          </div>
        </div>

        <Input
          label="Tanggal Pengembalian Fisik"
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          required
        />

        <Input
          label="Kondisi Barang / Catatan Pengembalian (Opsional)"
          value={returnNotes}
          onChange={(e) => setReturnNotes(e.target.value)}
          placeholder="Contoh: Kondisi baik, kabel lengkap, telah dicek menyala"
        />

        <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200">
          <p className="font-semibold">Konfirmasi Stok Otomatis:</p>
          <p className="mt-0.5 text-[11px]">
            Setelah pengembalian diproses, stok <strong>{transaction.itemName}</strong> akan bertambah kembali sebesar <strong>{transaction.quantity} unit</strong>.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" type="submit">
            Proses Pengembalian Selesai
          </Button>
        </div>
      </form>
    </Modal>
  );
};
