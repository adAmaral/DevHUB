'use client';

import { useState } from 'react';

import { useCart } from '@/contexts/CartContext';

export function AddToCartButton({ item }) {
  const { addItem } = useCart();
  const [message, setMessage] = useState(null);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          addItem(item);
          setMessage('Added to cart');
          setTimeout(() => setMessage(null), 1500);
        }}
      >
        Add to cart
      </button>
      {message ? <p style={{ color: '#15803d' }}>{message}</p> : null}
    </div>
  );
}
