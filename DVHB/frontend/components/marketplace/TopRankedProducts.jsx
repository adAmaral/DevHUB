'use client';

import Link from 'next/link';
import { formatCurrency, getSellerById } from '@/lib/marketplace-service';

export function TopRankedProducts({ products }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Ranking</p>
          <h2 className="mt-2 text-xl font-black text-slate-900">Top produtos</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">Atualizado</span>
      </div>

      <div className="mt-6 space-y-4">
        {products.map((product) => {
          const seller = getSellerById(product.vendorId);
          return (
            <article key={product.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">#{product.rank} • {product.category}</p>
                  <Link href={`/product/${product.slug}`} className="mt-2 block text-base font-bold text-slate-900 hover:text-primary">
                    {product.title}
                  </Link>
                  <p className="mt-1 text-sm text-slate-600">{seller?.name} • {product.rating.toFixed(1)} ★</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-primary">{formatCurrency(product.price)}</p>
                  <p className="text-xs text-slate-500">{product.sales} vendas</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
