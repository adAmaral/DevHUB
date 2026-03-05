-- ESTRUTURA DE BANCO DE DADOS - MARKETPLACE
-- =============================================

-- 1. TABELA DE USUÁRIOS
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(15),
    senha VARCHAR(255) NOT NULL,
    foto_perfil VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultimo_acesso TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

-- 2. TABELA DE ENDEREÇOS
CREATE TABLE endercos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo ENUM('residencial', 'comercial', 'outro') DEFAULT 'residencial',
    endereco VARCHAR(255) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(255),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(9),
    principal BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 3. TABELA DE MÉTODOS DE PAGAMENTO
CREATE TABLE metodos_pagamento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo ENUM('cartao_credito', 'cartao_debito', 'boleto', 'pix') NOT NULL,
    titular VARCHAR(255),
    numero_mascado VARCHAR(20),
    mes_validade INT,
    ano_validade INT,
    chave_pix VARCHAR(255),
    padrao BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 4. TABELA DE PRODUTOS
CREATE TABLE produtos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100),
    preco DECIMAL(10, 2) NOT NULL,
    preco_original DECIMAL(10, 2),
    estoque INT DEFAULT 0,
    imagem_principal VARCHAR(255),
    rating DECIMAL(3, 2) DEFAULT 0,
    quantidade_avaliacoes INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABELA DE CARRINHO
CREATE TABLE carrinho (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(10, 2),
    data_adicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id, produto_id)
);

-- 6. TABELA DE CUPONS
CREATE TABLE cupons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descricao VARCHAR(255),
    tipo ENUM('percentual', 'fixo') DEFAULT 'percentual',
    valor DECIMAL(10, 2) NOT NULL,
    minimo_compra DECIMAL(10, 2),
    quantidade_total INT,
    quantidade_usada INT DEFAULT 0,
    usuario_id INT,
    data_inicio DATE,
    data_fim DATE,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- 7. TABELA DE PEDIDOS
CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    endereco_entrega_id INT NOT NULL,
    metodo_pagamento_id INT NOT NULL,
    cupom_id INT,
    status ENUM('pendente', 'processando', 'enviado', 'entregue', 'cancelado', 'devolvido') DEFAULT 'pendente',
    subtotal DECIMAL(10, 2) NOT NULL,
    desconto DECIMAL(10, 2) DEFAULT 0,
    taxa_entrega DECIMAL(10, 2),
    total DECIMAL(10, 2) NOT NULL,
    numero_rastreio VARCHAR(50),
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_entrega_prevista DATE,
    data_entrega_real DATE,
    data_cancelamento DATE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (endereco_entrega_id) REFERENCES endercos(id),
    FOREIGN KEY (metodo_pagamento_id) REFERENCES metodos_pagamento(id),
    FOREIGN KEY (cupom_id) REFERENCES cupons(id) ON DELETE SET NULL
);

-- 8. TABELA DE ITENS DO PEDIDO
CREATE TABLE itens_pedido (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- 9. TABELA DE FAVORITOS
CREATE TABLE favoritos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    produto_id INT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id, produto_id)
);

-- 10. TABELA DE WISHLIST
CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    produto_id INT NOT NULL,
    alerta_preco BOOLEAN DEFAULT FALSE,
    preco_alerta DECIMAL(10, 2),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id, produto_id)
);

-- 11. TABELA DE AVALIAÇÕES
CREATE TABLE avaliacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    titulo VARCHAR(255),
    comentario TEXT,
    fotos VARCHAR(500),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    UNIQUE KEY (usuario_id, produto_id)
);

-- 12. TABELA DE NOTIFICAÇÕES
CREATE TABLE notificacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT,
    tipo ENUM('pedido', 'promocao', 'oferta', 'sistema') DEFAULT 'sistema',
    lido BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 13. TABELA DE MENSAGENS/CHAT
CREATE TABLE mensagens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    pedido_id INT,
    tipo ENUM('usuario_vendedor', 'suporte') DEFAULT 'usuario_vendedor',
    assunto VARCHAR(255),
    mensagem TEXT NOT NULL,
    remetente VARCHAR(50),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL
);

-- 14. TABELA DE DEVOLUÇÕES
CREATE TABLE devolucoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    descricao TEXT,
    status ENUM('solicitada', 'aprovada', 'recusada', 'reembolsada') DEFAULT 'solicitada',
    numero_etiqueta VARCHAR(50),
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_resolucao DATE,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);

