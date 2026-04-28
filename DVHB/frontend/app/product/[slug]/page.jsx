import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { getProductBySlug, getSellerById, formatCurrency } from '@/lib/marketplace-service';

export async function generateMetadata({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: 'Produto não encontrado' };

  return {
    title: `${product.title} - DevHub Web`,
    description: product.description || `Compre ${product.title} no marketplace DevHub. ${product.category} • ${product.location}`,
    keywords: `${product.category}, software, ${product.title}`,
    alternates: {
      canonical: `https://devhub477.vercel.app/product/${params.slug}`,
    },
    openGraph: {
      title: `${product.title} - DevHub Web`,
      description: product.description || `Compre ${product.title} no marketplace DevHub.`,
      images: product.images?.[0] ? [{ url: product.images[0], alt: product.title }] : [],
    },
  };
}

export default function ProductDetailPage({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const seller = getSellerById(product.vendorId);

  return (
    <main className="min-h-screen bg-background-light px-4 py-8 lg:px-10">
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.title,
            "description": product.description,
            "image": product.images || [],
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "BRL",
              "availability": "https://schema.org/InStock",
            },
            "brand": {
              "@type": "Brand",
              "name": seller?.name || "DevHub",
            },
          }),
        }}
      />
      <section className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Produto</p>
            <h1 className="mt-3 text-3xl font-black text-slate-900">{product.title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{product.category} • {product.location} • {product.delivery}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Preço</p>
            <p className="mt-2 text-3xl font-black text-primary">{formatCurrency(product.price)}</p>
            <span className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              {product.isSponsored ? 'Patrocinado' : 'Destaque'}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_420px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-black text-slate-900">Sobre o software</h2>
              <p className="mt-4 text-slate-700">{product.description}</p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Avaliação</p>
                <p className="mt-3 text-2xl font-black text-slate-900">{product.rating.toFixed(1)} ★</p>
                <p className="mt-2 text-sm text-slate-600">{product.ratingCount} avaliações</p>
              </article>
              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Vendas</p>
                <p className="mt-3 text-2xl font-black text-slate-900">{product.sales}</p>
                <p className="mt-2 text-sm text-slate-600">clientes satisfeitos</p>
              </article>
              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Entrega</p>
                <p className="mt-3 text-2xl font-black text-slate-900">{product.delivery}</p>
                <p className="mt-2 text-sm text-slate-600">Prazo estimado</p>
              </article>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 className="text-xl font-black text-slate-900">Recursos principais</h3>
              <ul className="mt-4 grid gap-3">
                {product.features.map((feature) => (
                  <li key={feature} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">• {feature}</li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black text-slate-900">Ação rápida</h3>
              <div className="mt-5 space-y-4">
                <AddToCartButton
                  item={{
                    id: product.id,
                    title: product.title,
                    description: product.brief,
                    price: product.price,
                    image: product.images[0],
                    category: product.category,
                  }}
                />
                <Link href="/checkout" className="block rounded-2xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary/90">
                  Ir para checkout
                </Link>
                <Link href="/support" className="block rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-900 hover:bg-slate-50">
                  Falar com especialista
                </Link>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black text-slate-900">Vendedor</h3>
              {seller ? (
                <div className="mt-4 space-y-4 rounded-3xl bg-slate-50 p-5">
                  <p className="text-lg font-bold text-slate-900">{seller.name}</p>
                  <p className="text-sm text-slate-600">{seller.bio}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4 text-sm text-slate-700">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Reputação</p>
                      <p className="mt-2 text-2xl font-black text-primary">{seller.reputation.toFixed(1)}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 text-sm text-slate-700">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Vendas</p>
                      <p className="mt-2 text-2xl font-black text-slate-900">{seller.totalSales}</p>
                    </div>
                  </div>
                  <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">{seller.verified ? 'Verificado' : 'Não verificado'}</p>
                  <Link href={`/seller/${seller.id}`} className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90">
                    Ver perfil do vendedor
                  </Link>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-600">Informações do vendedor não encontradas.</p>
              )}
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
