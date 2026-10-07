import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return <BrowserRouter><AuthProvider><DataProvider><Navbar /><Routes><Route path="/" element={<Home />} /><Route path="/admin/login" element={<Login />} /><Route path="/admin" element={<AdminDashboard />} /><Route path="/admin/products" element={<AdminDashboard />} /><Route path="/admin/categories" element={<AdminDashboard />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></DataProvider></AuthProvider></BrowserRouter>;
}
