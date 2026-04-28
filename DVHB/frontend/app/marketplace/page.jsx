'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { ProductFilters } from '@/components/marketplace/ProductFilters';
import { TopRankedProducts } from '@/components/marketplace/TopRankedProducts';
import { LiveNotificationFeed } from '@/components/notifications/LiveNotificationFeed';
import {
  getAutocompleteSuggestions,
  getCategories,
  getNotifications,
  getSponsoredProducts,
  getTopRankedProducts,
  getTopSellers,
  searchProducts,
} from '@/lib/marketplace-service';

const defaultFilters = {
  query: '',
  category: 'All',
  minPrice: 0,
  maxPrice: 250,
  minRating: 4,
  location: '',
  sort: 'relevance',
  sponsoredOnly: false,
};

export default function MarketplacePage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [suggestions, setSuggestions] = useState([]);
  const [notifications] = useState(getNotifications());

  useEffect(() => {
    if (filters.query.trim().length > 1) {
      setSuggestions(getAutocompleteSuggestions(filters.query));
    } else {
      setSuggestions([]);
    }
  }, [filters.query]);

  const products = useMemo(() => searchProducts(filters), [filters]);
  const featuredProducts = useMemo(() => getSponsoredProducts(), []);
  const rankedProducts = useMemo(() => getTopRankedProducts(4), []);
  const topSellers = useMemo(() => getTopSellers(3), []);
  const categories = useMemo(() => ['All', ...getCategories()], []);

  const handleFilterChange = (update) => {
    setFilters((current) => ({ ...current, ...update }));
  };

  const handleSuggestionClick = (term) => {
    setFilters((current) => ({ ...current, query: term }));
    setSuggestions([]);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] gap-8 xl:grid-cols-[320px_1.7fr_320px]">
        <div className="xl:sticky xl:top-24 xl:self-start">
          <ProductFilters categories={categories} filters={filters} onChange={handleFilterChange} />
        </div>

        <section className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Marketplace</p>
                <h1 className="mt-3 text-3xl font-black text-slate-900">Encontre o software ideal</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Busca por reputação do vendedor, produtos patrocinados, ranking e recomendações bilaterais para acelerar conversões.
                </p>
              </div>

              <div className="relative w-full max-w-lg">
                <input
                  value={filters.query}
                  onChange={(event) => handleFilterChange({ query: event.target.value })}
                  placeholder="Buscar software, categoria ou vendedor"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
                {suggestions.length > 0 ? (
                  <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Destaques</p>
                  <h2 className="mt-2 text-xl font-black text-slate-900">Produtos patrocinados</h2>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">Promoção</span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Patrocinado</p>
                    <h3 className="mt-3 text-lg font-bold text-slate-900">{product.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{product.brief}</p>
                    <div className="mt-4 flex items-center justify-between text-sm text-slate-700">
                      <span>⭐ {product.rating.toFixed(1)}</span>
                      <span>{product.sales} vendas</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Resultados</p>
                  <h2 className="mt-2 text-xl font-black text-slate-900">Software encontrados</h2>
                </div>
                <span className="text-sm text-slate-500">{products.length} itens ativos</span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {!products.length ? (
                <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-sm text-slate-600">
                  Nenhum produto corresponde aos filtros escolhidos. Ajuste a busca ou remova alguns filtros.
                </div>
              ) : null}
            </section>
          </div>
        </section>

        <aside className="space-y-6">
          <LiveNotificationFeed initialNotifications={notifications} />

          <TopRankedProducts products={rankedProducts} />

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Vendedores</p>
                <h2 className="mt-2 text-xl font-black text-slate-900">Top parceiros</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">Reputação</span>
            </div>

            <div className="mt-6 space-y-4">
              {topSellers.map((seller) => (
                <article key={seller.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-bold text-slate-900">{seller.name}</p>
                      <p className="mt-1 text-sm text-slate-600">{seller.bio}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-primary">{seller.reputation.toFixed(1)} ★</p>
                      <p className="text-xs text-slate-500">{seller.totalSales} vendas</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
