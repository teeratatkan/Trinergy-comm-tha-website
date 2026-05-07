import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('trinergy_token'));
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem('trinergy_token');
    if (t) {
      try {
        const payload = JSON.parse(atob(t.split('.')[1]));
        return payload;
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (newToken) => {
    localStorage.setItem('trinergy_token', newToken);
    setToken(newToken);
    try {
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      setUser(payload);
    } catch {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('trinergy_token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
