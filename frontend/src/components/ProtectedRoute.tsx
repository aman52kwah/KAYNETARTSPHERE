import { Navigate } from 'react-router-dom';
import useAuth from '../utils/hooks/useAuth'; // Custom hook

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { isAuthenticated, userRole } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" />;
  if (isAdmin && userRole !== 'admin') return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;