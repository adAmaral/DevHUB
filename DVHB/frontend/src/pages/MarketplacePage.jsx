import { useEffect, useState } from 'react';
import Seo from '../seo/Seo';
import ProductCard from '../components/ProductCard';
import MarketplaceFilters from '../components/MarketplaceFilters';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { fetchProducts } from '../services/productService';

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ q: '', category: '', platform: '', maxPrice: '', minRating: '', sort: 'recentes' });

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('');
      try { setProducts(await fetchProducts()); } catch (e) { setError(e.message); setProducts([]); } finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = products.filter((p) => {
    const q = filters.q.toLowerCase();
    const byText = !q || `${p.name} ${p.vendor} ${p.description}`.toLowerCase().includes(q);
    const byCategory = !filters.category || p.category === filters.category;
    const byPlatform = !filters.platform || p.platform === filters.platform;
    const byPrice = !filters.maxPrice || Number(p.price) <= Number(filters.maxPrice);
    const byRating = !filters.minRating || Number(p.rating) >= Number(filters.minRating);
    return byText && byCategory && byPlatform && byPrice && byRating;
  }).sort((a,b)=>filters.sort==='populares'?Number(b.popularity)-Number(a.popularity):filters.sort==='avaliados'?Number(b.rating)-Number(a.rating):new Date(b.createdAt)-new Date(a.createdAt));

  const categories = [...new Set(products.map(p=>p.category).filter(Boolean))];
  const platforms = [...new Set(products.map(p=>p.platform).filter(Boolean))];

  return <section>
    <Seo title='Mercado | DEVHUB' description='Explore softwares e SaaS no marketplace DEVHUB.' path='/mercado' />
    <h1>Vitrine de software e SaaS</h1>
    <MarketplaceFilters filters={filters} setFilters={setFilters} categories={categories} platforms={platforms} />
    {loading && <LoadingState message='Carregando catálogo do marketplace...' />}
    {!loading && error && <ErrorState message={error} />}
    {!loading && !error && filtered.length === 0 && <EmptyState title='Nenhum produto encontrado' message='Ajuste os filtros ou tente novamente mais tarde.' />}
    {!loading && !error && filtered.length > 0 && <section className='grid products' style={{ marginTop: '1rem' }}>{filtered.map((p) => <ProductCard key={p.slug || p.id} p={p} />)}</section>}
  </section>;
}
