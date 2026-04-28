'use client';

export function ProductFilters({ categories = [], filters, onChange, className = '' }) {
  return (
    <aside className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <h2 className="text-xl font-black text-slate-900">Filtros avançados</h2>
      <div className="mt-5 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">
          Buscar
          <input
            type="search"
            value={filters.query}
            onChange={(event) => onChange({ query: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="Segurança, analytics, NexaSystems"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Categoria
          <select
            value={filters.category}
            onChange={(event) => onChange({ category: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="All">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700">
            Preço mínimo
            <input
              type="number"
              min={0}
              value={filters.minPrice}
              onChange={(event) => onChange({ minPrice: Number(event.target.value) })}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Preço máximo
            <input
              type="number"
              min={0}
              value={filters.maxPrice}
              onChange={(event) => onChange({ maxPrice: Number(event.target.value) })}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
        </div>

        <label className="block text-sm font-semibold text-slate-700">
          Avaliação mínima
          <select
            value={filters.minRating}
            onChange={(event) => onChange({ minRating: Number(event.target.value) })}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value={0}>Qualquer</option>
            <option value={4}>4 estrelas</option>
            <option value={4.5}>4.5 estrelas</option>
            <option value={5}>5 estrelas</option>
          </select>
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Localização do produto
          <input
            type="text"
            value={filters.location}
            onChange={(event) => onChange({ location: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="Brasil, São Paulo, remoto"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Produtos patrocinados
          <div className="mt-2 flex items-center gap-3">
            <input
              id="sponsoredOnly"
              type="checkbox"
              checked={filters.sponsoredOnly}
              onChange={(event) => onChange({ sponsoredOnly: event.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-slate-600">Exibir apenas produtos com destaque patrocinado</span>
          </div>
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Ordenar por
          <select
            value={filters.sort}
            onChange={(event) => onChange({ sort: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="relevance">Relevância</option>
            <option value="price_asc">Menor preço</option>
            <option value="price_desc">Maior preço</option>
            <option value="rating">Melhor avaliação</option>
            <option value="sales">Mais vendidos</option>
          </select>
        </label>
      </div>
    </aside>
  );
}
