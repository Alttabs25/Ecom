import { useEffect, useState } from 'react';
import { Icon } from './Icons';
import { isSupabaseConfigured } from '../lib/catalogService';

const blank = { name: '', category: '', price: '', shortDescription: '', description: '', availability: 'Available', colors: [], sizes: [], customization: '', featured: false, image: '' };
const split = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);

export default function ProductForm({ product, categories, onSave, onCancel, uploadImage }) {
  const [form, setForm] = useState(blank);
  const [colors, setColors] = useState('');
  const [sizes, setSizes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { const next = product || { ...blank, category: categories[0]?.name || '' }; setForm(next); setColors((next.colors || []).join(', ')); setSizes((next.sizes || []).join(', ')); }, [product, categories]);
  const update = (key, value) => setForm((old) => ({ ...old, [key]: value }));
  const fileChange = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setError('Please choose an image smaller than 5MB.');
    if (isSupabaseConfigured) {
      try { setSaving(true); update('image', await uploadImage(file, JSON.parse(localStorage.getItem('lumiere_admin_session'))?.access_token)); } catch (e) { setError(e.message); } finally { setSaving(false); }
    } else {
      const reader = new FileReader();
      reader.onload = () => update('image', reader.result);
      reader.readAsDataURL(file);
    }
  };
  const submit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try { await onSave({ ...form, price: Number(form.price), colors: split(colors), sizes: split(sizes) }); } catch (e) { setError(e.message); setSaving(false); }
  };
  return <form className="product-form" onSubmit={submit}>
    <div className="form-section"><div><h3>Product image</h3><p>Use a clear square or portrait image, up to 5MB.</p></div><label className="image-uploader">{form.image ? <img src={form.image} alt="Preview" /> : <span><Icon name="upload" size={28} /><b>Upload image</b><small>PNG, JPG or WEBP</small></span>}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => fileChange(e.target.files[0])} /></label></div>
    <div className="form-section form-fields"><div><h3>Basic information</h3><p>What customers will see in the catalog.</p></div><div className="field-grid">
      <label className="full">Product name<input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Personalized Holographic Pouch" /></label>
      <label>Category<select required value={form.category} onChange={(e) => update('category', e.target.value)}>{categories.map((item) => <option key={item.id}>{item.name}</option>)}</select></label>
      <label>Price (₱)<input required min="0" step="0.01" type="number" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="99.00" /></label>
      <label className="full">Short description<input required value={form.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} maxLength="120" placeholder="A short line for the product card" /></label>
      <label className="full">Complete description<textarea required rows="5" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe the product, its finish, and ideal uses..." /></label>
    </div></div>
    <div className="form-section form-fields"><div><h3>Options & availability</h3><p>Add comma-separated choices customers can view.</p></div><div className="field-grid">
      <label>Colors / designs<input value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Lilac, Blush, Clear" /></label>
      <label>Sizes<input value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="Mini, Regular, Large" /></label>
      <label>Availability<select value={form.availability} onChange={(e) => update('availability', e.target.value)}><option>Available</option><option>Made to Order</option><option>Out of Stock</option></select></label>
      <label>Customization<input value={form.customization} onChange={(e) => update('customization', e.target.value)} placeholder="Custom Name Available" /></label>
      <label className="check-field full"><input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} /><span><b>Featured product</b><small>Highlight this item in the storefront.</small></span></label>
    </div></div>
    {error && <p className="form-error">{error}</p>}
    <div className="form-actions"><button type="button" className="button button-secondary" onClick={onCancel}>Cancel</button><button className="button button-primary" disabled={saving}>{saving ? 'Saving…' : product ? 'Save changes' : 'Add product'}</button></div>
  </form>;
}
