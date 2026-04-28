import { ProductForm } from '@/components/seller/ProductForm';
import { requireSellerSession } from '@/lib/auth-guards';

export default async function NewProductPage() {
  await requireSellerSession('/seller/products/new');

  return (
    <main style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h1>Create Product Listing</h1>
      <p>Add software products or freelancer services to the marketplace.</p>
      <ProductForm mode="create" />
    </main>
  );
}
