'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { getSellerById, formatCurrency } from '@/lib/marketplace-service';

export function ProductCard({ product }) {
  const seller = useMemo(() => getSellerById(product.vendorId), [product.vendorId]);
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative overflow-hidden bg-slate-100">
        <div className="relative h-56 w-full">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        {product.isSponsored ? (
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white">
            Patrocinado
          </span>
        ) : null}
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            {product.category}
          </p>
          <strong className="text-lg text-primary">{formatCurrency(product.price)}</strong>
        </div>

        <div className="space-y-2">
          <Link href={`/product/${product.slug}`} className="block text-xl font-bold text-slate-900 hover:text-primary">
            {product.title}
          </Link>
          <p className="text-sm text-slate-600">{product.brief}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
          <span>⭐ {product.rating.toFixed(1)}</span>
          <span>{product.ratingCount} avaliações</span>
          <span>{product.delivery}</span>
        </div>

        <div className="grid gap-3">
          <AddToCartButton item={{
            id: product.id,
            title: product.title,
            description: product.brief,
            price: product.price,
            image: product.images[0],
            category: product.category,
          }} />
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
          >
            Ver detalhes
          </Link>
        </div>

        {seller ? (
          <div className="space-y-3 rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <Link href={`/seller/${seller.id}`} className="inline-flex items-center gap-2 font-semibold text-slate-900 hover:text-primary">
              <span>{seller.name}</span>
              {seller.verified ? (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Verificado</span>
              ) : null}
            </Link>
            <p>{seller.rating.toFixed(1)} ★ • {seller.location}</p>
            <p className="text-xs text-slate-500">Reputação {seller.reputation.toFixed(1)} • {seller.totalSales} vendas</p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
