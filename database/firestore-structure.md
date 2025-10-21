# Estrutura do Firestore - DevHUB

Este documento descreve a estrutura de dados do Firebase Firestore para o projeto DevHUB.

## Coleções Principais

### 1. `usuarios`

Armazena informações de todos os usuários (clientes, empresas e freelancers).

**Documento ID**: UID do Firebase Authentication

**Campos**:
```javascript
{
  nome: string,              // Nome completo ou nome fantasia
  email: string,             // Email (único)
  tipo: string,              // 'cliente', 'empresa' ou 'freelancer'
  telefone: string,          // Telefone de contato
  endereco: string,          // Endereço completo
  cidade: string,            // Cidade
  estado: string,            // Estado/UF
  cep: string,               // CEP
  data_nascimento: string,   // Data de nascimento (para freelancers)
  cpf_cnpj: string,          // CPF (freelancer) ou CNPJ (empresa)
  descricao: string,         // Descrição/bio do usuário
  foto_perfil: string,       // URL da foto de perfil
  nome_fantasia: string,     // Nome fantasia (empresas)
  razao_social: string,      // Razão social (empresas)
  area_atuacao: string,      // Área de atuação
  especialidades: array,     // Array de strings com especialidades
  portfolio_url: string,     // URL do portfólio
  site_url: string,          // URL do site (empresas)
  ativo: boolean,            // Se o usuário está ativo
  data_cadastro: timestamp,  // Data de criação
  data_atualizacao: timestamp // Data da última atualização
}
```

**Índices recomendados**:
- `tipo` (ASC) + `ativo` (ASC) + `data_cadastro` (DESC)
- `cidade` (ASC) + `ativo` (ASC) + `data_cadastro` (DESC)
- `email` (ASC)

---

### 2. `categorias`

Categorias de serviços e produtos.

**Documento ID**: Auto-gerado

**Campos**:
```javascript
{
  nome: string,              // Nome da categoria
  descricao: string,         // Descrição da categoria
  icone: string,             // Nome do ícone
  ativo: boolean,            // Se a categoria está ativa
  data_cadastro: timestamp   // Data de criação
}
```

**Índices recomendados**:
- `ativo` (ASC) + `nome` (ASC)

**Dados iniciais**:
```javascript
[
  { nome: 'Design', descricao: 'Serviços de design gráfico, logos, identidade visual', icone: 'design' },
  { nome: 'Programação', descricao: 'Desenvolvimento de sites, aplicativos e sistemas', icone: 'code' },
  { nome: 'Marketing', descricao: 'Marketing digital, gestão de redes sociais, SEO', icone: 'marketing' },
  { nome: 'Redação', descricao: 'Criação de conteúdo, copywriting, tradução', icone: 'edit' },
  { nome: 'Fotografia', descricao: 'Fotografia profissional, edição de imagens', icone: 'camera' },
  { nome: 'Vídeo', descricao: 'Produção e edição de vídeos, motion graphics', icone: 'video' },
  { nome: 'Música', descricao: 'Produção musical, trilhas sonoras, locução', icone: 'music' },
  { nome: 'Consultoria', descricao: 'Consultoria empresarial, financeira, jurídica', icone: 'business' },
  { nome: 'Educação', descricao: 'Aulas particulares, cursos online, treinamentos', icone: 'education' },
  { nome: 'Comércio', descricao: 'Produtos físicos, artesanato, vendas', icone: 'shopping' }
]
```

---

### 3. `servicos`

Serviços e produtos oferecidos pelos usuários.

**Documento ID**: Auto-gerado

**Campos**:
```javascript
{
  usuario_id: string,        // ID do usuário que oferece o serviço
  categoria_id: string,      // ID da categoria
  titulo: string,            // Título do serviço
  descricao: string,         // Descrição detalhada
  tipo: string,              // 'servico' ou 'produto'
  preco: number,             // Preço em reais
  prazo_entrega: number,     // Prazo de entrega em dias
  imagens: array,            // Array de URLs das imagens
  tags: array,               // Array de tags para busca
  ativo: boolean,            // Se o serviço está ativo
  destaque: boolean,         // Se o serviço está em destaque
  visualizacoes: number,     // Contador de visualizações
  data_cadastro: timestamp,  // Data de criação
  data_atualizacao: timestamp // Data da última atualização
}
```

**Índices recomendados**:
- `usuario_id` (ASC) + `ativo` (ASC) + `data_cadastro` (DESC)
- `categoria_id` (ASC) + `ativo` (ASC) + `data_cadastro` (DESC)
- `tipo` (ASC) + `ativo` (ASC) + `preco` (ASC)
- `destaque` (ASC) + `ativo` (ASC) + `data_cadastro` (DESC)

