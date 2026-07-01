const json = async (r) => {
  if (!r.ok) throw new Error('Erro ao buscar dados de produtos.');
  return r.json();
};

export async function fetchProducts(params = {}) {
  const qs = new URLSearchParams(params);
  const url = `/api/products${qs.toString() ? `?${qs}` : ''}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  return json(res);
}

export async function fetchProductBySlug(slug) {
  if (!slug) throw new Error('Slug inválido.');
  const res = await fetch(`/api/products/${encodeURIComponent(slug)}`, { headers: { Accept: 'application/json' } });
  return json(res);
}