-- 15. TABELA DE DENÚNCIAS
CREATE TABLE denuncias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    produto_id INT,
    tipo ENUM('produto_falso', 'nao_entregue', 'descricao_incorreta', 'outro') NOT NULL,
    descricao TEXT,
    status ENUM('aberta', 'em_analise', 'resolvida') DEFAULT 'aberta',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE SET NULL
);

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX idx_usuario_email ON usuarios(email);
CREATE INDEX idx_usuario_id ON endercos(usuario_id);
CREATE INDEX idx_carrinho_usuario ON carrinho(usuario_id);
CREATE INDEX idx_pedido_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedido_status ON pedidos(status);
CREATE INDEX idx_avaliacao_produto ON avaliacoes(produto_id);
CREATE INDEX idx_notificacao_usuario ON notificacoes(usuario_id);
CREATE INDEX idx_mensagem_usuario ON mensagens(usuario_id);

-- =============================================
-- TRIGGERS
-- =============================================

-- TRIGGER: Atualizar rating do produto após nova avaliação
DELIMITER //
CREATE TRIGGER atualizar_rating_produto
AFTER INSERT ON avaliacoes
FOR EACH ROW
BEGIN
    UPDATE produtos
    SET rating = (SELECT AVG(rating) FROM avaliacoes WHERE produto_id = NEW.produto_id),
        quantidade_avaliacoes = (SELECT COUNT(*) FROM avaliacoes WHERE produto_id = NEW.produto_id)
    WHERE id = NEW.produto_id;
END //
DELIMITER ;

-- TRIGGER: Decrementar estoque quando item é adicionado ao pedido
DELIMITER //
CREATE TRIGGER decrementar_estoque
AFTER INSERT ON itens_pedido
FOR EACH ROW
BEGIN
    UPDATE produtos SET estoque = estoque - NEW.quantidade WHERE id = NEW.produto_id;
END //
DELIMITER ;

-- TRIGGER: Incrementar estoque quando devolução é reembolsada
DELIMITER //
CREATE TRIGGER incrementar_estoque_devolucao
AFTER UPDATE ON devolucoes
FOR EACH ROW
BEGIN
    IF NEW.status = 'reembolsada' THEN
        UPDATE produtos SET estoque = estoque + (SELECT quantidade FROM itens_pedido WHERE pedido_id = NEW.pedido_id LIMIT 1)
        WHERE id IN (SELECT produto_id FROM itens_pedido WHERE pedido_id = NEW.pedido_id);
    END IF;
END //
DELIMITER ;

-- TRIGGER: Usar cupom quando pedido é criado
DELIMITER //
CREATE TRIGGER usar_cupom
AFTER INSERT ON pedidos
FOR EACH ROW
BEGIN
    IF NEW.cupom_id IS NOT NULL THEN
        UPDATE cupons SET quantidade_usada = quantidade_usada + 1 WHERE id = NEW.cupom_id;
    END IF;
END //
DELIMITER ;

-- TRIGGER: Criar notificação quando pedido muda de status
DELIMITER //
CREATE TRIGGER notificar_mudanca_status_pedido
AFTER UPDATE ON pedidos
FOR EACH ROW
BEGIN
    IF NEW.status != OLD.status THEN
        INSERT INTO notificacoes (usuario_id, titulo, mensagem, tipo)
        VALUES (NEW.usuario_id, 
                CONCAT('Seu pedido #', NEW.id, ' foi atualizado'),
                CONCAT('Status: ', NEW.status),
                'pedido');
    END IF;
END //
DELIMITER ;

-- =============================================
-- VIEWS ÚTEIS
-- =============================================

-- VIEW: Detalhes completos do pedido
CREATE VIEW v_pedidos_detalhes AS
SELECT 
    p.id,
    p.numero_rastreio,
    u.nome as cliente,
    u.email,
    e.endereco,
    e.numero,
    e.cidade,
    p.status,
    p.data_pedido,
    p.total,
    COUNT(ip.id) as quantidade_itens
FROM pedidos p
JOIN usuarios u ON p.usuario_id = u.id
JOIN endercos e ON p.endereco_entrega_id = e.id
LEFT JOIN itens_pedido ip ON p.id = ip.pedido_id
GROUP BY p.id;

-- VIEW: Produtos mais avaliados
CREATE VIEW v_produtos_top_avaliados AS
SELECT 
    id,
    nome,
    preco,
    rating,
    quantidade_avaliacoes,
    categoria
FROM produtos
WHERE ativo = TRUE
ORDER BY rating DESC, quantidade_avaliacoes DESC;

-- VIEW: Cupons disponíveis por usuário
CREATE VIEW v_cupons_disponiveis AS
SELECT 
    id,
    codigo,
    descricao,
    tipo,
    valor,
    minimo_compra,
    (quantidade_total - quantidade_usada) as quantidade_restante,
    data_fim
FROM cupons
WHERE ativo = TRUE
    AND CURDATE() BETWEEN data_inicio AND data_fim
    AND (quantidade_total IS NULL OR quantidade_usada < quantidade_total);

