import Link from 'next/link';

const solutionGroups = [
  {
    title: 'Startup Pack',
    text: 'Fast launch bundle with CI/CD, observability and analytics starter kits.',
    cta: '/marketplace'
  },
  {
    title: 'Security Stack',
    text: 'Identity, secrets, WAF and threat monitoring curated for production-ready teams.',
    cta: '/marketplace'
  },
  {
    title: 'Enterprise Integrations',
    text: 'Single sign-on, audit trails and enterprise connectors for large organizations.',
    cta: '/pricing'
  }
];

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-background-light px-6 py-10">
      <section className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">DevHub</p>
        <h1 className="text-3xl font-black text-slate-900">Solutions Explorer</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Discover complete solution paths, compare bundles, and navigate directly to pricing or tools tailored for your team stage.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {solutionGroups.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-900">{item.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{item.text}</p>
              <Link href={item.cta} className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">
                Explore
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-primary/5 p-4">
          <h3 className="font-bold text-slate-900">Need a custom architecture?</h3>
          <p className="mt-1 text-sm text-slate-600">Talk to our solution architects to design an end-to-end stack.</p>
          <div className="mt-3 flex gap-3">
            <Link href="/support" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
              Talk to specialist
            </Link>
            <Link href="/marketplace" className="rounded-lg border border-primary/30 px-4 py-2 text-sm font-semibold text-primary">
              Browse tools
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
