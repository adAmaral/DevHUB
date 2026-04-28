import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth-options';

export default async function FreelancerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect('/auth/login?callbackUrl=/dashboard/freelancer');
  if (session.user.role !== 'freelancer') redirect(`/dashboard/${session.user.role}`);

  return (
    <main>
      <h1>Freelancer Dashboard</h1>
      <p>Welcome back, {session.user.name ?? session.user.email}.</p>
      <p>Track client projects, proposals, and ratings from completed jobs.</p>
    </main>
  );
}
