export type UserRole = 'admin' | 'barber' | 'client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export interface Booking {
  id: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
}

export interface QueueEntry {
  id: string;
  clientName: string;
  serviceId: string;
  status: 'waiting' | 'in-progress' | 'completed';
  estimatedWaitMinutes: number;
  joinedAt: string;
}

export interface DashboardStats {
  todayRevenue: number;
  activeBookings: number;
  queueCount: number;
  commissionEarned: number;
}