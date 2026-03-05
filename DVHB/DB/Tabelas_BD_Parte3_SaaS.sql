-- =============================================
-- BANCO DE DADOS MARKETPLACE - PARTE 3
-- SUPORTE A SAAS/SOFTWARES HOSTED
-- =============================================

-- =============================================
-- TIPOS DE ENTREGA DE SOFTWARE
-- =============================================

-- 1. CLASSIFICAÇÃO DO TIPO DE SOFTWARE
CREATE TABLE tipo_distribuicao_software (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    tipo_distribuicao ENUM('download', 'saas', 'cloud', 'api', 'plugin', 'extensao', 'hibrido') NOT NULL,
    descricao VARCHAR(500),
    url_acesso VARCHAR(500),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE,
    UNIQUE KEY (software_id, tipo_distribuicao)
);

-- =============================================
-- TABELAS PARA SAAS/SOFTWARES HOSTED
-- =============================================

-- 2. CONFIGURAÇÃO DO SAAS
CREATE TABLE saas_configuracao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    dominio_principal VARCHAR(255),
    infraestrutura VARCHAR(100),
    provedor_cloud ENUM('aws', 'azure', 'gcp', 'digitalocean', 'linode', 'outro') DEFAULT 'aws',
    regiao_padrao VARCHAR(100),
    database_tipo VARCHAR(50),
    cache_tipo VARCHAR(50),
    cdn_habilitado BOOLEAN DEFAULT TRUE,
    backup_automatico BOOLEAN DEFAULT TRUE,
    frequencia_backup VARCHAR(50) DEFAULT 'diaria',
    uptime_garantido DECIMAL(5, 2),
    support_level ENUM('community', 'basic', 'premium', 'enterprise') DEFAULT 'basic',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE,
    UNIQUE KEY (software_id)
);

-- 3. INSTÂNCIAS DO SAAS POR USUÁRIO
CREATE TABLE saas_instancia_usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    licenca_id INT NOT NULL,
    software_id INT NOT NULL,
    usuario_id INT NOT NULL,
    url_acesso VARCHAR(500),
    subdomain VARCHAR(255) UNIQUE,
    dominio_customizado VARCHAR(255) UNIQUE,
    status_instancia ENUM('criando', 'ativa', 'pausada', 'suspensa', 'deletada') DEFAULT 'criando',
    tipo_ambiente ENUM('producao', 'staging', 'desenvolvimento') DEFAULT 'producao',
    versao_software VARCHAR(50),
    regiao_servidor VARCHAR(100),
    ip_servidor VARCHAR(50),
    servidor_origem VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ativacao TIMESTAMP,
    data_delecao TIMESTAMP,
    FOREIGN KEY (licenca_id) REFERENCES licencas(id) ON DELETE CASCADE,
    FOREIGN KEY (software_id) REFERENCES softwares(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_usuario_software (usuario_id, software_id),
    INDEX idx_status (status_instancia)
);

-- 4. ACESSOS À INSTÂNCIA (USERNAME/PASSWORD)
CREATE TABLE saas_acessos_instancia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    tipo_acesso ENUM('admin', 'usuario', 'desenvolvedor', 'suporte', 'leitura') DEFAULT 'admin',
    username VARCHAR(255),
    email_acesso VARCHAR(255),
    senha_hash VARCHAR(255),
    senha_temporaria BOOLEAN DEFAULT FALSE,
    data_criacao_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_login TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    permissoes JSON,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE,
    INDEX idx_username (username)
);

