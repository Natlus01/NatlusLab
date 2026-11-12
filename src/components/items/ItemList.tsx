import React, { useState, useMemo } from 'react';
import { Item } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { SearchBar } from '../common/SearchBar';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { ItemFormModal } from './ItemFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { ItemQRCodeModal } from './ItemQRCodeModal';
import { exportItemsToExcel } from '../../utils/excelExporter';
import { generateInventoryReportPDF } from '../../utils/pdfGenerator';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUpRight,
  Package,
  Layers,
  QrCode,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';

interface ItemListProps {
  items: Item[];
  onAddItem: (itemData: {
    code: string;
    name: string;
    category: string;
    stock: number;
    totalStock: number;
  }) => { success: boolean; message: string };
  onUpdateItem: (
    id: string,
    updates: Partial<Item>
  ) => { success: boolean; message: string };
  onDeleteItem: (id: string) => { success: boolean; message: string };
  onBorrowItemRequest?: (item: Item) => void;
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onBorrowItemRequest,
}) => {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'AVAILABLE' | 'OUT_OF_STOCK'>('ALL');

  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);
  const [qrModalItem, setQrModalItem] = useState<Item | null>(null);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ['ALL', ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;

      const matchStock =
        stockFilter === 'ALL'
          ? true
          : stockFilter === 'AVAILABLE'
          ? item.stock > 0
          : item.stock === 0;

      return matchSearch && matchCategory && matchStock;
    });
  }, [items, searchTerm, selectedCategory, stockFilter]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (item: Item) => {
    setEditingItem(item);
    setIsAddEditOpen(true);
  };

  const handleOpenDelete = (item: Item) => {
    setDeletingItem(item);
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    const res = onDeleteItem(deletingItem.id);
    if (res.success) {
      showNotification(res.message, 'success');
      setDeletingItem(null);
    } else {
      showNotification(res.message, 'error');
    }
  };

  const handleFormSubmit = (data: {
    code: string;
    name: string;
    category: string;
    stock: number;
    totalStock: number;
  }) => {
    if (editingItem) {
      const res = onUpdateItem(editingItem.id, data);
      if (res.success) showNotification(res.message, 'success');
      return res;
    } else {
      const res = onAddItem(data);
      if (res.success) showNotification(res.message, 'success');
      return res;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar and search controls */}
      <div className="p-5 rounded-lg border border-blueGray-200 bg-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h6 className="text-xs uppercase font-bold text-blueGray-400">
              Master Data Laboratorium
            </h6>
            <h1 className="text-xl font-bold uppercase tracking-tight text-blueGray-800 mt-0.5">
              Daftar Barang & Inventaris
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => exportItemsToExcel(items)}
              title="Unduh rekap inventaris format Excel"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Ekspor Excel</span>
            </button>
            <button
              type="button"
              onClick={() => generateInventoryReportPDF(items)}
              title="Unduh laporan rekap inventaris format PDF"
              className="bg-blueGray-700 hover:bg-blueGray-800 text-white font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Laporan PDF</span>
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="bg-lightBlue-500 hover:bg-lightBlue-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Tambah Barang Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-blueGray-100">
          <div className="md:col-span-2">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Cari kode (BR001) atau nama perangkat (Lenovo, Mouse, dsb)..."
              ariaLabel="Cari inventaris barang"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter kategori"
              className="w-full min-h-[44px] px-3 py-2 text-xs rounded border border-blueGray-300 bg-white text-blueGray-700 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'Semua Kategori' : cat}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              aria-label="Filter status stok"
              className="w-full min-h-[44px] px-3 py-2 text-xs rounded border border-blueGray-300 bg-white text-blueGray-700 cursor-pointer"
            >
              <option value="ALL">Semua Stok</option>
              <option value="AVAILABLE">Tersedia (&gt; 0)</option>
              <option value="OUT_OF_STOCK">Habis Dipinjam (0)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-blueGray-400">
          <span>Menampilkan <strong>{filteredItems.length}</strong> dari {items.length} jenis peralatan</span>
          {(searchTerm || selectedCategory !== 'ALL' || stockFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setStockFilter('ALL');
              }}
              className="text-lightBlue-600 font-bold uppercase text-[11px] cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {notification && (
        <div
          role="status"
          className={`p-3 rounded text-xs font-semibold border ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          {notification.text}
        </div>
      )}

      {/* Notus CardTable Layout */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={<Package className="w-8 h-8 text-blueGray-400" />}
          title="Tidak Ada Barang Ditemukan"
          description={
            searchTerm || selectedCategory !== 'ALL' || stockFilter !== 'ALL'
              ? 'Tidak ada barang yang cocok dengan kriteria pencarian dan filter Anda.'
              : 'Belum ada data barang laboratorium yang tersimpan di sistem.'
          }
          actionLabel={isAdmin ? 'Tambah Barang Pertama' : undefined}
          onAction={isAdmin ? handleOpenAdd : undefined}
        />
      ) : (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border border-blueGray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="items-center w-full bg-transparent border-collapse text-left text-xs">
              <thead>
                <tr>
                  <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Kode
                  </th>
                  <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Nama Barang
                  </th>
                  <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100 hidden md:table-cell">
                    Kategori
                  </th>
                  <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-center bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Stok Siap
                  </th>
                  <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-center bg-blueGray-50 text-blueGray-500 border-blueGray-100 hidden sm:table-cell">
                    Dipinjam
                  </th>
                  <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-center bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Status
                  </th>
                  <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-right bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blueGray-100">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blueGray-50/70 transition-colors"
                  >
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-mono font-bold text-lightBlue-600">
                      {item.code}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="font-bold text-blueGray-800 text-sm">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-blueGray-400 md:hidden mt-0.5">
                        {item.category}
                      </div>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 hidden md:table-cell text-blueGray-600 font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-blueGray-400" aria-hidden="true" />
                        {item.category}
                      </span>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center font-bold text-blueGray-800 tabular-nums text-sm">
                      {item.stock}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center hidden sm:table-cell text-blueGray-500 tabular-nums">
                      {item.borrowedCount}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                      {item.stock > 0 ? (
                        <Badge variant="success" className="text-[10px]">
                          Tersedia
                        </Badge>
                      ) : (
                        <Badge variant="danger" className="text-[10px]">
                          Habis
                        </Badge>
                      )}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setQrModalItem(item)}
                          aria-label={`Lihat QR Code ${item.name}`}
                          title="Lihat & Cetak QR Code Unit"
                          className="p-1.5 text-blueGray-600 hover:text-lightBlue-600 hover:bg-lightBlue-50 rounded transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center border border-blueGray-200"
                        >
                          <QrCode className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        {onBorrowItemRequest && (
                          <button
                            type="button"
                            onClick={() => onBorrowItemRequest(item)}
                            disabled={item.stock <= 0}
                            title={item.stock <= 0 ? 'Stok sedang kosong' : 'Pinjam barang ini'}
                            className="bg-lightBlue-500 hover:bg-lightBlue-600 active:bg-lightBlue-700 text-white font-bold uppercase text-[10px] px-2.5 py-1.5 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer disabled:bg-blueGray-300 disabled:cursor-not-allowed flex items-center gap-1 min-h-[32px]"
                          >
                            <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                            <span>Pinjam</span>
                          </button>
                        )}
                        {isAdmin && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              aria-label={`Ubah data ${item.name}`}
                              title="Ubah data barang"
                              className="p-1.5 text-blueGray-500 hover:text-lightBlue-600 hover:bg-blueGray-100 rounded transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                            >
                              <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenDelete(item)}
                              aria-label={`Hapus data ${item.name}`}
                              title="Hapus data barang"
                              className="p-1.5 text-blueGray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ItemFormModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSubmit={handleFormSubmit}
        initialItem={editingItem}
      />

      <DeleteConfirmModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
        item={deletingItem}
      />

      <ItemQRCodeModal
        isOpen={!!qrModalItem}
        onClose={() => setQrModalItem(null)}
        item={qrModalItem}
      />
    </div>
  );
};
