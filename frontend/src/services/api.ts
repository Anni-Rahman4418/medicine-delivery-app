import axios from 'axios';
import { Medicine, Order, User, Prescription } from '../types';
import { INITIAL_MEDICINES, INITIAL_ORDERS, INITIAL_USERS } from '../data/mockData';

const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_BASE = `${API_ROOT}/api`;

const STORAGE_KEYS = {
  MEDICINES: 'mg_medicines',
  ORDERS: 'mg_orders',
  USERS: 'mg_users',
  PRESCRIPTIONS: 'mg_prescriptions',
  CART: 'mg_cart',
};

const getStored = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

export const apiService = {
  async checkBackendHealth(): Promise<boolean> {
    try {
      const res = await axios.get(`${API_ROOT}/`, { timeout: 2500 });
      return res.status === 200;
    } catch {
      return false;
    }
  },

  // AUTH
  async login(email: string, password: string) {
    const res = await axios.post(`${API_BASE}/login`, { email, password }, { timeout: 3000 });
    return res.data;
  },

  async register(userData: { name: string; email: string; password: string; role: string; pharmacyName?: string; address?: string; phone?: string }) {
    const res = await axios.post(`${API_BASE}/register`, userData, { timeout: 3000 });
    return res.data;
  },

  // MEDICINES CRUD
  async getMedicines(): Promise<Medicine[]> {
    try {
      const res = await axios.get(`${API_BASE}/medicines`, { timeout: 3000 });
      setStored(STORAGE_KEYS.MEDICINES, res.data);
      return res.data;
    } catch {
      return getStored<Medicine[]>(STORAGE_KEYS.MEDICINES, INITIAL_MEDICINES);
    }
  },

  async createMedicine(data: Omit<Medicine, 'id' | 'createdAt'>): Promise<Medicine> {
    try {
      const res = await axios.post(`${API_BASE}/medicines`, data, { timeout: 3000 });
      return res.data;
    } catch {
      const newMed: Medicine = { ...data, id: `med-${Date.now()}`, createdAt: new Date().toISOString() };
      const meds = getStored<Medicine[]>(STORAGE_KEYS.MEDICINES, INITIAL_MEDICINES);
      setStored(STORAGE_KEYS.MEDICINES, [newMed, ...meds]);
      return newMed;
    }
  },

  async updateMedicine(id: string, updates: Partial<Medicine>): Promise<Medicine> {
    try {
      const res = await axios.put(`${API_BASE}/medicines/${id}`, updates, { timeout: 3000 });
      return res.data;
    } catch {
      const meds = getStored<Medicine[]>(STORAGE_KEYS.MEDICINES, INITIAL_MEDICINES);
      const index = meds.findIndex((m) => m.id === id);
      if (index === -1) throw new Error('Medicine not found');
      meds[index] = { ...meds[index], ...updates };
      setStored(STORAGE_KEYS.MEDICINES, meds);
      return meds[index];
    }
  },

  async deleteMedicine(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE}/medicines/${id}`, { timeout: 3000 });
      return true;
    } catch {
      const meds = getStored<Medicine[]>(STORAGE_KEYS.MEDICINES, INITIAL_MEDICINES);
      setStored(STORAGE_KEYS.MEDICINES, meds.filter((m) => m.id !== id));
      return true;
    }
  },

  // PRESCRIPTIONS
  async getPrescriptions(userId?: string): Promise<Prescription[]> {
    try {
      const res = await axios.get(`${API_BASE}/prescriptions`, { params: userId ? { user_id: userId } : {}, timeout: 3000 });
      setStored(STORAGE_KEYS.PRESCRIPTIONS, res.data);
      return res.data;
    } catch {
      const all = getStored<Prescription[]>(STORAGE_KEYS.PRESCRIPTIONS, []);
      return userId ? all.filter((p) => p.userId === userId) : all;
    }
  },

  async uploadPrescription(userId: string, userName: string, imageUrl: string): Promise<Prescription> {
    try {
      const res = await axios.post(`${API_BASE}/prescriptions`, { userId, userName, imageUrl }, { timeout: 3000 });
      return res.data;
    } catch {
      const newPresc: Prescription = {
        id: `presc-${Date.now()}`,
        userId,
        userName,
        imageUrl,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };
      const all = getStored<Prescription[]>(STORAGE_KEYS.PRESCRIPTIONS, []);
      setStored(STORAGE_KEYS.PRESCRIPTIONS, [newPresc, ...all]);
      return newPresc;
    }
  },

  async reviewPrescription(id: string, status: 'Approved' | 'Rejected', notes?: string): Promise<Prescription> {
    try {
      const res = await axios.put(`${API_BASE}/prescriptions/${id}`, { status, notes }, { timeout: 3000 });
      return res.data;
    } catch {
      const all = getStored<Prescription[]>(STORAGE_KEYS.PRESCRIPTIONS, []);
      const index = all.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Prescription not found');
      all[index] = { ...all[index], status, notes };
      setStored(STORAGE_KEYS.PRESCRIPTIONS, all);
      return all[index];
    }
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    try {
      const res = await axios.get(`${API_BASE}/orders`, { timeout: 3000 });
      setStored(STORAGE_KEYS.ORDERS, res.data);
      return res.data;
    } catch {
      return getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    }
  },

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    // this can legitimately fail with a real error (e.g. missing prescription
    // approval) - don't silently fall back to local storage in that case
    const res = await axios.post(`${API_BASE}/orders`, orderData, { timeout: 3000 });
    return res.data;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    try {
      const res = await axios.put(`${API_BASE}/orders/${id}`, { status }, { timeout: 3000 });
      return res.data;
    } catch {
      const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      const index = orders.findIndex((o) => o.id === id);
      if (index === -1) throw new Error('Order not found');
      orders[index].status = status;
      setStored(STORAGE_KEYS.ORDERS, orders);
      return orders[index];
    }
  },

  // USERS
  async getUsers(): Promise<User[]> {
    try {
      const res = await axios.get(`${API_BASE}/users`, { timeout: 3000 });
      setStored(STORAGE_KEYS.USERS, res.data);
      return res.data;
    } catch {
      return getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
  },

  async deleteUser(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE}/users/${id}`, { timeout: 3000 });
      return true;
    } catch {
      const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      setStored(STORAGE_KEYS.USERS, users.filter((u) => u.id !== id));
      return true;
    }
  },
};

export const cartStorage = {
  get(): { medicineId: string; quantity: number }[] {
    return getStored(STORAGE_KEYS.CART, []);
  },
  set(cart: { medicineId: string; quantity: number }[]) {
    setStored(STORAGE_KEYS.CART, cart);
  },
};
