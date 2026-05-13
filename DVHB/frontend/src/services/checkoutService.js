const json = async (r) => {
  if (!r.ok) throw new Error('Erro ao processar checkout.');
  return r.json();
};

export async function createCheckout(payload) {
  const res = await fetch('/api/checkout/create', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  return json(res);
}

export async function finalizeOrder(payload) {
  const res = await fetch('/api/checkout/finalize', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  return json(res);
}
