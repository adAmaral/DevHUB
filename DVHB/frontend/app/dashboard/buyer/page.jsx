import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Dashboard Comprador - DevHub Web',
  description: 'Acompanhe seus pedidos e histórico de compras no dashboard do comprador.',
};

export default async function BuyerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect('/auth/login?callbackUrl=/dashboard/buyer');
  if (session.user.role !== 'buyer') redirect(`/dashboard/${session.user.role}`);

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <main className="min-h-screen bg-background-light px-4 py-10 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Buyer dashboard</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Bem-vindo de volta, {session.user.name ?? session.user.email}</h1>
          <p className="mt-3 text-sm text-slate-600">Gerencie seus pedidos, acompanhe entregas e continue comprando softwares com segurança.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Pedidos recentes</p>
              <p className="mt-3 text-3xl font-black text-slate-900">{orders.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Total gasto</p>
              <p className="mt-3 text-3xl font-black text-primary">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Próximo passo</p>
              <p className="mt-3 text-3xl font-black text-slate-900">Continue explorando</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard/buyer/orders" className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90">
              Ver todos os pedidos
            </Link>
            <Link href="/marketplace" className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">
              Explorar marketplace
            </Link>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900">Últimos pedidos</h2>
          {orders.length ? (
            <div className="mt-6 grid gap-4">
              {orders.map((order) => (
                <article key={order.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Pedido {order.id}</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">Total ${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="text-sm text-slate-600">
                      <p>Status: {order.paymentStatus}</p>
                      <p className="mt-1">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/buyer/orders/${order.id}`} className="mt-4 inline-flex rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90">
                    Ver detalhes
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-sm text-slate-600">Nenhum pedido encontrado. Explore o marketplace para fazer sua primeira compra.</div>
          )}
        </section>
      </section>
    </main>
  );
}
