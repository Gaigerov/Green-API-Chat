import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import GreenApiService from '../services/greenApi';
import { Credentials } from '../types';

interface AuthContextType {
  credentials: Credentials | null;
  apiService: GreenApiService | null;
  login: (apiUrl: string, idInstance: string, apiTokenInstance: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = 'green_api_credentials';

function makeService(creds: Credentials) {
  return new GreenApiService(creds);
}

export function AuthProvider({ children, ...props }: { children: ReactNode; [k: string]: unknown }) {
  const [credentials, setCredentials] = useState<Credentials | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) as Credentials : null;
    } catch { return null; }
  });

  const [apiService, setApiService] = useState<GreenApiService | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return makeService(JSON.parse(stored) as Credentials);
    } catch { /* ignore */ }
    return null;
  });

  const login = useCallback((apiUrl: string, idInstance: string, apiTokenInstance: string) => {
    const creds: Credentials = { apiUrl, idInstance, apiTokenInstance };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
    setCredentials(creds);
    setApiService(makeService(creds));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCredentials(null);
    setApiService(null);
  }, []);

  return (
    <AuthContext.Provider value={{ credentials, apiService, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
