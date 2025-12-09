import { ShoppingCart, User, Package, Clock, CheckCircle2, Truck } from "lucide-react";

export type Service = {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: 'kiloan' | 'satuan' | 'express';
  icon: string;
  description?: string;
};

export type InventoryItem = {
  id: string;
  code: string;
  name: string;
  stock: number;
  unit: string;
  minStock: number;
  supplier: string;
  supplierContact: string;
  price: number;
  category: string;
};

export type OrderStatus = 'pending' | 'washing' | 'ready' | 'picked_up';

export type Order = {
  id: string;
  customerName: string;
  serviceItems: Service[];
  total: number;
  status: OrderStatus;
  date: string;
  paymentMethod: 'tunai' | 'qris' | 'debit';
};

export type Member = {
  id: string;
  name: string;
  phone: string;
  avatar: string; // Added avatar
  joinDate: string;
  expiryDate: string;
  points: number;
  totalSpend: number; // Added total spend (Total Transaksi)
};

export const services: Service[] = [
  { id: '1', name: 'Cuci Komplit', price: 7000, unit: 'kg', category: 'kiloan', icon: 'washing-machine', description: 'Cuci + Gosok + Parfum' },
  { id: '2', name: 'Setrika Saja', price: 4000, unit: 'kg', category: 'kiloan', icon: 'iron', description: 'Gosok + Parfum' },
  { id: '3', name: 'Bed Cover (S)', price: 15000, unit: 'pcs', category: 'satuan', icon: 'bed', description: 'Ukuran Single/Twin' },
  { id: '4', name: 'Bed Cover (L)', price: 25000, unit: 'pcs', category: 'satuan', icon: 'bed', description: 'Ukuran Queen/King' },
  { id: '5', name: 'Jas / Blazer', price: 20000, unit: 'pcs', category: 'satuan', icon: 'shirt', description: 'Dry Clean' },
  { id: '6', name: 'Boneka Medium', price: 10000, unit: 'pcs', category: 'satuan', icon: 'bear', description: 'Tinggi < 50cm' },
  { id: '7', name: 'Express 3 Jam', price: 15000, unit: 'kg', category: 'express', icon: 'timer', description: 'Selesai dalam 3 jam' },
  { id: '8', name: 'Karpet Tebal', price: 15000, unit: 'm2', category: 'satuan', icon: 'bed', description: 'Cuci Deep Clean' },
];

export const inventoryData: InventoryItem[] = [
  { id: '1', code: 'INV-001', name: 'Deterjen Liquid Premium', stock: 12, unit: 'liter', minStock: 5, supplier: 'CV. Bersih Jaya', supplierContact: '08123456789', price: 25000, category: 'Chemical' },
  { id: '2', code: 'INV-002', name: 'Parfum Laundry Sakura', stock: 3, unit: 'liter', minStock: 5, supplier: 'Toko Harum', supplierContact: '08198765432', price: 45000, category: 'Chemical' },
  { id: '3', code: 'INV-003', name: 'Plastik Packing 3kg', stock: 150, unit: 'pcs', minStock: 50, supplier: 'Mitra Plastik', supplierContact: '08134567890', price: 500, category: 'Packaging' },
  { id: '4', code: 'INV-004', name: 'Hanger Kawat', stock: 200, unit: 'pcs', minStock: 100, supplier: 'Grosir Laundry', supplierContact: '08156789012', price: 1200, category: 'Equipment' },
  { id: '5', code: 'INV-005', name: 'Label Tag Anti Air', stock: 500, unit: 'roll', minStock: 20, supplier: 'CV. Bersih Jaya', supplierContact: '08123456789', price: 15000, category: 'Equipment' },
];

export const recentOrders: Order[] = [
  { id: 'TRX-681', customerName: 'Budi Santoso', serviceItems: [services[0]], total: 21000, status: 'ready', date: '2023-10-25', paymentMethod: 'tunai' },
  { id: 'TRX-682', customerName: 'Siti Aminah', serviceItems: [services[2], services[5]], total: 35000, status: 'washing', date: '2023-10-25', paymentMethod: 'qris' },
  { id: 'TRX-683', customerName: 'Andi Pratama', serviceItems: [services[6]], total: 45000, status: 'pending', date: '2023-10-26', paymentMethod: 'debit' },
  { id: 'TRX-684', customerName: 'Dewi Lestari', serviceItems: [services[0]], total: 14000, status: 'picked_up', date: '2023-10-24', paymentMethod: 'tunai' },
  { id: 'TRX-685', customerName: 'Rina Wati', serviceItems: [services[1]], total: 12000, status: 'washing', date: '2023-10-26', paymentMethod: 'qris' },
];

export const members: Member[] = [
  { 
    id: 'M-001', 
    name: 'Budi Santoso', 
    phone: '081234567890', 
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60',
    joinDate: '2023-01-15', 
    expiryDate: '2024-01-15', 
    points: 150,
    totalSpend: 450000
  },
  { 
    id: 'M-002', 
    name: 'Siti Aminah', 
    phone: '081987654321', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
    joinDate: '2023-05-20', 
    expiryDate: '2024-05-20', 
    points: 20,
    totalSpend: 85000
  },
  { 
    id: 'M-003', 
    name: 'Rudi Hermawan', 
    phone: '081345678901', 
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
    joinDate: '2023-03-10', 
    expiryDate: '2024-03-10', 
    points: 540,
    totalSpend: 1250000
  },
  { 
    id: 'M-004', 
    name: 'Dewi Lestari', 
    phone: '081298765432', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60',
    joinDate: '2023-06-15', 
    expiryDate: '2024-06-15', 
    points: 80,
    totalSpend: 240000
  },
];
