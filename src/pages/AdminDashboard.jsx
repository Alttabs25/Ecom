import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import AdminSidebar from '../components/AdminSidebar';
import ProductForm from '../components/ProductForm';
import ProductModal from '../components/ProductModal';
import { ProductImage } from '../components/ProductCard';
import { Icon } from '../components/Icons';

function Dialog({ title, children, onClose, wide = false }) {
  return <div className="modal-backdrop admin-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className={`admin-dialog ${wide ? 'wide' : ''}`}><div className="dialog-head"><h2>{title}</h2><button onClick={onClose}><Icon name="close" /></button></div>{children}</div></div>;
}

function Overview({ products, categories }) {
  const available = products.filter((p) => p.availability === 'Available').length;
  const featured = products.filter((p) => p.featured).length;
  return <><div className="admin-heading"><div><span className="eyebrow">Catalog overview</span><h1>Good day, Admin.</h1><p>Here’s what’s happening with your collection.</p></div></div><div className="stat-grid"><div><span className="stat-icon lavender"><Icon name="image" /></span><p>Total products</p><strong>{products.length}</strong><small>Across {categories.length} categories</small></div><div><span className="stat-icon mint"><Icon name="check" /></span><p>Available now</p><strong>{available}</strong><small>Ready to browse</small></div><div><span className="stat-icon peach"><Icon name="sparkles" /></span><p>Featured</p><strong>{featured}</strong><small>Highlighted products</small></div></div><div className="admin-card"><div className="card-head"><div><h2>Recently added</h2><p>Your latest catalog entries</p></div><a href="/admin/products">View all <Icon name="arrow" size={16} /></a></div><ProductTable products={products.slice(0, 5)} compact /></div></>;
}

function ProductTable({ products, onView, onEdit, onDelete, compact = false }) {
  return <div className="table-wrap"><table className="product-table"><thead><tr><th>Image</th><th>Product name</th><th>Category</th><th>Price</th><th>Availability</th><th>Featured</th>{!compact && <th>Actions</th>}</tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><ProductImage product={product} className="table-image" /></td><td><strong>{product.name}</strong></td><td><span className="table-category">{product.category}</span></td><td><b>₱{Number(product.price).toLocaleString()}</b></td><td><span className={`status ${product.availability.toLowerCase().replaceAll(' ', '-')}`}><i />{product.availability}</span></td><td>{product.featured ? <span className="featured-check"><Icon name="check" size={13} /> Yes</span> : <span className="muted">—</span>}</td>{!compact && <td><div className="table-actions"><button title="View" onClick={() => onView(product)}><Icon name="eye" size={17} /></button><button title="Edit" onClick={() => onEdit(product)}><Icon name="edit" size={17} /></button><button className="danger" title="Delete" onClick={() => onDelete(product)}><Icon name="trash" size={17} /></button></div></td>}</tr>)}</tbody></table>{!products.length && <div className="table-empty">No products in the catalog yet.</div>}</div>;
}

function Categories({ categories, products, addCategory, updateCategory, deleteCategory }) {
  const [editing, setEditing] = useState(null); const [name, setName] = useState(''); const [description, setDescription] = useState(''); const [error, setError] = useState('');
  const reset = () => { setEditing(null); setName(''); setDescription(''); setError(''); };
  const save = async (e) => { e.preventDefault(); setError(''); try { editing ? await updateCategory(editing.id, { name, description }) : await addCategory({ name, description }); reset(); } catch (err) { setError(err.message); } };
  const edit = (item) => { setEditing(item); setName(item.name); setDescription(item.description || ''); };
  const remove = async (item) => { if (!confirm(`Delete “${item.name}”?`)) return; try { await deleteCategory(item.id); } catch (err) { setError(err.message); } };
  return <><div className="admin-heading"><div><span className="eyebrow">Organize your catalog</span><h1>Categories</h1><p>Create and manage the groups customers use to browse.</p></div></div><div className="category-admin-grid"><form className="admin-card category-form" onSubmit={save}><h2>{editing ? 'Edit category' : 'Add category'}</h2><label>Category name<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Gift Sets" /></label><label>Description<textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short optional description" /></label>{error && <p className="form-error">{error}</p>}<div><button className="button button-primary">{editing ? 'Save changes' : 'Add category'}</button>{editing && <button type="button" className="button button-secondary" onClick={reset}>Cancel</button>}</div></form><div className="admin-card category-list"><div className="card-head"><div><h2>Your categories</h2><p>{categories.length} category groups</p></div></div>{categories.map((item) => <div className="category-row" key={item.id}><span className="stat-icon lavender"><Icon name="tag" /></span><div><strong>{item.name}</strong><p>{item.description || 'No description'}</p><small>{products.filter((p) => p.category === item.name).length} products</small></div><div><button onClick={() => edit(item)}><Icon name="edit" size={17} /></button><button onClick={() => remove(item)}><Icon name="trash" size={17} /></button></div></div>)}</div></div></>;
}

