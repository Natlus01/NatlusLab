import React, { useState, useEffect } from 'react';
import { Item } from '../../types';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (itemData: {
    code: string;
    name: string;
    category: string;
    stock: number;
    totalStock: number;
  }) => { success: boolean; message: string };
  initialItem?: Item | null;
}

const CATEGORY_OPTIONS = [
  { value: 'Laptop & Komputer', label: 'Laptop & Komputer' },
  { value: 'Aksesori & Periferal', label: 'Aksesori & Periferal' },
  { value: 'Audio Visual & Presentasi', label: 'Audio Visual & Presentasi' },
  { value: 'Display & Monitor', label: 'Display & Monitor' },
  { value: 'Perangkat Jaringan', label: 'Perangkat Jaringan' },
  { value: 'Peralatan & Perkakas Lab', label: 'Peralatan & Perkakas Lab' },
];

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialItem,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value);
  const [stock, setStock] = useState<number | string>(1);
  const [errorMessage, setErrorMessage] = useState('');

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setStock('');
      return;
    }
    // Hapus karakter non-digit dan strip leading zero (contoh "02" -> "2")
    const clean = raw.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
    if (clean === '') {
      setStock('');
      return;
    }
    setStock(parseInt(clean, 10));
  };

  const handleStockBlur = () => {
    if (stock === '' || Number(stock) < 0) {
      setStock(0);
    }
  };

  useEffect(() => {
    if (initialItem) {
      setCode(initialItem.code);
      setName(initialItem.name);
      setCategory(initialItem.category);
      setStock(initialItem.stock);
    } else {
      setCode('');
      setName('');
      setCategory(CATEGORY_OPTIONS[0].value);
      setStock(1);
    }
    setErrorMessage('');
  }, [initialItem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setErrorMessage('Kode barang wajib diisi (contoh: BR006).');
      return;
    }
    if (!name.trim()) {
      setErrorMessage('Nama barang wajib diisi.');
      return;
    }
    const numStock = Math.max(0, Number(stock) || 0);

    const totalStock = initialItem
      ? initialItem.totalStock + (numStock - initialItem.stock)
      : numStock;

    const result = onSubmit({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      category,
      stock: numStock,
      totalStock: Math.max(numStock, totalStock),
    });

    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialItem ? 'Ubah Data Barang' : 'Tambah Data Barang Baru'}
      description="Kelola informasi aset inventaris laboratorium komputer"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 font-bold">
            {errorMessage}
          </div>
        )}

        <Input
          label="Kode Barang"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Contoh: BR006"
          required
          helperText="Format kode barang unik laboratorium (misal: BR001, BR002)"
        />

        <Input
          label="Nama Barang"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Switch TP-Link 16 Port"
          required
        />

        <Select
          label="Kategori Peralatan"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={CATEGORY_OPTIONS}
          required
        />

        <Input
          label="Jumlah Stok Tersedia"
          type="number"
          min="0"
          value={stock}
          onChange={handleStockChange}
          onBlur={handleStockBlur}
          required
          helperText="Jumlah fisik barang yang siap dipinjamkan di laboratorium"
        />

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-blueGray-200">
          <Button variant="outline" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" type="submit">
            {initialItem ? 'Simpan Perubahan' : 'Tambahkan Barang'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
