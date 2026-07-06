import { create } from 'zustand';
import { authService } from '../services/auth.service.js';
import storage from '../utils/storage.js';
import { getErrorMessage } from '../services/api.js';
import { ROLE_DASHBOARD_ROUTES } from '../constants/roles.js';

const getInitialState = () => {
  const user = storage.getUser();
  const token = storage.getToken();
  return {
    user,
    token,
    isAuthenticated: !!(user && token),
    rememberMe: storage.isRememberMe(),
  };
};

export const useAuthStore = create((set, get) => ({
  ...getInitialState(),
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    const { token, user } = get();

    if (!token) {
      set({ isInitialized: true });
      return;
    }

    try {
      set({ isLoading: true });
      const response = await authService.getProfile();
      const profileUser = response.data.user;
      const rememberMe = storage.isRememberMe();
      storage.setUser(profileUser, rememberMe);
      set({
        user: profileUser,
        isAuthenticated: true,
        isInitialized: true,
        isLoading: false,
      });
    } catch {
      storage.clearAuth();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
      });
    }
  },

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login(credentials);
      const { user, accessToken, rememberMe } = response.data;

      storage.setToken(accessToken, rememberMe);
      storage.setUser(user, rememberMe);

      set({
        user,
        token: accessToken,
        isAuthenticated: true,
        rememberMe,
        isLoading: false,
        error: null,
      });

      return { success: true, user };
    } catch (error) {
      const message = getErrorMessage(error);
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await authService.logout();
    } catch {
      // Clear local session even if API call fails
    } finally {
      storage.clearAuth();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        rememberMe: false,
        isLoading: false,
        error: null,
      });
    }
  },

  forgotPassword: async (email) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.forgotPassword(email);
      set({ isLoading: false });
      return { success: true, message: response.message };
    } catch (error) {
      const message = getErrorMessage(error);
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  resetPassword: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.resetPassword(payload);
      set({ isLoading: false });
      return { success: true, message: response.message };
    } catch (error) {
      const message = getErrorMessage(error);
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  hasRole: (...roles) => {
    const { user } = get();
    return user ? roles.includes(user.role) : false;
  },

  getDashboardRoute: () => {
    const { user } = get();
    if (!user) return '/login';
    return ROLE_DASHBOARD_ROUTES[user.role] || '/dashboard';
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
