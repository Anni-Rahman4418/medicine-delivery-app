export type UserRole = 'customer' | 'pharmacy' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  pharmacyName?: string;
  address?: string;
  phone?: string;
  createdAt: string;
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Pain Relief' | 'Antibiotics' | 'Allergy' | 'Vitamins' | 'Diabetes Care' | 'Skin Care' | 'First Aid';
  manufacturer?: string;
  imageUrl: string;
  stock: number;
  requiresPrescription: boolean;
  pharmacyId: string;
  pharmacyName: string;
  rating: number;
  createdAt: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export type PrescriptionStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Prescription {
  id: string;
  userId: string;
  userName: string;
  imageUrl: string;
  status: PrescriptionStatus;
  notes?: string;
  createdAt: string;
}

export type OrderStatus = 'Placed' | 'Confirmed' | 'Packed' | 'Out For Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userAddress: string;
  userPhone: string;
  items: { medicineId: string; name: string; price: number; quantity: number }[];
  prescriptionId?: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'Credit Card' | 'Cash on Delivery' | 'Mobile Wallet';
  status: OrderStatus;
  estimatedDeliveryTime: string;
  courierName?: string;
  courierPhone?: string;
  createdAt: string;
}
