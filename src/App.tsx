import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { storageService } from './services/storageService';
import { Item, Transaction, User } from './types';
import { LoginPage } from './components/auth/LoginPage';
import { Layout } from './components/layout/Layout';
import { ActiveTab } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ItemList } from './components/items/ItemList';
import { TransactionList } from './components/transactions/TransactionList';
import { BorrowView } from './components/transactions/BorrowView';
import { ReturnView } from './components/transactions/ReturnView';
import { UserList } from './components/users/UserList';
import { SettingsView } from './components/settings/SettingsView';
import { BorrowModal } from './components/transactions/BorrowModal';
import { ItemFormModal } from './components/items/ItemFormModal';

export const App: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const [items, setItems] = useState<Item[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Global modals
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [selectedBorrowItem, setSelectedBorrowItem] = useState<Item | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  // Sync data with storageService
  const loadData = () => {
    setItems(storageService.getItems());
    setTransactions(storageService.getTransactions());
    setUsers(storageService.getUsers());
  };

  useEffect(() => {
    storageService.init();
    loadData();

    // 1. Subscription event internal & BroadcastChannel lintas tab
    const unsubscribe = storageService.subscribe(() => {
      loadData();
    });

    // 2. Interval background auto-refresh (setiap 3 detik memastikan data selalu mutakhir)
    const intervalId = setInterval(() => {
      loadData();
    }, 3000);

    // 3. Auto-refresh saat tab kembali difokuskan oleh pengguna
    const handleFocus = () => loadData();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Role guard: If a staff user is on an admin-only tab, redirect to dashboard
  useEffect(() => {
    if (!isAdmin && (activeTab === 'users' || activeTab === 'settings')) {
      setActiveTab('dashboard');
    }
  }, [isAdmin, activeTab]);

  if (!currentUser) {
    return <LoginPage />;
  }

  // Handlers for Items
  const handleAddItem = (data: {
    code: string;
    name: string;
    category: string;
    stock: number;
    totalStock: number;
  }) => {
    return storageService.addItem(data);
  };

  const handleUpdateItem = (id: string, updates: Partial<Item>) => {
    return storageService.updateItem(id, updates);
  };

  const handleDeleteItem = (id: string) => {
    return storageService.deleteItem(id);
  };

  // Handlers for Transactions
  const handleBorrowSubmit = (params: {
    borrowerName: string;
    itemId: string;
    quantity: number;
    borrowDate: string;
    processedByUser: User;
    notes?: string;
  }) => {
    return storageService.borrowItem(params);
  };

  const handleReturnSubmit = (params: {
    transactionId: string;
    returnDate: string;
    returnedByUser: User;
    returnNotes?: string;
  }) => {
    return storageService.returnItem(params);
  };

  // Handlers for Users
  const handleAddUser = (userData: any) => {
    return storageService.addUser(userData);
  };

  const handleUpdateUser = (id: string, updates: any) => {
    return storageService.updateUser(id, updates);
  };

  const handleToggleUserStatus = (id: string) => {
    return storageService.toggleUserStatus(id);
  };

  const handleRequestBorrow = (item: Item) => {
    setSelectedBorrowItem(item);
    setIsBorrowModalOpen(true);
  };

  return (
    <Layout activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <DashboardView
          items={items}
          transactions={transactions}
          onNavigateTab={setActiveTab}
          onOpenBorrowModal={() => {
            setSelectedBorrowItem(null);
            setIsBorrowModalOpen(true);
          }}
          onOpenAddItemModal={() => setIsAddItemModalOpen(true)}
        />
      )}

      {activeTab === 'items' && (
        <ItemList
          items={items}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onBorrowItemRequest={handleRequestBorrow}
        />
      )}

      {activeTab === 'borrow' && (
        <BorrowView
          items={items}
          currentUser={currentUser}
          onBorrowSubmit={handleBorrowSubmit}
        />
      )}

      {activeTab === 'return' && (
        <ReturnView
          transactions={transactions}
          currentUser={currentUser}
          onReturnSubmit={handleReturnSubmit}
        />
      )}

      {activeTab === 'transactions' && (
        <TransactionList
          transactions={transactions}
          items={items}
          currentUser={currentUser}
          onBorrowSubmit={handleBorrowSubmit}
          onReturnSubmit={handleReturnSubmit}
          defaultFilter="ALL"
          title="Riwayat Lengkap Peminjaman & Pengembalian"
        />
      )}

      {activeTab === 'users' && isAdmin && (
        <UserList
          users={users}
          onAddUser={handleAddUser}
          onUpdateUser={handleUpdateUser}
          onToggleStatus={handleToggleUserStatus}
        />
      )}

      {activeTab === 'settings' && isAdmin && (
        <SettingsView />
      )}

      {/* Global Modals */}
      <BorrowModal
        isOpen={isBorrowModalOpen}
        onClose={() => {
          setIsBorrowModalOpen(false);
          setSelectedBorrowItem(null);
        }}
        items={items}
        currentUser={currentUser}
        onBorrowSubmit={handleBorrowSubmit}
        preselectedItem={selectedBorrowItem}
      />

      {isAdmin && (
        <ItemFormModal
          isOpen={isAddItemModalOpen}
          onClose={() => setIsAddItemModalOpen(false)}
          onSubmit={handleAddItem}
        />
      )}
    </Layout>
  );
};
