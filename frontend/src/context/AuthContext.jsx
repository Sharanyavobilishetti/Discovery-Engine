import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetch('http://localhost:8000/api/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Token expired');
      })
      .then(userData => setUser(userData))
      .catch(() => logout());
    }
  }, [token]);

  const login = (data) => {
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    setIsAuthOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthOpen, setIsAuthOpen }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
