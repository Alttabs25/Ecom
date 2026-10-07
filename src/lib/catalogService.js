const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/$/, '');
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

const authHeaders = (token, extra = {}) => ({
  apikey: supabaseKey,
  Authorization: `Bearer ${token || supabaseKey}`,
  'Content-Type': 'application/json',
  ...extra,
});

async function request(path, options = {}, token) {
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: authHeaders(token, options.headers),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error_description || 'Something went wrong.');
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: Number(p.price),
  shortDescription: p.short_description || '',
  description: p.description || '',
  availability: p.availability,
  colors: p.colors || [],
  sizes: p.sizes || [],
  customization: p.customization || '',
  featured: Boolean(p.featured),
  image: p.image_url || '',
});

const toRow = (p) => ({
  name: p.name,
  category: p.category,
  price: Number(p.price),
  short_description: p.shortDescription,
  description: p.description,
  availability: p.availability,
  colors: p.colors,
  sizes: p.sizes,
  customization: p.customization,
  featured: Boolean(p.featured),
  image_url: p.image,
});

export const catalogService = {
  async load() {
    const [products, categories] = await Promise.all([
      request('/rest/v1/products?select=*&order=created_at.desc'),
      request('/rest/v1/categories?select=*&order=name.asc'),
    ]);
    return { products: products.map(mapProduct), categories };
  },
  async signIn(email, password) {
    return request('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) });
  },
  async addProduct(product, token) {
    const [row] = await request('/rest/v1/products', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(toRow(product)) }, token);
    return mapProduct(row);
  },
  async updateProduct(id, product, token) {
    const [row] = await request(`/rest/v1/products?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(toRow(product)) }, token);
    return mapProduct(row);
  },
  deleteProduct(id, token) {
    return request(`/rest/v1/products?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' }, token);
  },
  async addCategory(category, token) {
    const [row] = await request('/rest/v1/categories', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(category) }, token);
    return row;
  },
  async updateCategory(id, category, token) {
    const [row] = await request(`/rest/v1/categories?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(category) }, token);
    return row;
  },
  deleteCategory(id, token) {
    return request(`/rest/v1/categories?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' }, token);
  },
  async uploadImage(file, token) {
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
    const response = await fetch(`${supabaseUrl}/storage/v1/object/product-images/${safeName}`, {
      method: 'POST',
      headers: { apikey: supabaseKey, Authorization: `Bearer ${token}`, 'Content-Type': file.type, 'x-upsert': 'true' },
      body: file,
    });
    if (!response.ok) throw new Error('Image upload failed.');
    return `${supabaseUrl}/storage/v1/object/public/product-images/${safeName}`;
  },
};
