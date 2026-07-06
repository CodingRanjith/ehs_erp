import { useAuthStore } from '../store/authStore.js';
import { ROLES } from '../constants/roles.js';

export const useAuth = () => {
  const store = useAuthStore();

  return {
    ...store,
    isAdmin: store.hasRole(ROLES.ADMIN),
    isManager: store.hasRole(ROLES.MANAGER),
    isStaff: store.hasRole(ROLES.STAFF),
    isWorker: store.hasRole(ROLES.WORKER),
  };
};

export default useAuth;