-- 5. LIMITES E QUOTAS POR PLANO
CREATE TABLE saas_limites_plano (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plano_id INT NOT NULL,
    limite_usuarios INT,
    limite_storage_gb INT,
    limite_bandwidth_gb INT,
    limite_api_chamadas_dia INT,
    limite_usuarios_simultaneos INT,
    limite_projetos INT,
    limite_integrações INT,
    limite_webhooks INT,
    limite_agendamentos INT,
    limite_execucoes_mes INT,
    suporte_prioridade ENUM('email', 'chat', 'phone', 'dedicado') DEFAULT 'email',
    tempo_resposta_horas INT,
    sso_permitido BOOLEAN DEFAULT FALSE,
    whitelabel_permitido BOOLEAN DEFAULT FALSE,
    custom_domain_permitido BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (plano_id) REFERENCES planos_preco(id) ON DELETE CASCADE,
    UNIQUE KEY (plano_id)
);

-- 6. CONSUMO ATUAL DO USUÁRIO
CREATE TABLE saas_consumo_usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    mes_referencia DATE,
    storage_usado_gb DECIMAL(10, 2),
    bandwidth_usado_gb DECIMAL(10, 2),
    usuarios_ativos INT,
    chamdas_api_mes INT,
    requisicoes_webhook INT,
    integrações_ativas INT,
    tempo_uptime_percentual DECIMAL(5, 2),
    excesso_identificado BOOLEAN DEFAULT FALSE,
    data_calculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE,
    UNIQUE KEY (instancia_id, mes_referencia),
    INDEX idx_data_calculo (data_calculo)
);

-- 7. HEALTH CHECK / UPTIME MONITORAMENTO
CREATE TABLE saas_health_check (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    endpoint_verificacao VARCHAR(500),
    status_resposta VARCHAR(50),
    tempo_resposta_ms INT,
    codigo_http INT,
    disponibilidade BOOLEAN,
    detalhes_erro TEXT,
    data_verificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE,
    INDEX idx_instancia_data (instancia_id, data_verificacao)
);

-- 8. HISTÓRICO DE UPTIME
CREATE TABLE saas_historico_uptime (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    data_relatorio DATE,
    percentual_uptime DECIMAL(5, 2),
    tempo_downtime_minutos INT,
    incidentes_count INT,
    alertas_count INT,
    performance_score DECIMAL(3, 2),
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE,
    UNIQUE KEY (instancia_id, data_relatorio)
);

-- 9. BACKUP AUTOMÁTICO
CREATE TABLE saas_backup (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    tipo_backup ENUM('incremental', 'completo', 'diferencial') DEFAULT 'incremental',
    tamanho_backup_gb DECIMAL(10, 2),
    local_armazenamento VARCHAR(255),
    data_backup TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_proxima_restauracao DATE,
    status_backup ENUM('sucesso', 'em_progresso', 'falha') DEFAULT 'em_progresso',
    tempo_restauracao_minutos INT,
    checagem_integridade BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE,
    INDEX idx_data (data_backup)
);

-- 10. RESTAURAÇÃO DE BACKUP
CREATE TABLE saas_restauracao_backup (
    id INT PRIMARY KEY AUTO_INCREMENT,
    backup_id INT NOT NULL,
    instancia_id INT NOT NULL,
    solicitado_por INT,
    motivo_restauracao VARCHAR(255),
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_inicio_restauracao TIMESTAMP,
    data_conclusao TIMESTAMP,
    status ENUM('solicitado', 'em_progresso', 'concluido', 'falha') DEFAULT 'solicitado',
    detalhes_falha TEXT,
    FOREIGN KEY (backup_id) REFERENCES saas_backup(id),
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id),
    FOREIGN KEY (solicitado_por) REFERENCES usuarios(id)
);

-- =============================================
-- LOGS E ATIVIDADES
-- =============================================

-- 11. LOGS DE ACESSO À INSTÂNCIA
CREATE TABLE saas_logs_acesso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    usuario_id INT,
    email_usuario VARCHAR(255),
    ip_acesso VARCHAR(50),
    user_agent VARCHAR(500),
    tipo_acesso ENUM('login', 'logout', 'api_call', 'webhook', 'integracao') DEFAULT 'login',
    endpoint_acessado VARCHAR(500),
    metodo HTTP VARCHAR(10),
    codigo_resposta INT,
    tempo_requisicao_ms INT,
    bytes_enviados INT,
    bytes_recebidos INT,
    data_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_instancia_data (instancia_id, data_acesso),
    INDEX idx_tipo_acesso (tipo_acesso)
);

