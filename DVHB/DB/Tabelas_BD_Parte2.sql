-- =============================================
-- BANCO DE DADOS MARKETPLACE - PARTE 2
-- TABELAS COMPLEMENTARES ENTERPRISE
-- =============================================

-- =============================================
-- TABELAS MANY-TO-MANY (RELACIONAMENTOS)
-- =============================================

-- 1. TABELA DE CATEGORIAS PARA SOFTWARES
CREATE TABLE software_categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    ordem INT DEFAULT 1,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE,
    UNIQUE KEY (software_id, categoria),
    INDEX idx_categoria (categoria)
);

-- 2. TABELA DE TAGS PARA SOFTWARES
CREATE TABLE software_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    tag VARCHAR(50) NOT NULL,
    frequencia INT DEFAULT 1,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE,
    UNIQUE KEY (software_id, tag),
    INDEX idx_tag (tag)
);

-- 3. TABELA CARACTERÍSTICAS POR PLANO
CREATE TABLE plano_caracteristicas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plano_id INT NOT NULL,
    caracteristica_id INT NOT NULL,
    FOREIGN KEY (plano_id) REFERENCES planos_preco(id) ON DELETE CASCADE,
    FOREIGN KEY (caracteristica_id) REFERENCES caracteristicas_software(id) ON DELETE CASCADE,
    UNIQUE KEY (plano_id, caracteristica_id)
);

-- 4. TABELA DE VOTOS EM FEATURES (ONE VOTE PER USER)
CREATE TABLE usuario_voto_feature (
    id INT PRIMARY KEY AUTO_INCREMENT,
    feature_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo_voto ENUM('upvote', 'downvote', 'neutro') DEFAULT 'upvote',
    data_voto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feature_id) REFERENCES feature_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY (feature_id, usuario_id),
    INDEX idx_usuario (usuario_id)
);

-- 5. TABELA DE UTILIDADE DE AVALIAÇÕES
CREATE TABLE avaliacao_utilidade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    avaliacao_id INT NOT NULL,
    usuario_id INT NOT NULL,
    util BOOLEAN,
    data_voto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (avaliacao_id) REFERENCES avaliacoes(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY (avaliacao_id, usuario_id)
);

-- 6. TABELA DE SOFTWARES RELACIONADOS
CREATE TABLE softwares_relacionados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_a INT NOT NULL,
    software_b INT NOT NULL,
    tipo_relacao ENUM('similar', 'complementar', 'competidor') DEFAULT 'similar',
    score_relevancia DECIMAL(3, 2),
    FOREIGN KEY (software_a) REFERENCES softwares(id) ON DELETE CASCADE,
    FOREIGN KEY (software_b) REFERENCES softwares(id) ON DELETE CASCADE,
    UNIQUE KEY (software_a, software_b)
);

-- 7. TABELA DE BUNDLES (PACOTES COM MÚLTIPLOS SOFTWARES)
CREATE TABLE bundles_software (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco_bundle DECIMAL(10, 2),
    desconto_percentual DECIMAL(5, 2),
    economia_total DECIMAL(10, 2),
    criado_por INT NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (criado_por) REFERENCES fornecedores(id)
);

-- 8. TABELA DE ITENS DO BUNDLE
CREATE TABLE bundle_itens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bundle_id INT NOT NULL,
    software_id INT NOT NULL,
    preco_no_bundle DECIMAL(10, 2),
    ordem INT,
    FOREIGN KEY (bundle_id) REFERENCES bundles_software(id) ON DELETE CASCADE,
    FOREIGN KEY (software_id) REFERENCES softwares(id),
    UNIQUE KEY (bundle_id, software_id)
);

-- 9. TABELA DE EXTENSÕES/PLUGINS
CREATE TABLE extensoes_software (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_host_id INT NOT NULL,
    software_extensao_id INT NOT NULL,
    descricao_integracao TEXT,
    versao_minima_host VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_host_id) REFERENCES softwares(id) ON DELETE CASCADE,
    FOREIGN KEY (software_extensao_id) REFERENCES softwares(id) ON DELETE CASCADE,
    UNIQUE KEY (software_host_id, software_extensao_id)
);

-- =============================================
-- TABELAS DE CONFIGURAÇÃO
-- =============================================

-- 10. CONFIGURAÇÕES DO MARKETPLACE
CREATE TABLE configuracoes_marketplace (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chave_config VARCHAR(100) UNIQUE NOT NULL,
    valor_config TEXT,
    tipo ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    descricao VARCHAR(500),
    editavel_admin BOOLEAN DEFAULT TRUE,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 11. CONFIGURAÇÕES POR FORNECEDOR
CREATE TABLE configuracoes_fornecedor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fornecedor_id INT NOT NULL,
    chave_config VARCHAR(100),
    valor_config TEXT,
    tipo ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE CASCADE,
    UNIQUE KEY (fornecedor_id, chave_config)
);

