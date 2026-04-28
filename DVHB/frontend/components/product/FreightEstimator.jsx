'use client';

import { useMemo, useState } from 'react';

export function FreightEstimator({ baseShipping }) {
  const [postalCode, setPostalCode] = useState('');
  const [region, setRegion] = useState('BR');

  const fee = useMemo(() => {
    if (!postalCode) return baseShipping;
    const base = Number(baseShipping) || 0;
    const regionMultiplier = region === 'BR' ? 1 : 1.3;
    return Math.max(0, Math.round((base * regionMultiplier + postalCode.slice(-2).charCodeAt(0)) * 100) / 100);
  }, [baseShipping, postalCode, region]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-lg font-black text-slate-900">Calcular frete</h3>
      <p className="mt-2 text-sm text-slate-600">Digite o CEP para estimar o prazo e o valor de envio.</p>
      <div className="mt-4 grid gap-3">
        <input
          type="text"
          value={postalCode}
          onChange={(event) => setPostalCode(event.target.value)}
          placeholder="CEP ou código do cliente"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <select
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary"
        >
          <option value="BR">Brasil</option>
          <option value="US">Internacional</option>
        </select>
      </div>
      <div className="mt-5 rounded-3xl bg-white p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Valor estimado</p>
        <p className="mt-2 text-2xl font-black text-primary">${fee.toFixed(2)}</p>
        <p className="mt-1">Prazo estimado: {region === 'BR' ? '2-5 dias úteis' : '7-12 dias úteis'}</p>
      </div>
    </div>
  );
}