-- 12. LOGS DE ERRO/EXCEÇÃO
CREATE TABLE saas_logs_erro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    tipo_erro VARCHAR(100),
    mensagem_erro TEXT,
    stack_trace TEXT,
    url_requisicao VARCHAR(500),
    usuario_afetado INT,
    severidade ENUM('info', 'warning', 'error', 'critical') DEFAULT 'error',
    resolvido BOOLEAN DEFAULT FALSE,
    data_erro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id),
    FOREIGN KEY (usuario_afetado) REFERENCES usuarios(id),
    INDEX idx_instancia_data (instancia_id, data_erro),
    INDEX idx_severidade (severidade)
);

-- 13. ATIVIDADES/EVENTOS DA INSTÂNCIA
CREATE TABLE saas_atividades_instancia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    tipo_atividade VARCHAR(100),
    descricao TEXT,
    usuario_id INT,
    dados_atividade JSON,
    resultado ENUM('sucesso', 'falha', 'pendente') DEFAULT 'sucesso',
    data_atividade TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_data (data_atividade)
);

-- =============================================
-- INTEGRAÇÃO E EXTENSIBILIDADE
-- =============================================

-- 14. INTEGRAÇÕES DA INSTÂNCIA
CREATE TABLE saas_integracao_instancia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    software_integrado_id INT,
    nome_integracao VARCHAR(255),
    tipo_integracao ENUM('webhook', 'api', 'plugin', 'extensao', 'custom') DEFAULT 'api',
    status_integracao ENUM('ativa', 'inativa', 'erro') DEFAULT 'ativa',
    chave_api_integracao VARCHAR(255),
    secret_integracao VARCHAR(255),
    configuracoes JSON,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_sincronia TIMESTAMP,
    proxima_sincronia TIMESTAMP,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (software_integrado_id) REFERENCES softwares(id),
    UNIQUE KEY (instancia_id, nome_integracao)
);

-- 15. WEBHOOKS CUSTOMIZADOS
CREATE TABLE saas_webhooks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    url_webhook VARCHAR(500),
    eventos_disparadores JSON,
    headers_customizados JSON,
    metodo_http VARCHAR(10) DEFAULT 'POST',
    timeout_segundos INT DEFAULT 30,
    tentativas_maximas INT DEFAULT 3,
    tentativas_falhadas INT DEFAULT 0,
    ultima_tentativa TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE,
    INDEX idx_ativo (ativo)
);

-- 16. CHAMADAS DE WEBHOOK
CREATE TABLE saas_webhook_chamadas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    webhook_id INT NOT NULL,
    dados_enviados JSON,
    resposta_recebida JSON,
    codigo_resposta INT,
    tempo_resposta_ms INT,
    status_chamada ENUM('sucesso', 'falha', 'timeout') DEFAULT 'sucesso',
    tentativa_numero INT,
    data_chamada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (webhook_id) REFERENCES saas_webhooks(id) ON DELETE CASCADE,
    INDEX idx_data (data_chamada)
);

-- =============================================
-- CONFIGURAÇÕES E PERSONALIZAÇÕES
-- =============================================

-- 17. CONFIGURAÇÕES CUSTOMIZADAS DA INSTÂNCIA
CREATE TABLE saas_configuracoes_instancia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    chave_config VARCHAR(100),
    valor_config TEXT,
    tipo ENUM('string', 'number', 'boolean', 'json', 'file') DEFAULT 'string',
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE,
    UNIQUE KEY (instancia_id, chave_config)
);

