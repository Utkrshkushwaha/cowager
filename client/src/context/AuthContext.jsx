import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('cowager_user');
    const token = localStorage.getItem('cowager_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('cowager_token', data.token);
    localStorage.setItem('cowager_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (formData) => {
    const { data } = await API.post('/auth/register', formData);
    localStorage.setItem('cowager_token', data.token);
    localStorage.setItem('cowager_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('cowager_token');
    localStorage.removeItem('cowager_user');
    setUser(null);
  };

  const isCustomer = user?.role === 'customer';
  const isWorker   = user?.role === 'worker';
  const isAdmin    = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isCustomer, isWorker, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
