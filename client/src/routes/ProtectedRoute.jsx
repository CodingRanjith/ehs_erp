import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Loader from '../components/common/Loader.jsx';
import { ROUTES } from '../constants/routes.js';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isInitialized, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return <Loader fullScreen text="Verifying session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !hasRole(...allowedRoles)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default ProtectedRoute;
