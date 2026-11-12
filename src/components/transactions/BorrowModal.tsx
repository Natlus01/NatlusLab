import React, { useState, useEffect } from 'react';
import { Item, User } from '../../types';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  preselectedItem?: Item | null;
}

export const BorrowModal: React.FC<BorrowModalProps> = ({
  isOpen,
  onClose,
  items,
  currentUser,
  onBorrowSubmit,
  preselectedItem,
}) => {
  const availableItems = items.filter((i) => i.stock > 0);

  const [borrowerName, setBorrowerName] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [borrowDate, setBorrowDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (preselectedItem && preselectedItem.stock > 0) {
      setSelectedItemId(preselectedItem.id);
    } else if (availableItems.length > 0) {
      setSelectedItemId(availableItems[0].id);
    } else {
      setSelectedItemId('');
    }
    setBorrowerName('');
    setQuantity(1);
    setBorrowDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setErrorMessage('');
  }, [isOpen, preselectedItem, items]);

  const selectedItem = items.find((i) => i.id === selectedItemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowerName.trim()) {
      setErrorMessage('Nama peminjam wajib diisi.');
      return;
    }
    if (!selectedItemId) {
      setErrorMessage('Silakan pilih barang yang akan dipinjam.');
      return;
    }
    if (quantity <= 0) {
      setErrorMessage('Jumlah unit yang dipinjam minimal 1.');
      return;
    }
    if (selectedItem && quantity > selectedItem.stock) {
      setErrorMessage(`Jumlah melebihi stok yang tersedia (${selectedItem.stock} unit).`);
      return;
    }

    const res = onBorrowSubmit({
      borrowerName: borrowerName.trim(),
      itemId: selectedItemId,
      quantity: Number(quantity),
      borrowDate,
      processedByUser: currentUser,
      notes: notes.trim(),
    });

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.message);
    }
  };

  const itemOptions = availableItems.map((item) => ({
    value: item.id,
    label: `${item.name} (${item.code}) - Stok: ${item.stock} unit`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Peminjaman Barang"
      description="Formulir resmi pencatatan transaksi peminjaman laboratorium"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-800 dark:text-rose-200">
            {errorMessage}
          </div>
        )}

        <Input
          label="Nama Lengkap Peminjam"
          value={borrowerName}
          onChange={(e) => setBorrowerName(e.target.value)}
          placeholder="Contoh: Rian Pratama (Mahasiswa TI)"
          required
          helperText="Nama mahasiswa, dosen, atau staff yang meminjam barang"
        />

        {availableItems.length === 0 ? (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-900 dark:text-amber-200">
            Saat ini tidak ada barang yang tersedia untuk dipinjam (stok 0).
          </div>
        ) : (
          <Select
            label="Pilih Barang"
            value={selectedItemId}
            onChange={(e) => {
              setSelectedItemId(e.target.value);
              setQuantity(1);
            }}
            options={itemOptions}
            required
            helperText={
              selectedItem
                ? `Kategori: ${selectedItem.category} | Tersedia: ${selectedItem.stock} unit`
                : ''
            }
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Jumlah Unit"
            type="number"
            min="1"
            max={selectedItem?.stock || 1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            required
            helperText={`Maksimal: ${selectedItem?.stock || 0} unit`}
          />

          <Input
            label="Tanggal Peminjaman"
            type="date"
            value={borrowDate}
            onChange={(e) => setBorrowDate(e.target.value)}
            required
          />
        </div>

        <Input
          label="Keperluan / Catatan (Opsional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Contoh: Praktikum Jaringan Komputer di Lab 2"
        />

        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <p>
            Petugas pemroses: <strong>{currentUser.name}</strong> ({currentUser.role})
          </p>
          <p className="mt-0.5 text-[11px]">
            Stok inventaris barang akan otomatis berkurang sebanyak unit yang dipinjam.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={availableItems.length === 0}
          >
            Simpan Transaksi
          </Button>
        </div>
      </form>
    </Modal>
  );
};
