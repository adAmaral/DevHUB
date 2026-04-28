import { ActionHubPage } from '@/components/ActionHubPage';

export default function SupportPage() {
  return (
    <ActionHubPage
      title="Support Center"
      description="Fale com o suporte do DevHub e acesse os canais para resolver problemas de assinatura, cobrança e integrações."
      links={[
        { href: '/settings/notifications', label: 'Abrir mensagens e alertas' },
        { href: '/billing/invoices', label: 'Ver histórico de faturas' },
        { href: '/subscriptions', label: 'Gerenciar assinaturas' },
        { href: '/marketplace', label: 'Buscar novas soluções' }
      ]}
    />
  );
}
