import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user`, { withCredentials: true });
        setIsAuthenticated(true);
        setUserRole(res.data.role);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  return { isAuthenticated, userRole };
};

export default useAuth;