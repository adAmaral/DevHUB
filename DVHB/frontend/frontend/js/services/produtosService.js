import { getProdutoById, getProdutos } from './api.js';

/**
 * Serviço de produtos: mantém API centralizada para facilitar troca por backend.
 */
export async function listarProdutos() {
  return getProdutos();
}

export async function obterProduto(id) {
  return getProdutoById(id);
}

export function filtrarProdutos(produtos, termo) {
  const q = termo.trim().toLowerCase();
  if (!q) return produtos;

  return produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(q) || produto.descricao.toLowerCase().includes(q),
  );
}
