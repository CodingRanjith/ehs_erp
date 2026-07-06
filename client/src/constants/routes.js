export const ROUTES = {
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  HOME: '/',
};

export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'ehs_access_token',
  USER: 'ehs_user',
  REMEMBER_ME: 'ehs_remember_me',
};
