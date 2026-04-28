'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SettingsBillingPage() {
  const [saved, setSaved] = useState(false);

  return (
    <main className="min-h-screen bg-background-light px-4 py-8 lg:px-10">
      <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Settings</p>
            <h1 className="text-3xl font-black text-slate-900">Billing & Payments</h1>
            <p className="mt-1 text-sm text-slate-600">Gerencie cartão, plano e histórico financeiro.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/settings/security" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              Voltar para configurações
            </Link>
            <Link href="/billing/invoices" className="rounded-lg border border-primary/30 px-4 py-2 text-sm font-semibold text-primary">
              Histórico de faturas
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Plano Atual</p>
            <p className="mt-2 text-lg font-bold text-slate-900">CloudScale Pro</p>
            <p className="text-sm text-slate-600">$49/mês</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Método de Pagamento</p>
            <p className="mt-2 text-lg font-bold text-slate-900">Visa •••• 8812</p>
            <p className="text-sm text-slate-600">Expira em 08/2027</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Próxima Cobrança</p>
            <p className="mt-2 text-lg font-bold text-slate-900">24 Out 2026</p>
            <p className="text-sm text-slate-600">Renovação automática ativa</p>
          </article>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 p-4">
          <h2 className="text-lg font-black text-slate-900">Cartões cadastrados</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Visa •••• 8812</p>
              <p className="text-sm text-slate-600">Titular: DevHub Admin</p>
              <p className="text-sm text-slate-600">Expira em 08/2027</p>
            </div>
            <div className="rounded-xl border border-dashed border-slate-300 p-4">
              <p className="font-semibold text-slate-900">Adicionar novo cartão</p>
              <p className="text-sm text-slate-600">Cadastre um cartão de backup para evitar falhas de renovação.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 2200);
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Salvar alterações
          </button>
          <Link href="/subscriptions" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Gerenciar assinaturas
          </Link>
        </div>
      </section>

      {saved && (
        <div className="fixed bottom-6 right-6 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          Configurações de cobrança salvas com sucesso.
        </div>
      )}
    </main>
  );
}
