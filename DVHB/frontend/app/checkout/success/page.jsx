'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useCart } from '@/contexts/CartContext';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('Finalizando seu pedido...');
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setStatus('Não foi possível encontrar o identificador da sessão de pagamento.');
      return;
    }

    const run = async () => {
      const response = await fetch('/api/checkout/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      if (!response.ok || !data.orderId) {
        setStatus('O pagamento foi processado, mas não foi possível finalizar o pedido. Contate o suporte.');
        return;
      }

      clearCart();
      setOrderId(data.orderId);
      setStatus('Pagamento confirmado! Seu pedido foi criado com sucesso.');
    };

    run();
  }, [searchParams, clearCart]);

  return (
    <main className="min-h-screen bg-background-light px-4 py-10 lg:px-10">
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900">Compra concluída</h1>
        <p className="mt-4 text-sm text-slate-600">{status}</p>
        {orderId ? (
          <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">ID do pedido</p>
            <p className="mt-2 text-base font-bold text-primary">{orderId}</p>
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard/buyer/orders')}
            className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Ver meus pedidos
          </button>
          <button
            type="button"
            onClick={() => router.push('/marketplace')}
            className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Voltar ao marketplace
          </button>
        </div>
      </section>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background-light px-4 py-10 lg:px-10"><p className="text-center">Carregando status do checkout...</p></main>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
