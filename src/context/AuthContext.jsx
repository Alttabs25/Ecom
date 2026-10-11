import { createContext, useCallback, useContext, useState } from 'react';
import { catalogService, isSupabaseConfigured } from '../lib/catalogService';

const AuthContext = createContext(null);
export const AUTH_SESSION_KEY = 'make_it_kmn_admin_session';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || 'null'));

  const storeSession = useCallback((next) => {
    localStorage.removeItem('lumiere_admin_session');
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(next));
    setSession(next);
    return next;
  }, []);

  const login = async (email, password) => {
    try {
      const next = isSupabaseConfigured
        ? await catalogService.signIn(email, password)
        : email === 'admin@makeitkmn.ph' && password === 'admin123'
          ? { access_token: 'demo-session', user: { email } }
          : null;
      if (!next) return { success: false, message: 'Incorrect email or password.' };
      storeSession(next);
      return { success: true };
    } catch (error) { return { success: false, message: error.message }; }
  };
  const logout = useCallback(() => { localStorage.removeItem(AUTH_SESSION_KEY); localStorage.removeItem('lumiere_admin_session'); setSession(null); }, []);
  const getAccessToken = useCallback(async () => {
    const current = JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || 'null');
    if (!current?.access_token) throw new Error('Your admin session is missing. Please sign in again.');
    if (!isSupabaseConfigured || current.access_token === 'demo-session') return current.access_token;
    const expiresAt = Number(current.expires_at || 0);
    if (!expiresAt || expiresAt * 1000 > Date.now() + 30_000) return current.access_token;
    if (!current.refresh_token) { logout(); throw new Error('Your admin session has expired. Please sign in again.'); }
    try {
      const refreshed = await catalogService.refreshSession(current.refresh_token);
      return storeSession(refreshed).access_token;
    } catch {
      logout();
      throw new Error('Your admin session has expired. Please sign in again.');
    }
  }, [logout, storeSession]);
  return <AuthContext.Provider value={{ session, login, logout, getAccessToken, demoMode: !isSupabaseConfigured }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
