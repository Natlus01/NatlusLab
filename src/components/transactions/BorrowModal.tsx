import React, { useState, useEffect } from 'react';
import { Item, User } from '../../types';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { QRScannerModal } from './QRScannerModal';
import { Camera, QrCode } from 'lucide-react';

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
  const [quantity, setQuantity] = useState<number | string>(1);
  const [borrowDate, setBorrowDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setQuantity('');
      return;
    }
    // Hapus karakter non-digit dan strip leading zero (contoh "02" -> "2")
    const clean = raw.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
    if (clean === '') {
      setQuantity('');
      return;
    }
    const num = parseInt(clean, 10);
    const max = selectedItem?.stock || 999;
    if (num > max) {
      setQuantity(max);
    } else {
      setQuantity(num);
    }
  };

  const handleQuantityBlur = () => {
    if (quantity === '' || Number(quantity) < 1) {
      setQuantity(1);
    }
  };

  const handleQRScanSuccess = (decodedText: string) => {
    let scannedCode = decodedText.trim();
    try {
      const parsed = JSON.parse(decodedText);
      if (parsed.code) scannedCode = parsed.code;
      else if (parsed.id) scannedCode = parsed.id;
    } catch {
      // plain string
    }

    const found = items.find(
      (it) =>
        it.code.toLowerCase() === scannedCode.toLowerCase() ||
        it.id.toLowerCase() === scannedCode.toLowerCase()
    );

    if (found) {
      if (found.stock > 0) {
        setSelectedItemId(found.id);
        setScanMessage(`Berhasil memindai: ${found.name} (${found.code})`);
        setErrorMessage('');
      } else {
        setErrorMessage(`Barang ${found.name} (${found.code}) stoknya sedang habis (0 unit).`);
      }
    } else {
      setErrorMessage(`Kode QR "${scannedCode}" tidak cocok dengan data inventaris.`);
    }
  };

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
    const numQty = Math.max(1, Number(quantity) || 1);
    if (selectedItem && numQty > selectedItem.stock) {
      setErrorMessage(`Jumlah melebihi stok yang tersedia (${selectedItem.stock} unit).`);
      return;
    }

    const res = onBorrowSubmit({
      borrowerName: borrowerName.trim(),
      itemId: selectedItemId,
      quantity: numQty,
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
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 font-bold">
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

        {scanMessage && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 font-bold flex items-center gap-2">
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>{scanMessage}</span>
          </div>
        )}

        {availableItems.length === 0 ? (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded text-xs text-orange-900 font-bold">
            Saat ini tidak ada barang yang tersedia untuk dipinjam (stok 0).
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase text-blueGray-700">
                Pilihan Perangkat Lab
              </span>
              <button
                type="button"
                onClick={() => setIsQRScannerOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-lightBlue-600 hover:text-lightBlue-700 cursor-pointer bg-lightBlue-50 px-2.5 py-1 rounded border border-lightBlue-200 shadow-xs"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan QR Kamera</span>
              </button>
            </div>
            <Select
              label=""
              value={selectedItemId}
              onChange={(e) => {
                setSelectedItemId(e.target.value);
                setQuantity(1);
                setScanMessage('');
              }}
              options={itemOptions}
              required
              helperText={
                selectedItem
                  ? `Kategori: ${selectedItem.category} | Tersedia: ${selectedItem.stock} unit`
                  : ''
              }
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Jumlah Unit"
            type="number"
            min="1"
            max={selectedItem?.stock || 1}
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleQuantityBlur}
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

        <div className="p-3 rounded bg-blueGray-50 border border-blueGray-200 text-xs text-blueGray-500">
          <p>
            Petugas pemroses: <strong>{currentUser.name}</strong> ({currentUser.role})
          </p>
          <p className="mt-0.5 text-[11px]">
            Stok inventaris barang akan otomatis berkurang sebanyak unit yang dipinjam.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-blueGray-200">
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

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleQRScanSuccess}
      />
    </Modal>
  );
};
