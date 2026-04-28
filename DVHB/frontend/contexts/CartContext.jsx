'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'devhub_cart_v1';

function normalizeItem(item) {
  if (!item || typeof item !== 'object') return null;
  if (!item.id || !item.title) return null;

  const price = Number(item.price);
  if (!Number.isFinite(price) || price < 0) return null;

  return {
    id: String(item.id),
    title: String(item.title),
    description: item.description ? String(item.description) : '',
    price,
    image: item.image ? String(item.image) : '',
    category: item.category ? String(item.category) : '',
    type: item.type === 'service' ? 'service' : 'product',
    quantity: Math.max(1, Number(item.quantity) || 1),
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      const safeItems = Array.isArray(parsed) ? parsed.map(normalizeItem).filter(Boolean) : [];
      setItems(safeItems);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    const normalized = normalizeItem(item);
    if (!normalized) return;

    setItems((current) => {
      const existing = current.find((entry) => entry.id === normalized.id);
      if (existing) {
        return current.map((entry) =>
          entry.id === normalized.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
        );
      }
      return [...current, { ...normalized, quantity: 1 }];
    });
  };

  const removeItem = (id) => {
    setItems((current) => current.filter((entry) => entry.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1);
    setItems((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, quantity: safeQuantity } : entry)),
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
