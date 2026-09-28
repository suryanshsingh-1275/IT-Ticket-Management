import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import api from '../api';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((response) => {
        const user = response.data.user;

        setUser(user);
      })
      .catch((error) => {
        localStorage.removeItem('token');
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);

 const saveSession = ({ token, user }) => {
    localStorage.setItem('token', token);

    setUser(user);

    return user;
  };

  