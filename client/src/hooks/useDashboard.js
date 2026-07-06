import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service.js';

export const DASHBOARD_QUERY_KEY = ['dashboard'];

export const useDashboard = () => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: async () => {
      const response = await dashboardService.getDashboard();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export default useDashboard;
