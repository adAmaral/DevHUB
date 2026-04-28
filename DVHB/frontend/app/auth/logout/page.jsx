'use client';

import { signOut } from 'next-auth/react';

export default function LogoutPage() {
  return (
    <main style={{ maxWidth: 500, margin: '3rem auto' }}>
      <h1>Logout</h1>
      <p>Click below to sign out securely.</p>
      <button onClick={() => signOut({ callbackUrl: '/auth/login' })}>Sign out</button>
    </main>
  );
}
