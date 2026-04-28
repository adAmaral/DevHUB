import { ActionHubPage } from '@/components/ActionHubPage';

export default function NewProjectPage() {
  return (
    <ActionHubPage
      title="Create New Project"
      description="Inicie um novo projeto, conecte suas ferramentas favoritas do marketplace e configure o workspace com segurança."
      links={[
        { href: '/marketplace', label: 'Explorar ferramentas no marketplace' },
        { href: '/subscriptions', label: 'Selecionar uma assinatura ativa' },
        { href: '/settings/profile', label: 'Revisar dados do perfil' },
        { href: '/dashboard', label: 'Voltar ao dashboard' }
      ]}
    />
  );
}
