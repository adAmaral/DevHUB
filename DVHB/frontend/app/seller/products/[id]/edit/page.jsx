import { notFound } from 'next/navigation';

import { ProductForm } from '@/components/seller/ProductForm';
import { requireSellerSession } from '@/lib/auth-guards';
import { prisma } from '@/lib/prisma';

export default async function EditProductPage({ params }) {
  const session = await requireSellerSession(`/seller/products/${params.id}/edit`);

  const product = await prisma.product.findFirst({
    where: { id: params.id, ownerId: session.user.id },
  });

  if (!product) {
    notFound();
  }

  return (
    <main style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h1>Edit Product</h1>
      <ProductForm
        mode="edit"
        productId={product.id}
        defaultValues={{
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
          features: product.features,
          images: product.images,
          technologyStack: product.technologyStack,
          freelancerAvailable: product.freelancerAvailable,
        }}
      />
    </main>
  );
}
