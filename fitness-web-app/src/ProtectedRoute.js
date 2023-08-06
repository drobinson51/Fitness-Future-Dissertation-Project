import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ path, element }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? element : null;
};

export default ProtectedRoute;
