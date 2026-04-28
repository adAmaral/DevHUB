'use client';

import Link from 'next/link';
import { useState } from 'react';

const apps = [
  ['GitHub', 'Connected', 'Manage repository access and deploy keys.'],
  ['Slack', 'Connected', 'Receive alerts for billing and subscription events.'],
  ['Jira', 'Not connected', 'Sync roadmap tasks with marketplace projects.']
];

export default function SettingsConnectedAppsPage() {
  const [activeApp, setActiveApp] = useState(null);

  return (
    <main className="min-h-screen bg-background-light px-6 py-10">
      <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Settings</p>
        <h1 className="text-3xl font-black text-slate-900">Connected Apps</h1>

        <div className="mt-8 space-y-3">
          {apps.map(([name, status, desc]) => (
            <article key={name} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">
              <div>
                <h2 className="font-bold text-slate-900">{name}</h2>
                <p className="text-sm text-slate-600">{desc}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{status}</span>
                <button
                  onClick={() => setActiveApp(name)}
                  className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white"
                >
                  Configure
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Link href="/settings/billing" className="text-sm font-semibold text-primary hover:underline">
            Billing settings
          </Link>
          <Link href="/settings/team" className="text-sm font-semibold text-primary hover:underline">
            Team settings
          </Link>
        </div>
      </section>

      {activeApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Configure {activeApp}</h3>
            <p className="mt-2 text-sm text-slate-600">Adjust permissions and integration scopes for this app.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setActiveApp(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">
                Cancel
              </button>
              <button onClick={() => setActiveApp(null)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
                Save configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
