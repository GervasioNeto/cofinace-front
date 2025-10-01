import { UserDTO, GroupDTO, TransactionDTO, CreateUserDTO, CreateGroupDTO, CreateTransactionDTO } from '@/types';

const API_BASE_URL = 'http://localhost:3002/api';

// Users
export const api = {
  users: {
    create: async (data: CreateUserDTO): Promise<UserDTO> => {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    
    getAll: async (): Promise<UserDTO[]> => {
      const response = await fetch(`${API_BASE_URL}/users`);
      return response.json();
    },
    
    getUserGroups: async (userId: string): Promise<GroupDTO[]> => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/groups`);
      return response.json();
    },
    
    getUserTransactions: async (userId: string): Promise<TransactionDTO[]> => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/transactions`);
      return response.json();
    },
  },
  
  groups: {
    create: async (data: CreateGroupDTO): Promise<GroupDTO> => {
      const response = await fetch(`${API_BASE_URL}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    
    getAll: async (): Promise<GroupDTO[]> => {
      const response = await fetch(`${API_BASE_URL}/groups`);
      return response.json();
    },
    
    addUserToGroup: async (groupId: string, userId: string): Promise<void> => {
      await fetch(`${API_BASE_URL}/groups/${groupId}/users/${userId}`, {
        method: 'POST',
      });
    },
    
    getGroupUsers: async (groupId: string): Promise<UserDTO[]> => {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/users`);
      return response.json();
    },
    
    getGroupTransactions: async (groupId: string): Promise<TransactionDTO[]> => {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/transactions`);
      return response.json();
    },
    
    update: async (groupId: string, data: Partial<CreateGroupDTO>): Promise<GroupDTO> => {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    
    delete: async (groupId: string): Promise<void> => {
      await fetch(`${API_BASE_URL}/groups/${groupId}`, {
        method: 'DELETE',
      });
    },
  },
  
  transactions: {
    create: async (groupId: string, data: CreateTransactionDTO): Promise<TransactionDTO> => {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    
    update: async (transactionId: string, data: Partial<CreateTransactionDTO>): Promise<TransactionDTO> => {
      const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    
    delete: async (transactionId: string): Promise<void> => {
      await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
        method: 'DELETE',
      });
    },
  },
};
