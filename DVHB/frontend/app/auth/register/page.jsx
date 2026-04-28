'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const roles = ['buyer', 'seller', 'freelancer'];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        bio,
        skills: skills.split(',').map((skill) => skill.trim()),
      }),
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.error ?? 'Não foi possível criar a conta no momento.');
      setLoading(false);
      return;
    }

    const loginResult = await signIn('credentials', { email, password, callbackUrl: '/dashboard', redirect: false });

    setLoading(false);
    if (loginResult?.error) {
      router.push('/auth/login');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 lg:px-10">
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="form-card p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Criar Conta</p>
          <h1 className="mt-4 text-4xl font-black text-slate-900">Junte-se à comunidade DevHub</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">Cadastre-se como comprador, vendedor ou freelancer para acessar o marketplace e impulsionar sua próxima solução empresarial.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">Estou me juntando como...</p>
              <div className="role-selector">
                {roles.map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setRole(option)}
                    className={role === option ? 'active' : ''}
                  >
                    {option === 'buyer' ? 'Comprador' : option === 'seller' ? 'Fornecedor' : 'Desenvolvedor'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Nome completo
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-field mt-2"
                  placeholder="Alex Rivera"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Endereço de e-mail
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-field mt-2"
                  placeholder="alex@example.com"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Senha
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-field mt-2"
                  placeholder="••••••••"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Skills
                <input
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="form-field mt-2"
                  placeholder="Ex: analytics, ERP, integração"
                />
              </label>
            </div>

            <label className="block text-sm font-semibold text-slate-700">
              Biografia curta
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="form-field mt-2 min-h-[120px] resize-none"
                placeholder="Descreva brevemente sua experiência ou interesse"
              />
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" disabled={loading} className="primary-button w-full sm:w-auto">
                {loading ? 'Criando conta...' : 'Criar minha conta'}
              </button>
              <p className="text-sm text-slate-500">Já possui conta? <a href="/auth/login" className="text-primary font-semibold hover:underline">Entrar</a></p>
            </div>

            {error ? <p className="rounded-3xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p> : null}
          </form>
        </div>
      </section>
    </main>
  );
}
