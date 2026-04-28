import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

function parseStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => String(entry).trim()).filter(Boolean);
}

async function getAuthorizedSellerOrFreelancer() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !['seller', 'freelancer'].includes(session.user.role)) return null;
  return session;
}

export async function GET(_request, context) {
  const session = await getAuthorizedSellerOrFreelancer();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const product = await prisma.product.findFirst({
    where: { id: context.params.id, ownerId: session.user.id },
  });

  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  return NextResponse.json({ product });
}

export async function PATCH(request, context) {
  const session = await getAuthorizedSellerOrFreelancer();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { title, description, category, price, features, images, technologyStack, freelancerAvailable } = await request.json();

    const product = await prisma.product.updateMany({
      where: { id: context.params.id, ownerId: session.user.id },
      data: {
        title: String(title ?? '').trim(),
        description: String(description ?? '').trim(),
        category: String(category ?? '').trim(),
        price: Number(price),
        features: parseStringArray(features),
        images: parseStringArray(images),
        technologyStack: parseStringArray(technologyStack),
        freelancerAvailable: Boolean(freelancerAvailable),
      },
    });

    if (!product.count) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updated = await prisma.product.findUnique({ where: { id: context.params.id } });
    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error('Update product failed:', error);
    return NextResponse.json({ error: 'Failed to update product.' }, { status: 500 });
  }
}