-- VIEW: Histórico de compras por usuário
CREATE VIEW v_historico_compras AS
SELECT 
    u.id as usuario_id,
    u.nome,
    COUNT(p.id) as total_pedidos,
    SUM(p.total) as valor_total_gasto,
    MAX(p.data_pedido) as ultima_compra,
    AVG(p.total) as ticket_medio
FROM usuarios u
LEFT JOIN pedidos p ON u.id = p.usuario_id AND p.status != 'cancelado'
GROUP BY u.id;

-- VIEW: Produtos com estoque baixo
CREATE VIEW v_produtos_estoque_baixo AS
SELECT 
    id,
    nome,
    estoque,
    preco,
    categoria
FROM produtos
WHERE estoque <= 10 AND ativo = TRUE;

-- =============================================
-- DADOS DE EXEMPLO
-- =============================================

-- Inserir usuários exemplo
INSERT INTO usuarios (nome, email, cpf, telefone, senha, ativo) VALUES
('João Silva', 'joao@email.com', '123.456.789-00', '11987654321', 'senha_hash_1', TRUE),
('Maria Santos', 'maria@email.com', '987.654.321-00', '11987654322', 'senha_hash_2', TRUE),
('Carlos Oliveira', 'carlos@email.com', '456.789.123-00', '11987654323', 'senha_hash_3', TRUE),
('Ana Costa', 'ana@email.com', '789.123.456-00', '11987654324', 'senha_hash_4', TRUE),
('Pedro Martins', 'pedro@email.com', '321.654.987-00', '11987654325', 'senha_hash_5', TRUE);

-- Inserir endereços exemplo
INSERT INTO endercos (usuario_id, tipo, endereco, numero, complemento, bairro, cidade, estado, cep, principal) VALUES
(1, 'residencial', 'Rua A', '100', 'Apt 101', 'Centro', 'São Paulo', 'SP', '01000-000', TRUE),
(1, 'comercial', 'Av B', '200', 'Sala 202', 'Zona Norte', 'São Paulo', 'SP', '02000-000', FALSE),
(2, 'residencial', 'Rua C', '300', 'Casa', 'Vila Nova', 'Rio de Janeiro', 'RJ', '20000-000', TRUE),
(3, 'residencial', 'Av D', '400', 'Apt 305', 'Jardins', 'Belo Horizonte', 'MG', '30000-000', TRUE),
(4, 'residencial', 'Rua E', '500', 'Apt 401', 'Centro', 'Brasília', 'DF', '70000-000', TRUE);

-- Inserir métodos de pagamento exemplo
INSERT INTO metodos_pagamento (usuario_id, tipo, titular, numero_mascado, mes_validade, ano_validade, padrao, ativo) VALUES
(1, 'cartao_credito', 'JOAO SILVA', '****-****-****-1234', 12, 2027, TRUE, TRUE),
(2, 'cartao_credito', 'MARIA SANTOS', '****-****-****-5678', 6, 2026, TRUE, TRUE),
(3, 'pix', NULL, NULL, NULL, NULL, TRUE, TRUE),
(4, 'boleto', NULL, NULL, NULL, NULL, FALSE, TRUE),
(5, 'cartao_debito', 'PEDRO MARTINS', '****-****-****-9012', 8, 2025, TRUE, TRUE);

-- Inserir produtos exemplo
INSERT INTO produtos (nome, descricao, categoria, preco, preco_original, estoque, rating, ativo) VALUES
('Smartphone XYZ', 'Smartphone de última geração com tela AMOLED', 'Eletrônicos', 1299.99, 1599.99, 25, 4.5, TRUE),
('Fone Bluetooth', 'Fone sem fio com cancelamento de ruído', 'Eletrônicos', 199.99, 249.99, 50, 4.8, TRUE),
('Capa Protetora', 'Capa resistente para smartphone', 'Acessórios', 49.99, 69.99, 100, 4.2, TRUE),
('Carregador Rápido', 'Carregador USB-C 65W', 'Acessórios', 89.99, 129.99, 35, 4.6, TRUE),
('Película Protetora', 'Película de vidro temperado', 'Acessórios', 19.99, 29.99, 150, 4.7, TRUE),
('Mochila Laptop', 'Mochila com compartimento para notebook', 'Bolsas', 159.99, 199.99, 20, 4.4, TRUE),
('Mouse Gamer', 'Mouse com DPI ajustável RGB', 'Periféricos', 129.99, 179.99, 45, 4.3, TRUE),
('Teclado Mecânico', 'Teclado mecanico switches red', 'Periféricos', 349.99, 449.99, 15, 4.9, TRUE);

