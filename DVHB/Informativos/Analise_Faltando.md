# ANÁLISE - O QUE FALTA NO BANCO DE DADOS

## ❌ TABELAS ESSENCIAIS FALTANDO

### 1. **RELACIONAMENTOS MANY-TO-MANY** (CRÍTICO)
- [ ] `software_categorias` (softwares podem ter múltiplas categorias)
- [ ] `software_tags` (softwares podem ter múltiplas tags)
- [ ] `plano_caracteristicas` (características disponíveis por plano)
- [ ] `usuario_voto_feature` (controlar votos únicos em features)
- [ ] `usuario_voto_avaliacao` (útil/não útil em reviews)

### 2. **CONFIGURAÇÃO E SETTINGS**
- [ ] `configuracoes_marketplace` (taxa padrão, políticas, moedas)
- [ ] `configuracoes_fornecedor` (configurações por fornecedor)
- [ ] `configuracoes_usuario` (preferências do usuário)
- [ ] `configuracoes_notificacao` (o que notificar para cada usuário)

### 3. **SEGURANÇA AVANÇADA**
- [ ] `sessoes_usuario` (rastreamento de login/logout)
- [ ] `tentativas_login_falhas` (prevenção de brute force)
- [ ] `logs_seguranca` (access logs, mudanças de senha)
- [ ] `chaves_api` (API keys para integrações)
- [ ] `chaves_autenticacao_2fa` (backup codes, TOTP)
- [ ] `ips_bloqueados` (blacklist)

### 4. **PAGAMENTO AVANÇADO**
- [ ] `historico_pagamento_fornecedor` (quando paga, quanto, status)
- [ ] `taxas_fornecedor_customizado` (taxa diferente por fornecedor)
- [ ] `ciclo_pagamento` (períodos de pagamento: mensal, semanal, etc)
- [ ] `retenção_pagamento` (valores retidos, motivos, status)
- [ ] `reembolsos` (separado de devoluções)
- [ ] `boletos_emitidos` (controle de boletos emitidos)

### 5. **ANÁLISE E RELATÓRIOS**
- [ ] `funil_conversao` (visitante → comprador)
- [ ] `analise_busca` (termos mais buscados)
- [ ] `analise_abandono_carrinho` (carrinhos abandonados)
- [ ] `analise_churn_usuario` (usuários inativos)
- [ ] `heatmap_aplicacao` (cliques, scroll, etc - client-side)
- [ ] `performance_servidor` (latência, CPU, memória)

### 6. **CONTEÚDO E DOCUMENTAÇÃO**
- [ ] `faq_software` (perguntas frequentes por software)
- [ ] `artigos_conhecimento` (knowledge base)
- [ ] `video_tutorials` (vídeos de tutorial)
- [ ] `guias_instalacao` (por SO/plataforma)
- [ ] `documentacao_api` (endpoints documentados)

### 7. **RELACIONAMENTOS ENTRE SOFTWARES**
- [ ] `software_relacionado` (softwares similares/complementares)
- [ ] `bundle_softwares` (pacotes com múltiplos softwares)
- [ ] `software_extensoes` (extensões/plugins de outro software)
- [ ] `compatibilidade_software` (qual software é compatível com qual)

### 8. **EMAIL E COMUNICAÇÃO EM MASSA**
- [ ] `campanhas_email` (campanhas de marketing)
- [ ] `emails_agendados` (emails a enviar em data/hora específica)
- [ ] `templates_email` (modelos de email)
- [ ] `historico_envio_email` (log de emails enviados)
- [ ] `unsubscribe_usuario` (usuários que desinscreveram)
- [ ] `notificacoes_push` (push notifications)

### 9. **AVALIAÇÕES E MODERAÇÃO**
- [ ] `moderacao_conteudo` (revisão manual de reviews)
- [ ] `relatorio_avaliacao` (reports de reviews fraudulentos)
- [ ] `resposta_avaliacao` (resposta do fornecedor ao review)
- [ ] `util_avaliacao` (marcar review como útil/não útil)

### 10. **CONFORMIDADE E LEGAL**
- [ ] `politicas_marketplace` (termos, privacidade, cookies)
- [ ] `aceite_usuario` (log de quando usuário aceitou termos)
- [ ] `dados_lgpd` (informações para LGPD/GDPR - direito ao esquecimento)
- [ ] `consentimento_privacidade` (log de consentimentos)
- [ ] `dados_backup_usuario` (backup de dados para exportação GDPR)

### 11. **INTEGRAÇÃO COM SERVIÇOS EXTERNOS**
- [ ] `integracao_payment_gateway` (Stripe, PagSeguro, etc)
- [ ] `integracao_email_service` (SendGrid, Mailgun, etc)
- [ ] `integracao_sms` (Twilio, etc)
- [ ] `integracao_analytics` (Google Analytics, Mixpanel)
- [ ] `integracao_crm` (dados de CRM)

### 12. **GAMIFICAÇÃO**
- [ ] `usuario_pontos` (pontos por atividade)
- [ ] `usuario_badges` (badges desbloqueados)
- [ ] `usuario_achievementos` (conquistas)
- [ ] `usuario_reputacao` (score de reputação)
- [ ] `usuario_nivel` (level/tier do usuário)

### 13. **PROGRAMA DE AFILIADOS**
- [ ] `afiliados` (usuários que são afiliados)
- [ ] `comissao_afiliado` (% de comissão)
- [ ] `rastreamento_afiliado` (quem clicou em qual link)
- [ ] `vendas_afiliado` (vendas geradas por afiliado)
- [ ] `pagamento_afiliado` (pagamentos aos afiliados)

