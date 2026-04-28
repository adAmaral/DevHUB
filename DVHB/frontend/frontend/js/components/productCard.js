/**
 * Componente de card de produto.
 */
export function renderProductCard(produto) {
  return `
    <article class="card">
      <img class="image" src="${produto.imagem}" alt="${produto.nome}" />
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
      <div class="row">
        <strong>R$ ${produto.preco.toFixed(2)}</strong>
        <div class="row">
          <a class="btn btn-secondary" href="produto.html?id=${produto.id}">Detalhes</a>
          <button class="btn btn-primary" data-add-cart="${produto.id}">Adicionar</button>
        </div>
      </div>
    </article>
  `;
}
