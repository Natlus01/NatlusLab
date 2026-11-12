import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    username: string;
    password: string;
    name: string;
    role: UserRole;
    isActive: boolean;
  }) => { success: boolean; message: string };
  initialUser?: User | null;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialUser,
}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialUser) {
      setName(initialUser.name);
      setUsername(initialUser.username);
      setPassword(initialUser.password);
      setIsActive(initialUser.isActive);
    } else {
      setName('');
      setUsername('');
      setPassword('');
      setIsActive(true);
    }
    setErrorMessage('');
  }, [initialUser, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Nama lengkap petugas wajib diisi.');
      return;
    }
    if (!username.trim()) {
      setErrorMessage('Username akun wajib diisi.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Password akun wajib diisi.');
      return;
    }

    const res = onSubmit({
      name: name.trim(),
      username: username.trim().toLowerCase(),
      password: password.trim(),
      role: 'STAFF',
      isActive,
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
      title={initialUser ? 'Ubah Data Akun Staff' : 'Tambah Akun Staff Baru'}
      description="Manajemen akun akses petugas operasional laboratorium"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-800 dark:text-rose-200">
            {errorMessage}
          </div>
        )}

        <Input
          label="Nama Lengkap Petugas"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Muhammad Budi Santoso"
          required
        />

        <Input
          label="Username Login"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Contoh: budi_lab"
          required
          helperText="Gunakan huruf kecil tanpa spasi"
        />

        <Input
          label="Password Akses"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan password"
          required
        />

        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
          <input
            id="user-is-active"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 text-teal-600 rounded-sm focus:ring-teal-500 cursor-pointer"
          />
          <label htmlFor="user-is-active" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <strong className="block text-slate-900 dark:text-slate-100">Akun Aktif</strong>
            Staff dapat login dan mengelola operasional jika status akun aktif.
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" type="submit">
            {initialUser ? 'Simpan Perubahan' : 'Buat Akun Staff'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
