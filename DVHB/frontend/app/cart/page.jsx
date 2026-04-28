'use client';

import Link from 'next/link';

import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <main className="min-h-screen bg-background-light px-4 py-8 lg:px-10">
      <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Cart</p>
            <h1 className="text-3xl font-black text-slate-900">Seu carrinho</h1>
            <p className="mt-1 text-sm text-slate-600">Revise produtos e serviços antes de seguir para o checkout.</p>
          </div>
          <Link href="/marketplace" className="rounded-lg border border-primary/30 px-4 py-2 text-sm font-semibold text-primary">
            Continuar comprando
          </Link>
        </div>

        {!items.length ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <p className="text-lg font-bold text-slate-900">Seu carrinho está vazio</p>
            <p className="mt-2 text-sm text-slate-600">Adicione softwares do marketplace para montar seu stack ideal.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/marketplace" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Explorar marketplace</Link>
              <Link href="/pricing" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Ver planos</Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="mt-8 grid gap-3">
              {items.map((item) => (
                <li key={item.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-600">{item.type === 'service' ? 'Freelancer service' : 'Software product'}</p>
                    </div>
                    <strong className="text-primary">${item.price.toFixed(2)}</strong>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="text-sm font-semibold text-slate-700">
                      Quantidade
                      <input
                        className="ml-2 h-9 w-20 rounded-lg border border-slate-300 px-2"
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                      />
                    </label>
                    <button type="button" onClick={() => removeItem(item.id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-lg font-black text-slate-900">Subtotal: ${subtotal.toFixed(2)}</p>
              <Link href="/checkout" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
                Ir para checkout
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
