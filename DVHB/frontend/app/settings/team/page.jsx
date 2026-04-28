'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SettingsTeamPage() {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background-light px-6 py-10">
      <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Settings</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black text-slate-900">Team Management</h1>
          <Link href="/settings/security" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Voltar para configurações
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 p-4">
            <h2 className="font-bold text-slate-900">Alex Chen</h2>
            <p className="text-sm text-slate-600">Owner • alex@devhub.io</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-4">
            <h2 className="font-bold text-slate-900">Maya Costa</h2>
            <p className="text-sm text-slate-600">Billing Admin • maya@devhub.io</p>
          </article>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => setInviteOpen(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
            Invite teammate
          </button>
          <Link href="/settings/connected-apps" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Connected apps
          </Link>
        </div>
      </section>

      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Invite teammate</h3>
            <p className="mt-2 text-sm text-slate-600">Add an email and choose role to send invitation.</p>
            <input className="mt-4 h-11 w-full rounded-lg border border-slate-300 px-3" placeholder="teammate@company.com" type="email" />
            <select className="mt-3 h-11 w-full rounded-lg border border-slate-300 px-3">
              <option>Developer</option>
              <option>Billing Admin</option>
              <option>Viewer</option>
            </select>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setInviteOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">
                Cancel
              </button>
              <button onClick={() => setInviteOpen(false)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
                Send invite
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
