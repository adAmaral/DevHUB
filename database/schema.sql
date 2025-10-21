DROP DATABASE IF EXISTS summit_db;
CREATE DATABASE IF NOT EXISTS summit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE summit_db;

DROP DATABASE IF EXISTS summit_db;
CREATE DATABASE IF NOT EXISTS summit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE summit_db;

CREATE DATABASE IF NOT EXISTS summit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE summit_db;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('cliente', 'empresa', 'freelancer') NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(50),
    cep VARCHAR(10),
    data_nascimento DATE, -- Para freelancers
    cpf_cnpj VARCHAR(20), -- CPF para freelancer, CNPJ para empresa
    descricao TEXT,
    foto_perfil VARCHAR(500),
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Campos adicionais para informações específicas de freelancer/empresa
    nome_fantasia VARCHAR(255), -- Para empresas
    razao_social VARCHAR(255), -- Para empresas
    area_atuacao VARCHAR(255), -- Para freelancers e empresas
    especialidades JSON, -- Para freelancers (array de strings)
    portfolio_url VARCHAR(500), -- Para freelancers e empresas
    site_url VARCHAR(500), -- Para empresas
    
    INDEX idx_email (email),
    INDEX idx_tipo (tipo),
    INDEX idx_ativo (ativo),
    INDEX idx_data_cadastro (data_cadastro)
);

CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    icone VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_nome (nome),
    INDEX idx_ativo (ativo)
);

CREATE TABLE servicos (
    id_servico INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    categoria_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tipo ENUM('servico', 'produto') NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    prazo_entrega INT, -- em dias
    imagens JSON, -- array de URLs das imagens
    tags JSON, -- array de tags
    ativo BOOLEAN DEFAULT TRUE,
    destaque BOOLEAN DEFAULT FALSE,
    visualizacoes INT DEFAULT 0,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE RESTRICT,
    
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_categoria_id (categoria_id),
    INDEX idx_tipo (tipo),
    INDEX idx_ativo (ativo),
    INDEX idx_destaque (destaque),
    INDEX idx_preco (preco),
    INDEX idx_data_cadastro (data_cadastro),
    FULLTEXT idx_busca (titulo, descricao)
);

CREATE TABLE avaliacoes (
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
    servico_id INT NOT NULL,
    usuario_avaliador_id INT NOT NULL,
    usuario_avaliado_id INT NOT NULL,
    nota INT NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_servico) REFERENCES servicos(id_servico) ON DELETE CASCADE,
    FOREIGN KEY (usuario_avaliador_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_avaliado_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_avaliacao (servico_id, usuario_avaliador_id),
    INDEX idx_servico_id (servico_id),
    INDEX idx_usuario_avaliador (usuario_avaliador_id),
    INDEX idx_usuario_avaliado (usuario_avaliado_id),
    INDEX idx_nota (nota),
    INDEX idx_data_avaliacao (data_avaliacao)
);

