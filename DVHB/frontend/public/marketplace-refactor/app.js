const hasDOM = typeof window !== 'undefined' && typeof document !== 'undefined';

if (hasDOM) {
  /**
   * Estado da aplicação.
   */
  const state = {
    products: [],
    cart: {},
    filters: {
      query: '',
      maxPrice: 500,
    },
  };

  const elements = {
    searchInput: document.querySelector('#searchInput'),
    priceInput: document.querySelector('#priceInput'),
    priceLabel: document.querySelector('#priceLabel'),
    clearFiltersBtn: document.querySelector('#clearFiltersBtn'),
    productGrid: document.querySelector('#productGrid'),
    resultCount: document.querySelector('#resultCount'),
    emptyState: document.querySelector('#emptyState'),
    cartList: document.querySelector('#cartList'),
    cartCount: document.querySelector('#cartCount'),
    cartTotal: document.querySelector('#cartTotal'),
    themeToggle: document.querySelector('#themeToggle'),
  };

  const formatCurrency = (value) => `$${Number(value).toFixed(2)}`;

  /**
   * Camada de acesso a dados (preparada para API).
   * Hoje retorna mock local; amanhã pode trocar para fetch('/api/products').
   */
  async function loadProducts() {
    return window.MOCK_PRODUCTS ?? [];
  }

  function getFilteredProducts() {
    const query = state.filters.query.trim().toLowerCase();

    return state.products.filter((product) => {
      const matchesQuery =
        !query
        || product.nome.toLowerCase().includes(query)
        || product.descricao.toLowerCase().includes(query);

      const matchesPrice = product.preco <= state.filters.maxPrice;

      return matchesQuery && matchesPrice;
    });
  }

  function getCartItems() {
    return Object.values(state.cart);
  }

  /**
   * Renderiza catálogo dinamicamente com os dados carregados.
   * Remove necessidade de produto hardcoded no HTML.
   */
  function renderProducts() {
    const products = getFilteredProducts();

    elements.productGrid.innerHTML = products
      .map(
        (product) => `
      <article class="card">
        <img class="card__image" src="${product.imagem}" alt="${product.nome}" loading="lazy" />
        <h3>${product.nome}</h3>
        <p>${product.descricao}</p>
        <div class="card__footer">
          <strong>${formatCurrency(product.preco)}</strong>
          <button class="btn btn--secondary" data-action="add" data-id="${product.id}" type="button">Adicionar</button>
        </div>
      </article>
    `,
      )
      .join('');

    elements.resultCount.textContent = `${products.length} resultado(s)`;
    elements.emptyState.hidden = products.length > 0;
  }

  function renderCart() {
    const items = getCartItems();

    elements.cartList.innerHTML = items
      .map(
        (item) => `
      <li class="cart-item">
        <div class="cart-item__top">
          <strong>${item.nome}</strong>
          <button class="btn btn--danger" data-action="remove" data-id="${item.id}" type="button">Remover</button>
        </div>
        <small>${formatCurrency(item.preco)} cada</small>
        <div class="cart-item__qty">
          <button class="btn btn--ghost" data-action="decrease" data-id="${item.id}" type="button">-</button>
          <span>${item.quantity}</span>
          <button class="btn btn--ghost" data-action="increase" data-id="${item.id}" type="button">+</button>
        </div>
      </li>
    `,
      )
      .join('');

    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.quantity * item.preco, 0);

    elements.cartCount.textContent = String(count);
    elements.cartTotal.textContent = formatCurrency(total);
  }

  function updateCart(productId, operation) {
    const product = state.products.find((item) => item.id === productId);
    if (!product) return;

    const currentItem = state.cart[productId] ?? { ...product, quantity: 0 };

    if (operation === 'add' || operation === 'increase') {
      currentItem.quantity += 1;
      state.cart[productId] = currentItem;
    }

    if (operation === 'decrease') {
      currentItem.quantity = Math.max(0, currentItem.quantity - 1);
      if (currentItem.quantity === 0) {
        delete state.cart[productId];
      } else {
        state.cart[productId] = currentItem;
      }
    }

    if (operation === 'remove') {
      delete state.cart[productId];
    }

    renderCart();
  }

  function bindEvents() {
    elements.searchInput.addEventListener('input', (event) => {
      state.filters.query = event.target.value;
      renderProducts();
    });

    elements.priceInput.addEventListener('input', (event) => {
      state.filters.maxPrice = Number(event.target.value);
      elements.priceLabel.textContent = `Até ${formatCurrency(state.filters.maxPrice)}`;
      renderProducts();
    });

    elements.clearFiltersBtn.addEventListener('click', () => {
      state.filters = { query: '', maxPrice: 500 };
      elements.searchInput.value = '';
      elements.priceInput.value = '500';
      elements.priceLabel.textContent = 'Até $500';
      renderProducts();
    });

    document.addEventListener('click', (event) => {
      const target = event.target.closest('[data-action]');
      if (!target) return;

      const { action, id } = target.dataset;
      updateCart(id, action);
    });

    elements.themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
    });
  }

  async function init() {
    state.products = await loadProducts();
    bindEvents();
    renderProducts();
    renderCart();
  }

  init();
}
