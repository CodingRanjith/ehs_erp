import api from './api.js';

const DASHBOARD_ENDPOINTS = {
  BASE: '/dashboard',
  OVERVIEW: '/dashboard/overview',
  CHARTS: '/dashboard/charts',
  RECENT: '/dashboard/recent',
};

export const dashboardService = {
  getDashboard: async () => {
    const { data } = await api.get(DASHBOARD_ENDPOINTS.BASE);
    return data;
  },

  getOverview: async () => {
    const { data } = await api.get(DASHBOARD_ENDPOINTS.OVERVIEW);
    return data;
  },

  getCharts: async () => {
    const { data } = await api.get(DASHBOARD_ENDPOINTS.CHARTS);
    return data;
  },

  getRecent: async () => {
    const { data } = await api.get(DASHBOARD_ENDPOINTS.RECENT);
    return data;
  },
};

export default dashboardService;
