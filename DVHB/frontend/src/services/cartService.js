const json = async (r, fallbackMsg) => { if (!r.ok) throw new Error(fallbackMsg); return r.json(); };
export async function fetchCart() { return (await json(await fetch('/api/cart', { headers: { Accept: 'application/json' } }), 'Não foi possível carregar carrinho.')).items || []; }
export async function applyCoupon(code) { return json(await fetch('/api/cart/coupon', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) }), 'Não foi possível validar cupom.'); }
export async function addCartItem(payload) { return json(await fetch('/api/cart/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }), 'Não foi possível adicionar ao carrinho.'); }
export async function removeCartItem(itemId) { return json(await fetch(`/api/cart/items/${encodeURIComponent(itemId)}`, { method: 'DELETE' }), 'Não foi possível remover item.'); }
