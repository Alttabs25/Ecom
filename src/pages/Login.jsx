import { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brand } from '../components/Navbar';
import { Icon } from '../components/Icons';

export default function Login() {
  const { session, login, demoMode } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(demoMode ? 'admin@lumiere.ph' : '');
  const [password, setPassword] = useState(demoMode ? 'admin123' : '');
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  if (session) return <Navigate to="/admin" replace />;
  const submit = async (e) => { e.preventDefault(); setLoading(true); setError(''); const result = await login(email, password); setLoading(false); result.success ? navigate('/admin') : setError(result.message); };
  return <main className="login-page"><Link className="back-link" to="/"><span>←</span> Back to catalog</Link><div className="login-card"><Brand /><span className="login-icon"><Icon name="sparkles" /></span><h1>Welcome back</h1><p>Sign in to manage your product catalog.</p><form onSubmit={submit}><label>Email address<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>{error && <p className="form-error">{error}</p>}<button className="button button-primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign in securely'}</button></form>{demoMode && <div className="demo-note"><b>Preview mode</b><span>Demo credentials are filled in. Connect Supabase for production authentication.</span></div>}</div></main>;
}
