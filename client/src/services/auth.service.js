import api from './api.js';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ME: '/auth/me',
  REFRESH: '/auth/refresh-token',
};

export const authService = {
  login: async (credentials) => {
    const { data } = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
    return data;
  },

  logout: async () => {
    const { data } = await api.post(AUTH_ENDPOINTS.LOGOUT);
    return data;
  },

  forgotPassword: async (email) => {
    const { data } = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    return data;
  },

  resetPassword: async (payload) => {
    const { data } = await api.post(AUTH_ENDPOINTS.RESET_PASSWORD, payload);
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get(AUTH_ENDPOINTS.ME);
    return data;
  },

  refreshToken: async () => {
    const { data } = await api.post(AUTH_ENDPOINTS.REFRESH);
    return data;
  },
};

export default authService;
