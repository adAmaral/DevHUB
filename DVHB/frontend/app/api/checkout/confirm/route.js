import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';

async function sendConfirmationEmail(email, orderId, total) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !email) return;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.ORDER_FROM_EMAIL,
      to: email,
      subject: `Order ${orderId} confirmed`,
      html: `<p>Thanks for your purchase! Order <strong>${orderId}</strong> total: <strong>$${total.toFixed(2)}</strong>.</p>`,
    }),
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const sessionId = body?.sessionId;
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 });
    }

    const existing = await prisma.order.findUnique({ where: { stripeSessionId: sessionId } });
    if (existing) {
      return NextResponse.json({ orderId: existing.id, alreadyProcessed: true });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed.' }, { status: 400 });
    }

    const rawCart = session.metadata?.cart ?? '[]';
    const items = JSON.parse(rawCart);

    const safeItems = Array.isArray(items)
      ? items
          .map((item) => ({
            id: String(item?.id ?? ''),
            title: String(item?.title ?? ''),
            quantity: Math.max(1, Number(item?.quantity) || 1),
            price: Number(item?.price) || 0,
          }))
          .filter((item) => item.id && item.title)
      : [];

    const total = (session.amount_total ?? 0) / 100;

    const taxAmount = safeItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.08;
    const order = await prisma.order.create({
      data: {
        userId: session.metadata?.userId || null,
        email: session.customer_details?.email ?? session.customer_email ?? 'unknown@example.com',
        totalAmount: total,
        taxAmount,
        paymentMethod: session.payment_method_types?.[0] ?? 'card',
        paymentStatus: session.payment_status,
        stripeSessionId: session.id,
        items: {
          create: safeItems.map((item) => ({
            productId: item.id,
            title: item.title,
            quantity: item.quantity,
            unitPrice: item.price,
            lineTotal: item.price * item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    await sendConfirmationEmail(order.email, order.id, order.totalAmount);

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error('Checkout confirmation failed:', error);
    return NextResponse.json({ error: 'Failed to finalize order.' }, { status: 500 });
  }
}
