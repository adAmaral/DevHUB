import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { requireSellerSession } from '@/lib/auth-guards';

export const metadata = {
  title: 'Dashboard Vendedor - DevHub Web',
  description: 'Gerencie seus produtos, pedidos e métricas no dashboard do vendedor.',
};

export default async function SellerDashboardPage() {
  const session = await requireSellerSession('/dashboard/seller');

  const products = await prisma.product.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  const productIds = products.map((product) => product.id);
  const salesOrders = productIds.length
    ? await prisma.order.findMany({
        where: { items: { some: { productId: { in: productIds } } } },
      })
    : [];

  const totalRevenue = salesOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <main className="min-h-screen bg-background-light px-4 py-10 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Seller dashboard</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Olá, {session.user.name ?? session.user.email}</h1>
          <p className="mt-3 text-sm text-slate-600">Gerencie seus produtos, acompanhe vendas e otimize sua reputação como vendedor.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Produtos ativos</p>
              <p className="mt-3 text-3xl font-black text-slate-900">{products.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Total de pedidos</p>
              <p className="mt-3 text-3xl font-black text-primary">{salesOrders.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Receita estimada</p>
              <p className="mt-3 text-3xl font-black text-primary">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/seller/products" className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90">
              Gerenciar produtos
            </Link>
            <Link href="/marketplace" className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">
              Visitar marketplace
            </Link>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900">Produtos recentes</h2>
          {products.length ? (
            <div className="mt-6 grid gap-4">
              {products.slice(0, 3).map((product) => (
                <article key={product.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-bold text-slate-900">{product.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{product.category}</p>
                    </div>
                    <div className="text-sm text-slate-700">
                      <p>Preço: ${product.price.toFixed(2)}</p>
                      <p>Atualizado: {new Date(product.updatedAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-sm text-slate-600">Você ainda não cadastrou produtos. Adicione novas ofertas para começar a vender.</div>
          )}
        </section>
      </section>
    </main>
  );
}
