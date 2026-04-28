import Link from 'next/link';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background-light px-6 py-10">
      <section className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">DevHub</p>
        <h1 className="text-3xl font-black text-slate-900">Pricing</h1>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['Starter', '$0', 'For evaluation and prototyping.'],
            ['Pro', '$49/mo', 'For growing teams and production use.'],
            ['Enterprise', 'Custom', 'For compliance and dedicated support.']
          ].map(([name, price, desc]) => (
            <article key={name} className="rounded-xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900">{name}</h2>
              <p className="mt-2 text-2xl font-black text-primary">{price}</p>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
              <Link href="/checkout" className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
                Choose plan
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
