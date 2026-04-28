import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-background-light px-6 py-12">
      <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Account Recovery</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Forgot your password?</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your email and we will send a recovery link. This flow is public and does not require login.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Email</label>
          <input
            className="h-12 w-full rounded-lg border border-slate-200 px-4 outline-none ring-primary/20 focus:ring-2"
            placeholder="you@company.com"
            type="email"
          />
          <Link href="/login" className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white">
            Send recovery link
          </Link>
        </div>

        <div className="mt-6 flex gap-3">
          <Link href="/login" className="text-sm font-semibold text-primary hover:underline">
            Back to login
          </Link>
          <Link href="/support" className="text-sm font-semibold text-slate-600 hover:underline">
            Need help?
          </Link>
        </div>
      </section>
    </main>
  );
}