---

### 4. `avaliacoes`

Avaliações de serviços prestados.

**Documento ID**: Auto-gerado

**Campos**:
```javascript
{
  servico_id: string,           // ID do serviço avaliado
  usuario_avaliador_id: string, // ID do usuário que fez a avaliação
  usuario_avaliado_id: string,  // ID do usuário avaliado
  nota: number,                 // Nota de 1 a 5
  comentario: string,           // Comentário da avaliação
  data_avaliacao: timestamp     // Data da avaliação
}
```

**Índices recomendados**:
- `servico_id` (ASC) + `data_avaliacao` (DESC)
- `usuario_avaliado_id` (ASC) + `nota` (DESC)
- `usuario_avaliador_id` (ASC) + `data_avaliacao` (DESC)

---

### 5. `mensagens`

Sistema de mensagens entre usuários.

**Documento ID**: Auto-gerado

**Campos**:
```javascript
{
  remetente_id: string,      // ID do usuário remetente
  destinatario_id: string,   // ID do usuário destinatário
  servico_id: string,        // ID do serviço relacionado (opcional)
  assunto: string,           // Assunto da mensagem
  mensagem: string,          // Conteúdo da mensagem
  lida: boolean,             // Se a mensagem foi lida
  data_envio: timestamp      // Data de envio
}
```

**Índices recomendados**:
- `destinatario_id` (ASC) + `lida` (ASC) + `data_envio` (DESC)
- `remetente_id` (ASC) + `data_envio` (DESC)
- `servico_id` (ASC) + `data_envio` (DESC)

---

### 6. `contratos`

Contratos e pedidos de serviços.

**Documento ID**: Auto-gerado

**Campos**:
```javascript
{
  servico_id: string,         // ID do serviço contratado
  cliente_id: string,         // ID do cliente
  prestador_id: string,       // ID do prestador de serviço
  titulo: string,             // Título do contrato
  descricao: string,          // Descrição do contrato
  valor: number,              // Valor do contrato
  prazo_entrega: timestamp,   // Data de entrega prevista
  status: string,             // 'pendente', 'aceito', 'em_andamento', 'concluido', 'cancelado'
  data_criacao: timestamp,    // Data de criação
  data_aceite: timestamp,     // Data de aceite (opcional)
  data_conclusao: timestamp,  // Data de conclusão (opcional)
  data_cancelamento: timestamp, // Data de cancelamento (opcional)
  motivo_cancelamento: string // Motivo do cancelamento (opcional)
}
```

**Índices recomendados**:
- `cliente_id` (ASC) + `status` (ASC) + `data_criacao` (DESC)
- `prestador_id` (ASC) + `status` (ASC) + `data_criacao` (DESC)
- `servico_id` (ASC) + `data_criacao` (DESC)

---

### 7. `favoritos`

Serviços favoritados pelos usuários.

**Documento ID**: Auto-gerado ou composto `{usuario_id}_{servico_id}`

**Campos**:
```javascript
{
  usuario_id: string,        // ID do usuário
  servico_id: string,        // ID do serviço favoritado
  data_favoritado: timestamp // Data em que foi favoritado
}
```

**Índices recomendados**:
- `usuario_id` (ASC) + `data_favoritado` (DESC)
- `servico_id` (ASC) + `data_favoritado` (DESC)

---