-- 12. CONFIGURAÇÕES POR USUÁRIO
CREATE TABLE configuracoes_usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tema VARCHAR(50) DEFAULT 'light',
    idioma VARCHAR(10) DEFAULT 'pt-BR',
    moeda_preferida VARCHAR(3) DEFAULT 'BRL',
    pais VARCHAR(100),
    tipo_usuario ENUM('cliente', 'fornecedor', 'admin') DEFAULT 'cliente',
    documento_verificado BOOLEAN DEFAULT FALSE,
    notificacoes_email BOOLEAN DEFAULT TRUE,
    notificacoes_push BOOLEAN DEFAULT TRUE,
    privacidade_profile ENUM('publica', 'amigos', 'privada') DEFAULT 'publica',
    dois_fator_ativado BOOLEAN DEFAULT FALSE,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id)
);

-- 13. CONFIGURAÇÕES DE NOTIFICAÇÃO
CREATE TABLE configuracoes_notificacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo_notificacao VARCHAR(100),
    email BOOLEAN DEFAULT TRUE,
    push BOOLEAN DEFAULT TRUE,
    sms BOOLEAN DEFAULT FALSE,
    inapp BOOLEAN DEFAULT TRUE,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id, tipo_notificacao)
);

-- =============================================
-- TABELAS DE SEGURANÇA AVANÇADA
-- =============================================

-- 14. SESSÕES DO USUÁRIO
CREATE TABLE sessoes_usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    token_sessao VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_expiracao TIMESTAMP,
    ultima_atividade TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_token (token_sessao),
    INDEX idx_usuario_id (usuario_id)
);

-- 15. TENTATIVAS DE LOGIN FALHADAS
CREATE TABLE tentativas_login_falhas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255),
    ip_address VARCHAR(50),
    tentativa_numero INT DEFAULT 1,
    motivo VARCHAR(255),
    data_tentativa TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bloqueado_ate TIMESTAMP,
    UNIQUE KEY (email, ip_address),
    INDEX idx_ip (ip_address),
    INDEX idx_email (email)
);

-- 16. LOGS DE SEGURANÇA
CREATE TABLE logs_seguranca (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    tipo_evento ENUM('login', 'logout', 'mudanca_senha', 'mudanca_email', 'falha_login', 'acesso_negado', 'dados_exportados', 'dados_deletados') NOT NULL,
    descricao TEXT,
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    resultado ENUM('sucesso', 'falha', 'alert') DEFAULT 'sucesso',
    data_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_usuario_tipo (usuario_id, tipo_evento),
    INDEX idx_data (data_evento)
);

-- 17. CHAVES API
CREATE TABLE chaves_api (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    chave_publica VARCHAR(255) UNIQUE NOT NULL,
    chave_privada VARCHAR(255) UNIQUE NOT NULL,
    nome_chave VARCHAR(100),
    escopo JSON,
    limite_requisicoes_dia INT,
    requisicoes_hoje INT DEFAULT 0,
    data_reset_contador DATE,
    ativa BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_utilizacao TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_chave_publica (chave_publica)
);

-- 18. AUTENTICAÇÕES 2FA
CREATE TABLE autenticacao_2fa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo_2fa ENUM('totp', 'email', 'sms') NOT NULL,
    secret_totp VARCHAR(255),
    telefone_sms VARCHAR(15),
    backup_codes JSON,
    ativo BOOLEAN DEFAULT FALSE,
    data_ativacao TIMESTAMP,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id, tipo_2fa)
);

-- 19. IPs BLOQUEADOS
CREATE TABLE ips_bloqueados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ip_address VARCHAR(50) UNIQUE NOT NULL,
    motivo VARCHAR(255),
    bloqueado_por INT,
    data_bloqueio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_desbloqueio TIMESTAMP,
    permanente BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (bloqueado_por) REFERENCES usuarios(id)
);

-- =============================================
-- TABELAS DE PAGAMENTO AVANÇADO
-- =============================================

