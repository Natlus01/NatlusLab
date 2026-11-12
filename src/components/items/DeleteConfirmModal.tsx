import React from 'react';
import { Item } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: Item | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  item,
}) => {
  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hapus Data Barang"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-900 dark:text-rose-200 text-xs leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            Apakah Anda yakin ingin menghapus <strong>{item.name}</strong> ({item.code}) dari data inventaris? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        {item.borrowedCount > 0 && (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
            Peringatan: Barang ini sedang memiliki {item.borrowedCount} unit dalam status peminjaman aktif!
          </p>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            disabled={item.borrowedCount > 0}
          >
            Hapus Permanen
          </Button>
        </div>
      </div>
    </Modal>
  );
};
