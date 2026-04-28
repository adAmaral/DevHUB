'use client';

import { CartProvider } from '@/contexts/CartContext';

export function Providers({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
