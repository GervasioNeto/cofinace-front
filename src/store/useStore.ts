import { create } from 'zustand';
import { UserDTO, GroupDTO, TransactionDTO } from '@/types';

interface AppState {
  currentUser: UserDTO | null;
  groups: GroupDTO[];
  transactions: TransactionDTO[];
  
  // User actions
  setCurrentUser: (user: UserDTO | null) => void;
  logout: () => void;
  
  // Group actions
  setGroups: (groups: GroupDTO[]) => void;
  addGroup: (group: GroupDTO) => void;
  updateGroup: (groupId: string, group: Partial<GroupDTO>) => void;
  deleteGroup: (groupId: string) => void;
  
  // Transaction actions
  setTransactions: (transactions: TransactionDTO[]) => void;
  addTransaction: (transaction: TransactionDTO) => void;
  updateTransaction: (transactionId: string, transaction: Partial<TransactionDTO>) => void;
  deleteTransaction: (transactionId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  groups: [],
  transactions: [],
  
  // User actions
  setCurrentUser: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),
  
  // Group actions
  setGroups: (groups) => set({ groups }),
  addGroup: (group) => set((state) => ({ 
    groups: [...state.groups, group] 
  })),
  updateGroup: (groupId, updatedGroup) => set((state) => ({
    groups: state.groups.map(g => g.id === groupId ? { ...g, ...updatedGroup } : g)
  })),
  deleteGroup: (groupId) => set((state) => ({
    groups: state.groups.filter(g => g.id !== groupId)
  })),
  
  // Transaction actions
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) => set((state) => ({ 
    transactions: [...state.transactions, transaction] 
  })),
  updateTransaction: (transactionId, updatedTransaction) => set((state) => ({
    transactions: state.transactions.map(t => t.id === transactionId ? { ...t, ...updatedTransaction } : t)
  })),
  deleteTransaction: (transactionId) => set((state) => ({
    transactions: state.transactions.filter(t => t.id !== transactionId)
  })),
}));