CREATE TABLE mensagens (
    id_mensagem INT AUTO_INCREMENT PRIMARY KEY,
    remetente_id INT NOT NULL,
    destinatario_id INT NOT NULL,
    servico_id INT,
    assunto VARCHAR(255),
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (remetente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (destinatario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_servico) REFERENCES servicos(id_servico) ON DELETE SET NULL,
    
    INDEX idx_remetente (remetente_id),
    INDEX idx_destinatario (destinatario_id),
    INDEX idx_servico (servico_id),
    INDEX idx_lida (lida),
    INDEX idx_data_envio (data_envio)
);

CREATE TABLE contratos (
    id_contrato INT AUTO_INCREMENT PRIMARY KEY,
    servico_id INT NOT NULL,
    cliente_id INT NOT NULL,
    prestador_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    valor DECIMAL(10,2) NOT NULL,
    prazo_entrega DATE,
    status ENUM('pendente', 'aceito', 'em_andamento', 'concluido', 'cancelado') DEFAULT 'pendente',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_aceite TIMESTAMP NULL,
    data_conclusao TIMESTAMP NULL,
    data_cancelamento TIMESTAMP NULL,
    motivo_cancelamento TEXT,
    
    FOREIGN KEY (id_servico) REFERENCES servicos(id_servico) ON DELETE RESTRICT,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (prestador_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    
    INDEX idx_servico_id (servico_id),
    INDEX idx_cliente_id (cliente_id),
    INDEX idx_prestador_id (prestador_id),
    INDEX idx_status (status),
    INDEX idx_data_criacao (data_criacao)
);

CREATE TABLE favoritos (
    id_favorito INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    servico_id INT NOT NULL,
    data_favoritado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_servico) REFERENCES servicos(id_servico) ON DELETE CASCADE,
    
    UNIQUE KEY unique_favorito (usuario_id, servico_id),
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_servico_id (servico_id),
    INDEX idx_data_favoritado (data_favoritado)
);

INSERT INTO categorias (nome, descricao, icone) VALUES
('Design', 'Serviços de design gráfico, logos, identidade visual', 'design'),
('Programação', 'Desenvolvimento de sites, aplicativos e sistemas', 'code'),
('Marketing', 'Marketing digital, gestão de redes sociais, SEO', 'marketing'),
('Redação', 'Criação de conteúdo, copywriting, tradução', 'edit'),
('Fotografia', 'Fotografia profissional, edição de imagens', 'camera'),
('Vídeo', 'Produção e edição de vídeos, motion graphics', 'video'),
('Música', 'Produção musical, trilhas sonoras, locução', 'music'),
('Consultoria', 'Consultoria empresarial, financeira, jurídica', 'business'),
('Educação', 'Aulas particulares, cursos online, treinamentos', 'education'),
('Comércio', 'Produtos físicos, artesanato, vendas', 'shopping');

INSERT INTO usuarios (nome, email, senha, tipo, descricao) VALUES
('Administrador Summit', 'admin@summit.com', 'admin123', 'empresa', 'Conta administrativa da plataforma Summit');


CREATE VIEW vw_estatisticas_usuarios AS
SELECT 
    tipo,
    COUNT(*) as total,
    COUNT(CASE WHEN ativo = TRUE THEN 1 END) as ativos,
    COUNT(CASE WHEN DATE(data_cadastro) = CURDATE() THEN 1 END) as novos_hoje,
    COUNT(CASE WHEN data_cadastro >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 END) as novos_semana
FROM usuarios
GROUP BY tipo;

CREATE VIEW vw_servicos_completos AS
SELECT 
    s.*,
    u.nome as nome_usuario,
    u.foto_perfil as foto_usuario,
    c.nome as nome_categoria,
    c.icone as icone_categoria,
    COALESCE(AVG(a.nota), 0) as media_avaliacoes,
    COUNT(a.id) as total_avaliacoes
FROM servicos s
JOIN usuarios u ON s.id_usuario = u.id_usuario
JOIN categorias c ON s.id_categoria = c.id_categoria
LEFT JOIN avaliacoes a ON s.id_servico = a.id_servico
WHERE s.ativo = TRUE AND u.ativo = TRUE
GROUP BY s.id;

CREATE VIEW vw_ranking_prestadores AS
SELECT 
    u.id,
    u.nome,
    u.foto_perfil,
    u.tipo,
    COUNT(s.id) as total_servicos,
    COALESCE(AVG(a.nota), 0) as media_avaliacoes,
    COUNT(a.id) as total_avaliacoes,
    COUNT(c.id) as contratos_concluidos
FROM usuarios u
LEFT JOIN servicos s ON u.id = s.usuario_id AND s.ativo = TRUE
LEFT JOIN avaliacoes a ON u.id = a.usuario_avaliado_id
LEFT JOIN contratos c ON u.id = c.prestador_id AND c.status = 'concluido'
WHERE u.tipo IN ('freelancer', 'empresa') AND u.ativo = TRUE
GROUP BY u.id
HAVING total_servicos > 0
ORDER BY media_avaliacoes DESC, total_avaliacoes DESC;

DELIMITER //

CREATE PROCEDURE BuscarServicos(
    IN p_termo VARCHAR(255),
    IN p_id_categoria INT,
    IN p_tipo VARCHAR(20),
    IN p_preco_min DECIMAL(10,2),
    IN p_preco_max DECIMAL(10,2),
    IN p_limite INT,
    IN p_offset INT
)
BEGIN
    SELECT * FROM vw_servicos_completos
    WHERE 
        (p_termo IS NULL OR MATCH(titulo, descricao) AGAINST(p_termo IN NATURAL LANGUAGE MODE))
        AND (p_id_categoria IS NULL OR id_categoria = p_id_categoria)
        AND (p_tipo IS NULL OR tipo = p_tipo)
        AND (p_preco_min IS NULL OR preco >= p_preco_min)
        AND (p_preco_max IS NULL OR preco <= p_preco_max)
    ORDER BY data_cadastro DESC
    LIMIT p_limite OFFSET p_offset;
END //

CREATE PROCEDURE EstatisticasUsuario(IN p_usuario_id INT)
BEGIN
    SELECT 
        u.nome,
        u.tipo,
        u.area_atuacao,
        u.especialidades,
        u.portfolio_url,
        u.site_url,
        COUNT(s.id) as total_servicos,
        COUNT(CASE WHEN s.ativo = TRUE THEN 1 END) as servicos_ativos,
        COALESCE(AVG(a.nota), 0) as media_avaliacoes,
        COUNT(a.id) as total_avaliacoes,
        COUNT(c.id) as total_contratos,
        COUNT(CASE WHEN c.status = 'concluido' THEN 1 END) as contratos_concluidos
    FROM usuarios u
    LEFT JOIN servicos s ON u.id = s.usuario_id
    LEFT JOIN avaliacoes a ON u.id = a.usuario_avaliado_id
    LEFT JOIN contratos c ON u.id = c.prestador_id
    WHERE u.id = p_usuario_id
    GROUP BY u.id;
END //

DELIMITER ;

DELIMITER //
CREATE TRIGGER tr_incrementar_visualizacoes
AFTER INSERT ON mensagens
FOR EACH ROW
BEGIN
    IF NEW.servico_id IS NOT NULL THEN
        UPDATE servicos 
        SET visualizacoes = visualizacoes + 1 
        WHERE id = NEW.servico_id;
    END IF;
END //
DELIMITER ;

CREATE INDEX idx_servicos_categoria_tipo ON servicos(categoria_id, tipo, ativo);
CREATE INDEX idx_servicos_usuario_ativo ON servicos(usuario_id, ativo);
CREATE INDEX idx_avaliacoes_usuario_nota ON avaliacoes(usuario_avaliado_id, nota);
CREATE INDEX idx_contratos_status_data ON contratos(status, data_criacao);

CREATE USER IF NOT EXISTS 'summit_app'@'localhost' IDENTIFIED BY 'summit_password_2024';
GRANT SELECT, INSERT, UPDATE, DELETE ON summit_db.* TO 'summit_app'@'localhost';
GRANT EXECUTE ON summit_db.* TO 'summit_app'@'localhost';
FLUSH PRIVILEGES;

ALTER TABLE usuarios COMMENT = 'Tabela principal de usuários do sistema, incluindo freelancers e empresas';
ALTER TABLE categorias COMMENT = 'Categorias de serviços e produtos';
ALTER TABLE servicos COMMENT = 'Serviços e produtos oferecidos pelos usuários';
ALTER TABLE avaliacoes COMMENT = 'Avaliações dos serviços prestados';
ALTER TABLE mensagens COMMENT = 'Sistema de mensagens entre usuários';
ALTER TABLE contratos COMMENT = 'Contratos e pedidos de serviços';
ALTER TABLE favoritos COMMENT = 'Serviços favoritados pelos usuários';

