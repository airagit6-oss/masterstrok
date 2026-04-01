import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ children }) => {
  const { isLoggedIn, hasSubscription } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!hasSubscription) {
    return <Navigate to="/subscription" replace />;
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