-- Inserir cupons exemplo
INSERT INTO cupons (codigo, descricao, tipo, valor, minimo_compra, quantidade_total, data_inicio, data_fim, ativo) VALUES
('DESCONTO10', '10% de desconto em eletrônicos', 'percentual', 10.00, 100.00, 50, CURDATE() - INTERVAL 5 DAY, CURDATE() + INTERVAL 30 DAY, TRUE),
('FRETE50', 'R$50 de desconto no frete', 'fixo', 50.00, 200.00, 25, CURDATE() - INTERVAL 2 DAY, CURDATE() + INTERVAL 20 DAY, TRUE),
('PRIMEIRACOMPRA', 'R$100 para primeira compra', 'fixo', 100.00, 150.00, 100, CURDATE() - INTERVAL 10 DAY, CURDATE() + INTERVAL 60 DAY, TRUE),
('VERAO25', '25% de desconto em acessórios', 'percentual', 25.00, 50.00, 40, CURDATE() - INTERVAL 15 DAY, CURDATE() + INTERVAL 45 DAY, TRUE);

-- =============================================
-- PROCEDURES
-- =============================================

-- PROCEDURE: Gerar relatório de vendas por período
DELIMITER //
CREATE PROCEDURE relatorio_vendas(
    IN data_inicio DATE,
    IN data_fim DATE
)
BEGIN
    SELECT 
        DATE(p.data_pedido) as data,
        COUNT(p.id) as total_pedidos,
        SUM(p.total) as valor_total,
        AVG(p.total) as ticket_medio,
        COUNT(DISTINCT p.usuario_id) as clientes_unicos
    FROM pedidos p
    WHERE p.data_pedido BETWEEN data_inicio AND data_fim
        AND p.status != 'cancelado'
    GROUP BY DATE(p.data_pedido)
    ORDER BY data DESC;
END //
DELIMITER ;

-- PROCEDURE: Criar pedido (simplificado)
DELIMITER //
CREATE PROCEDURE criar_pedido(
    IN p_usuario_id INT,
    IN p_endereco_id INT,
    IN p_metodo_pagamento_id INT,
    IN p_cupom_id INT,
    OUT p_pedido_id INT
)
BEGIN
    DECLARE v_subtotal DECIMAL(10,2);
    DECLARE v_desconto DECIMAL(10,2) DEFAULT 0;
    DECLARE v_total DECIMAL(10,2);
    
    SELECT SUM(c.quantidade * c.preco_unitario) INTO v_subtotal
    FROM carrinho c
    WHERE c.usuario_id = p_usuario_id;
    
    IF p_cupom_id IS NOT NULL THEN
        SELECT c.valor INTO v_desconto
        FROM cupons c
        WHERE c.id = p_cupom_id AND c.tipo = 'fixo';
        
        IF v_desconto IS NULL THEN
            SELECT (v_subtotal * c.valor / 100) INTO v_desconto
            FROM cupons c
            WHERE c.id = p_cupom_id AND c.tipo = 'percentual';
        END IF;
    END IF;
    
    SET v_total = v_subtotal - COALESCE(v_desconto, 0) + 15;
    
    INSERT INTO pedidos (usuario_id, endereco_entrega_id, metodo_pagamento_id, cupom_id, subtotal, desconto, taxa_entrega, total, status)
    VALUES (p_usuario_id, p_endereco_id, p_metodo_pagamento_id, p_cupom_id, v_subtotal, COALESCE(v_desconto, 0), 15, v_total, 'pendente');
    
    SET p_pedido_id = LAST_INSERT_ID();
END //
DELIMITER ;

-- PROCEDURE: Buscar produtos por filtros
DELIMITER //
CREATE PROCEDURE buscar_produtos(
    IN p_categoria VARCHAR(100),
    IN p_preco_min DECIMAL(10,2),
    IN p_preco_max DECIMAL(10,2),
    IN p_rating_min DECIMAL(3,2)
)
BEGIN
    SELECT 
        id,
        nome,
        descricao,
        categoria,
        preco,
        estoque,
        rating,
        quantidade_avaliacoes
    FROM produtos
    WHERE ativo = TRUE
        AND (p_categoria IS NULL OR categoria = p_categoria)
        AND (p_preco_min IS NULL OR preco >= p_preco_min)
        AND (p_preco_max IS NULL OR preco <= p_preco_max)
        AND (p_rating_min IS NULL OR rating >= p_rating_min)
    ORDER BY rating DESC, quantidade_avaliacoes DESC;
END //
DELIMITER ;

-- =============================================
-- TABELAS - FORNECEDOR/DESENVOLVEDOR
-- =============================================

-- 16. TABELA DE FORNECEDORES/EMPRESAS
CREATE TABLE fornecedores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    nome_empresa VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    razao_social VARCHAR(255),
    logo VARCHAR(255),
    descricao TEXT,
    site VARCHAR(255),
    telefone_empresa VARCHAR(15),
    endereco VARCHAR(255),
    numero VARCHAR(10),
    complemento VARCHAR(255),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(9),
    taxa_comissao DECIMAL(5, 2) DEFAULT 20.00,
    saldo_pendente DECIMAL(12, 2) DEFAULT 0,
    saldo_disponivel DECIMAL(12, 2) DEFAULT 0,
    bancos_permitidos INT DEFAULT 5,
    verificado BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 17. TABELA DE SOFTWARES/PRODUTOS DIGITAIS
