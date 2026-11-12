import React, { useState } from 'react';
import { User, UserRole } from '../../types';
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
      {/* Header bar and Add Staff button */}
      <div className="p-5 rounded-lg border border-blueGray-200 bg-white shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h6 className="text-xs uppercase font-bold text-blueGray-400">
            Administrasi Pengguna
          </h6>
          <h1 className="text-xl font-bold uppercase tracking-tight text-blueGray-800 mt-0.5">
            Manajemen Akun Staff Laboratorium
          </h1>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-lightBlue-500 hover:bg-lightBlue-600 text-white font-bold uppercase text-xs px-4 py-2.5 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" aria-hidden="true" />
          <span>Tambah Akun Staff</span>
        </button>
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

      {/* Notus CardTable */}
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border border-blueGray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse text-left text-xs">
            <thead>
              <tr>
                <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Nama Petugas
                </th>
                <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Username
                </th>
                <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Role Akses
                </th>
                <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-center bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Status
                </th>
                <th scope="col" className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-right bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Kelola
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blueGray-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-blueGray-50/70 transition-colors"
                >
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full bg-lightBlue-500 text-white font-bold text-xs flex items-center justify-center shadow select-none"
                        aria-hidden="true"
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-blueGray-800 block text-sm">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-blueGray-400">
                          ID: {user.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-mono font-bold text-blueGray-700">
                    @{user.username}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <span className="inline-flex items-center gap-1.5 font-bold">
                      {user.role === 'ADMIN' && (
                        <Shield className="w-3.5 h-3.5 text-lightBlue-600" aria-hidden="true" />
                      )}
                      <span>
                        {user.role === 'ADMIN' ? 'Administrator' : 'Staff Operasional'}
                      </span>
                    </span>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
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
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.role === 'STAFF' && (
                        <button
                          type="button"
                          onClick={() => handleToggle(user.id)}
                          className={`font-bold uppercase text-[10px] px-3 py-1.5 rounded shadow hover:shadow-md outline-none transition-all cursor-pointer flex items-center gap-1 min-h-[32px] ${
                            user.isActive
                              ? 'bg-blueGray-200 hover:bg-blueGray-300 text-blueGray-700'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                          title={
                            user.isActive
                              ? 'Nonaktifkan akun staff ini'
                              : 'Aktifkan kembali akun staff ini'
                          }
                        >
                          {user.isActive ? (
                            <>
                              <UserX className="w-3 h-3" />
                              <span>Nonaktifkan</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3 h-3" />
                              <span>Aktifkan</span>
                            </>
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(user)}
                        aria-label={`Ubah kredensial ${user.name}`}
                        title="Ubah data atau password"
                        className="p-1.5 text-blueGray-500 hover:text-lightBlue-600 hover:bg-blueGray-100 rounded transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
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
