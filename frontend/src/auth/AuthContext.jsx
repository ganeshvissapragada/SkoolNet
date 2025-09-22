import React, { createContext, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const r = localStorage.getItem('role');
    const u = localStorage.getItem('userId');
    if (t) setToken(t);
    if (r) setRole(r);
    if (u) setUserId(Number(u));
  }, []);

  const login = (t, r, u) => {
    localStorage.setItem('token', t);
    localStorage.setItem('role', r);
    localStorage.setItem('userId', u);
    setToken(t);
    setRole(r);
    setUserId(u);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setToken(null);
    setRole(null);
    setUserId(null);
  };

  const value = useMemo(() => ({ token, role, userId, login, logout }), [token, role, userId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}