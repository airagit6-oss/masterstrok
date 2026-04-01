import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ResellerGuardProps {
  children: React.ReactNode;
}

const ResellerGuard: React.FC<ResellerGuardProps> = ({ children }) => {
  const { isLoggedIn, isReseller } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isReseller) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ResellerGuard;
