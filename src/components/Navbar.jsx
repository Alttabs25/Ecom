import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from './Icons';
import logo from '../assets/LOGO.jpg';

export function Brand({ compact = false }) {
  return <Link className="brand" to="/" aria-label="Make It KMN home"><span className="brand-mark" aria-hidden="true"><img src={logo} alt="" /></span>{!compact && <span><b>Make It KMN</b><small>PERSONALIZED KEEPSAKES</small></span>}</Link>;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 16); onScroll(); window.addEventListener('scroll', onScroll); return () => window.removeEventListener('scroll', onScroll); }, []);
  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => document.body.classList.remove('nav-open');
  }, [open]);
  if (location.pathname.startsWith('/admin')) return null;
  const links = [['Home', '#home'], ['Products', '#products'], ['Categories', '#categories'], ['About', '#about']];
  const go = (hash) => { setOpen(false); setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 30); };
  return <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
    <div className="nav-inner">
      <Brand />
      <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Main navigation">
        {links.map(([label, hash]) => <Link key={hash} to={`/${hash}`} onClick={() => go(hash)}>{label}</Link>)}
      </nav>
      {open && <button className="mobile-nav-backdrop" onClick={() => setOpen(false)} aria-label="Close navigation" />}
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}><Icon name={open ? 'close' : 'menu'} size={24} /></button>
    </div>
  </header>;
}
