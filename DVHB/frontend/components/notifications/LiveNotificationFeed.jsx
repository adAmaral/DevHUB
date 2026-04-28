'use client';

import { useEffect, useMemo, useState } from 'react';

const notificationTemplates = [
  { title: 'Novo pedido recebido', subtitle: 'O pedido #DH-00XX entrou em processamento.' },
  { title: 'Mensagem do vendedor', subtitle: 'A resposta à sua pergunta foi enviada.' },
  { title: 'Promoção ativa', subtitle: 'Campanha patrocinada ganhou destaque na homepage.' },
  { title: 'Reputação atualizada', subtitle: 'Seu perfil passou a 4.8 estrelas de vendedor.' }
];

export function LiveNotificationFeed({ initialNotifications = [] }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const nextNotification = useMemo(() => {
    const index = notifications.length % notificationTemplates.length;
    const template = notificationTemplates[index];
    return {
      id: `n-${Date.now()}`,
      title: template.title,
      message: template.subtitle,
      time: 'Agora',
    };
  }, [notifications.length]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNotifications((current) => [nextNotification, ...current].slice(0, 5));
    }, 9000);

    return () => window.clearInterval(interval);
  }, [nextNotification]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Notificações</p>
          <h2 className="mt-2 text-xl font-black text-slate-900">Tempo real</h2>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">Ao vivo</span>
      </div>

      <div className="mt-6 space-y-4">
        {notifications.map((notification) => (
          <article key={notification.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
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
  );
}
