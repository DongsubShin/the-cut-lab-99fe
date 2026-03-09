import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../services/api/booking.service';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: bookingService.getDashboardStats,
  });
};

export const useQueue = () => {
  return useQuery({
    queryKey: ['live-queue'],
    queryFn: bookingService.getQueue,
    refetchInterval: 30000, // Refresh every 30s
  });
};