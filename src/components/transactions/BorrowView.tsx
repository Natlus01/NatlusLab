import React, { useState } from 'react';
import { Item, User, Transaction } from '../../types';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { QRScannerModal } from './QRScannerModal';
import { generateBorrowReceiptPDF } from '../../utils/pdfGenerator';
import {
  ArrowUpRight,
  Camera,
  CheckCircle2,
  Printer,
  ShieldCheck,
  PackageCheck,
  QrCode,
  Info,
} from 'lucide-react';

interface BorrowViewProps {
  items: Item[];
  currentUser: User;
  onBorrowSubmit: (params: {
    borrowerName: string;
    itemId: string;
    quantity: number;
    borrowDate: string;
    processedByUser: User;
    notes?: string;
  }) => { success: boolean; message: string; transaction?: Transaction };
}

export const BorrowView: React.FC<BorrowViewProps> = ({
  items,
  currentUser,
  onBorrowSubmit,
}) => {
  const availableItems = items.filter((i) => i.stock > 0);

  const [borrowerName, setBorrowerName] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(
    availableItems.length > 0 ? availableItems[0].id : ''
  );
  const [quantity, setQuantity] = useState<number | string>(1);
  const [borrowDate, setBorrowDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState<{
    message: string;
    transaction?: Transaction;
  } | null>(null);

  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

  const selectedItem = items.find((i) => i.id === selectedItemId);

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
      // plain text
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
      setErrorMessage(`Kode QR "${scannedCode}" tidak ditemukan di database.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessInfo(null);

    if (!borrowerName.trim()) {
      setErrorMessage('Nama peminjam wajib diisi.');
      return;
    }
    if (!selectedItemId) {
      setErrorMessage('Silakan pilih perangkat yang akan dipinjam.');
      return;
    }
    const numQty = Math.max(1, Number(quantity) || 1);
    if (selectedItem && numQty > selectedItem.stock) {
      setErrorMessage(`Jumlah melebihi stok tersedia (${selectedItem.stock} unit).`);
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
      setSuccessInfo({
        message: res.message,
        transaction: res.transaction,
      });
      // Reset form
      setBorrowerName('');
      setNotes('');
      setQuantity(1);
      setScanMessage('');
    } else {
      setErrorMessage(res.message);
    }
  };

  const itemOptions = availableItems.map((item) => ({
    value: item.id,
    label: `${item.name} (${item.code}) — Siap: ${item.stock} unit`,
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-lg border border-blueGray-200 bg-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h6 className="text-xs uppercase font-bold text-blueGray-400">
              Layanan Sirkulasi Laboratorium
            </h6>
            <h1 className="text-xl font-bold uppercase tracking-tight text-blueGray-800 mt-0.5">
              Pencatatan Peminjaman Perangkat
            </h1>
            <p className="text-xs text-blueGray-500 mt-1">
              Formulir terpadu peminjaman unit dengan dukungan pemindaian QR Code dan cetak surat bukti resmi.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsQRScannerOpen(true)}
              className="bg-lightBlue-600 hover:bg-lightBlue-700 text-white font-bold uppercase text-xs px-4 py-2.5 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer flex items-center gap-1.5 min-h-[42px]"
            >
              <Camera className="w-4 h-4" />
              <span>Scan QR Kamera</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Alert with Print Action */}
      {successInfo && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold">{successInfo.message}</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Unit inventaris telah dikurangi dari stok laboratorium secara otomatis.
              </p>
            </div>
          </div>
          {successInfo.transaction && (
            <button
              type="button"
              onClick={() => generateBorrowReceiptPDF(successInfo.transaction!)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase px-3 py-2 rounded shadow inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto min-h-[36px]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Bukti PDF</span>
            </button>
          )}
        </div>
      )}

      {/* Main Grid: Form (Left) & Quick Select / Instructions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Peminjaman */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg border border-blueGray-200 p-6">
          <div className="flex items-center gap-2 pb-4 mb-5 border-b border-blueGray-100">
            <div className="w-8 h-8 rounded bg-lightBlue-100 text-lightBlue-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-blueGray-800">
                Formulir Peminjaman Unit
              </h2>
              <p className="text-[11px] text-blueGray-400">
                Isi data peminjam dan pastikan unit perangkat siap diuji
              </p>
            </div>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-4 p-3 bg-red-50 text-red-900 border border-red-200 rounded text-xs font-semibold"
            >
              {errorMessage}
            </div>
          )}

          {scanMessage && (
            <div className="mb-4 p-3 bg-lightBlue-50 border border-lightBlue-200 rounded text-xs text-lightBlue-900 font-bold flex items-center gap-2">
              <QrCode className="w-4 h-4 text-lightBlue-600" />
              <span>{scanMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Lengkap Peminjam"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              placeholder="Contoh: Rian Pratama (NIM 210101001 / Dosen)"
              required
              helperText="Identitas mahasiswa, dosen, atau praktikan yang meminjam alat"
            />

            {availableItems.length === 0 ? (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded text-xs text-orange-900 font-bold">
                Semua stok barang laboratorium saat ini sedang habis (0 unit tersedia).
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase text-blueGray-700">
                    Pilih Perangkat Laboratorium
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsQRScannerOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-lightBlue-600 hover:text-lightBlue-700 cursor-pointer bg-lightBlue-50 px-2.5 py-1 rounded border border-lightBlue-200 shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Scan QR Unit</span>
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
                      ? `Kategori: ${selectedItem.category} | Tersedia di Lab: ${selectedItem.stock} unit`
                      : ''
                  }
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Jumlah Unit yang Dipinjam"
                type="number"
                min="1"
                max={selectedItem?.stock || 1}
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={handleQuantityBlur}
                required
                helperText={`Batas maksimal stok tersedia: ${selectedItem?.stock || 0} unit`}
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
              label="Keperluan / Catatan Praktikum"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Praktikum Jaringan Komputer di Lab 2"
              helperText="Tuliskan mata kuliah, praktikum, atau tujuan peminjaman"
            />

            <div className="p-3.5 rounded bg-blueGray-50 border border-blueGray-200 text-xs text-blueGray-600 flex items-center justify-between">
              <div>
                <span className="block font-bold text-blueGray-800">
                  Petugas Pemroses: {currentUser.name}
                </span>
                <span className="text-[11px] text-blueGray-400">
                  Role: {currentUser.role} | Validasi otomatis ke database PostgreSQL
                </span>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="pt-3 border-t border-blueGray-100 flex justify-end">
              <button
                type="submit"
                disabled={availableItems.length === 0}
                className="bg-lightBlue-600 hover:bg-lightBlue-700 active:bg-lightBlue-800 text-white font-bold uppercase text-xs px-6 py-3 rounded shadow hover:shadow-lg outline-none transition-all cursor-pointer flex items-center gap-2 min-h-[44px] disabled:bg-blueGray-300 disabled:cursor-not-allowed"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Simpan Transaksi Peminjaman</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Quick Items Palette & Guidelines */}
        <div className="space-y-6">
          {/* Quick Item Picker */}
          <div className="bg-white rounded-lg shadow-lg border border-blueGray-200 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blueGray-700 pb-2 mb-3 border-b border-blueGray-100 flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              <span>Unit Siap Dipinjam ({availableItems.length})</span>
            </h3>
            <p className="text-[11px] text-blueGray-400 mb-3">
              Klik nama barang untuk langsung memilih unit ke dalam formulir:
            </p>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {availableItems.map((item) => {
                const isSelected = item.id === selectedItemId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedItemId(item.id);
                      setQuantity(1);
                      setScanMessage('');
                    }}
                    className={`w-full text-left p-2.5 rounded border transition-colors flex items-center justify-between text-xs cursor-pointer ${
                      isSelected
                        ? 'bg-lightBlue-50 border-lightBlue-400 text-lightBlue-900 font-bold'
                        : 'bg-blueGray-50 border-blueGray-200 hover:bg-blueGray-100 text-blueGray-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold truncate">{item.name}</div>
                      <div className="text-[10px] text-blueGray-400 font-mono">
                        {item.code} • {item.category}
                      </div>
                    </div>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-blueGray-300 font-bold tabular-nums">
                      {item.stock} unit
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-white rounded-lg shadow-lg border border-blueGray-200 p-5 text-xs text-blueGray-600">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blueGray-700 pb-2 mb-3 border-b border-blueGray-100 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-lightBlue-600" />
              <span>Ketentuan Sirkulasi Lab</span>
            </h3>
            <ul className="space-y-2 text-[11px] list-disc list-inside text-blueGray-500">
              <li>Peminjam wajib menunjukkan kartu identitas (KTM / Kartu Pegawai).</li>
              <li>Periksa kelengkapan fisik dan kabel perangkat sebelum diserahkan.</li>
              <li>Cetak dan simpan lembar tanda terima peminjaman sebagai arsip bukti.</li>
              <li>Pengembalian barang wajib diproses melalui menu <strong>Pengembalian</strong>.</li>
            </ul>
          </div>
        </div>
      </div>

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleQRScanSuccess}
      />
    </div>
  );
};