-- 20. HISTÓRICO DE PAGAMENTOS DO FORNECEDOR
CREATE TABLE historico_pagamento_fornecedor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fornecedor_id INT NOT NULL,
    periodo_inicio DATE,
    periodo_fim DATE,
    cantidad_vendas INT,
    valor_bruto DECIMAL(12, 2),
    comissao_marketplace DECIMAL(12, 2),
    impostos_retidos DECIMAL(12, 2),
    ajustes DECIMAL(12, 2),
    valor_liquido DECIMAL(12, 2),
    status_pagamento ENUM('processando', 'agendado', 'pago', 'falha', 'retido') DEFAULT 'processando',
    data_programada_pagamento DATE,
    data_pagamento_efetivo DATE,
    meio_pagamento VARCHAR(50),
    numero_comprovante VARCHAR(100),
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    INDEX idx_fornecedor_periodo (fornecedor_id, periodo_inicio)
);

-- 21. TAXAS CUSTOMIZADAS POR FORNECEDOR
CREATE TABLE taxas_fornecedor_customizado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fornecedor_id INT NOT NULL,
    categoria_software VARCHAR(100),
    taxa_comissao DECIMAL(5, 2),
    taxa_minima DECIMAL(10, 2),
    motivo_customizacao VARCHAR(255),
    data_inicio DATE,
    data_fim DATE,
    aprovado_admin INT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    FOREIGN KEY (aprovado_admin) REFERENCES usuarios(id)
);

-- 22. CICLOS DE PAGAMENTO
CREATE TABLE ciclo_pagamento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fornecedor_id INT NOT NULL,
    tipo_ciclo ENUM('diario', 'semanal', 'quinzenal', 'mensal') DEFAULT 'mensal',
    dia_pagamento INT,
    mes_pagamento INT,
    valor_minimo_liberacao DECIMAL(12, 2),
    proxima_data_pagamento DATE,
    ultima_data_pagamento DATE,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    UNIQUE KEY (fornecedor_id)
);

-- 23. RETENÇÃO DE PAGAMENTO
CREATE TABLE retencao_pagamento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fornecedor_id INT NOT NULL,
    valor_retido DECIMAL(12, 2),
    motivo_retencao VARCHAR(255),
    descricao TEXT,
    data_retencao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_liberacao DATE,
    status ENUM('retido', 'liberado_parcial', 'liberado_total', 'cancelado') DEFAULT 'retido',
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    INDEX idx_status (status)
);

-- 24. REEMBOLSOS (SEPARADO DE DEVOLUÇÕES)
CREATE TABLE reembolsos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    venda_id INT NOT NULL,
    usuario_id INT NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    descricao TEXT,
    valor_reembolso DECIMAL(10, 2),
    metodo_reembolso VARCHAR(50),
    status ENUM('solicitado', 'aprovado', 'processando', 'concluido', 'rejeitado') DEFAULT 'solicitado',
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_processamento DATE,
    data_conclusao DATE,
    comprovante_transacao VARCHAR(255),
    FOREIGN KEY (venda_id) REFERENCES vendas_software(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_status (status)
);

-- 25. BOLETOS EMITIDOS
CREATE TABLE boletos_emitidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fornecedor_id INT NOT NULL,
    numero_boleto VARCHAR(50) UNIQUE NOT NULL,
    valor_boleto DECIMAL(12, 2),
    data_vencimento DATE,
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    banco_emissor VARCHAR(50),
    url_boleto VARCHAR(500),
    status ENUM('emitido', 'lido', 'pago', 'vencido', 'cancelado') DEFAULT 'emitido',
    data_pagamento DATE,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    INDEX idx_status (status)
);

-- =============================================
-- TABELAS DE EMAIL E COMUNICAÇÃO
-- =============================================

-- 26. CAMPANHAS DE EMAIL
CREATE TABLE campanhas_email (
    id INT PRIMARY KEY AUTO_INCREMENT,
    criada_por INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    assunto_email VARCHAR(255),
    corpo_email TEXT,
    tipo_campanha ENUM('promocao', 'newsletter', 'transacional', 'reengajamento', 'onboarding') DEFAULT 'newsletter',
    segmento_alvo VARCHAR(100),
    data_agendada DATE,
    data_envio TIMESTAMP,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('rascunho', 'agendada', 'enviando', 'enviada', 'cancelada') DEFAULT 'rascunho',
    total_destinatarios INT,
    enviados INT DEFAULT 0,
    abertos INT DEFAULT 0,
    cliques INT DEFAULT 0,
    taxa_entrega DECIMAL(5, 2),
    taxa_abertura DECIMAL(5, 2),
    taxa_clique DECIMAL(5, 2),
    FOREIGN KEY (criada_por) REFERENCES usuarios(id)
);

