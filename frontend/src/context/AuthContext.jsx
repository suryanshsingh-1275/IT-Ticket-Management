import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

// This context stores the logged-in user and the functions to
// log in, register and log out. Any component can read it with useAuth().
const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

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
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  function saveSession(data) {
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  }

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    return saveSession(res.data);
  }

  async function register(form) {
    const res = await api.post('/auth/register', form);
    return saveSession(res.data);
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  const value = { user, setUser, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}