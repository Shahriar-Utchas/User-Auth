import { Navigate } from 'react-router';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) return <p>Loading...</p>;

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