-- 27. EMAILS AGENDADOS
CREATE TABLE emails_agendados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    destinatario_email VARCHAR(255),
    assunto VARCHAR(255),
    corpo TEXT,
    tipo_email VARCHAR(50),
    data_agendada TIMESTAMP,
    data_envio TIMESTAMP,
    status ENUM('agendado', 'enviado', 'falha', 'cancelado') DEFAULT 'agendado',
    tentativas INT DEFAULT 0,
    proxima_tentativa TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- 28. TEMPLATES DE EMAIL
CREATE TABLE templates_email (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome_template VARCHAR(100) UNIQUE NOT NULL,
    categoria VARCHAR(50),
    assunto_padrao VARCHAR(255),
    corpo_template TEXT,
    variaveis_suportadas JSON,
    criado_por INT,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);

-- 29. HISTÓRICO DE ENVIO DE EMAILS
CREATE TABLE historico_envio_email (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    email_destinatario VARCHAR(255),
    campanha_id INT,
    assunto VARCHAR(255),
    tipo_email VARCHAR(50),
    status_envio ENUM('enviado', 'falha', 'bounce', 'spam') DEFAULT 'enviado',
    motivo_falha VARCHAR(255),
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_abertura TIMESTAMP,
    links_clicados INT DEFAULT 0,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (campanha_id) REFERENCES campanhas_email(id),
    INDEX idx_data_envio (data_envio)
);

-- 30. UNSUBSCRIBE DE USUARIOS
CREATE TABLE unsubscribe_usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    email VARCHAR(255),
    tipo_email VARCHAR(50),
    data_unsubscribe TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo VARCHAR(255),
    resubscricao_permitida BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    UNIQUE KEY (email, tipo_email)
);

-- 31. NOTIFICAÇÕES PUSH
CREATE TABLE notificacoes_push (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    titulo VARCHAR(255),
    mensagem TEXT,
    icone VARCHAR(255),
    url_acao VARCHAR(500),
    tipo_notificacao VARCHAR(50),
    lida BOOLEAN DEFAULT FALSE,
    clicada BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_leitura TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_lida (usuario_id, lida)
);

-- =============================================
-- TABELAS DE ANÁLISE E RELATÓRIOS
-- =============================================

-- 32. FUNIL DE CONVERSÃO
CREATE TABLE funil_conversao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_relatorio DATE,
    etapa_funil VARCHAR(100),
    quantidade_usuarios INT,
    quantidade_convertidos INT,
    taxa_conversao DECIMAL(5, 2),
    software_id INT,
    categoria_software VARCHAR(100),
    UNIQUE KEY (data_relatorio, etapa_funil, software_id),
    FOREIGN KEY (software_id) REFERENCES softwares(id)
);

-- 33. ANÁLISE DE BUSCA
CREATE TABLE analise_busca (
    id INT PRIMARY KEY AUTO_INCREMENT,
    termo_busca VARCHAR(255),
    quantidade_buscas INT DEFAULT 1,
    quantidade_resultados INT,
    resultados_clicados INT DEFAULT 0,
    taxa_conversao_post_busca DECIMAL(5, 2),
    categoria_maior_relevancia VARCHAR(100),
    data_ultima_busca TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_termo (termo_busca)
);

-- 34. ANÁLISE DE ABANDONO DE CARRINHO
CREATE TABLE analise_abandono_carrinho (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    carrinho_id INT NOT NULL,
    valor_total DECIMAL(10, 2),
    quantidade_itens INT,
    motivo_abandono VARCHAR(255),
    tempo_carrinho_minutos INT,
    recuperado BOOLEAN DEFAULT FALSE,
    data_abandono TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_usuario_data (usuario_id, data_abandono)
);

-- 35. ANÁLISE DE CHURN (USUÁRIOS INATIVOS)
CREATE TABLE analise_churn_usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    dias_inatividade INT,
    ultima_atividade_data DATE,
    risco_churn ENUM('baixo', 'medio', 'alto', 'critico') DEFAULT 'baixo',
    valor_vida_usuario DECIMAL(12, 2),
    motivo_suspeito_churn VARCHAR(255),
    data_analise TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    UNIQUE KEY (usuario_id, data_analise)
);

-- 36. HEATMAP DE APLICAÇÃO
CREATE TABLE heatmap_aplicacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    sessao_id VARCHAR(255),
    pagina_url VARCHAR(500),
    posicao_x INT,
    posicao_y INT,
    tipo_evento ENUM('click', 'scroll', 'hover', 'keystroke') DEFAULT 'click',
    elemento_html VARCHAR(255),
    duracao_segundos INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_sessao (sessao_id)
);