export default function AdminDashboard() {
  const { session, logout, demoMode } = useAuth();
  const data = useData(); const location = useLocation(); const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false); const [formProduct, setFormProduct] = useState(null); const [formOpen, setFormOpen] = useState(false); const [viewing, setViewing] = useState(null); const [deleting, setDeleting] = useState(null); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  if (!session) return <Navigate to="/admin/login" replace />;
  const onLogout = () => { logout(); navigate('/admin/login'); };
  const openForm = (product = null) => { setFormProduct(product); setFormOpen(true); };
  const saveProduct = async (product) => { formProduct ? await data.updateProduct(formProduct.id, product) : await data.addProduct(product); setFormOpen(false); setFormProduct(null); };
  const confirmDelete = async () => { setBusy(true); setError(''); try { await data.deleteProduct(deleting.id); setDeleting(null); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  const page = location.pathname.endsWith('/products') ? 'products' : location.pathname.endsWith('/categories') ? 'categories' : 'overview';
  return <div className="admin-shell">
    <AdminSidebar open={sidebar} onClose={() => setSidebar(false)} onLogout={onLogout} />{sidebar && <div className="sidebar-scrim" onClick={() => setSidebar(false)} />}
    <main className="admin-main"><header className="admin-topbar"><button className="admin-menu" onClick={() => setSidebar(true)}><Icon name="menu" /></button><div><span>{session.user?.email}</span>{demoMode && <b>Demo mode</b>}</div></header><div className="admin-content">
      {page === 'overview' && <Overview products={data.products} categories={data.categories} />}
      {page === 'products' && <><div className="admin-heading"><div><span className="eyebrow">Your collection</span><h1>Manage Products</h1><p>Add, update, view, and organize everything in the customer catalog.</p></div><button className="button button-primary" onClick={() => openForm()}><Icon name="plus" /> Add product</button></div><div className="admin-card"><ProductTable products={data.products} onView={setViewing} onEdit={openForm} onDelete={setDeleting} /></div></>}
      {page === 'categories' && <Categories {...data} />}
    </div></main>
    {formOpen && <Dialog title={formProduct ? 'Edit product' : 'Add a new product'} onClose={() => setFormOpen(false)} wide><ProductForm product={formProduct} categories={data.categories} onSave={saveProduct} onCancel={() => setFormOpen(false)} uploadImage={data.uploadImage} /></Dialog>}
    {viewing && <ProductModal product={viewing} onClose={() => setViewing(null)} />}
    {deleting && <Dialog title="Delete product?" onClose={() => setDeleting(null)}><div className="confirm-dialog"><span className="delete-icon"><Icon name="trash" /></span><p>“{deleting.name}” will be permanently removed from the catalog.</p>{error && <p className="form-error">{error}</p>}<div><button className="button button-secondary" onClick={() => setDeleting(null)}>Keep product</button><button className="button button-danger" disabled={busy} onClick={confirmDelete}>{busy ? 'Deleting…' : 'Delete product'}</button></div></div></Dialog>}
  </div>;
}
