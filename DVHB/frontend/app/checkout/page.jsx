'use client';

import { useState } from 'react';

import { useCart } from '@/contexts/CartContext';

const TAX_RATE = 0.08;

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, paymentMethod, taxRate: TAX_RATE }),
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? 'Unable to create checkout session.');
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment initialization failed.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background-light px-4 py-8 lg:px-10">
      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.3fr_1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">Checkout</h1>
          <p className="mt-1 text-sm text-slate-600">Revise seus itens e finalize com segurança.</p>

          <div className="mt-6 space-y-3">
            {!items.length && <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">Seu carrinho está vazio.</p>}
            {items.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-600">Quantidade: {item.quantity}</p>
                <p className="mt-1 text-sm font-semibold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </article>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Resumo do pedido</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Taxa (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="mt-2 border-t pt-2 text-base font-bold flex justify-between"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">Forma de pagamento</h3>
          <div className="mt-3 space-y-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm">
              <input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
              Cartão de crédito/débito (Stripe)
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm">
              <input type="radio" checked={paymentMethod === 'bank_transfer'} onChange={() => setPaymentMethod('bank_transfer')} />
              Transferência bancária
            </label>
          </div>

          {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}

          <button
            type="button"
            onClick={handlePayment}
            disabled={!items.length || loading}
            className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Redirecionando para Stripe...' : 'Pagar agora'}
          </button>
        </aside>
      </section>
    </main>
  );
}