CREATE TABLE softwares (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fornecedor_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    descricao TEXT,
    descricao_tecnica TEXT,
    categoria VARCHAR(100),
    subcategoria VARCHAR(100),
    tags VARCHAR(500),
    logo VARCHAR(255),
    banner VARCHAR(255),
    screenshots JSON,
    linguagem_programacao VARCHAR(50),
    so_compativel VARCHAR(255),
    requisitos_minimos TEXT,
    requisitos_recomendados TEXT,
    preco_base DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0,
    quantidade_avaliacoes INT DEFAULT 0,
    downloads_totais INT DEFAULT 0,
    usuarios_ativos INT DEFAULT 0,
    publicado BOOLEAN DEFAULT FALSE,
    em_destaque BOOLEAN DEFAULT FALSE,
    data_lancamento DATE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE CASCADE,
    INDEX idx_fornecedor (fornecedor_id)
);

-- 18. TABELA DE PLANOS DE PREÇO
CREATE TABLE planos_preco (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    tipo ENUM('trial', 'lite', 'pro', 'enterprise', 'custom') DEFAULT 'lite',
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    duracao_dias INT,
    limite_usuarios INT,
    limite_instalacoes INT,
    suporte_incluso BOOLEAN DEFAULT FALSE,
    updates_incluso BOOLEAN DEFAULT TRUE,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE
);

-- 18.1 TABELA DE MÍDIA/IMAGENS DO SOFTWARE
CREATE TABLE midia_software (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    tipo_midia ENUM('logo', 'banner', 'screenshot', 'icon', 'tutorial', 'documento', 'video') NOT NULL,
    titulo VARCHAR(255),
    descricao TEXT,
    alt_text VARCHAR(500),
    url_midia VARCHAR(500) NOT NULL,
    url_miniatura VARCHAR(500),
    url_cdn VARCHAR(500),
    tipo_arquivo VARCHAR(50),
    tamanho_bytes BIGINT,
    dimensoes_width INT,
    dimensoes_height INT,
    duracao_video INT,
    ordem_exibicao INT,
    visitacoes INT DEFAULT 0,
    downlod INT DEFAULT 0,
    principal BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE,
    INDEX idx_software_tipo (software_id, tipo_midia)
);

-- =============================================
-- TABELA DE CARACTERÍSTICAS/FEATURES DO SOFTWARE
-- =============================================

-- 19. TABELA DE CARACTERÍSTICAS DO SOFTWARE
CREATE TABLE caracteristicas_software (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    nome_feature VARCHAR(255) NOT NULL,
    descricao TEXT,
    icone VARCHAR(255),
    categoria_feature VARCHAR(100),
    disponivel_planos JSON,
    ordem INT,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE
);

-- 20. TABELA DE REQUISITOS DO SOFTWARE
CREATE TABLE requisitos_software (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    so VARCHAR(100),
    versao_minima VARCHAR(50),
    versao_recomendada VARCHAR(50),
    memoria_minima_gb DECIMAL(3, 1),
    memoria_recomendada_gb DECIMAL(3, 1),
    espaco_disco_gb INT,
    processador_minimo VARCHAR(255),
    parametros_adicionais TEXT,
    obrigatorio BOOLEAN DEFAULT TRUE,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE
);

-- =============================================
-- TABELA DE VERSÕES DE SOFTWARE
-- =============================================

-- 21. TABELA DE VERSÕES DE SOFTWARE (RENUMERADA)
CREATE TABLE versoes_software (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    numero_versao VARCHAR(50) NOT NULL,
    changelog TEXT,
    features_novas TEXT,
    bugs_corrigidos TEXT,
    melhorias_performance TEXT,
    breaking_changes TEXT,
    data_lancamento DATE,
    arquivo_url VARCHAR(255),
    arquivo_windows VARCHAR(255),
    arquivo_mac VARCHAR(255),
    arquivo_linux VARCHAR(255),
    tamanho_windows_mb INT,
    tamanho_mac_mb INT,
    tamanho_linux_mb INT,
    hash_windows VARCHAR(255),
    hash_mac VARCHAR(255),
    hash_linux VARCHAR(255),
    versao_atual BOOLEAN DEFAULT FALSE,
    versao_suportada BOOLEAN DEFAULT TRUE,
    versao_segura BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE,
    UNIQUE KEY (software_id, numero_versao),
    INDEX idx_versao_atual (software_id, versao_atual)
);

-- =============================================
-- TABELA DE LICENÇAS
-- =============================================