-- 18. TEMAS E BRANDING (WHITE LABEL)
CREATE TABLE saas_branding_instancia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    logo_url VARCHAR(500),
    logo_favicon VARCHAR(500),
    cor_primaria VARCHAR(7),
    cor_secundaria VARCHAR(7),
    font_primaria VARCHAR(100),
    footer_customizado TEXT,
    header_customizado TEXT,
    css_custom TEXT,
    nome_brandizado VARCHAR(255),
    email_suporte_customizado VARCHAR(255),
    telefone_suporte VARCHAR(15),
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE
);

-- 19. CERTIFICADOS SSL/TLS
CREATE TABLE saas_certificado_ssl (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    dominio_certificado VARCHAR(255),
    tipo_certificado ENUM('self_signed', 'lets_encrypt', 'comodo', 'custom') DEFAULT 'lets_encrypt',
    data_emissao DATE,
    data_expiracao DATE,
    issuer VARCHAR(255),
    status_certificado ENUM('valido', 'proximo_expirar', 'expirado') DEFAULT 'valido',
    renov_automatica BOOLEAN DEFAULT TRUE,
    data_renovacao_proxima DATE,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE,
    UNIQUE KEY (instancia_id, dominio_certificado)
);

-- =============================================
-- ESCALABILIDADE E RECURSOS
-- =============================================

-- 20. ALOCAÇÃO DE RECURSOS
CREATE TABLE saas_recursos_alocados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    cpu_cores DECIMAL(3, 1),
    memoria_ram_gb INT,
    storage_disco_gb INT,
    bandwidth_limitado_gb INT,
    conexoes_db_simultaneas INT,
    conexoes_cache_simultaneas INT,
    tipo_instancia VARCHAR(100),
    hardware_dedicado BOOLEAN DEFAULT FALSE,
    data_alocacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE
);

-- 21. AUTO-SCALING
CREATE TABLE saas_auto_scaling (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    auto_scaling_habilitado BOOLEAN DEFAULT FALSE,
    cpu_min_percentual INT DEFAULT 30,
    cpu_max_percentual INT DEFAULT 80,
    memoria_min_percentual INT DEFAULT 30,
    memoria_max_percentual INT DEFAULT 80,
    instâncias_minimas INT DEFAULT 1,
    instâncias_maximas INT DEFAULT 5,
    tempo_escala_minutos INT DEFAULT 5,
    data_config TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE
);

-- 22. METRICAS DE USO EM TEMPO REAL
CREATE TABLE saas_metricas_tempo_real (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    timestamp_metrica TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cpu_percentual DECIMAL(5, 2),
    memoria_percentual DECIMAL(5, 2),
    disco_percentual DECIMAL(5, 2),
    latencia_ms INT,
    requisicoes_por_segundo INT,
    usuarios_conectados INT,
    taxas_erro DECIMAL(5, 2),
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE,
    INDEX idx_instancia_timestamp (instancia_id, timestamp_metrica)
);

-- =============================================
-- UPGRADE/DOWNGRADE E MUDANÇAS DE PLANO
-- =============================================

-- 23. HISTÓRICO DE MUDANÇAS DE PLANO
CREATE TABLE saas_mudanca_plano (
    id INT PRIMARY KEY AUTO_INCREMENT,
    licenca_id INT NOT NULL,
    plano_anterior_id INT,
    plano_novo_id INT,
    data_mudanca TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_efetivacao DATE,
    motivo_mudanca VARCHAR(255),
    prec_ajuste DECIMAL(10, 2),
    tipo_mudanca ENUM('upgrade', 'downgrade', 'lateral') DEFAULT 'upgrade',
    status_mudanca ENUM('solicitada', 'processando', 'efetiva', 'cancelada') DEFAULT 'solicitada',
    FOREIGN KEY (licenca_id) REFERENCES licencas(id),
    FOREIGN KEY (plano_anterior_id) REFERENCES planos_preco(id),
    FOREIGN KEY (plano_novo_id) REFERENCES planos_preco(id)
);