-- 37. PERFORMANCE DO SERVIDOR
CREATE TABLE performance_servidor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cpu_percentual DECIMAL(5, 2),
    memoria_usada_gb DECIMAL(5, 2),
    memoria_total_gb DECIMAL(5, 2),
    disco_usado_gb DECIMAL(10, 2),
    disco_total_gb DECIMAL(10, 2),
    latencia_media_ms INT,
    requisicoes_por_segundo INT,
    taxa_erro INT DEFAULT 0,
    status_servico ENUM('ok', 'degradado', 'offline') DEFAULT 'ok',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp)
);

-- =============================================
-- TABELAS DE CONTEÚDO E DOCUMENTAÇÃO
-- =============================================

-- 38. FAQ DO SOFTWARE
CREATE TABLE faq_software (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    pergunta VARCHAR(500) NOT NULL,
    resposta TEXT NOT NULL,
    categoria_faq VARCHAR(100),
    visualizacoes INT DEFAULT 0,
    util INT DEFAULT 0,
    nao_util INT DEFAULT 0,
    ordem INT,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE
);

-- 39. ARTIGOS DE CONHECIMENTO
CREATE TABLE artigos_conhecimento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) UNIQUE NOT NULL,
    descricao TEXT,
    conteudo TEXT,
    categoria VARCHAR(100),
    tags VARCHAR(500),
    autor_id INT,
    visualizacoes INT DEFAULT 0,
    util INT DEFAULT 0,
    nao_util INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (autor_id) REFERENCES usuarios(id)
);

-- 40. VÍDEOS DE TUTORIAL
CREATE TABLE video_tutorials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    titulo VARCHAR(255),
    descricao TEXT,
    url_video VARCHAR(500),
    duracao_segundos INT,
    visualizacoes INT DEFAULT 0,
    likes INT DEFAULT 0,
    categoria_tutorial VARCHAR(100),
    ordem INT,
    ativo BOOLEAN DEFAULT TRUE,
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE
);

-- 41. GUIAS DE INSTALAÇÃO
CREATE TABLE guias_instalacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    sistema_operacional VARCHAR(50),
    versao_so VARCHAR(50),
    passo_a_passo TEXT,
    requisitos TEXT,
    solucao_problemas TEXT,
    screenshots JSON,
    tempo_instalacao_minutos INT,
    dificuldade ENUM('facil', 'media', 'dificil') DEFAULT 'media',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE,
    UNIQUE KEY (software_id, sistema_operacional)
);

-- 42. DOCUMENTAÇÃO API
CREATE TABLE documentacao_api (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    endpoint VARCHAR(500),
    metodo_http VARCHAR(10),
    descricao_endpoint TEXT,
    parametros JSON,
    exemplo_requisicao TEXT,
    exemplo_resposta TEXT,
    codigo_resposta INT,
    rate_limit INT,
    versao_api VARCHAR(50),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE
);

-- =============================================
-- TABELAS DE AVALIAÇÕES E MODERAÇÃO
-- =============================================

-- 43. MODERAÇÃO DE CONTEÚDO
CREATE TABLE moderacao_conteudo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    avaliacao_id INT NOT NULL,
    status_moderacao ENUM('pendente', 'aprovada', 'rejeitada', 'editada') DEFAULT 'pendente',
    motivo_rejeicao VARCHAR(255),
    moderador_id INT,
    comentario_moderador TEXT,
    data_moderacao TIMESTAMP,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (avaliacao_id) REFERENCES avaliacoes(id) ON DELETE CASCADE,
    FOREIGN KEY (moderador_id) REFERENCES usuarios(id)
);

-- 44. DENÚNCIA DE AVALIAÇÃO
CREATE TABLE denuncia_avaliacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    avaliacao_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo_denuncia ENUM('falsa', 'inconveniente', 'spam', 'ofensiva') NOT NULL,
    descricao TEXT,
    status ENUM('aberta', 'em_analise', 'resolvida', 'descartada') DEFAULT 'aberta',
    moderador_id INT,
    analise TEXT,
    data_denuncia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (avaliacao_id) REFERENCES avaliacoes(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (moderador_id) REFERENCES usuarios(id)
);

-- 45. RESPOSTAS A AVALIAÇÕES
CREATE TABLE resposta_avaliacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    avaliacao_id INT NOT NULL,
    fornecedor_id INT NOT NULL,
    resposta TEXT NOT NULL,
    curtidas INT DEFAULT 0,
    data_resposta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (avaliacao_id) REFERENCES avaliacoes(id) ON DELETE CASCADE,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    UNIQUE KEY (avaliacao_id)
);

-- =============================================
-- TABELAS DE CONFORMIDADE E LEGAL (LGPD/GDPR)
-- =============================================