-- 22. TABELA DE LICENÇAS (RENUMERADA)
CREATE TABLE licencas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    software_id INT NOT NULL,
    plano_id INT NOT NULL,
    chave_licenca VARCHAR(255) UNIQUE NOT NULL,
    chave_validacao VARCHAR(255),
    status ENUM('ativa', 'expirada', 'cancelada', 'suspensa', 'em_trial') DEFAULT 'ativa',
    tipo_licenca ENUM('pessoal', 'comercial', 'educacional', 'governo') DEFAULT 'pessoal',
    data_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_expiracao DATE,
    data_renovacao_proxima DATE,
    renovacao_automatica BOOLEAN DEFAULT TRUE,
    downloads_restantes INT DEFAULT -1,
    instalacoes_restantes INT DEFAULT -1,
    instalacoes_ativas INT DEFAULT 0,
    ultimo_acesso DATE,
    ultima_versao_acessada VARCHAR(50),
    data_cancelamento DATE,
    motivo_cancelamento VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (software_id) REFERENCES softwares(id),
    FOREIGN KEY (plano_id) REFERENCES planos_preco(id),
    INDEX idx_usuario_software (usuario_id, software_id),
    INDEX idx_chave_licenca (chave_licenca),
    INDEX idx_status (status)
);

-- =============================================
-- TABELA DE VENDAS/RECEITA
-- =============================================

