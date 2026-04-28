import Link from 'next/link';

export function ActionHubPage({ title, description, links }) {
  return (
    <main className="min-h-screen bg-background-light px-6 py-10 text-slate-900">
      <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">DevHub</p>
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">{description}</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
