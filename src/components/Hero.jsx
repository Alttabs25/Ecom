import { useEffect, useState } from 'react';
import { Icon } from './Icons';
import TextType from './TextType';

export default function Hero({ featuredProducts = [], loading = false, onSelect }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const featuredCount = featuredProducts.length;
  const featured = featuredProducts[activeIndex] || null;

  useEffect(() => {
    if (activeIndex >= featuredCount) setActiveIndex(0);
  }, [activeIndex, featuredCount]);

  useEffect(() => {
    if (paused || featuredCount <= 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const timeout = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % featuredCount);
    }, 5500);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, featuredCount, paused]);

  const selectSlide = (index) => setActiveIndex((index + featuredCount) % featuredCount);

  return <section className="hero" id="home">
    <div className="orb orb-one" /><div className="orb orb-two" />
    <div className="hero-inner">
      <div className="hero-copy">
        <span className="eyebrow"><Icon name="sparkles" size={15} /> Made personal, made memorable</span>
        <h1>
          Little keepsakes,<br />
          <TextType
            text={['KMN', 'made just for you.', 'made personal.', 'made memorable.']}
            typingSpeed={75}
            pauseDuration={1500}
            deletingSpeed={50}
            showCursor
            cursorCharacter="_"
            cursorBlinkDuration={0.5}
            className="hero-typed-text"
            aria-hidden="true"
          />
          <span className="sr-only">made just for you.</span>
        </h1>
        <p>Discover charming personalized pieces for everyday moments and the celebrations you’ll always remember.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#products">View products <Icon name="arrow" size={18} /></a>
          <a className="text-link" href="#about">Our story <Icon name="chevron" size={16} /></a>
        </div>
        <div className="hero-notes"><span><Icon name="check" size={14} /> Custom names</span><span><Icon name="check" size={14} /> Handmade details</span></div>
      </div>
      <div
        className="hero-art"
        aria-label="Featured products"
        aria-roledescription="carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
      >
        <button
          key={featured?.id || (loading ? 'loading' : 'empty')}
          type="button"
          className="shine-card hero-feature-card"
          onClick={() => featured && onSelect?.(featured)}
          disabled={!featured || loading}
          aria-label={featured ? `View ${featured.name}` : 'Featured product'}
        >
          <div className={`image-placeholder hero-placeholder${loading ? ' is-loading' : ''}`}>
            {loading
              ? <span>Loading featured piece…</span>
              : featured?.image
                ? <img src={featured.image} alt={featured.name} />
                : <><Icon name="image" size={44} /><span>{featured ? 'Product photo coming soon' : 'Featured piece coming soon'}</span></>}
          </div>
          <div className="hero-product"><span>Featured piece</span><strong>{loading ? 'Loading collection…' : featured?.name || 'Something special is coming'}</strong>{featured && <b>₱{Number(featured.price).toLocaleString()}</b>}</div>
        </button>
        {featuredCount > 1 && <>
          <div className="hero-carousel-arrows">
            <button type="button" onClick={() => selectSlide(activeIndex - 1)} aria-label="Previous featured product"><Icon name="chevron" size={20} /></button>
            <button type="button" onClick={() => selectSlide(activeIndex + 1)} aria-label="Next featured product"><Icon name="chevron" size={20} /></button>
          </div>
          <div className="hero-carousel-dots" aria-label="Choose a featured product">
            {featuredProducts.map((product, index) => <button key={product.id} type="button" className={index === activeIndex ? 'active' : ''} onClick={() => selectSlide(index)} aria-label={`Show ${product.name}`} aria-current={index === activeIndex ? 'true' : undefined} />)}
          </div>
        </>}
        <span className="float-pill pill-one">Custom name available</span>
        <span className="float-pill pill-two"><Icon name="sparkles" size={14} /> Made with care</span>
      </div>
    </div>
  </section>;
}