-- 23. TABELA DE VENDAS/RECEITA (RENUMERADA)
CREATE TABLE vendas_software (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fornecedor_id INT NOT NULL,
    pedido_id INT NOT NULL,
    software_id INT NOT NULL,
    plano_id INT,
    licenca_id INT,
    versao_software_id INT,
    usuario_id INT,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    desconto_cupom DECIMAL(10, 2) DEFAULT 0,
    comissao_marketplace DECIMAL(10, 2),
    valor_liquido DECIMAL(10, 2),
    imposto_retido DECIMAL(10, 2) DEFAULT 0,
    status_pagamento ENUM('pendente', 'processando', 'pago', 'retido', 'falha', 'reembolsado') DEFAULT 'pendente',
    banco_destino VARCHAR(50),
    chave_pix_destino VARCHAR(255),
    tipo_transacao ENUM('venda', 'reembolso', 'ajuste') DEFAULT 'venda',
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_pagamento DATE,
    observacoes TEXT,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (software_id) REFERENCES softwares(id),
    FOREIGN KEY (plano_id) REFERENCES planos_preco(id),
    FOREIGN KEY (licenca_id) REFERENCES licencas(id),
    FOREIGN KEY (versao_software_id) REFERENCES versoes_software(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_fornecedor (fornecedor_id),
    INDEX idx_data_venda (data_venda),
    INDEX idx_status_pagamento (status_pagamento)
);

-- =============================================
-- TABELA DE TICKETS DE SUPORTE
-- =============================================

-- 24. TABELA DE TICKETS DE SUPORTE (RENUMERADA)
CREATE TABLE tickets_suporte (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    fornecedor_id INT NOT NULL,
    software_id INT NOT NULL,
    licenca_id INT,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    prioridade ENUM('baixa', 'media', 'alta', 'critica') DEFAULT 'media',
    status ENUM('aberto', 'em_progresso', 'aguardando_cliente', 'resolvido', 'fechado', 'reaberto') DEFAULT 'aberto',
    categoria VARCHAR(100),
    tags VARCHAR(500),
    tempo_resposta_horas INT,
    solucao_encontrada BOOLEAN DEFAULT FALSE,
    satisfacao_cliente INT,
    respostas INT DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    data_fechamento DATE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    FOREIGN KEY (software_id) REFERENCES softwares(id),
    FOREIGN KEY (licenca_id) REFERENCES licencas(id),
    INDEX idx_status (status),
    INDEX idx_usuario (usuario_id),
    INDEX idx_software (software_id)
);

-- 25. TABELA DE RESPOSTAS DE SUPORTE (RENUMERADA)
CREATE TABLE respostas_suporte (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT NOT NULL,
    usuario_id INT,
    fornecedor_id INT,
    tipo_resposta ENUM('usuario', 'fornecedor', 'suporte_marketplace') DEFAULT 'usuario',
    mensagem TEXT NOT NULL,
    tempo_resposta_minutos INT,
    tempo_resolucao_minutos INT,
    anexos JSON,
    lido BOOLEAN DEFAULT FALSE,
    marcado_solucao BOOLEAN DEFAULT FALSE,
    pontuacao_util INT DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets_suporte(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    INDEX idx_ticket (ticket_id)
);

-- =============================================
-- TABELA DE CUPONS PARA SOFTWARES
-- =============================================

-- 26. TABELA DE CUPONS PARA SOFTWARES (RENUMERADA)
CREATE TABLE cupons_software (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fornecedor_id INT NOT NULL,
    software_id INT,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descricao VARCHAR(255),
    tipo ENUM('percentual', 'fixo') DEFAULT 'percentual',
    valor DECIMAL(10, 2) NOT NULL,
    minimo_compra DECIMAL(10, 2),
    quantidade_total INT,
    quantidade_usada INT DEFAULT 0,
    limite_por_usuario INT DEFAULT 1,
    categoria_aplicavel VARCHAR(100),
    data_inicio DATE,
    data_fim DATE,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE SET NULL,
    INDEX idx_codigo (codigo),
    INDEX idx_ativo (ativo)
);

-- =============================================
-- TABELA DE EQUIPE DO DESENVOLVEDOR
-- =============================================

-- 27. TABELA DE EQUIPE DO DESENVOLVEDOR (RENUMERADA)
CREATE TABLE equipe_desenvolvimento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fornecedor_id INT NOT NULL,
    usuario_id INT NOT NULL,
    papel ENUM('owner', 'developer', 'tester', 'manager', 'analyst', 'designer') DEFAULT 'developer',
    permissoes JSON,
    software_restrito_id INT,
    data_adicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (software_restrito_id) REFERENCES softwares(id) ON DELETE SET NULL,
    UNIQUE KEY (fornecedor_id, usuario_id),
    INDEX idx_papel (papel)
);

-- =============================================
-- TABELA DE INTEGRAÇÃO GIT
-- =============================================

-- 28. TABELA DE INTEGRAÇÃO GIT (RENUMERADA)
CREATE TABLE integracao_git (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    tipo_repo ENUM('github', 'gitlab', 'bitbucket', 'gitea') NOT NULL,
    url_repositorio VARCHAR(500),
    token_acesso VARCHAR(500),
    owner_repo VARCHAR(255),
    branch_principal VARCHAR(100) DEFAULT 'main',
    webhook_url VARCHAR(500),
    webhook_secret VARCHAR(500),
    webhook_ativo BOOLEAN DEFAULT TRUE,
    build_automatico BOOLEAN DEFAULT TRUE,
    teste_automatico BOOLEAN DEFAULT TRUE,
    deploy_automatico BOOLEAN DEFAULT FALSE,
    ultima_sincronizacao TIMESTAMP,
    proxima_sincronizacao TIMESTAMP,
    commits_total INT DEFAULT 0,
    contributors INT DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE,
    UNIQUE KEY (software_id, tipo_repo)
);

-- =============================================
-- TABELA DE ESTATÍSTICAS DE SOFTWARE
-- =============================================

-- 29. TABELA DE ESTATÍSTICAS DE SOFTWARE (RENUMERADA)
CREATE TABLE estatisticas_software (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    data_relatorio DATE,
    downloads_dia INT DEFAULT 0,
    downloads_total INT DEFAULT 0,
    vendas_dia INT DEFAULT 0,
    vendas_total INT DEFAULT 0,
    receita_dia DECIMAL(12, 2) DEFAULT 0,
    receita_total DECIMAL(12, 2) DEFAULT 0,
    usuarios_novos_dia INT DEFAULT 0,
    usuarios_ativos_total INT DEFAULT 0,
    usuarios_inativos INT DEFAULT 0,
    rating_medio DECIMAL(3, 2) DEFAULT 0,
    taxa_retencao DECIMAL(5, 2),
    taxa_churn DECIMAL(5, 2),
    tempo_uso_medio_horas INT,
    feature_mais_usadas JSON,
    versao_mais_usada VARCHAR(50),
    so_mais_usado VARCHAR(100),
    pais_mais_vendas VARCHAR(100),
    UNIQUE KEY (software_id, data_relatorio),
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE,
    INDEX idx_data (data_relatorio)
);

-- =============================================
-- TABELA DE TELEMETRIA
-- =============================================

-- 30. TABELA DE TELEMETRIA (RENUMERADA)
CREATE TABLE telemetria_software (
    id INT PRIMARY KEY AUTO_INCREMENT,
    licenca_id INT NOT NULL,
    software_id INT NOT NULL,
    evento_tipo VARCHAR(100),
    sessao_id VARCHAR(255),
    detalhes JSON,
    versao_software VARCHAR(50),
    build_numero INT,
    so_usuario VARCHAR(50),
    versao_so VARCHAR(50),
    arquitetura VARCHAR(20),
    navegador VARCHAR(100),
    resolucao_tela VARCHAR(20),
    ip_usuario VARCHAR(50),
    pais VARCHAR(100),
    cidade VARCHAR(100),
    locacao_lat DECIMAL(10, 8),
    locacao_lng DECIMAL(11, 8),
    duracao_sessao_segundos INT,
    paginas_visitadas INT,
    tempo_inatividade_segundos INT,
    data_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (licenca_id) REFERENCES licencas(id) ON DELETE CASCADE,
    FOREIGN KEY (software_id) REFERENCES softwares(id),
    INDEX idx_licenca_data (licenca_id, data_evento),
    INDEX idx_evento_tipo (evento_tipo),
    INDEX idx_sessao (sessao_id)
);

-- =============================================
-- TABELA DE FEATURE REQUESTS
-- =============================================

-- 31. TABELA DE FEATURE REQUESTS (RENUMERADA)
CREATE TABLE feature_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    usuario_id INT,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100),
    votos INT DEFAULT 1,
    comentarios INT DEFAULT 0,
    status ENUM('novo', 'considerando', 'planejado', 'em_desenvolvimento', 'completo', 'rejeitado', 'duplicado') DEFAULT 'novo',
    data_implementacao DATE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES softwares(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_status (status),
    INDEX idx_votos (votos)
);