-- 46. POLÍTICAS DO MARKETPLACE
CREATE TABLE politicas_marketplace (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo_politica ENUM('termos_servico', 'privacidade', 'cookies', 'devolucao', 'intelectual') NOT NULL,
    titulo VARCHAR(255),
    conteudo TEXT,
    versao VARCHAR(10),
    data_vigencia DATE,
    data_proxima_atualizacao DATE,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 47. ACEITE DE USUÁRIO A POLÍTICAS
CREATE TABLE aceite_usuario_politicas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    politica_id INT NOT NULL,
    versao_aceita VARCHAR(10),
    data_aceite TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_aceite VARCHAR(50),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (politica_id) REFERENCES politicas_marketplace(id),
    UNIQUE KEY (usuario_id, politica_id)
);

-- 48. DADOS LGPD (DIREITO AO ESQUECIMENTO)
CREATE TABLE dados_lgpd_usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo_solicitacao ENUM('anonimizacao', 'delecao', 'portabilidade') NOT NULL,
    descricao TEXT,
    status ENUM('solicitado', 'processando', 'concluido', 'cancelado') DEFAULT 'solicitado',
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_conclusao DATE,
    detalhes_processamento TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id, tipo_solicitacao)
);

-- 49. CONSENTIMENTO DE PRIVACIDADE
CREATE TABLE consentimento_privacidade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo_dado ENUM('marketing', 'analiticos', 'cookies', 'compartilhamento') NOT NULL,
    consentimento BOOLEAN,
    data_consentimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_consentimento VARCHAR(50),
    fonte_consentimento VARCHAR(100),
    versao_politica VARCHAR(10),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id, tipo_dado)
);

-- 50. BACKUP DE DADOS DO USUÁRIO (PARA GDPR)
CREATE TABLE dados_backup_usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo_backup VARCHAR(50),
    dados_json LONGTEXT,
    tamanho_bytes BIGINT,
    formato_arquivo VARCHAR(20),
    data_backup TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_expiracao TIMESTAMP,
    acessado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =============================================
-- TABELAS DE PROGRAMA DE AFILIADOS
-- =============================================

-- 51. AFILIADOS
CREATE TABLE afiliados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    comissao_percentual DECIMAL(5, 2),
    status_afiliado ENUM('ativo', 'inativo', 'suspenso', 'rejeitado') DEFAULT 'ativo',
    site_afiliado VARCHAR(500),
    metodos_promocao JSON,
    documento_verificado BOOLEAN DEFAULT FALSE,
    dados_bancarios_verificado BOOLEAN DEFAULT FALSE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_vendas_geradas DECIMAL(12, 2) DEFAULT 0,
    total_comissao DECIMAL(12, 2) DEFAULT 0,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id)
);

-- 52. RASTREAMENTO DE AFILIADOS
CREATE TABLE rastreamento_afiliado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    afiliado_id INT NOT NULL,
    link_afiliado VARCHAR(500),
    software_id INT,
    cliques INT DEFAULT 0,
    conversoes INT DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_clique TIMESTAMP,
    FOREIGN KEY (afiliado_id) REFERENCES afiliados(id) ON DELETE CASCADE,
    FOREIGN KEY (software_id) REFERENCES softwares(id)
);

-- 53. COMISSÃO POR VENDA DE AFILIADO
CREATE TABLE comissao_afiliado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    afiliado_id INT NOT NULL,
    venda_id INT NOT NULL,
    software_id INT,
    valor_venda DECIMAL(10, 2),
    percentual_comissao DECIMAL(5, 2),
    valor_comissao DECIMAL(10, 2),
    status_comissao ENUM('pendente', 'processando', 'paga', 'retida') DEFAULT 'pendente',
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_pagamento DATE,
    FOREIGN KEY (afiliado_id) REFERENCES afiliados(id),
    FOREIGN KEY (venda_id) REFERENCES vendas_software(id),
    FOREIGN KEY (software_id) REFERENCES softwares(id)
);

-- 54. PAGAMENTO DE AFILIADOS
CREATE TABLE pagamento_afiliado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    afiliado_id INT NOT NULL,
    valor_total DECIMAL(12, 2),
    quantidade_comissoes INT,
    periodo_inicio DATE,
    periodo_fim DATE,
    status_pagamento ENUM('processando', 'agendado', 'pago', 'falha') DEFAULT 'processando',
    data_pagamento DATE,
    metodo_pagamento VARCHAR(50),
    comprovante_transacao VARCHAR(255),
    FOREIGN KEY (afiliado_id) REFERENCES afiliados(id),
    INDEX idx_status (status_pagamento)
);

