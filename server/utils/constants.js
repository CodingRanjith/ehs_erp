export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  WORKER: 'worker',
};

export const ROLE_LIST = Object.values(ROLES);

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_INACTIVE: 'Your account has been deactivated. Please contact admin.',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'You do not have permission to perform this action',
  TOKEN_EXPIRED: 'Session expired. Please login again',
  TOKEN_INVALID: 'Invalid token',
  PASSWORD_RESET_SENT: 'If an account exists with this email, a reset link has been sent',
  PASSWORD_RESET_SUCCESS: 'Password has been reset successfully',
  INVALID_RESET_TOKEN: 'Invalid or expired reset token',
  USER_NOT_FOUND: 'User not found',
};

export const COOKIE_NAMES = {
  REFRESH_TOKEN: 'ehs_refresh_token',
};