-- =============================================
-- TABELA DE WEBHOOKS
-- =============================================

-- 32. TABELA DE WEBHOOKS (RENUMERADA)
CREATE TABLE webhooks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fornecedor_id INT NOT NULL,
    url_webhook VARCHAR(500) NOT NULL,
    eventos JSON,
    headers_customizados JSON,
    metodo_http VARCHAR(10) DEFAULT 'POST',
    timeout_segundos INT DEFAULT 30,
    tentativas_maximas INT DEFAULT 5,
    tentativas_falhas INT DEFAULT 0,
    ultima_tentativa TIMESTAMP,
    proxima_tentativa TIMESTAMP,
    status_ultimo_envio VARCHAR(3),
    resposta_ultimo_envio TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE CASCADE
);

-- =============================================
-- TABELA DE AUDITORIA
-- =============================================

-- 33. TABELA DE AUDITORIA (RENUMERADA)
CREATE TABLE auditoria_softwares (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fornecedor_id INT NOT NULL,
    usuario_id INT,
    software_id INT,
    tabela_alvo VARCHAR(100),
    tipo_acao ENUM('insert', 'update', 'delete', 'login', 'export', 'publicacao', 'cancela') DEFAULT 'update',
    descricao TEXT,
    dados_anterior JSON,
    dados_novo JSON,
    endereco_ip VARCHAR(50),
    user_agent VARCHAR(500),
    data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (software_id) REFERENCES softwares(id),
    INDEX idx_fornecedor_data (fornecedor_id, data_acao),
    INDEX idx_tipo_acao (tipo_acao)
);

-- =============================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- =============================================

CREATE INDEX idx_software_fornecedor ON softwares(fornecedor_id);
CREATE INDEX idx_software_categoria ON softwares(categoria);
CREATE INDEX idx_licenca_usuario ON licencas(usuario_id);
CREATE INDEX idx_licenca_software ON licencas(software_id);
CREATE INDEX idx_licenca_status ON licencas(status);
CREATE INDEX idx_venda_fornecedor ON vendas_software(fornecedor_id);
CREATE INDEX idx_ticket_status ON tickets_suporte(status);
CREATE INDEX idx_telemetria_licenca ON telemetria_software(licenca_id);

-- =============================================
-- TRIGGERS PARA FORNECEDOR/DESENVOLVEDOR
-- =============================================

-- TRIGGER: Atualizar saldo do fornecedor após venda
DELIMITER //
CREATE TRIGGER atualizar_saldo_fornecedor
AFTER INSERT ON vendas_software
FOR EACH ROW
BEGIN
    UPDATE fornecedores
    SET saldo_pendente = saldo_pendente + NEW.valor_liquido
    WHERE id = NEW.fornecedor_id;
END //
DELIMITER ;

-- TRIGGER: Decrementar votos em feature request quando duplicado
DELIMITER //
CREATE TRIGGER registrar_voto_feature
AFTER INSERT ON feature_requests
FOR EACH ROW
BEGIN
    INSERT INTO notificacoes (usuario_id, titulo, mensagem, tipo)
    SELECT DISTINCT e.usuario_id, 
                    CONCAT('Nova sugestão em ', s.nome),
                    NEW.titulo,
                    'sistema'
    FROM equipe_desenvolvimento e
    JOIN softwares s ON s.id = NEW.software_id
    WHERE e.fornecedor_id = s.fornecedor_id;
END //
DELIMITER ;

-- TRIGGER: Criar notificação para novo ticket de suporte
DELIMITER //
CREATE TRIGGER notificar_novo_ticket
AFTER INSERT ON tickets_suporte
FOR EACH ROW
BEGIN
    INSERT INTO notificacoes (usuario_id, titulo, mensagem, tipo)
    VALUES (NEW.usuario_id,
            CONCAT('Ticket #', NEW.id, ' criado'),
            NEW.titulo,
            'sistema');
END //
DELIMITER ;