-- =============================================
-- TABELAS DE GAMIFICAÇÃO
-- =============================================

-- 55. PONTOS DO USUÁRIO
CREATE TABLE usuario_pontos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    pontos_totais INT DEFAULT 0,
    pontos_disponiveis INT DEFAULT 0,
    historico_pontos JSON,
    data_ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id)
);

-- 56. BADGES DO USUÁRIO
CREATE TABLE usuario_badges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    nome_badge VARCHAR(100),
    descricao_badge TEXT,
    icone_badge VARCHAR(255),
    data_obtencao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id, nome_badge)
);

-- 57. ACHIEVEMENTS DO USUÁRIO
CREATE TABLE usuario_achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    nome_achievement VARCHAR(100),
    descricao VARCHAR(500),
    icone_achievement VARCHAR(255),
    progresso_atual INT DEFAULT 0,
    progresso_total INT,
    desbloqueado BOOLEAN DEFAULT FALSE,
    data_desbloqueio TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 58. REPUTAÇÃO DO USUÁRIO
CREATE TABLE usuario_reputacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    score_reputacao INT DEFAULT 0,
    nivel_reputacao VARCHAR(50),
    avaliacoes_util INT DEFAULT 0,
    avaliacao_favoraveis INT DEFAULT 0,
    avaliacao_negativas INT DEFAULT 0,
    data_ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id)
);

-- 59. NÍVEL DO USUÁRIO
CREATE TABLE usuario_nivel (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    nivel_atual INT DEFAULT 1,
    experiencia_atual INT DEFAULT 0,
    experiencia_para_proximo_nivel INT,
    beneficios_nivel JSON,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id)
);

-- =============================================
-- TABELAS DE ALERTAS E PREFERÊNCIAS
-- =============================================

-- 60. ALERTA DE PREÇO ATIVADO
CREATE TABLE alerta_preco_ativado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    software_id INT NOT NULL,
    preco_limite DECIMAL(10, 2),
    tipo_alerta ENUM('reducao', 'aumento', 'promocao') DEFAULT 'reducao',
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id, software_id)
);

-- 61. HISTÓRICO DE ALERTA DE PREÇO
CREATE TABLE historico_alerta_preco (
    id INT PRIMARY KEY AUTO_INCREMENT,
    alerta_id INT NOT NULL,
    preco_anterior DECIMAL(10, 2),
    preco_novo DECIMAL(10, 2),
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_notificado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (alerta_id) REFERENCES alerta_preco_ativado(id) ON DELETE CASCADE
);

-- 62. ALERTA DE NOVO PRODUTO
CREATE TABLE alerta_novo_produto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    categoria_monitorada VARCHAR(100),
    tags_monitoradas VARCHAR(500),
    fornecedor_monitorado INT,
    notificar_email BOOLEAN DEFAULT TRUE,
    notificar_push BOOLEAN DEFAULT TRUE,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (fornecedor_monitorado) REFERENCES fornecedores(id)
);

-- 63. ALERTA DE ATUALIZAÇÃO
CREATE TABLE alerta_atualizacao_software (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    software_id INT NOT NULL,
    notificar_todas_atualizacoes BOOLEAN DEFAULT TRUE,
    notificar_security_patch BOOLEAN DEFAULT TRUE,
    notificar_feature_major BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id, software_id)
);

-- =============================================
-- ANÁLISE DE CONVERSÃO
-- =============================================

-- 64. IMPRESSÕES DE PRODUTO
CREATE TABLE impressoes_produto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    usuario_id INT,
    pagina_origem VARCHAR(500),
    posicao_listagem INT,
    tipo_listagem VARCHAR(50),
    data_impressao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES softwares(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_data (data_impressao)
);

-- 65. CLIQUES EM CALL-TO-ACTION
CREATE TABLE cliques_cta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    usuario_id INT,
    tipo_cta VARCHAR(100),
    posicao_cta VARCHAR(100),
    origem_pagina VARCHAR(500),
    data_clique TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES softwares(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- 66. TEMPO DE VISUALIZAÇÃO
CREATE TABLE tempo_visualizacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    software_id INT NOT NULL,
    sessao_id VARCHAR(255),
    tempo_segundos INT,
    data_visualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (software_id) REFERENCES softwares(id)
);

-- =============================================
-- TABELAS DE ADMINISTRAÇÃO
-- =============================================

-- 67. USUÁRIOS ADMIN
CREATE TABLE usuario_admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    nivel_acesso ENUM('super_admin', 'admin_conteudo', 'admin_financeiro', 'admin_suporte', 'moderador') NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    data_promocao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id)
);

