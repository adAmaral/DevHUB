import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export default async function BuyerOrderDetailPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect('/auth/login?callbackUrl=/dashboard/buyer/orders');
  if (session.user.role !== 'buyer') redirect(`/dashboard/${session.user.role}`);

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { items: true },
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background-light px-4 py-10 lg:px-10">
      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Pedido</p>
            <h1 className="mt-3 text-3xl font-black text-slate-900">{order.id}</h1>
            <p className="mt-1 text-sm text-slate-600">Criado em {new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-700">
            Status: {order.paymentStatus}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Total</p>
            <p className="mt-3 text-2xl font-black text-slate-900">${order.totalAmount.toFixed(2)}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Impostos</p>
            <p className="mt-3 text-2xl font-black text-slate-900">${order.taxAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-black text-slate-900">Itens do pedido</h2>
          {order.items.map((item) => (
            <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-600">Quantidade: {item.quantity}</p>
                </div>
                <div className="text-sm font-semibold text-slate-900">${item.lineTotal.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/dashboard/buyer/orders" className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">
            Voltar aos pedidos
          </a>
        </div>
      </section>
    </main>
  );
}
