# Relatório de Botões e Telas Faltantes

## 📋 CLIENTE

### Telas/Páginas Faltantes:

1. **cliente/cliente-detalhes-produto.html**
   - **Localização**: `cliente/cliente-produtos.html`
   - **Botão**: "Ver Detalhes" (linha 93, 105, 117, 129)
   - **Funcionalidade**: Visualizar detalhes completos de um produto adquirido
   - **Contexto**: Cada produto adquirido tem um botão que atualmente mostra apenas um alert

2. **cliente/cliente-avaliar-produto.html** (ou modal)
   - **Localização**: `cliente/cliente-produtos.html`
   - **Botão**: "Avaliar" (linha 94, 106)
   - **Funcionalidade**: Permitir que o cliente avalie um produto adquirido
   - **Contexto**: Aparece nos produtos que já foram adquiridos

3. **cliente/cliente-renovar-produto.html** (ou modal)
   - **Localização**: `cliente/cliente-produtos.html`
   - **Botão**: "Renovar" (linha 118)
   - **Funcionalidade**: Renovar um produto expirado
   - **Contexto**: Aparece apenas para produtos com status "Expirado"

4. **cliente/cliente-suporte.html** (ou modal)
   - **Localização**: `cliente/cliente-produtos.html`
   - **Botão**: "Suporte" (linha 130)
   - **Funcionalidade**: Solicitar suporte para um produto Premium adquirido
   - **Contexto**: Aparece em produtos Premium ativos

5. **cliente/cliente-editar-perfil.html**
   - **Localização**: `cliente/cliente-detalhes-conta.html`
   - **Botão**: "Editar Perfil" (linha 149)
   - **Problema**: Atualmente aponta incorretamente para `empresa-configuracoes.html`
   - **Funcionalidade**: Editar informações do perfil do cliente
   - **Nota**: Deveria ser uma página específica para cliente ou redirecionar para configurações do cliente

6. **cliente/cliente-alterar-senha.html** (ou modal)
   - **Localização**: `cliente/cliente-detalhes-conta.html`
   - **Botão**: "Alterar Senha" (linha 153)
   - **Funcionalidade**: Alterar senha da conta
   - **Contexto**: Atualmente mostra apenas um alert informando que será implementado

---

## 👨‍💼 FREELANCER

### Telas/Páginas Faltantes:

1. **freelancer/freelancer-detalhes-pedido.html**
   - **Localização**: `freelancer/freelancer-pedidos.html`
   - **Botão**: "Ver Detalhes" (linha 266)
   - **Função JavaScript**: `verDetalhes(id)` (linha 291)
   - **Funcionalidade**: Visualizar detalhes completos de um pedido específico
   - **Contexto**: Tabela de pedidos mostra botão para cada pedido

2. **freelancer/freelancer-perfil.html** (ou redirecionamento)
   - **Localização**: Vários arquivos via dropdown "Meu Perfil"
   - **Link**: `href="#"` com `id="profileLink"` (atualmente apenas `#`)
   - **Funcionalidade**: Página de perfil do freelancer
   - **Nota**: O JavaScript já define o link dinamicamente, mas não há página específica

3. **freelancer/freelancer-detalhes-cliente.html**
   - **Localização**: `freelancer/freelancer-clientes.html`
   - **Botão**: "Ver Detalhes" (linha 139 e outros)
   - **Funcionalidade**: Ver detalhes completos de um cliente específico
   - **Contexto**: Cards de clientes têm botão "Ver Detalhes"

---

## 🏢 EMPRESA

### Telas/Páginas Faltantes:

1. **empresa/empresa-detalhes-pedido.html**
   - **Localização**: `empresa/empresa-pedidos.html`
   - **Botão**: "Ver Detalhes" (linha 299)
   - **Função JavaScript**: `verDetalhes(id)` (linha 324)
   - **Funcionalidade**: Visualizar detalhes completos de um pedido específico
   - **Contexto**: Tabela de pedidos mostra botão para cada pedido

2. **empresa/empresa-perfil.html** (ou redirecionamento)
   - **Localização**: Vários arquivos via dropdown "Meu Perfil"
   - **Link**: `href="#"` (linhas 111, 110, 119, etc.)
   - **Funcionalidade**: Página de perfil da empresa
   - **Nota**: Múltiplos arquivos têm link "Meu Perfil" que não aponta para nenhuma página

