import { Icon } from './Icons';

export default function Hero({ featured }) {
  return <section className="hero" id="home">
    <div className="orb orb-one" /><div className="orb orb-two" />
    <div className="hero-inner">
      <div className="hero-copy">
        <span className="eyebrow"><Icon name="sparkles" size={15} /> Made personal, made memorable</span>
        <h1>Little keepsakes,<br /><em>made just for you.</em></h1>
        <p>Discover charming personalized pieces for everyday moments and the celebrations you’ll always remember.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#products">View products <Icon name="arrow" size={18} /></a>
          <a className="text-link" href="#about">Our story <Icon name="chevron" size={16} /></a>
        </div>
        <div className="hero-notes"><span><Icon name="check" size={14} /> Custom names</span><span><Icon name="check" size={14} /> Handmade details</span></div>
      </div>
      <div className="hero-art" aria-label="Featured product placeholder">
        <div className="shine-card">
          <div className="image-placeholder hero-placeholder">
            {featured?.image ? <img src={featured.image} alt={featured.name} /> : <><Icon name="image" size={44} /><span>Your product photo</span></>}
          </div>
          <div className="hero-product"><span>Featured piece</span><strong>{featured?.name || 'Personalized Holographic Pouch'}</strong><b>₱{Number(featured?.price || 99).toLocaleString()}</b></div>
        </div>
        <span className="float-pill pill-one">Custom name available</span>
        <span className="float-pill pill-two"><Icon name="sparkles" size={14} /> Made with care</span>
      </div>
    </div>
  </section>;
}
