import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductsBySellerId, getSellerById } from '@/lib/marketplace-service';
import { ProductCard } from '@/components/marketplace/ProductCard';

export default function SellerProfilePage({ params }) {
  const seller = getSellerById(params.sellerId);
  if (!seller) notFound();

  const sellerProducts = getProductsBySellerId(seller.id);

  return (
    <main className="min-h-screen bg-background-light px-4 py-8 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Vendedor</p>
              <h1 className="mt-3 text-3xl font-black text-slate-900">{seller.name}</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-600">{seller.bio}</p>
            </div>
            <div className="grid gap-3 sm:text-right">
              <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-primary">{seller.verified ? 'Verificado' : 'Confiável'}</span>
              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Reputação</p>
                <p className="mt-2 text-2xl font-black text-primary">{seller.reputation.toFixed(1)} ★</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <article className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total de vendas</p>
              <p className="mt-3 text-3xl font-black text-slate-900">{seller.totalSales}</p>
            </article>
            <article className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Tempo médio de resposta</p>
              <p className="mt-3 text-3xl font-black text-slate-900">{seller.responseTime}</p>
            </article>
            <article className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Localização</p>
              <p className="mt-3 text-3xl font-black text-slate-900">{seller.location}</p>
            </article>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Catálogo</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Produtos deste vendedor</h2>
            </div>
            <Link href="/marketplace" className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">
              Voltar ao marketplace
            </Link>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {sellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {!sellerProducts.length ? (
            <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-sm text-slate-600">Este vendedor ainda não tem produtos cadastrados.</div>
          ) : null}
        </section>
      </section>
    </main>
  );
}
