import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth-options';

const allowedRoles = new Set(['buyer', 'seller', 'freelancer']);

export default async function DashboardPage() {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    if (role && allowedRoles.has(role)) {
      redirect(`/dashboard/${role}`);
    }
  } catch {
    // Fallback below keeps dashboard route available even without auth context.
  }

  redirect('/auth/login?callbackUrl=/dashboard');
}
