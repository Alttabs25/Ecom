import { useEffect } from 'react';
import { Icon } from './Icons';
import { ProductImage } from './ProductCard';

export default function ProductModal({ product, onClose }) {
  useEffect(() => { const key = (e) => e.key === 'Escape' && onClose(); document.body.classList.add('modal-open'); window.addEventListener('keydown', key); return () => { document.body.classList.remove('modal-open'); window.removeEventListener('keydown', key); }; }, [onClose]);
  if (!product) return null;
  const state = product.availability.toLowerCase().replaceAll(' ', '-');
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div className="product-modal" role="dialog" aria-modal="true" aria-label={product.name}>
      <button className="modal-close" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
      <ProductImage product={product} className="modal-image" />
      <div className="modal-copy">
        <div className="product-meta"><span>{product.category}</span><span className={`status ${state}`}><i />{product.availability}</span></div>
        <h2>{product.name}</h2><strong className="modal-price">₱{Number(product.price).toLocaleString()}</strong>
        <p className="modal-description">{product.description}</p>
        {product.customization && <div className="custom-callout"><Icon name="sparkles" /><div><strong>Personalize it</strong><span>{product.customization}</span></div></div>}
        <div className="variant-grid">
          {!!product.colors?.length && <div><span>Available colors / designs</span><div className="chips">{product.colors.map((item) => <b key={item}>{item}</b>)}</div></div>}
          {!!product.sizes?.length && <div><span>Available sizes</span><div className="chips">{product.sizes.map((item) => <b key={item}>{item}</b>)}</div></div>}
        </div>
        <p className="catalog-note">This catalog is for browsing only. Contact the business directly for product inquiries.</p>
      </div>
    </div>
  </div>;
}
