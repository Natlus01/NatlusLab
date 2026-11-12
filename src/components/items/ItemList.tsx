import React, { useState, useMemo } from 'react';
import { Item } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { SearchBar } from '../common/SearchBar';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { ItemFormModal } from './ItemFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUpRight,
  Package,
  Layers,
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

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);
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
      {/* Header and Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Manajemen Inventaris Barang
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Daftar peralatan laboratorium komputer, ketersediaan unit, dan status peminjaman.
          </p>
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenAdd}
          >
            Tambah Barang Baru
          </Button>
        )}
      </div>

      {notification && (
        <div
          role="status"
          className={`p-3 rounded-lg text-xs font-medium border ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/50 dark:text-rose-200 dark:border-rose-800'
          }`}
        >
          {notification.text}
        </div>
      )}

      {/* Filters & Search */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Cari kode (BR001) atau nama perangkat (Lenovo, Mouse, Monitor)..."
              ariaLabel="Cari barang inventaris"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter kategori peralatan"
              className="w-full min-h-[44px] px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 cursor-pointer"
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
              className="w-full min-h-[44px] px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 cursor-pointer"
            >
              <option value="ALL">Semua Stok</option>
              <option value="AVAILABLE">Tersedia (&gt; 0)</option>
              <option value="OUT_OF_STOCK">Habis Dipinjam (0)</option>
            </select>
          </div>
        </div>

        {/* Active search filter pills summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Menampilkan <strong>{filteredItems.length}</strong> dari {items.length} jenis peralatan</span>
          {(searchTerm || selectedCategory !== 'ALL' || stockFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setStockFilter('ALL');
              }}
              className="text-teal-700 hover:text-teal-800 dark:text-teal-400 font-medium cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Main Table View */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={<Package className="w-8 h-8" />}
          title="Tidak Ada Barang Ditemukan"
          description={
            searchTerm || selectedCategory !== 'ALL' || stockFilter !== 'ALL'
              ? 'Tidak ada barang yang cocok dengan kriteria pencarian dan filter Anda saat ini.'
              : 'Belum ada data barang laboratorium yang tersimpan di sistem.'
          }
          actionLabel={isAdmin ? 'Tambah Barang Pertama' : undefined}
          onAction={isAdmin ? handleOpenAdd : undefined}
        />
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <tr>
                  <th scope="col" className="py-3.5 px-4">Kode</th>
                  <th scope="col" className="py-3.5 px-4">Nama Barang</th>
                  <th scope="col" className="py-3.5 px-4 hidden md:table-cell">Kategori</th>
                  <th scope="col" className="py-3.5 px-4 text-center">Stok Siap</th>
                  <th scope="col" className="py-3.5 px-4 text-center hidden sm:table-cell">Dipinjam</th>
                  <th scope="col" className="py-3.5 px-4 text-center">Status</th>
                  <th scope="col" className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-800 dark:text-teal-300">
                      {item.code}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 md:hidden mt-0.5">
                        {item.category}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {item.stock}
                    </td>
                    <td className="py-3.5 px-4 text-center hidden sm:table-cell text-slate-500 dark:text-slate-400 tabular-nums">
                      {item.borrowedCount}
                    </td>
                    <td className="py-3.5 px-4 text-center">
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
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onBorrowItemRequest && (
                          <Button
                            size="sm"
                            variant="primary"
                            icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                            onClick={() => onBorrowItemRequest(item)}
                            disabled={item.stock <= 0}
                            title={item.stock <= 0 ? 'Stok sedang kosong' : 'Pinjam barang ini'}
                            className="hidden sm:inline-flex text-xs px-2.5"
                          >
                            Pinjam
                          </Button>
                        )}
                        {isAdmin && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              aria-label={`Ubah data ${item.name}`}
                              title="Ubah data barang"
                              className="p-2 text-slate-500 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                            >
                              <Edit2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenDelete(item)}
                              aria-label={`Hapus data ${item.name}`}
                              title="Hapus data barang"
                              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
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

      {/* Add / Edit Modal */}
      <ItemFormModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSubmit={handleFormSubmit}
        initialItem={editingItem}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
        item={deletingItem}
      />
    </div>
  );
};
