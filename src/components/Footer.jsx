import { Brand } from './Navbar';
import { Icon } from './Icons';
export default function Footer() {
  const socials = [
    ['Facebook', 'facebook', 'https://facebook.com/'],
    ['Instagram', 'instagram', 'https://instagram.com/'],
    ['TikTok', 'tiktok', 'https://tiktok.com/'],
    ['Messenger', 'messenger', 'https://m.me/'],
  ];
  return <footer className="footer"><div className="footer-inner"><div className="footer-brand"><Brand /><p>Personalized keepsakes for life’s sweetest moments.</p><div className="footer-socials" aria-label="Social media links">{socials.map(([label, icon, href]) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}><Icon name={icon} size={17} /></a>)}</div></div><div className="footer-links"><a href="#home">Home</a><a href="#products">Products</a><a href="#categories">Categories</a><a href="#about">About</a></div><div className="footer-meta"><span>Digital product catalog</span><small>© {new Date().getFullYear()} Lumière Keepsakes</small></div></div></footer>;
}
