import Link from 'next/link';
import { notFound } from 'next/navigation';

const subscriptions = {
  'cloudscale-pro': {
    name: 'CloudScale Pro',
    plan: 'Enterprise Plan',
    renew: 'Renews Oct 24',
    amount: '$199/mo'
  },
  'devstack-pro-kit': {
    name: 'DevStack Pro Kit',
    plan: 'Developer License',
    renew: 'Renews Nov 01',
    amount: '$49/mo'
  },
  'cloudguard-security': {
    name: 'CloudGuard Security',
    plan: 'Standard Plan',
    renew: 'Renews Oct 28',
    amount: '$89/mo'
  }
};

export default function SubscriptionDetailPage({ params }) {
  const subscription = subscriptions[params.slug];

  if (!subscription) notFound();

  return (
    <main className="min-h-screen bg-background-light px-6 py-10">
      <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Subscription</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">{subscription.name}</h1>
        <p className="mt-1 text-sm text-slate-600">{subscription.plan}</p>

        <div className="mt-8 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-slate-500">Plano</p>
            <p className="font-semibold text-slate-900">{subscription.plan}</p>
          </div>
          <div>
            <p className="text-slate-500">Próxima renovação</p>
            <p className="font-semibold text-slate-900">{subscription.renew}</p>
          </div>
          <div>
            <p className="text-slate-500">Valor</p>
            <p className="font-semibold text-slate-900">{subscription.amount}</p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Link href="/billing/invoices" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
            Ir para billing
          </Link>
          <Link href="/subscriptions" className="rounded-lg border border-primary/30 px-4 py-2 text-sm font-semibold text-primary">
            Voltar para assinaturas
          </Link>
        </div>
      </section>
    </main>
  );
}
