const CART_KEY = 'devhub:cart';

/**
 * Serviço de carrinho isolado do app.
 * FUTURO BACKEND: substituir leitura local por GET /cart e escrita por POST/PUT /cart.
 */
export function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCart(cartItems) {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
}

export function addItemToCart(productId) {
  const cart = getCart();
  const current = cart.find((item) => item.id === productId);

  if (current) {
    current.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  saveCart(cart);
  return cart;
}

export function getCartItemsCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}
