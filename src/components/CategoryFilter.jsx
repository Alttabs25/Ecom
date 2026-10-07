export default function CategoryFilter({ categories, active, onChange }) {
  return <div className="category-filter-shell"><div className="category-filters" id="categories" role="group" aria-label="Product categories">{['All', ...categories.map((item) => item.name)].map((name) => <button key={name} className={active === name ? 'active' : ''} onClick={() => onChange(name)}>{name}</button>)}</div></div>;
}
