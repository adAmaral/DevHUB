'use client';

import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
  const provider = searchParams.get('provider');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const providerMessage = useMemo(() => {
    if (!provider) return null;
    if (provider === 'google' || provider === 'github') {
      return `Login via ${provider} ainda não está configurado. Use email e senha enquanto finalizamos a integração.`;
    }
    return null;
  }, [provider]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setError('Invalid email or password.');
      return;
    }

    router.push(result.url ?? '/dashboard');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-background-light px-4 py-10">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">DevHub</p>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">Acesse sua conta para continuar no dashboard.</p>

        {providerMessage && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm font-medium text-amber-700">{providerMessage}</p>}
        {callbackUrl && <p className="mt-3 text-xs text-slate-500">Após login, você será redirecionado para: {callbackUrl}</p>}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-1 text-sm font-semibold text-slate-700" htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-lg border border-slate-300 px-3 outline-none focus:border-primary"
            />
          </label>

          <label className="grid gap-1 text-sm font-semibold text-slate-700" htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-lg border border-slate-300 px-3 outline-none focus:border-primary"
            />
          </label>

          {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p> : null}

          <button type="submit" disabled={loading} className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          No account?{' '}
          <Link href="/auth/register" className="font-semibold text-primary hover:underline">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background-light p-10"><p className="text-center">Loading login...</p></main>}>
      <LoginForm />
    </Suspense>
  );
}
