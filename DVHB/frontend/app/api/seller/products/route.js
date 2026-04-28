import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

function parseStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => String(entry).trim()).filter(Boolean);
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !['seller', 'freelancer'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ products });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !['seller', 'freelancer'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, description, category, price, features, images, technologyStack, freelancerAvailable } = await request.json();

    if (!title || !description || !category || !price) {
      return NextResponse.json({ error: 'Title, description, category and price are required.' }, { status: 400 });
    }

    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json({ error: 'Price must be a number greater than 0.' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        ownerId: session.user.id,
        title: String(title).trim(),
        description: String(description).trim(),
        category: String(category).trim(),
        price: parsedPrice,
        features: parseStringArray(features),
        images: parseStringArray(images),
        technologyStack: parseStringArray(technologyStack),
        freelancerAvailable: Boolean(freelancerAvailable),
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Create product failed:', error);
    return NextResponse.json({ error: 'Failed to create product.' }, { status: 500 });
  }
}
