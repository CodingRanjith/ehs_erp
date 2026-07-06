import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Loader from '../components/common/Loader.jsx';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isInitialized, getDashboardRoute } = useAuth();

  if (!isInitialized) {
    return <Loader fullScreen text="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={getDashboardRoute()} replace />;
  }

  return children;
};

export default PublicRoute;
