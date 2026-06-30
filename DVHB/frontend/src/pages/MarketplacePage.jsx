import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Seo from '../seo/Seo';
import ProductCard from '../components/ProductCard';
import MarketplaceFilters from '../components/MarketplaceFilters';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { fetchProducts } from '../services/productService';

export default function MarketplacePage() {
  const { user } = useAuth();
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
    const byText = !q || `${p.nome} ${p.descricao}`.toLowerCase().includes(q);
    const byCategory = !filters.category || p.categoria === filters.category;
    const byPlatform = true; // no platform field yet
    const byPrice = !filters.maxPrice || Number(p.preco) <= Number(filters.maxPrice);
    const byRating = !filters.minRating || Number(p.rating || 0) >= Number(filters.minRating);
    return byText && byCategory && byPlatform && byPrice && byRating;
  }).sort((a,b)=>filters.sort==='populares'?Number(b.quantidade_avaliacoes || 0)-Number(a.quantidade_avaliacoes || 0):filters.sort==='avaliados'?Number(b.rating || 0)-Number(a.rating || 0):new Date(b.data_criacao)-new Date(a.data_criacao));

  const categories = [...new Set(products.map(p=>p.categoria).filter(Boolean))];
  const platforms = [];

  return <section>
    <Seo title='Mercado | DEVHUB' description='Explore softwares e SaaS no marketplace DEVHUB.' path='/mercado' />
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Vitrine de software e SaaS</h1>
        {user && (user.tipo_conta === 'freelancer' || user.tipo_conta === 'empresa fornecedora') && (
            <Link to="/publicar-produto" className="btn btn-primary">
                Publicar Produto
            </Link>
        )}
    </div>

    <MarketplaceFilters filters={filters} setFilters={setFilters} categories={categories} platforms={platforms} />
    {loading && <LoadingState message='Carregando catálogo do marketplace...' />}
    {!loading && error && <ErrorState message={error} />}
    {!loading && !error && filtered.length === 0 && <EmptyState title='Nenhum produto encontrado' message='Ajuste os filtros ou tente novamente mais tarde.' />}
    {!loading && !error && filtered.length > 0 && <section className='grid products' style={{ marginTop: '1rem' }}>{filtered.map((p) => <ProductCard key={p.slug || p.id} p={p} />)}</section>}
  </section>;
}
