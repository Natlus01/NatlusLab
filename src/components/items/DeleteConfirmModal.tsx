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
        <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded text-red-900 text-xs leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            Apakah Anda yakin ingin menghapus <strong>{item.name}</strong> ({item.code}) dari data inventaris? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        {item.borrowedCount > 0 && (
          <p className="text-xs text-red-600 font-bold">
            Peringatan: Barang ini sedang memiliki {item.borrowedCount} unit dalam status peminjaman aktif!
          </p>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-blueGray-200">
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
