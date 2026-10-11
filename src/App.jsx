import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

function SiteContent() {
  const [minimumElapsed, setMinimumElapsed] = useState(() => performance.now() >= 1600);

  useEffect(() => {
    if (minimumElapsed) return undefined;
    const timer = window.setTimeout(() => setMinimumElapsed(true), Math.max(0, 1600 - performance.now()));
    return () => window.clearTimeout(timer);
  }, [minimumElapsed]);

  useEffect(() => {
    if (!minimumElapsed) return undefined;
    const loader = document.getElementById('boot-loader');
    if (!loader) {
      document.body.classList.remove('site-loading');
      return undefined;
    }
    loader.classList.add('is-leaving');
    const timer = window.setTimeout(() => {
      loader.remove();
      document.body.classList.remove('site-loading');
    }, 450);
    return () => window.clearTimeout(timer);
  }, [minimumElapsed]);

  return <>
    <Navbar />
    <Routes><Route path="/" element={<Home />} /><Route path="/admin/login" element={<Login />} /><Route path="/admin" element={<AdminDashboard />} /><Route path="/admin/products" element={<AdminDashboard />} /><Route path="/admin/categories" element={<AdminDashboard />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>
  </>;
}

export default function App() {
  return <BrowserRouter><AuthProvider><DataProvider><SiteContent /></DataProvider></AuthProvider></BrowserRouter>;
}
