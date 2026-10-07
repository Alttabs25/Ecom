import { NavLink } from 'react-router-dom';
import { Brand } from './Navbar';
import { Icon } from './Icons';

export default function AdminSidebar({ onLogout, open, onClose }) {
  return <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
    <div className="sidebar-head"><Brand /><button onClick={onClose} aria-label="Close sidebar"><Icon name="close" /></button></div>
    <span className="sidebar-label">Workspace</span>
    <nav><NavLink to="/admin" end onClick={onClose}><Icon name="grid" /> Overview</NavLink><NavLink to="/admin/products" onClick={onClose}><Icon name="image" /> Manage Products</NavLink><NavLink to="/admin/categories" onClick={onClose}><Icon name="tag" /> Categories</NavLink></nav>
    <div className="sidebar-bottom"><a href="/" target="_blank"><Icon name="eye" /> View catalog</a><button onClick={onLogout}><Icon name="logout" /> Sign out</button></div>
  </aside>;
}
