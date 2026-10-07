import { Brand } from './Navbar';
export default function Footer() {
  return <footer className="footer"><div className="footer-inner"><div><Brand /><p>Personalized keepsakes for life’s sweetest moments.</p></div><div className="footer-links"><a href="#home">Home</a><a href="#products">Products</a><a href="#categories">Categories</a><a href="#about">About</a></div><div className="footer-meta"><span>Digital product catalog</span><small>© {new Date().getFullYear()} Lumière Keepsakes</small></div></div></footer>;
}
