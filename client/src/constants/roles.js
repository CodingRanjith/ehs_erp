export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  WORKER: 'worker',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.STAFF]: 'Staff',
  [ROLES.WORKER]: 'Worker',
};

export const ROLE_LIST = Object.values(ROLES);

export const ROLE_DASHBOARD_ROUTES = {
  [ROLES.ADMIN]: '/dashboard',
  [ROLES.MANAGER]: '/dashboard',
  [ROLES.STAFF]: '/dashboard',
  [ROLES.WORKER]: '/dashboard',
};