-- =============================================
-- ALERTAS E NOTIFICAÇÕES
-- =============================================

-- 24. ALERTAS DE SAÚDE
CREATE TABLE saas_alertas_saude (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    tipo_alerta ENUM('high_cpu', 'high_memory', 'low_storage', 'downtime', 'error_rate', 'slow_response') NOT NULL,
    severity ENUM('info', 'warning', 'critical') DEFAULT 'warning',
    descricao TEXT,
    valor_atual DECIMAL(10, 2),
    valor_limite DECIMAL(10, 2),
    status_alerta ENUM('ativo', 'resolvido', 'ignorado') DEFAULT 'ativo',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_resolucao TIMESTAMP,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE,
    INDEX idx_status (status_alerta)
);

-- 25. CONFIGURAÇÕES DE ALERTAS
CREATE TABLE saas_configuracao_alertas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    notificar_email BOOLEAN DEFAULT TRUE,
    notificar_sms BOOLEAN DEFAULT FALSE,
    notificar_slack BOOLEAN DEFAULT FALSE,
    notificar_pagerduty BOOLEAN DEFAULT FALSE,
    threshold_cpu INT DEFAULT 80,
    threshold_memoria INT DEFAULT 80,
    threshold_disco INT DEFAULT 90,
    threshold_latencia_ms INT DEFAULT 1000,
    threshold_taxa_erro DECIMAL(5, 2) DEFAULT 5.00,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE,
    UNIQUE KEY (instancia_id)
);

-- =============================================
-- SUPORTE E ESCALAÇÃO
-- =============================================

-- 26. TICKETS DE SUPORTE SAAS
CREATE TABLE saas_tickets_suporte (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT NOT NULL,
    usuario_id INT NOT NULL,
    titulo VARCHAR(255),
    descricao TEXT,
    prioridade ENUM('baixa', 'media', 'alta', 'critica') DEFAULT 'media',
    categoria VARCHAR(100),
    status ENUM('aberto', 'em_progresso', 'aguardando_cliente', 'resolvido', 'fechado') DEFAULT 'aberto',
    tempo_resposta_primeira_msg INT,
    tempo_resolucao INT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_resolucao DATE,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- 27. MANUTENÇÃO AGENDADA
CREATE TABLE saas_manutencao_agendada (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instancia_id INT,
    data_inicio TIMESTAMP,
    data_fim TIMESTAMP,
    descricao TEXT,
    tipo_manutencao ENUM('atualizacao', 'patch_seguranca', 'migracao', 'otimizacao', 'outra') DEFAULT 'atualizacao',
    impacto_esperado VARCHAR(255),
    notificacao_enviada BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instancia_id) REFERENCES saas_instancia_usuario(id)
);

-- =============================================
-- ÍNDICES FINAIS PARA PART 3
-- =============================================

CREATE INDEX idx_saas_instancia_usuario ON saas_instancia_usuario(usuario_id);
CREATE INDEX idx_saas_instancia_software ON saas_instancia_usuario(software_id);
CREATE INDEX idx_saas_consumo_mes ON saas_consumo_usuario(mes_referencia);
CREATE INDEX idx_saas_health_instancia ON saas_health_check(instancia_id);
CREATE INDEX idx_saas_logs_instancia ON saas_logs_acesso(instancia_id);
CREATE INDEX idx_saas_integracao_ativa ON saas_integracao_instancia(status_integracao);
CREATE INDEX idx_saas_metricas_instancia ON saas_metricas_tempo_real(instancia_id);

-- =============================================
-- SUMMARY
-- =============================================
-- Total de 27 tabelas adicionadas para suporte SaaS
-- Cobrindo: Deployments, Health, Monitoramento, Logs, 
-- Integrações, Personalizações, Recursos, Alertas
-- =============================================
