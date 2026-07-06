import { AUTH_STORAGE_KEYS } from '../constants/routes.js';

const getStorage = (rememberMe) => (rememberMe ? localStorage : sessionStorage);

export const storage = {
  getToken() {
    return (
      localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN) ||
      sessionStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
    );
  },

  setToken(token, rememberMe = false) {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    getStorage(rememberMe).setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, token);
    localStorage.setItem(AUTH_STORAGE_KEYS.REMEMBER_ME, String(rememberMe));
  },

  removeToken() {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBER_ME);
  },

  getUser() {
    const raw =
      localStorage.getItem(AUTH_STORAGE_KEYS.USER) ||
      sessionStorage.getItem(AUTH_STORAGE_KEYS.USER);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setUser(user, rememberMe = false) {
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    getStorage(rememberMe).setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
  },

  removeUser() {
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  },

  isRememberMe() {
    return localStorage.getItem(AUTH_STORAGE_KEYS.REMEMBER_ME) === 'true';
  },

  clearAuth() {
    this.removeToken();
    this.removeUser();
  },
};

export default storage;