3. **empresa/empresa-explorar.html** (ou funcionalidade)
   - **Localização**: `shared/marketplace.html`
   - **Link**: "Explorar" (linha 68)
   - **Funcionalidade**: Página de exploração/busca avançada
   - **Contexto**: Link no header do marketplace que atualmente não faz nada (`href="#"`)

---

## 🌐 COMPARTILHADAS (SHARED)

### Telas/Páginas Faltantes:

1. **shared/pedidos-cliente.html** (ou tipo específico)
   - **Localização**: `shared/marketplace.html`
   - **Link**: "Meus Pedidos" (linha 69)
   - **Funcionalidade**: Página de pedidos do cliente
   - **Contexto**: Link no header que atualmente não faz nada (`href="#"`)
   - **Nota**: Pode ser diferente dependendo do tipo de usuário (cliente vs empresa vs freelancer)

2. **shared/termos-servico.html**
   - **Localização**: `shared/cadastro.html`
   - **Link**: "Termos de Serviço" (linha 135)
   - **Funcionalidade**: Página com termos e condições de uso
   - **Contexto**: Link no formulário de cadastro

3. **shared/politica-privacidade.html**
   - **Localização**: `shared/cadastro.html`
   - **Link**: "Política de Privacidade" (linha 135)
   - **Funcionalidade**: Página com política de privacidade
   - **Contexto**: Link no formulário de cadastro

4. **shared/recuperar-senha.html**
   - **Localização**: `shared/login.html`
   - **Link**: "Esqueceu a senha?" (linha 89)
   - **Funcionalidade**: Página para recuperação/redefinição de senha
   - **Contexto**: Link no formulário de login que atualmente não faz nada (`href="#"`)

---

## 🔧 FUNCIONALIDADES JAVASCRIPT SEM PÁGINAS

### Botões que apenas executam JavaScript (podem precisar de páginas):

1. **Modal de Produto (Freelancer)**
   - **Localização**: `freelancer/freelancer-produtos.html`
   - **Funções**: `abrirModalProduto()`, `fecharModalProduto()`, `editarProduto(id)`, `removerProduto(id)`
   - **Status**: Modal existe, mas pode precisar de páginas separadas para edição detalhada

2. **Modal de Venda (Empresa)**
   - **Localização**: `empresa/empresa-vendas.html`
   - **Funções**: `abrirModalVenda()`, `fecharModalVenda()`
   - **Status**: Modal existe, mas pode precisar de página de detalhes de venda

3. **Modal de Produto (Empresa)**
   - **Localização**: `empresa/empresa-produtos.html`
   - **Funções**: `abrirModalProduto()`, `fecharModalProduto()`, `editarProduto(btn)`, `removerProduto(btn)`
   - **Status**: Modal existe, mas pode precisar de páginas separadas para edição detalhada

4. **Modal de Membro (Empresa)**
   - **Localização**: `empresa/empresa-equipe.html`
   - **Funções**: `abrirModalMembro()`, `fecharModalMembro()`
   - **Status**: Modal existe, mas pode precisar de página de detalhes do membro

---

## 📊 RESUMO POR PRIORIDADE

### Alta Prioridade (Funcionalidades Core):
- Páginas de detalhes de pedido (cliente, freelancer, empresa)
- Páginas de detalhes de produto adquirido (cliente)
- Página de perfil (todos os tipos)
- Página de recuperação de senha

### Média Prioridade (Melhorias UX):
- Páginas de avaliação/renovação de produtos (cliente)
- Páginas de suporte (cliente)
- Página de detalhes de cliente (freelancer)
- Página de explorar (empresa)

### Baixa Prioridade (Legal/Informacional):
- Termos de Serviço
- Política de Privacidade

---

## 🔗 REFERÊNCIAS QUEB RADAS

1. **cliente/cliente-detalhes-conta.html** linha 149:
   - `window.location.href='empresa-configuracoes.html'`
   - **Deve ser**: `window.location.href='../empresa/empresa-configuracoes.html'` ou criar página específica para cliente