-- 68. PERMISSÕES ADMIN
CREATE TABLE permissoes_admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    permissao VARCHAR(100) NOT NULL,
    recurso_alvo VARCHAR(100),
    data_concessao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES usuario_admin(id) ON DELETE CASCADE,
    UNIQUE KEY (admin_id, permissao, recurso_alvo)
);

-- 69. AÇÕES DE ADMIN
CREATE TABLE acoes_admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    tipo_acao VARCHAR(100) NOT NULL,
    alvo_acao VARCHAR(255),
    descricao TEXT,
    dados_anterior JSON,
    dados_novo JSON,
    resultado ENUM('sucesso', 'falha') DEFAULT 'sucesso',
    motivo_falha VARCHAR(255),
    data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES usuario_admin(id),
    INDEX idx_tipo_acao (tipo_acao),
    INDEX idx_data_acao (data_acao)
);

-- 70. TICKETS PARA SUPORTE DO MARKETPLACE
CREATE TABLE tickets_admin_marketplace (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fornecedor_id INT NOT NULL,
    assunto VARCHAR(255),
    descricao TEXT,
    prioridade ENUM('baixa', 'media', 'alta', 'critica') DEFAULT 'media',
    categoria VARCHAR(100),
    status ENUM('aberto', 'em_progresso', 'resolvido', 'fechado') DEFAULT 'aberto',
    assignado_para INT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_resolucao DATE,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    FOREIGN KEY (assignado_para) REFERENCES usuario_admin(id)
);

-- =============================================
-- VERIFICAÇÃO E QUALIDADE
-- =============================================

-- 71. VERIFICAÇÃO DE QUALIDADE
CREATE TABLE verificacao_qualidade_software (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    score_qualidade DECIMAL(3, 2),
    documentacao_score DECIMAL(3, 2),
    seguranca_score DECIMAL(3, 2),
    performance_score DECIMAL(3, 2),
    compatibilidade_score DECIMAL(3, 2),
    suporte_score DECIMAL(3, 2),
    recomendacoes TEXT,
    revisado_por INT,
    data_analise TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES softwares(id),
    FOREIGN KEY (revisado_por) REFERENCES usuario_admin(id)
);

-- 72. TESTE DE COMPATIBILIDADE
CREATE TABLE teste_compatibilidade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    sistema_operacional VARCHAR(50),
    versao_testada VARCHAR(50),
    status_teste ENUM('sucesso', 'falha', 'parcial', 'nao_testado') DEFAULT 'nao_testado',
    observacoes TEXT,
    data_teste TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES softwares(id)
);

-- 73. SCAN DE MALWARE
CREATE TABLE malware_scan_resultado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    versao_software VARCHAR(50),
    mecanismo_scan VARCHAR(100),
    data_scan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resultado ENUM('limpo', 'suspeito', 'infectado') DEFAULT 'limpo',
    deteccoes_encontradas INT DEFAULT 0,
    detalhes_deteccoes JSON,
    hash_arquivo VARCHAR(255)
);

-- 74. CERTIFICADO DE SEGURANÇA
CREATE TABLE certificado_seguranca (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    tipo_certificado VARCHAR(100),
    numero_certificado VARCHAR(255),
    data_emissao DATE,
    data_expiracao DATE,
    autoridade_certificadora VARCHAR(255),
    certificado_arquivo VARCHAR(500)
);

-- =============================================
-- ÍNDICES FINAIS DE PERFORMANCE
-- =============================================

CREATE INDEX idx_usuario_tipo ON configuracoes_usuario(tipo_usuario);
CREATE INDEX idx_usuario_bloqueado ON usuarios(ativo);
CREATE INDEX idx_softwares_publicado ON softwares(publicado);
CREATE INDEX idx_softwares_destaque ON softwares(em_destaque);
CREATE INDEX idx_softwares_categoria ON softwares(categoria);
CREATE INDEX idx_licencas_chave ON licencas(chave_licenca);
CREATE INDEX idx_vendas_status ON vendas_software(status_pagamento);
CREATE INDEX idx_telemetria_evento ON telemetria_software(evento_tipo);
CREATE INDEX idx_notificacoes_lido ON notificacoes(lido);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_afiliado_status ON afiliados(status_afiliado);
CREATE INDEX idx_admin_nivel ON usuario_admin(nivel_acesso);
CREATE INDEX idx_campanhas_status ON campanhas_email(status);
CREATE INDEX idx_sessoes_token ON sessoes_usuario(token_sessao);
CREATE INDEX idx_tentativas_email ON tentativas_login_falhas(email);
