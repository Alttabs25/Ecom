import { Icon } from './Icons';
export default function SearchBar({ value, onChange }) {
  return <label className="search-bar"><Icon name="search" /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search by product name..." aria-label="Search products" />{value && <button onClick={() => onChange('')} aria-label="Clear search"><Icon name="close" size={17} /></button>}</label>;
}
