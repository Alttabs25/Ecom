import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import ProductModal from '../components/ProductModal';
import Footer from '../components/Footer';
import { Icon } from '../components/Icons';

export default function Home() {
  const { products, categories, loading, notice } = useData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const visible = useMemo(() => products.filter((product) => (category === 'All' || product.category === category) && product.name.toLowerCase().includes(search.toLowerCase().trim())), [products, category, search]);
  const featured = products.find((product) => product.featured) || products[0];
  return <>
    <Hero featured={featured} />
    {notice && <div className="site-notice">{notice}</div>}
    <main>
      <section className="catalog section" id="products">
        <div className="section-heading"><span className="eyebrow"><Icon name="sparkles" size={14} /> The collection</span><h2>Find your new favorite</h2><p>Thoughtful pieces made more meaningful with a personal touch.</p></div>
        <div className="catalog-tools"><SearchBar value={search} onChange={setSearch} /><CategoryFilter categories={categories} active={category} onChange={setCategory} /></div>
        <div className="results-line"><span>{loading ? 'Loading collection…' : `${visible.length} ${visible.length === 1 ? 'product' : 'products'}`}</span>{(search || category !== 'All') && <button onClick={() => { setSearch(''); setCategory('All'); }}>Clear filters</button>}</div>
        {loading ? <div className="loading-grid">{[1,2,3].map((n) => <div key={n} />)}</div> : <ProductGrid products={visible} onSelect={setSelected} />}
      </section>

      <section className="about section" id="about">
        <div className="about-card"><div className="about-art"><span className="arch arch-one" /><span className="arch arch-two" /><Icon name="sparkles" size={42} /></div><div><span className="eyebrow">A little about us</span><h2>Beautifully yours, down to the details.</h2><p>At Lumière, we believe the smallest things can carry the biggest meaning. Our pieces are thoughtfully personalized to celebrate names, friendships, milestones, and all the moments in between.</p><div className="about-values"><span>Personal touches</span><span>Small-batch care</span><span>Made in the Philippines</span></div></div></div>
      </section>
    </main>
    <Footer />
    {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
  </>;
}
