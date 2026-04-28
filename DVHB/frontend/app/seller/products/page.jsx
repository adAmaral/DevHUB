import Link from 'next/link';

import { requireSellerSession } from '@/lib/auth-guards';
import { prisma } from '@/lib/prisma';

export default async function SellerProductsPage() {
  const session = await requireSellerSession('/seller/products');

  const products = await prisma.product.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h1>Your Software Products & Services</h1>
      <p>Manage marketplace listings as a seller/freelancer account owner.</p>
      <Link href="/seller/products/new">Add New Product</Link>

      <ul style={{ marginTop: 24, display: 'grid', gap: 14 }}>
        {products.map((product) => (
          <li key={product.id} style={{ border: '1px solid #ddd', padding: 12 }}>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Price:</strong> ${product.price.toFixed(2)}
            </p>
            <p>
              <strong>Ratings:</strong> {product.ratings ?? 'Not rated'}
            </p>
            <Link href={`/seller/products/${product.id}/edit`}>Edit</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
