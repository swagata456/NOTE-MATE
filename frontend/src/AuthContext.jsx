import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { clearSession, getStoredUser, saveSession, setUnauthorizedHandler } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const login = useCallback((token, userInfo) => {
    saveSession(token, userInfo);
    setUser(userInfo);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  // If the server rejects our token (expired), log out automatically.
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
