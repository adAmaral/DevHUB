CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuarios(email);

CREATE INDEX IF NOT EXISTS idx_usuario_id ON enderecos(usuario_id);

CREATE INDEX IF NOT EXISTS idx_carrinho_usuario ON carrinho(usuario_id);

CREATE INDEX IF NOT EXISTS idx_pedido_usuario ON pedidos(usuario_id);

CREATE INDEX IF NOT EXISTS idx_pedido_status ON pedidos(status);

CREATE INDEX IF NOT EXISTS idx_avaliacao_produto ON avaliacoes(produto_id);

CREATE INDEX IF NOT EXISTS idx_notificacao_usuario ON notificacoes(usuario_id);

CREATE INDEX IF NOT EXISTS idx_mensagem_usuario ON mensagens(usuario_id);

CREATE INDEX IF NOT EXISTS idx_software_fornecedor ON softwares(fornecedor_id);

CREATE INDEX IF NOT EXISTS idx_software_categoria ON softwares(categoria);

CREATE INDEX IF NOT EXISTS idx_licenca_usuario ON licencas(usuario_id);

CREATE INDEX IF NOT EXISTS idx_licenca_software ON licencas(software_id);

CREATE INDEX IF NOT EXISTS idx_licenca_status ON licencas(status);

CREATE INDEX IF NOT EXISTS idx_venda_fornecedor ON vendas_software(fornecedor_id);

CREATE INDEX IF NOT EXISTS idx_ticket_status ON tickets_suporte(status);

CREATE INDEX IF NOT EXISTS idx_telemetria_licenca ON telemetria_software(licenca_id);

CREATE INDEX IF NOT EXISTS idx_usuario_tipo ON configuracoes_usuario(tipo_usuario);

CREATE INDEX IF NOT EXISTS idx_usuario_bloqueado ON usuarios(ativo);

CREATE INDEX IF NOT EXISTS idx_softwares_publicado ON softwares(publicado);

CREATE INDEX IF NOT EXISTS idx_softwares_destaque ON softwares(em_destaque);

CREATE INDEX IF NOT EXISTS idx_softwares_categoria ON softwares(categoria);

CREATE INDEX IF NOT EXISTS idx_licencas_chave ON licencas(chave_licenca);

CREATE INDEX IF NOT EXISTS idx_vendas_status ON vendas_software(status_pagamento);

CREATE INDEX IF NOT EXISTS idx_telemetria_evento ON telemetria_software(evento_tipo);

CREATE INDEX IF NOT EXISTS idx_notificacoes_lido ON notificacoes(lido);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

CREATE INDEX IF NOT EXISTS idx_afiliado_status ON afiliados(status_afiliado);

CREATE INDEX IF NOT EXISTS idx_admin_nivel ON usuario_admin(nivel_acesso);

CREATE INDEX IF NOT EXISTS idx_campanhas_status ON campanhas_email(status);

CREATE INDEX IF NOT EXISTS idx_sessoes_token ON sessoes_usuario(token_sessao);

CREATE INDEX IF NOT EXISTS idx_tentativas_email ON tentativas_login_falhas(email);

CREATE INDEX IF NOT EXISTS idx_saas_instancia_usuario ON saas_instancia_usuario(usuario_id);

CREATE INDEX IF NOT EXISTS idx_saas_instancia_software ON saas_instancia_usuario(software_id);

CREATE INDEX IF NOT EXISTS idx_saas_consumo_mes ON saas_consumo_usuario(mes_referencia);

CREATE INDEX IF NOT EXISTS idx_saas_health_instancia ON saas_health_check(instancia_id);

CREATE INDEX IF NOT EXISTS idx_saas_logs_instancia ON saas_logs_acesso(instancia_id);

CREATE INDEX IF NOT EXISTS idx_saas_integracao_ativa ON saas_integracao_instancia(status_integracao);

CREATE INDEX IF NOT EXISTS idx_saas_metricas_instancia ON saas_metricas_tempo_real(instancia_id);