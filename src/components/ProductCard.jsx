import { Icon } from './Icons';

export function ProductImage({ product, className = '' }) {
  return <div className={`product-image ${className}`}>{product.image ? <img src={product.image} alt={product.name} /> : <div className="image-placeholder"><Icon name="image" size={34} /><span>Product photo coming soon</span></div>}{product.featured && <span className="featured-label"><Icon name="sparkles" size={12} /> Featured</span>}</div>;
}

export default function ProductCard({ product, onClick }) {
  const state = product.availability.toLowerCase().replaceAll(' ', '-');
  return <article className="product-card" onClick={() => onClick(product)} tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && onClick(product)}>
    <ProductImage product={product} />
    <div className="product-card-body">
      <div className="product-meta"><span>{product.category}</span><span className={`status ${state}`}><i />{product.availability}</span></div>
      <h3>{product.name}</h3><p>{product.shortDescription}</p>
      <div className="product-card-foot"><strong>₱{Number(product.price).toLocaleString()}</strong><button aria-label={`View ${product.name}`}><Icon name="arrow" /></button></div>
    </div>
  </article>;
}
