import { createContext, useContext, useState } from 'react';
import { catalogService, isSupabaseConfigured } from '../lib/catalogService';

const AuthContext = createContext(null);
const SESSION_KEY = 'lumiere_admin_session';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'));

  const login = async (email, password) => {
    try {
      const next = isSupabaseConfigured
        ? await catalogService.signIn(email, password)
        : email === 'admin@lumiere.ph' && password === 'admin123'
          ? { access_token: 'demo-session', user: { email } }
          : null;
      if (!next) return { success: false, message: 'Incorrect email or password.' };
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      setSession(next);
      return { success: true };
    } catch (error) { return { success: false, message: error.message }; }
  };
  const logout = () => { localStorage.removeItem(SESSION_KEY); setSession(null); };
  return <AuthContext.Provider value={{ session, login, logout, demoMode: !isSupabaseConfigured }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
