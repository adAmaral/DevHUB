import { renderProductCard } from './productCard.js';

/**
 * Renderização da lista de produtos.
 */
export function renderProductList(container, produtos) {
  if (!produtos.length) {
    container.innerHTML = '<p class="message info">Nenhum produto encontrado.</p>';
    return;
  }

  container.innerHTML = produtos.map(renderProductCard).join('');
}
