import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

const PAGE_SIZE = 12;

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get('q')?.trim();
  const category = searchParams.get('category')?.trim();
  const minPrice = Number(searchParams.get('minPrice') ?? '0');
  const maxPrice = Number(searchParams.get('maxPrice') ?? '0');
  const minRating = Number(searchParams.get('minRating') ?? '0');
  const stack = searchParams.get('stack')?.trim();
  const freelancerAvailability = searchParams.get('freelancerAvailability');
  const sort = searchParams.get('sort') ?? 'popularity';
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));

  const where = {
    AND: [
      q ? { OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { features: { hasSome: [q] } },
        { technologyStack: { hasSome: [q] } },
      ] } : {},
      category ? { category: { equals: category, mode: 'insensitive' } } : {},
      minPrice > 0 ? { price: { gte: minPrice } } : {},
      maxPrice > 0 ? { price: { lte: maxPrice } } : {},
      minRating > 0 ? { ratings: { gte: minRating } } : {},
      stack ? { technologyStack: { hasSome: [stack] } } : {},
      freelancerAvailability === 'true' ? { freelancerAvailable: true, owner: { role: 'freelancer' } } : {},
    ],
  };

  const orderBy = sort === 'price' ? { price: 'asc' } : sort === 'rating' ? { ratings: 'desc' } : { popularity: 'desc' };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { owner: { select: { id: true, name: true, role: true, rating: true, skills: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize: PAGE_SIZE, hasMore: page * PAGE_SIZE < total });
}
