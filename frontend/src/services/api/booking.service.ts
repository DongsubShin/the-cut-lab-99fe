import { api } from './axios-instance';
import { Booking, Service, QueueEntry, DashboardStats } from '../../types';

export const bookingService = {
  getServices: () => api.get<Service[]>('/services').then(res => res.data),
  
  getBookings: () => api.get<Booking[]>('/bookings').then(res => res.data),
  
  getQueue: () => api.get<QueueEntry[]>('/queue').then(res => res.data),
  
  getDashboardStats: () => api.get<DashboardStats>('/admin/stats').then(res => res.data),
  
  createBooking: (data: Partial<Booking>) => 
    api.post<Booking>('/bookings', data).then(res => res.data),
    
  joinQueue: (data: { clientName: string; serviceId: string }) =>
    api.post<QueueEntry>('/queue/join', data).then(res => res.data),
};