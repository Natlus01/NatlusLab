import { Item, User, Transaction } from '../types';
import { INITIAL_ITEMS, INITIAL_USERS, INITIAL_TRANSACTIONS } from '../data/seedData';

const STORAGE_KEYS = {
  ITEMS: 'labflow_items_v1',
  USERS: 'labflow_users_v1',
  TRANSACTIONS: 'labflow_transactions_v1',
  AUTH: 'labflow_auth_session_v1',
  THEME: 'labflow_theme_mode_v1',
};

type StorageListener = () => void;
const listeners: Set<StorageListener> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Safe fail
    }
  });
};

export const storageService = {
  subscribe(listener: StorageListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  // Initialize data if not yet present in localStorage
  init(): void {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ITEMS)) {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(INITIAL_ITEMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    }
  },

  // USERS
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    notifyListeners();
  },

  addUser(user: Omit<User, 'id' | 'createdAt'>): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const existing = users.find((u) => u.username.toLowerCase() === user.username.toLowerCase());
    if (existing) {
      return { success: false, message: 'Username sudah digunakan oleh akun lain.' };
    }

    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);
    return { success: true, message: 'Akun Staff berhasil ditambahkan.', user: newUser };
  },

  updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): { success: boolean; message: string } {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      return { success: false, message: 'Pengguna tidak ditemukan.' };
    }

    // Check username uniqueness if changed
    if (updates.username) {
      const duplicate = users.find(
        (u) => u.id !== id && u.username.toLowerCase() === updates.username?.toLowerCase()
      );
      if (duplicate) {
        return { success: false, message: 'Username sudah digunakan oleh akun lain.' };
      }
    }

    users[index] = { ...users[index], ...updates };
    this.saveUsers(users);
    return { success: true, message: 'Data pengguna berhasil diperbarui.' };
  },

  toggleUserStatus(id: string): { success: boolean; message: string; newStatus?: boolean } {
    const users = this.getUsers();
    const user = users.find((u) => u.id === id);
    if (!user) {
      return { success: false, message: 'Pengguna tidak ditemukan.' };
    }

    // Do not allow deactivating the main default admin to prevent lockout
    if (user.username === 'admin') {
      return { success: false, message: 'Akun Admin utama tidak dapat dinonaktifkan demi keamanan sistem.' };
    }

    user.isActive = !user.isActive;
    this.saveUsers(users);
    return {
      success: true,
      message: `Status akun berhasil diubah menjadi ${user.isActive ? 'Aktif' : 'Nonaktif'}.`,
      newStatus: user.isActive,
    };
  },

  // ITEMS
  getItems(): Item[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
      return data ? JSON.parse(data) : INITIAL_ITEMS;
    } catch {
      return INITIAL_ITEMS;
    }
  },

  saveItems(items: Item[]): void {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    notifyListeners();
  },

  addItem(item: Omit<Item, 'id' | 'borrowedCount' | 'createdAt' | 'updatedAt'>): { success: boolean; message: string; item?: Item } {
    const items = this.getItems();
    const existing = items.find((i) => i.code.toLowerCase() === item.code.toLowerCase());
    if (existing) {
      return { success: false, message: `Kode barang ${item.code} sudah terdaftar.` };
    }

    const newItem: Item = {
      ...item,
      id: `item-${Date.now()}`,
      borrowedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    items.push(newItem);
    this.saveItems(items);
    return { success: true, message: 'Barang baru berhasil ditambahkan.', item: newItem };
  },

  updateItem(id: string, updates: Partial<Omit<Item, 'id' | 'createdAt' | 'borrowedCount'>>): { success: boolean; message: string } {
    const items = this.getItems();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) {
      return { success: false, message: 'Data barang tidak ditemukan.' };
    }

    if (updates.code) {
      const duplicate = items.find(
        (i) => i.id !== id && i.code.toLowerCase() === updates.code?.toLowerCase()
      );
      if (duplicate) {
        return { success: false, message: `Kode barang ${updates.code} sudah digunakan barang lain.` };
      }
    }

    const current = items[index];
    const newStock = updates.stock !== undefined ? updates.stock : current.stock;
    const newTotalStock = updates.totalStock !== undefined ? updates.totalStock : current.totalStock;

    if (newStock < 0 || newTotalStock < 0) {
      return { success: false, message: 'Jumlah stok tidak boleh bernilai negatif.' };
    }

    items[index] = {
      ...current,
      ...updates,
      stock: newStock,
      totalStock: newTotalStock,
      updatedAt: new Date().toISOString(),
    };

    this.saveItems(items);
    return { success: true, message: 'Data barang berhasil diperbarui.' };
  },

  deleteItem(id: string): { success: boolean; message: string } {
    const items = this.getItems();
    const item = items.find((i) => i.id === id);
    if (!item) {
      return { success: false, message: 'Barang tidak ditemukan.' };
    }

    // Safety check: Cannot delete item if it is currently borrowed
    if (item.borrowedCount > 0) {
      return {
        success: false,
        message: `Tidak dapat menghapus barang. Masih ada ${item.borrowedCount} unit yang sedang dipinjam.`,
      };
    }

    const filtered = items.filter((i) => i.id !== id);
    this.saveItems(filtered);
    return { success: true, message: `Barang "${item.name}" berhasil dihapus.` };
  },

  // TRANSACTIONS
  getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  },

  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    notifyListeners();
  },

  borrowItem(params: {
    borrowerName: string;
    itemId: string;
    quantity: number;
    borrowDate: string;
    processedByUser: User;
    notes?: string;
  }): { success: boolean; message: string; transaction?: Transaction } {
    if (!params.borrowerName.trim()) {
      return { success: false, message: 'Nama peminjam wajib diisi.' };
    }
    if (params.quantity <= 0) {
      return { success: false, message: 'Jumlah barang yang dipinjam minimal 1 unit.' };
    }

    const items = this.getItems();
    const itemIndex = items.findIndex((i) => i.id === params.itemId);
    if (itemIndex === -1) {
      return { success: false, message: 'Barang yang dipilih tidak valid.' };
    }

    const targetItem = items[itemIndex];
    if (targetItem.stock < params.quantity) {
      return {
        success: false,
        message: `Stok tidak mencukupi. Stok tersedia saat ini: ${targetItem.stock} unit.`,
      };
    }

    // Deduct stock and increment borrowedCount
    items[itemIndex] = {
      ...targetItem,
      stock: targetItem.stock - params.quantity,
      borrowedCount: targetItem.borrowedCount + params.quantity,
      updatedAt: new Date().toISOString(),
    };

    const newTransaction: Transaction = {
      id: `trx-${Date.now()}`,
      transactionCode: `TRX-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 900) + 100)}`,
      borrowerName: params.borrowerName.trim(),
      itemId: targetItem.id,
      itemCode: targetItem.code,
      itemName: targetItem.name,
      quantity: params.quantity,
      borrowDate: params.borrowDate || new Date().toISOString().split('T')[0],
      status: 'DIPINJAM',
      processedByUserId: params.processedByUser.id,
      processedByUserName: params.processedByUser.name,
      notes: params.notes?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    const transactions = this.getTransactions();
    transactions.unshift(newTransaction);

    this.saveItems(items);
    this.saveTransactions(transactions);

    return {
      success: true,
      message: `Peminjaman ${params.quantity} unit ${targetItem.name} berhasil dicatat.`,
      transaction: newTransaction,
    };
  },

  returnItem(params: {
    transactionId: string;
    returnDate: string;
    returnedByUser: User;
    returnNotes?: string;
  }): { success: boolean; message: string } {
    const transactions = this.getTransactions();
    const trxIndex = transactions.findIndex((t) => t.id === params.transactionId);
    if (trxIndex === -1) {
      return { success: false, message: 'Data transaksi peminjaman tidak ditemukan.' };
    }

    const trx = transactions[trxIndex];
    if (trx.status === 'SELESAI') {
      return { success: false, message: 'Barang pada transaksi ini sudah pernah dikembalikan.' };
    }

    const items = this.getItems();
    const itemIndex = items.findIndex((i) => i.id === trx.itemId);
    if (itemIndex !== -1) {
      const currentItem = items[itemIndex];
      items[itemIndex] = {
        ...currentItem,
        stock: currentItem.stock + trx.quantity,
        borrowedCount: Math.max(0, currentItem.borrowedCount - trx.quantity),
        updatedAt: new Date().toISOString(),
      };
      this.saveItems(items);
    }

    transactions[trxIndex] = {
      ...trx,
      status: 'SELESAI',
      returnDate: params.returnDate || new Date().toISOString().split('T')[0],
      returnedByUserId: params.returnedByUser.id,
      returnedByUserName: params.returnedByUser.name,
      notes: params.returnNotes ? `${trx.notes ? trx.notes + ' | ' : ''}Catatan Kembali: ${params.returnNotes}` : trx.notes,
    };

    this.saveTransactions(transactions);
    return {
      success: true,
      message: `Pengembalian ${trx.quantity} unit ${trx.itemName} berhasil diproses. Stok barang telah dikembalikan.`,
    };
  },

  // RESET & BACKUP
  resetToDefault(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(INITIAL_ITEMS));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    notifyListeners();
  },

  exportDatabase(): string {
    const dump = {
      exportedAt: new Date().toISOString(),
      system: 'NatlusLab - Laboratory Inventory & Borrowing System',
      users: this.getUsers(),
      items: this.getItems(),
      transactions: this.getTransactions(),
    };
    return JSON.stringify(dump, null, 2);
  },

  importDatabase(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!Array.isArray(data.items) || !Array.isArray(data.users) || !Array.isArray(data.transactions)) {
        return { success: false, message: 'Format berkas JSON cadangan tidak valid.' };
      }
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(data.items));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
      notifyListeners();
      return { success: true, message: 'Data laboratorium berhasil dipulihkan dari cadangan.' };
    } catch {
      return { success: false, message: 'Gagal membaca berkas JSON. Format data salah.' };
    }
  },
};
