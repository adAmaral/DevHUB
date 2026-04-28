import { getNotifications } from '@/lib/marketplace-service';
import { LiveNotificationFeed } from '@/components/notifications/LiveNotificationFeed';

export default function NotificationsPage() {
  const notifications = getNotifications();

  return (
    <main className="min-h-screen bg-background-light px-4 py-8 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Central de notificações</p>
          <h1 className="mt-4 text-3xl font-black text-slate-900">Atualizações em tempo real</h1>
          <p className="mt-3 text-sm text-slate-600">
            Acompanhe pedidos, impulsionamentos e reputação do marketplace em um painel único.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">Histórico</h2>
            <div className="mt-6 space-y-4">
              {notifications.map((notification) => (
                <article key={notification.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{notification.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-500">{notification.time}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <LiveNotificationFeed initialNotifications={notifications} />
        </div>
      </div>
    </main>
  );
}
