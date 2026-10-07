import ProductCard from './ProductCard';
import { Icon } from './Icons';
export default function ProductGrid({ products, onSelect }) {
  if (!products.length) return <div className="empty-state"><Icon name="search" size={34} /><h3>No lovely finds yet</h3><p>Try another name or category.</p></div>;
  return <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} onClick={onSelect} />)}</div>;
}
