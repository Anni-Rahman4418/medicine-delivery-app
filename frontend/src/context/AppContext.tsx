import React, { createContext, useContext, useState, useEffect } from 'react';
import { Medicine, User, Order, CartItem, Prescription } from '../types';
import { apiService } from '../services/api';
import { INITIAL_USERS } from '../data/mockData';

export type ActiveViewMode = 'marketplace' | 'pharmacy' | 'admin';

interface AppContextType {
  activeView: ActiveViewMode;
  setActiveView: (view: ActiveViewMode) => void;
  isBackendOnline: boolean;

  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: string; pharmacyName?: string; address?: string; phone?: string }) => Promise<void>;
  logout: () => void;
  deleteUser: (id: string) => Promise<void>;

  medicines: Medicine[];
  isLoadingMedicines: boolean;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addMedicine: (m: Omit<Medicine, 'id' | 'createdAt'>) => Promise<Medicine>;
  updateMedicine: (id: string, m: Partial<Medicine>) => Promise<Medicine>;
  deleteMedicine: (id: string) => Promise<void>;

  cart: CartItem[];
  addToCart: (medicine: Medicine, quantity?: number) => void;
  updateCartQuantity: (medicineId: string, quantity: number) => void;
  removeFromCart: (medicineId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartRequiresPrescription: boolean;

  prescriptions: Prescription[];
  myApprovedPrescription: Prescription | null;
  uploadPrescription: (file: File) => Promise<Prescription>;
  reviewPrescription: (id: string, status: 'Approved' | 'Rejected', notes?: string) => Promise<void>;

  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  placeOrder: (paymentMethod: Order['paymentMethod'], address: string, phone: string) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isPrescriptionModalOpen: boolean;
  setIsPrescriptionModalOpen: (open: boolean) => void;
  editingMedicine: Medicine | null;
  setEditingMedicine: (m: Medicine | null) => void;
  isMedicineFormOpen: boolean;
  setIsMedicineFormOpen: (open: boolean) => void;
  selectedMedicineDetail: Medicine | null;
  setSelectedMedicineDetail: (m: Medicine | null) => void;
  toast: { message: string; type: 'success' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveViewMode>('marketplace');
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoadingMedicines, setIsLoadingMedicines] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [isMedicineFormOpen, setIsMedicineFormOpen] = useState(false);
  const [selectedMedicineDetail, setSelectedMedicineDetail] = useState<Medicine | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    (async () => {
      const online = await apiService.checkBackendHealth();
      setIsBackendOnline(online);

      setIsLoadingMedicines(true);
      const [meds, allUsers, allOrders] = await Promise.all([
        apiService.getMedicines(),
        apiService.getUsers(),
        apiService.getOrders(),
      ]);
      setMedicines(meds);
      setUsers(allUsers);
      setOrders(allOrders);
      setIsLoadingMedicines(false);
    })();
  }, []);

  useEffect(() => {
    if (currentUser) {
      apiService.getPrescriptions(currentUser.id).then(setPrescriptions);
    }
  }, [currentUser]);

  // AUTH
  const login = async (email: string, password: string) => {
    const res = await apiService.login(email, password);
    const user = users.find((u) => u.id === res.user.id) || res.user;
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name.split(' ')[0]}!`);
  };

  const register = async (data: { name: string; email: string; password: string; role: string; pharmacyName?: string; address?: string; phone?: string }) => {
    const res = await apiService.register(data);
    const newUser: User = { ...data, id: res.id, role: data.role as User['role'], createdAt: new Date().toISOString() };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast('Account created!');
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('marketplace');
  };

  const deleteUser = async (id: string) => {
    await apiService.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast('User removed');
  };

  // MEDICINES
  const addMedicine = async (m: Omit<Medicine, 'id' | 'createdAt'>) => {
    const created = await apiService.createMedicine(m);
    setMedicines((prev) => [created, ...prev]);
    showToast('Medicine added');
    return created;
  };

  const updateMedicine = async (id: string, m: Partial<Medicine>) => {
    const updated = await apiService.updateMedicine(id, m);
    setMedicines((prev) => prev.map((med) => (med.id === id ? updated : med)));
    showToast('Medicine updated');
    return updated;
  };

  const deleteMedicine = async (id: string) => {
    await apiService.deleteMedicine(id);
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    showToast('Medicine removed');
  };

  // CART
  const addToCart = (medicine: Medicine, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map((item) =>
          item.medicine.id === medicine.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { medicine, quantity }];
    });
    showToast(`${medicine.name} added to cart`);
  };

  const updateCartQuantity = (medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.medicine.id === medicineId ? { ...item, quantity } : item)));
  };

  const removeFromCart = (medicineId: string) => {
    setCart((prev) => prev.filter((item) => item.medicine.id !== medicineId));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);
  const cartRequiresPrescription = cart.some((item) => item.medicine.requiresPrescription);
  const myApprovedPrescription = prescriptions.find((p) => p.status === 'Approved') || null;

  // PRESCRIPTIONS
  const uploadPrescription = async (file: File) => {
    if (!currentUser) throw new Error('Must be logged in');
    const presc = await apiService.uploadPrescription(currentUser.id, currentUser.name, file);
    setPrescriptions((prev) => [presc, ...prev]);
    showToast('Prescription uploaded - waiting for approval');
    return presc;
  };

  const reviewPrescription = async (id: string, status: 'Approved' | 'Rejected', notes?: string) => {
    const updated = await apiService.reviewPrescription(id, status, notes);
    setPrescriptions((prev) => prev.map((p) => (p.id === id ? updated : p)));
    showToast(`Prescription ${status.toLowerCase()}`);
  };

  // ORDERS
  const placeOrder = async (paymentMethod: Order['paymentMethod'], address: string, phone: string) => {
    if (!currentUser) throw new Error('Must be logged in');

    const deliveryFee = 2.5;
    const order = await apiService.createOrder({
      userId: currentUser.id,
      userName: currentUser.name,
      userAddress: address,
      userPhone: phone,
      items: cart.map((item) => ({
        medicineId: item.medicine.id,
        name: item.medicine.name,
        price: item.medicine.price,
        quantity: item.quantity,
      })),
      prescriptionId: cartRequiresPrescription ? myApprovedPrescription?.id : undefined,
      subtotal: cartTotal,
      deliveryFee,
      totalAmount: cartTotal + deliveryFee,
      paymentMethod,
      status: 'Placed',
      estimatedDeliveryTime: '45 mins',
    });

    setOrders((prev) => [order, ...prev]);
    setActiveOrder(order);

    // Deduct stock in local state
    setMedicines((prev) =>
      prev.map((m) => {
        const cartMatch = cart.find((ci) => ci.medicine.id === m.id);
        if (cartMatch) {
          return { ...m, stock: Math.max(0, m.stock - cartMatch.quantity) };
        }
        return m;
      })
    );

    clearCart();
    showToast('Order placed!');
    return order;
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    const updated = await apiService.updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
  };

  return (
    <AppContext.Provider
      value={{
        activeView, setActiveView, isBackendOnline,
        currentUser, users, login, register, logout, deleteUser,
        medicines, isLoadingMedicines, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery,
        addMedicine, updateMedicine, deleteMedicine,
        cart, addToCart, updateCartQuantity, removeFromCart, clearCart, cartTotal, cartRequiresPrescription,
        prescriptions, myApprovedPrescription, uploadPrescription, reviewPrescription,
        orders, activeOrder, setActiveOrder, placeOrder, updateOrderStatus,
        isCartOpen, setIsCartOpen, isAuthOpen, setIsAuthOpen,
        isPrescriptionModalOpen, setIsPrescriptionModalOpen,
        editingMedicine, setEditingMedicine, isMedicineFormOpen, setIsMedicineFormOpen,
        selectedMedicineDetail, setSelectedMedicineDetail, toast, showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
