import { hash } from 'bcryptjs';
import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { name, email, password, role, bio, skills } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, password and role are required.' }, { status: 400 });
    }

    if (!Object.values(Role).includes(role)) {
      return NextResponse.json({ error: 'Invalid role selected.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: 'Email is already registered.' }, { status: 409 });
    }

    const passwordHash = await hash(String(password), 12);

    const user = await prisma.user.create({
      data: {
        name: name?.trim() || null,
        email: String(email).toLowerCase(),
        passwordHash,
        role,
        bio: bio?.trim() || null,
        skills: Array.isArray(skills) ? skills.map((skill) => String(skill).trim()).filter(Boolean) : [],
        rating: null,
      },
      select: { id: true, email: true, role: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
