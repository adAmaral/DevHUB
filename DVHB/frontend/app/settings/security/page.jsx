'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const securityCards = [
  { id: 'password', title: 'Senha', description: 'Última alteração: há 34 dias.', actions: ['Alterar senha'] },
  { id: '2fa', title: 'Autenticação em 2 fatores', description: 'Recomendado para proteger sua conta.', actions: ['Configurar 2FA'] },
  { id: 'sessions', title: 'Sessões ativas', description: 'Gerencie dispositivos conectados e encerre sessões antigas.', actions: ['Ver sessões', 'Encerrar outras sessões'] },
];

export default function SettingsSecurityPage() {
  const [query, setQuery] = useState('');

  const filteredCards = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return securityCards;

    return securityCards.filter((card) => {
      const haystack = `${card.title} ${card.description} ${card.actions.join(' ')}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query]);

  return (
    <main className="min-h-screen bg-background-light px-4 py-8 lg:px-10">
      <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Settings</p>
            <h1 className="text-3xl font-black text-slate-900">Security & Access</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/settings/billing" className="rounded-lg border border-primary/30 px-4 py-2 text-sm font-semibold text-primary">Billing</Link>
            <Link href="/dashboard" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Voltar ao dashboard</Link>
          </div>
        </div>

        <div className="mt-6">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="security-search">Buscar nas configurações</label>
          <input
            id="security-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: senha, 2FA, sessões"
            className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-primary"
          />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {filteredCards.map((card) => (
            <article key={card.id} className={`rounded-xl border border-slate-200 bg-slate-50 p-4 ${card.id === 'sessions' ? 'md:col-span-2' : ''}`}>
              <h2 className="font-bold text-slate-900">{card.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{card.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {card.actions.map((action) => (
                  <button key={action} className={`rounded-lg px-4 py-2 text-sm font-semibold ${action.includes('Encerrar') ? 'border border-red-200 text-red-700' : action.includes('Configurar') ? 'border border-primary/30 text-primary' : 'bg-primary text-white'}`}>
                    {action}
                  </button>
                ))}
              </div>
            </article>
          ))}

          {!filteredCards.length && (
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 md:col-span-2">
              Nenhuma configuração encontrada para “{query}”.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
