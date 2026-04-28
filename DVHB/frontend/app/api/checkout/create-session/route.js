import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';
import { getStripe } from '@/lib/stripe';

export async function POST(request) {
  try {
    const body = await request.json();
    const items = Array.isArray(body?.items) ? body.items : [];
    const paymentMethod = body?.paymentMethod;
    const taxRate = body?.taxRate;

    if (!items.length) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    const sanitizedItems = items
      .map((item) => ({
        id: String(item?.id ?? ''),
        title: String(item?.title ?? ''),
        price: Number(item?.price),
        quantity: Math.max(1, Number(item?.quantity) || 1),
        type: item?.type === 'service' ? 'service' : 'product',
      }))
      .filter((item) => item.id && item.title && Number.isFinite(item.price) && item.price > 0);

    if (!sanitizedItems.length) {
      return NextResponse.json({ error: 'No valid items found in cart.' }, { status: 400 });
    }

    const computedTaxRate = Number.isFinite(Number(taxRate)) ? Number(taxRate) : 0.08;

    const lineItems = sanitizedItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.title,
          metadata: { itemId: item.id, itemType: item.type },
        },
      },
    }));

    const subtotal = sanitizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxAmount = subtotal * computedTaxRate;

    if (taxAmount > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(taxAmount * 100),
          product_data: { name: 'Sales Tax' },
        },
      });
    }

    const session = await getServerSession(authOptions);

    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
      customer_email: session?.user?.email ?? undefined,
      payment_method_types: paymentMethod === 'bank_transfer' ? ['us_bank_account'] : ['card'],
      metadata: {
        cart: JSON.stringify(sanitizedItems),
        taxRate: String(computedTaxRate),
        userId: session?.user?.id ?? '',
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Create checkout session failed:', error);
    return NextResponse.json({ error: 'Failed to initialize checkout.' }, { status: 500 });
  }
}
