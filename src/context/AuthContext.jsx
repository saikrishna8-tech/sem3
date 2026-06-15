import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

const USER_KEY = 'ecommerce_user';
const TOKEN_KEY = 'auth_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const persistSession = (authData) => {
    const sessionUser = {
      id: authData.id,
      email: authData.email,
      name: authData.name,
      role: authData.role,
    };
    setUser(sessionUser);
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    localStorage.setItem(TOKEN_KEY, authData.token);
    return sessionUser;
  };

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    return persistSession(data);
  };

  const signup = async (name, email, password) => {
    const data = await authApi.register(name, email, password);
    return persistSession(data);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const isAdmin = () => user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
