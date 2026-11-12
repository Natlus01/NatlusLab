export type UserRole = 'ADMIN' | 'STAFF';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Item {
  id: string;
  code: string;
  name: string;
  category: string;
  stock: number;         // Stok tersedia saat ini di laboratorium
  totalStock: number;    // Total unit aset yang dimiliki laboratorium
  borrowedCount: number; // Jumlah unit yang sedang dipinjam
  createdAt: string;
  updatedAt: string;
}

export type TransactionStatus = 'DIPINJAM' | 'SELESAI';

export interface Transaction {
  id: string;
  transactionCode: string;
  borrowerName: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  borrowDate: string;
  returnDate?: string;
  status: TransactionStatus;
  processedByUserId: string;
  processedByUserName: string;
  returnedByUserId?: string;
  returnedByUserName?: string;
  notes?: string;
  createdAt: string;
}

export interface SubmissionInfo {
  fullName: string;
  nim: string;
  appUrl: string;
  repoUrl: string;
  adminDemo: { username: string; password: string };
  staffDemo: { username: string; password: string };
  techStack: string[];
}
