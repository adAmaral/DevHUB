import { ActionHubPage } from '@/components/ActionHubPage';

export default function SubscriptionsPage() {
  return (
    <ActionHubPage
      title="My Subscriptions"
      description="Gerencie seus planos atuais, faça upgrades e acompanhe renovações em um só lugar."
      links={[
        { href: '/subscriptions/cloudscale-pro', label: 'CloudScale Pro' },
        { href: '/subscriptions/devstack-pro-kit', label: 'DevStack Pro Kit' },
        { href: '/subscriptions/cloudguard-security', label: 'CloudGuard Security' },
        { href: '/billing/invoices', label: 'Ir para Usage & Billing' }
      ]}
    />
  );
}
