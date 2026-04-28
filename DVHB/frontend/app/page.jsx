export const metadata = {
  title: 'DevHub - Marketplace de Softwares Empresariais',
  description: 'Encontre soluções de ERP, PDV, estoque e analytics no marketplace DevHub.',
  keywords: 'marketplace, software empresarial, ERP, PDV, analytics, estoque',
  openGraph: {
    title: 'DevHub - Marketplace de Softwares Empresariais',
    description: 'Encontre soluções de ERP, PDV, estoque e analytics no marketplace DevHub.',
    url: 'https://devhub477.vercel.app',
  },
};

import Link from 'next/link';
import { getCategories, getSponsoredProducts, getTopRankedProducts, getTopSellers } from '@/lib/marketplace-service';

export default function HomePage() {
  const categories = getCategories();
  const featured = getSponsoredProducts().slice(0, 3);
  const topProducts = getTopRankedProducts(3);
  const sellers = getTopSellers(3);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-10">
        <div className="hero-card p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-6">
              <div className="feature-pill">Software marketplace</div>
              <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">Encontre softwares empresariais de alto valor em um só lugar.</h1>
              <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                Centralize a busca por soluções de estoque, farmácia, PDV, ERP e analytics com vendedores nacionais verificados e anúncios patrocinados prontos para conversão.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/marketplace" className="primary-button inline-flex items-center justify-center">
                  Explorar marketplace
                </Link>
                <Link href="/notifications" className="secondary-button inline-flex items-center justify-center">
                  Ver notificações
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="card-highlight">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">+4.9</p>
                  <p className="mt-3 text-lg font-black">Produtos avaliados</p>
                </div>
                <div className="card-highlight">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">200+</p>
                  <p className="mt-3 text-lg font-black">Vendedores ativos</p>
                </div>
                <div className="card-highlight">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Rápido</p>
                  <p className="mt-3 text-lg font-black">Busca orientada por resultados</p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Busca rápida</p>
              <div className="mt-4 grid gap-3">
                <input
                  type="text"
                  readOnly
                  value="Pesquisar por CRM, ERP, segurança, analytics..."
                  className="form-field w-full"
                />
                <Link href="/marketplace" className="primary-button text-center text-sm font-semibold">
                  Iniciar busca
                </Link>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Categorias</p>
                  <p className="mt-3 text-lg font-black text-slate-900">{categories.length} nichos</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Vendedores</p>
                  <p className="mt-3 text-lg font-black text-slate-900">{sellers.length} parceiros</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="section-card p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">O que está no topo</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Produtos patrocinados</h2>
            </div>
            <Link href="/marketplace" className="text-sm font-semibold text-primary hover:underline">Ver todos</Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {featured.map((product) => (
              <article key={product.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-primary">Patrocinado</p>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{product.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{product.brief}</p>
                <p className="mt-4 text-sm font-semibold text-slate-900">{product.sales} vendas</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-card p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Recomendações</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Melhores escolhas</h2>
            </div>
            <Link href="/marketplace" className="text-sm font-semibold text-primary hover:underline">Explorar produtos</Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {topProducts.map((product) => (
              <article key={product.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">{product.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{product.brief}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-700">
                  <span>{product.rating.toFixed(1)} ★</span>
                  <span>{product.sales} vendas</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-card p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Perfil do vendedor</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Parceiros confiáveis</h2>
            </div>
            <Link href="/marketplace" className="text-sm font-semibold text-primary hover:underline">Ver vendedores</Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sellers.map((seller) => (
              <article key={seller.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5 shadow-sm">
                <p className="text-lg font-bold text-slate-900">{seller.name}</p>
                <p className="mt-2 text-sm text-slate-600">{seller.bio}</p>
                <p className="mt-4 text-sm text-slate-700">Reputação {seller.reputation.toFixed(1)} ★</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
