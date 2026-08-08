import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('findora_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (token) {
      authAPI.getMe()
        .then((res) => {
          if (isMounted) setUser(res.data);
        })
        .catch(() => {
          if (isMounted) {
            localStorage.removeItem('findora_token');
            setUser(null);
          }
        });
    }
    return () => { isMounted = false; };
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('findora_token', access_token);
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const register = async (email, password, fullName) => {
    const res = await authAPI.register({ email, password, full_name: fullName });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('findora_token', access_token);
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('findora_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
