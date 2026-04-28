import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export default async function BuyerOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect('/auth/login?callbackUrl=/dashboard/buyer/orders');
  if (session.user.role !== 'buyer') redirect(`/dashboard/${session.user.role}`);

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });

  return (
    <main className="min-h-screen bg-background-light px-4 py-10 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Histórico de pedidos</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Seus pedidos</h1>
          <p className="mt-3 text-sm text-slate-600">Acompanhe o status de compras anteriores e revise itens comprados.</p>
        </div>

        {orders.length ? (
          <div className="grid gap-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Pedido {order.id}</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">Total de ${order.totalAmount.toFixed(2)}</p>
                    <p className="mt-1 text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="space-y-2 text-sm text-slate-700">
                    <p>Status: <strong>{order.paymentStatus}</strong></p>
                    <p>Imposto: ${order.taxAmount.toFixed(2)}</p>
                    <Link href={`/dashboard/buyer/orders/${order.id}`} className="inline-flex rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
                      Ver pedido
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-sm text-slate-600">
            Nenhum pedido encontrado ainda. Explore o marketplace para fazer sua primeira compra.
            <div className="mt-4">
              <Link href="/marketplace" className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90">
                Ir para o marketplace
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
