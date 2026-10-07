import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initialCategories, initialProducts } from '../data/sampleData';
import { catalogService, isSupabaseConfigured } from '../lib/catalogService';

const DataContext = createContext(null);
const PRODUCT_KEY = 'lumiere_products';
const CATEGORY_KEY = 'lumiere_categories';
const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
};

const readProducts = () => {
  const stored = read(PRODUCT_KEY, initialProducts);
  const featuredSample = initialProducts[0];
  return stored.map((product) => product.id === featuredSample.id && !product.image ? featuredSample : product);
};

export function DataProvider({ children }) {
  const [products, setProducts] = useState(readProducts);
  const [categories, setCategories] = useState(() => read(CATEGORY_KEY, initialCategories));
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    catalogService.load().then(({ products: remoteProducts, categories: remoteCategories }) => {
      setProducts(remoteProducts);
      setCategories(remoteCategories);
    }).catch(() => setNotice('Could not reach Supabase. Showing the local catalog.')).finally(() => setLoading(false));
  }, []);

  const persist = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const token = () => JSON.parse(localStorage.getItem('lumiere_admin_session') || 'null')?.access_token;

  const addProduct = async (product) => {
    const created = isSupabaseConfigured ? await catalogService.addProduct(product, token()) : { ...product, id: crypto.randomUUID() };
    setProducts((items) => { const next = [created, ...items]; if (!isSupabaseConfigured) persist(PRODUCT_KEY, next); return next; });
  };
  const updateProduct = async (id, product) => {
    const updated = isSupabaseConfigured ? await catalogService.updateProduct(id, product, token()) : { ...product, id };
    setProducts((items) => { const next = items.map((item) => item.id === id ? updated : item); if (!isSupabaseConfigured) persist(PRODUCT_KEY, next); return next; });
  };
  const deleteProduct = async (id) => {
    if (isSupabaseConfigured) await catalogService.deleteProduct(id, token());
    setProducts((items) => { const next = items.filter((item) => item.id !== id); if (!isSupabaseConfigured) persist(PRODUCT_KEY, next); return next; });
  };
  const addCategory = async (category) => {
    const created = isSupabaseConfigured ? await catalogService.addCategory(category, token()) : { ...category, id: category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') };
    setCategories((items) => { const next = [...items, created]; if (!isSupabaseConfigured) persist(CATEGORY_KEY, next); return next; });
  };
  const updateCategory = async (id, category) => {
    const updated = isSupabaseConfigured ? await catalogService.updateCategory(id, category, token()) : { ...category, id };
    setCategories((items) => { const next = items.map((item) => item.id === id ? updated : item); if (!isSupabaseConfigured) persist(CATEGORY_KEY, next); return next; });
  };
  const deleteCategory = async (id) => {
    const current = categories.find((item) => item.id === id);
    if (products.some((product) => product.category === current?.name)) throw new Error('Move products out of this category before deleting it.');
    if (isSupabaseConfigured) await catalogService.deleteCategory(id, token());
    setCategories((items) => { const next = items.filter((item) => item.id !== id); if (!isSupabaseConfigured) persist(CATEGORY_KEY, next); return next; });
  };

  const value = useMemo(() => ({ products, categories, loading, notice, setNotice, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory, uploadImage: catalogService.uploadImage }), [products, categories, loading, notice]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const value = useContext(DataContext);
  if (!value) throw new Error('useData must be used within DataProvider');
  return value;
}