### 14. **WISHLISTS E ALERTAS**
- [ ] `alerta_preco_ativado` (sim/não)
- [ ] `historico_alerta_preco` (alertas já enviados)
- [ ] `alerta_novo_produto` (notificar quando novo software é lançado)
- [ ] `alerta_atualizacao_software` (notificar quando há update)

### 15. **COMPARAÇÃO DE SOFTWARES**
- [ ] `usuario_comparacao` (softwares que usuário está comparando)
- [ ] `historico_comparacao` (comparações feitas)

### 16. **IMPRESSÕES E CONVERSÃO**
- [ ] `impressoes_produto` (quantas vezes o software foi visualizado)
- [ ] `cliques_cta` (quantas vezes botão "Comprar" foi clicado)
- [ ] `tempo_visualizacao` (tempo gasto na página)

### 17. **BACKUP E DISASTER RECOVERY**
- [ ] `backup_agendado` (backups automáticos)
- [ ] `restauracao_ponto` (points-in-time restauration)
- [ ] `historico_backup` (log de backups realizados)

### 18. **MARKETPLACE ADMIN**
- [ ] `usuario_admin` (usuários com acesso admin)
- [ ] `permissoes_admin` (o que cada admin pode fazer)
- [ ] `acoes_admin` (audit log de ações de admin)
- [ ] `tickets_admin` (tickets para contato com suporte do marketplace)

### 19. **REVIEW DE QUALIDADE**
- [ ] `verificacao_software` (score de qualidade do software)
- [ ] `teste_compatibilidade` (testes automáticos de compatibilidade)
- [ ] `malware_scan` (resultado de scan de malware)
- [ ] `certificado_seguranca` (SSL, assinatura digital)

### 20. **INTELIGÊNCIA ARTIFICIAL**
- [ ] `recomendacao_ia` (recomendações personalizadas)
- [ ] `trending_softwares` (softwares em alta)
- [ ] `categoria_dinamica` (categorias inferidas por IA)

---

## 🔴 IMPLEMENTAÇÕES NECESSÁRIAS (NÃO SÃO TABELAS)

### Campos faltando em tabelas existentes:

**usuarios:**
- [ ] `tipo_usuario` (ENUM: cliente, fornecedor, admin)
- [ ] `pais` (para compliance internacional)
- [ ] `moeda_preferida` (BRL, USD, EUR, etc)
- [ ] `idioma_preferido` (pt-BR, en-US, etc)
- [ ] `documento_verificado` (boolean - KYC)
- [ ] `bloqueado_razao` (se bloqueado, por quê)

**softwares:**
- [ ] `seo_metadescricao` (para SEO)
- [ ] `seo_keywords` (palavras-chave)
- [ ] `slug_permanente` (para URL amigável)
- [ ] `tempo_medio_suporte_horas` (SLA)
- [ ] `taxa_atualizacao_dias` (frequência de updates)
- [ ] `certificacoes` (ISO, SOC2, HIPAA, etc)
- [ ] `compatibilidade_integracao` (JSON de integrações)

**licencas:**
- [ ] `tipo_ativacao` (online, offline, hardware-tied)
- [ ] `device_fingerprint` (para validar instalação)
- [ ] `data_ultimo_heartbeat` (último check-in)
- [ ] `permitir_multiplas_instalacoes` (boolean)
- [ ] `limite_usuarios_simultaneos` (para SaaS)

**fornecedores:**
- [ ] `verificado_pix` (boolean)
- [ ] `verificado_cnpj` (boolean)
- [ ] `contrato_assinado_data` (quando assinou contrato)
- [ ] `multa_por_violacao` (em caso de violação de termos)
- [ ] `suspensoes_totais` (quantas vezes foi suspenso)
- [ ] `score_qualidade` (0-100)

---

## 📊 ÍNDICES ESSENCIAIS FALTANDO

```sql
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX idx_usuarios_bloqueado ON usuarios(bloqueado);
CREATE INDEX idx_softwares_publicado ON softwares(publicado);
CREATE INDEX idx_softwares_destaque ON softwares(em_destaque);
CREATE INDEX idx_licencas_chave ON licencas(chave_licenca);
CREATE INDEX idx_vendas_status_pagamento ON vendas_software(status_pagamento);
CREATE INDEX idx_telemetria_tipo_evento ON telemetria_software(evento_tipo);
CREATE INDEX idx_notificacoes_lido ON notificacoes(lido);
CREATE INDEX idx_campanhas_email_status ON campanhas_email(status);
```

---

## 🎯 PRIORIDADE DE IMPLEMENTAÇÃO

### ALTA (Fazer primeiro - Essencial para marketplace funcionar):
1. Relacionamentos Many-to-Many (tabelas de junção)
2. Tabelas de Configuração
3. Tabelas de Segurança (sessões, logs)
4. Histórico de Pagamento Fornecedor
5. Campos faltando em tabelas principais
6. Índices críticos

### MÉDIA (Importante para produção):
7. Email e Comunicação
8. Análise e Relatórios
9. Conformidade LGPD/GDPR
10. Conteúdo (FAQ, Documentação)
11. Avaliações e Moderação

### BAIXA (Nice-to-have, implementar depois):
12. Gamificação
13. Programa de Afiliados
14. IA e Recomendações
15. Comparação de Softwares

---

## 📋 CHECKLIST DE COMPLETUDE

- [ ] 33 tabelas principais criadas
- [ ] X tabelas many-to-many criadas
- [ ] Todas as foreign keys estabelecidas
- [ ] Índices de performance criados
- [ ] Triggers para regras de negócio
- [ ] Views para queries complexas
- [ ] Procedures para operações comuns
- [ ] Conformidade LGPD/GDPR implementada
- [ ] Segurança (encryption, hashing) definida
- [ ] Backup/Recovery strategy
- [ ] Documentação de schema

**Total estimado: 50-60 tabelas para marketplace enterprise completo**
