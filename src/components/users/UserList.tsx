import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { UserFormModal } from './UserFormModal';
import {
  UserPlus,
  Shield,
  UserCheck,
  UserX,
  Edit2,
} from 'lucide-react';

interface UserListProps {
  users: User[];
  onAddUser: (userData: {
    username: string;
    password: string;
    name: string;
    role: UserRole;
    isActive: boolean;
  }) => { success: boolean; message: string };
  onUpdateUser: (
    id: string,
    updates: Partial<User>
  ) => { success: boolean; message: string };
  onToggleStatus: (id: string) => { success: boolean; message: string };
}

export const UserList: React.FC<UserListProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onToggleStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleToggle = (id: string) => {
    const res = onToggleStatus(id);
    if (res.success) {
      showNotification(res.message, 'success');
    } else {
      showNotification(res.message, 'error');
    }
  };

  const handleFormSubmit = (data: {
    username: string;
    password: string;
    name: string;
    role: UserRole;
    isActive: boolean;
  }) => {
    if (editingUser) {
      const res = onUpdateUser(editingUser.id, data);
      if (res.success) showNotification(res.message, 'success');
      return res;
    } else {
      const res = onAddUser(data);
      if (res.success) showNotification(res.message, 'success');
      return res;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Manajemen Akun Pengguna & Staff
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Hak akses Admin: tambah petugas, ubah data kredensial, serta aktifkan atau nonaktifkan akun staff.
          </p>
        </div>
        <Button
          variant="primary"
          icon={<UserPlus className="w-4 h-4" />}
          onClick={handleOpenAdd}
        >
          Tambah Akun Staff
        </Button>
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

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <tr>
                <th scope="col" className="py-3.5 px-4">Nama Lengkap</th>
                <th scope="col" className="py-3.5 px-4">Username</th>
                <th scope="col" className="py-3.5 px-4">Role Hak Akses</th>
                <th scope="col" className="py-3.5 px-4 text-center">Status Akun</th>
                <th scope="col" className="py-3.5 px-4 text-right">Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center select-none"
                        aria-hidden="true"
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                          {user.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ID: {user.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                    @{user.username}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5">
                      {user.role === 'ADMIN' && (
                        <Shield className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                      )}
                      <span className="font-semibold text-xs">
                        {user.role === 'ADMIN' ? 'Administrator' : 'Staff Operasional'}
                      </span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {user.isActive ? (
                      <Badge variant="success" className="text-[10px]">
                        Aktif
                      </Badge>
                    ) : (
                      <Badge variant="danger" className="text-[10px]">
                        Nonaktif
                      </Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {user.role === 'STAFF' && (
                        <Button
                          size="sm"
                          variant={user.isActive ? 'outline' : 'secondary'}
                          icon={
                            user.isActive ? (
                              <UserX className="w-3.5 h-3.5 text-rose-600" />
                            ) : (
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            )
                          }
                          onClick={() => handleToggle(user.id)}
                          className="text-xs px-2.5"
                          title={
                            user.isActive
                              ? 'Nonaktifkan akun ini (staff tidak bisa login)'
                              : 'Aktifkan kembali akun staff ini'
                          }
                        >
                          {user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        </Button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(user)}
                        aria-label={`Ubah kredensial ${user.name}`}
                        title="Ubah data atau password"
                        className="p-2 text-slate-500 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <Edit2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialUser={editingUser}
      />
    </div>
  );
};
