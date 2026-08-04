import { Medicine, Order, User } from '../types';

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-101',
    name: 'Paracetamol 500mg (20 tablets)',
    description: 'For relief of mild to moderate pain and fever.',
    price: 3.99,
    category: 'Pain Relief',
    manufacturer: 'HealWell Pharma',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    stock: 150,
    requiresPrescription: false,
    pharmacyId: 'user-2',
    pharmacyName: 'GreenLeaf Pharmacy',
    rating: 4.7,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-102',
    name: 'Amoxicillin 500mg (10 capsules)',
    description: 'Antibiotic used to treat a number of bacterial infections.',
    price: 8.5,
    category: 'Antibiotics',
    manufacturer: 'CurePoint Labs',
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80',
    stock: 60,
    requiresPrescription: true,
    pharmacyId: 'user-2',
    pharmacyName: 'GreenLeaf Pharmacy',
    rating: 4.6,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-103',
    name: 'Cetirizine 10mg (10 tablets)',
    description: 'Antihistamine for allergy relief - sneezing, itching, runny nose.',
    price: 4.25,
    category: 'Allergy',
    manufacturer: 'HealWell Pharma',
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=800&q=80',
    stock: 90,
    requiresPrescription: false,
    pharmacyId: 'user-2',
    pharmacyName: 'GreenLeaf Pharmacy',
    rating: 4.8,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_USERS: User[] = [
  { id: 'user-1', name: 'Anni Rahman', email: 'anni@medigo.com', role: 'customer', address: '742 Evergreen Terrace', phone: '+1 555-0101', createdAt: new Date().toISOString() },
  { id: 'user-2', name: 'GreenLeaf Pharmacy', email: 'contact@greenleaf.com', role: 'pharmacy', pharmacyName: 'GreenLeaf Pharmacy', address: '12 Health Ave', phone: '+1 555-0102', createdAt: new Date().toISOString() },
  { id: 'user-3', name: 'MediGo Admin', email: 'admin@medigo.com', role: 'admin', address: 'MediGo HQ', createdAt: new Date().toISOString() },
];
