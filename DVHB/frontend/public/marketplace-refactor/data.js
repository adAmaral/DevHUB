/**
 * Fonte local de dados (mock).
 * Futuramente, esta lista pode vir de uma API sem alterar o restante da UI.
 */
const root = typeof window !== 'undefined' ? window : globalThis;

root.MOCK_PRODUCTS = [
  {
    id: 'crm-pro',
    nome: 'CRM Pro',
    descricao: 'Gestão de funil de vendas com automações e relatórios.',
    preco: 79,
    imagem: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&auto=format&fit=crop&q=60',
  },
  {
    id: 'analytics-x',
    nome: 'Analytics X',
    descricao: 'Dashboards em tempo real para métricas de produto e negócio.',
    preco: 129,
    imagem: 'https://images.unsplash.com/photo-1551281044-8b7a4cee4c9c?w=640&auto=format&fit=crop&q=60',
  },
  {
    id: 'invoice-hub',
    nome: 'Invoice Hub',
    descricao: 'Emissão e conciliação de notas para times financeiros.',
    preco: 49,
    imagem: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=640&auto=format&fit=crop&q=60',
  },
  {
    id: 'shield-sec',
    nome: 'Shield Security',
    descricao: 'Monitoramento de ameaças com alertas e trilha de auditoria.',
    preco: 199,
    imagem: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=640&auto=format&fit=crop&q=60',
  },
  {
    id: 'support-desk',
    nome: 'Support Desk',
    descricao: 'Central de tickets com SLA e base de conhecimento.',
    preco: 59,
    imagem: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=640&auto=format&fit=crop&q=60',
  },
  {
    id: 'mail-boost',
    nome: 'Mail Boost',
    descricao: 'Campanhas de e-mail com segmentação e testes A/B.',
    preco: 39,
    imagem: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=640&auto=format&fit=crop&q=60',
  },
];