## Regras de Segurança do Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Função auxiliar para verificar autenticação
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Função auxiliar para verificar se é o próprio usuário
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Usuários
    match /usuarios/{userId} {
      // Qualquer um pode ler usuários ativos
      allow read: if resource.data.ativo == true;
      
      // Apenas o próprio usuário pode criar/atualizar seus dados
      allow create: if isOwner(userId);
      allow update: if isOwner(userId);
      
      // Não permitir delete direto (usar soft delete com campo 'ativo')
      allow delete: if false;
    }
    
    // Categorias
    match /categorias/{categoriaId} {
      // Todos podem ler categorias ativas
      allow read: if resource.data.ativo == true;
      
      // Apenas admins podem criar/atualizar/deletar
      allow write: if false; // Configurar permissão de admin
    }
    
    // Serviços
    match /servicos/{servicoId} {
      // Todos podem ler serviços ativos
      allow read: if resource.data.ativo == true;
      
      // Apenas o dono pode criar/atualizar
      allow create: if isAuthenticated() && request.resource.data.usuario_id == request.auth.uid;
      allow update: if isOwner(resource.data.usuario_id);
      
      // Apenas o dono pode deletar
      allow delete: if isOwner(resource.data.usuario_id);
    }
    
    // Avaliações
    match /avaliacoes/{avaliacaoId} {
      // Todos podem ler
      allow read: if true;
      
      // Apenas usuários autenticados podem criar
      allow create: if isAuthenticated() && request.resource.data.usuario_avaliador_id == request.auth.uid;
      
      // Apenas o autor pode atualizar/deletar
      allow update, delete: if isOwner(resource.data.usuario_avaliador_id);
    }
    
    // Mensagens
    match /mensagens/{mensagemId} {
      // Apenas remetente e destinatário podem ler
      allow read: if isAuthenticated() && 
                     (request.auth.uid == resource.data.remetente_id || 
                      request.auth.uid == resource.data.destinatario_id);
      
      // Apenas remetente pode criar
      allow create: if isAuthenticated() && request.resource.data.remetente_id == request.auth.uid;
      
      // Apenas destinatário pode marcar como lida
      allow update: if isOwner(resource.data.destinatario_id);
      
      // Remetente ou destinatário podem deletar
      allow delete: if isAuthenticated() && 
                       (request.auth.uid == resource.data.remetente_id || 
                        request.auth.uid == resource.data.destinatario_id);
    }
    
    // Contratos
    match /contratos/{contratoId} {
      // Apenas cliente e prestador podem ler
      allow read: if isAuthenticated() && 
                     (request.auth.uid == resource.data.cliente_id || 
                      request.auth.uid == resource.data.prestador_id);
      
      // Apenas cliente pode criar
      allow create: if isAuthenticated() && request.resource.data.cliente_id == request.auth.uid;
      
      // Cliente e prestador podem atualizar
      allow update: if isAuthenticated() && 
                       (request.auth.uid == resource.data.cliente_id || 
                        request.auth.uid == resource.data.prestador_id);
      
      // Apenas cliente pode deletar
      allow delete: if isOwner(resource.data.cliente_id);
    }
    
    // Favoritos
    match /favoritos/{favoritoId} {
      // Apenas o dono pode ler seus favoritos
      allow read: if isOwner(resource.data.usuario_id);
      
      // Apenas o dono pode criar/deletar favoritos
      allow create, delete: if isAuthenticated() && request.resource.data.usuario_id == request.auth.uid;
      
      // Não permitir update
      allow update: if false;
    }
  }
}
```

---

## Consultas Comuns

### Buscar serviços por categoria
```javascript
db.collection('servicos')
  .where('categoria_id', '==', categoriaId)
  .where('ativo', '==', true)
  .orderBy('data_cadastro', 'desc')
  .limit(20)
  .get()
```

### Buscar usuários por tipo
```javascript
db.collection('usuarios')
  .where('tipo', '==', 'freelancer')
  .where('ativo', '==', true)
  .orderBy('data_cadastro', 'desc')
  .limit(50)
  .get()
```

### Buscar avaliações de um usuário
```javascript
db.collection('avaliacoes')
  .where('usuario_avaliado_id', '==', userId)
  .orderBy('data_avaliacao', 'desc')
  .get()
```

### Buscar mensagens não lidas
```javascript
db.collection('mensagens')
  .where('destinatario_id', '==', userId)
  .where('lida', '==', false)
  .orderBy('data_envio', 'desc')
  .get()
```

---

## Migração de MySQL para Firestore

### Diferenças principais:

1. **IDs**: MySQL usa auto-increment, Firestore usa strings (UID do Auth ou auto-gerado)
2. **Timestamps**: MySQL usa DATETIME, Firestore usa Timestamp objects
3. **JSON**: MySQL armazena como JSON string, Firestore armazena como arrays nativos
4. **Relacionamentos**: Não há JOINs no Firestore, use denormalização ou subcoleções
5. **Transações**: Firestore suporta transações, mas com limitações diferentes

### Script de migração (exemplo):

```javascript
// Migrar usuários do MySQL para Firestore
async function migrarUsuarios() {
  const usuarios = await mysqlQuery('SELECT * FROM usuarios');
  
  for (const usuario of usuarios) {
    await db.collection('usuarios').doc(usuario.id_usuario.toString()).set({
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      // ... outros campos
      especialidades: JSON.parse(usuario.especialidades || '[]'),
      data_cadastro: admin.firestore.Timestamp.fromDate(new Date(usuario.data_cadastro)),
      data_atualizacao: admin.firestore.Timestamp.fromDate(new Date(usuario.data_atualizacao))
    });
  }
}
```

