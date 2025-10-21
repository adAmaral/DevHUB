DROP DATABASE IF EXISTS devhub_db;

CREATE DATABASE devhub_db
    ENCODING 'UTF8'
    LC_COLLATE 'pt_BR.UTF-8'
    LC_CTYPE 'pt_BR.UTF-8'
    TEMPLATE template0;

CREATE TYPE tipo_usuario AS ENUM ('cliente', 'empresa', 'freelancer');
CREATE TYPE tipo_servico AS ENUM ('servico', 'produto');
CREATE TYPE status_contrato AS ENUM ('pendente', 'aceito', 'em_andamento', 'concluido', 'cancelado');

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY, -- 'SERIAL' substitui 'AUTO_INCREMENT'
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo tipo_usuario NOT NULL, -- Usa o TIPO criado
    telefone VARCHAR(20),
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(50),
    cep VARCHAR(10),
    data_nascimento DATE,
    cpf_cnpj VARCHAR(20),
    descricao TEXT,
    foto_perfil VARCHAR(500),
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- TIMESTAMPTZ é mais robusto
    data_atualizacao TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    nome_fantasia VARCHAR(255),
    razao_social VARCHAR(255),
    area_atuacao VARCHAR(255),
    especialidades JSONB, -- JSONB é preferível no PostgreSQL
    portfolio_url VARCHAR(500),
    site_url VARCHAR(500)
);

CREATE TRIGGER set_usuarios_timestamp
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    icone VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE servicos (
    id_servico SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    categoria_id INT NOT NULL REFERENCES categorias(id_categoria) ON DELETE RESTRICT,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tipo tipo_servico NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    prazo_entrega INT,
    imagens JSONB,
    tags JSONB,
    ativo BOOLEAN DEFAULT TRUE,
    destaque BOOLEAN DEFAULT FALSE,
    visualizacoes INT DEFAULT 0,
    data_cadastro TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Coluna de vetor para Full-Text Search (substitui o FULLTEXT do MySQL)
    tsv tsvector GENERATED ALWAYS AS (
        to_tsvector('portuguese', coalesce(titulo, '') || ' ' || coalesce(descricao, ''))
    ) STORED
);

-- Trigger para 'data_atualizacao'
CREATE TRIGGER set_servicos_timestamp
BEFORE UPDATE ON servicos
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE avaliacoes (
    id_avaliacao SERIAL PRIMARY KEY,
    servico_id INT NOT NULL REFERENCES servicos(id_servico) ON DELETE CASCADE,
    usuario_avaliador_id INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE, -- CORRIGIDO
    usuario_avaliado_id INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE, -- CORRIGIDO
    nota INT NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    data_avaliacao TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (servico_id, usuario_avaliador_id) -- Substitui 'UNIQUE KEY'
);

CREATE TABLE mensagens (
    id_mensagem SERIAL PRIMARY KEY,
    remetente_id INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE, -- CORRIGIDO
    destinatario_id INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE, -- CORRIGIDO
    servico_id INT REFERENCES servicos(id_servico) ON DELETE SET NULL,
    assunto VARCHAR(255),
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contratos (
    id_contrato SERIAL PRIMARY KEY,
    servico_id INT NOT NULL REFERENCES servicos(id_servico) ON DELETE RESTRICT,
    cliente_id INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE RESTRICT, -- CORRIGIDO
    prestador_id INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE RESTRICT, -- CORRIGIDO
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    valor DECIMAL(10,2) NOT NULL,
    prazo_entrega DATE,
    status status_contrato DEFAULT 'pendente',
    data_criacao TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    data_aceite TIMESTAMPTZ NULL,
    data_conclusao TIMESTAMPTZ NULL,
    data_cancelamento TIMESTAMPTZ NULL,
    motivo_cancelamento TEXT
);

CREATE TABLE favoritos (
    id_favorito SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    servico_id INT NOT NULL REFERENCES servicos(id_servico) ON DELETE CASCADE,
    data_favoritado TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (usuario_id, servico_id)
);

-- Inserção de Dados
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


-- Criação de Views
CREATE VIEW vw_estatisticas_usuarios AS
SELECT 
    tipo,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE ativo = TRUE) as ativos, -- Sintaxe 'FILTER' do PG
    COUNT(*) FILTER (WHERE DATE(data_cadastro) = CURRENT_DATE) as novos_hoje, -- 'CURRENT_DATE'
    COUNT(*) FILTER (WHERE data_cadastro >= (CURRENT_DATE - INTERVAL '7 day')) as novos_semana
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
    COUNT(a.id_avaliacao) as total_avaliacoes -- CORRIGIDO para id_avaliacao
FROM servicos s
JOIN usuarios u ON s.usuario_id = u.id_usuario
JOIN categorias c ON s.categoria_id = c.id_categoria -- CORRIGIDO
LEFT JOIN avaliacoes a ON s.id_servico = a.servico_id
WHERE s.ativo = TRUE AND u.ativo = TRUE
GROUP BY s.id_servico, u.id_usuario, c.id_categoria; -- CORRIGIDO (PG é mais estrito no GROUP BY)

CREATE VIEW vw_ranking_prestadores AS
SELECT 
    u.id_usuario, -- CORRIGIDO
    u.nome,
    u.foto_perfil,
    u.tipo,
    COUNT(s.id_servico) as total_servicos, -- CORRIGIDO
    COALESCE(AVG(a.nota), 0) as media_avaliacoes,
    COUNT(a.id_avaliacao) as total_avaliacoes, -- CORRIGIDO
    COUNT(c.id_contrato) FILTER (WHERE c.status = 'concluido') as contratos_concluidos -- CORRIGIDO
FROM usuarios u
LEFT JOIN servicos s ON u.id_usuario = s.usuario_id AND s.ativo = TRUE
LEFT JOIN avaliacoes a ON u.id_usuario = a.usuario_avaliado_id
LEFT JOIN contratos c ON u.id_usuario = c.prestador_id
WHERE u.tipo IN ('freelancer', 'empresa') AND u.ativo = TRUE
GROUP BY u.id_usuario -- CORRIGIDO
HAVING COUNT(s.id_servico) > 0
ORDER BY media_avaliacoes DESC, total_avaliacoes DESC;

-- Funções (Substituindo Procedures)
CREATE OR REPLACE FUNCTION BuscarServicos(
    p_termo VARCHAR(255),
    p_id_categoria INT,
    p_tipo_varchar VARCHAR(20),
    p_preco_min DECIMAL(10,2),
    p_preco_max DECIMAL(10,2),
    p_limite INT,
    p_offset INT
)
RETURNS SETOF vw_servicos_completos AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM vw_servicos_completos
    WHERE 
        -- Substitui o MATCH...AGAINST pelo operador @@ do PG FTS
        (p_termo IS NULL OR tsv @@ plainto_tsquery('portuguese', p_termo))
        AND (p_id_categoria IS NULL OR categoria_id = p_id_categoria) -- CORRIGIDO
        AND (p_tipo_varchar IS NULL OR tipo::text = p_tipo_varchar) -- Compara o ENUM como texto
        AND (p_preco_min IS NULL OR preco >= p_preco_min)
        AND (p_preco_max IS NULL OR preco <= p_preco_max)
    ORDER BY data_cadastro DESC
    LIMIT p_limite OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION EstatisticasUsuario(p_usuario_id INT)
RETURNS TABLE (
    nome VARCHAR(255),
    tipo tipo_usuario,
    area_atuacao VARCHAR(255),
    especialidades JSONB,
    portfolio_url VARCHAR(500),
    site_url VARCHAR(500),
    total_servicos BIGINT,
    servicos_ativos BIGINT,
    media_avaliacoes DECIMAL,
    total_avaliacoes BIGINT,
    total_contratos BIGINT,
    contratos_concluidos BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.nome,
        u.tipo,
        u.area_atuacao,
        u.especialidades,
        u.portfolio_url,
        u.site_url,
        COUNT(s.id_servico) as total_servicos,
        COUNT(s.id_servico) FILTER (WHERE s.ativo = TRUE) as servicos_ativos,
        COALESCE(AVG(a.nota), 0::decimal) as media_avaliacoes,
        COUNT(a.id_avaliacao) as total_avaliacoes,
        COUNT(c.id_contrato) as total_contratos,
        COUNT(c.id_contrato) FILTER (WHERE c.status = 'concluido') as contratos_concluidos
    FROM usuarios u
    LEFT JOIN servicos s ON u.id_usuario = s.usuario_id
    LEFT JOIN avaliacoes a ON u.id_usuario = a.usuario_avaliado_id
    LEFT JOIN contratos c ON u.id_usuario = c.prestador_id
    WHERE u.id_usuario = p_usuario_id
    GROUP BY u.id_usuario;
END;
$$ LANGUAGE plpgsql;


-- Triggers (convertidos para o formato do PG)
CREATE OR REPLACE FUNCTION tr_incrementar_visualizacoes()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.servico_id IS NOT NULL THEN
        UPDATE servicos 
        SET visualizacoes = visualizacoes + 1 
        WHERE id_servico = NEW.servico_id; -- CORRIGIDO
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_incrementar_visualizacoes
AFTER INSERT ON mensagens
FOR EACH ROW
EXECUTE PROCEDURE tr_incrementar_visualizacoes();


-- Criação de Índices (movidos para fora do CREATE TABLE)
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo);
CREATE INDEX idx_usuarios_ativo ON usuarios(ativo);
CREATE INDEX idx_usuarios_data_cadastro ON usuarios(data_cadastro);

CREATE INDEX idx_categorias_nome ON categorias(nome);
CREATE INDEX idx_categorias_ativo ON categorias(ativo);

CREATE INDEX idx_servicos_usuario_id ON servicos(usuario_id);
CREATE INDEX idx_servicos_categoria_id ON servicos(categoria_id);
CREATE INDEX idx_servicos_tipo ON servicos(tipo);
CREATE INDEX idx_servicos_ativo ON servicos(ativo);
CREATE INDEX idx_servicos_destaque ON servicos(destaque);
CREATE INDEX idx_servicos_preco ON servicos(preco);
CREATE INDEX idx_servicos_data_cadastro ON servicos(data_cadastro);
CREATE INDEX idx_servicos_tsv ON servicos USING GIN(tsv); -- Índice GIN para FTS

CREATE INDEX idx_avaliacoes_servico_id ON avaliacoes(servico_id);
CREATE INDEX idx_avaliacoes_avaliador_id ON avaliacoes(usuario_avaliador_id);
CREATE INDEX idx_avaliacoes_avaliado_id ON avaliacoes(usuario_avaliado_id);
CREATE INDEX idx_avaliacoes_nota ON avaliacoes(nota);
CREATE INDEX idx_avaliacoes_data_avaliacao ON avaliacoes(data_avaliacao);

CREATE INDEX idx_mensagens_remetente_id ON mensagens(remetente_id);
CREATE INDEX idx_mensagens_destinatario_id ON mensagens(destinatario_id);
CREATE INDEX idx_mensagens_servico_id ON mensagens(servico_id);
CREATE INDEX idx_mensagens_lida ON mensagens(lida);
CREATE INDEX idx_mensagens_data_envio ON mensagens(data_envio);

CREATE INDEX idx_contratos_servico_id ON contratos(servico_id);
CREATE INDEX idx_contratos_cliente_id ON contratos(cliente_id);
CREATE INDEX idx_contratos_prestador_id ON contratos(prestador_id);
CREATE INDEX idx_contratos_status ON contratos(status);
CREATE INDEX idx_contratos_data_criacao ON contratos(data_criacao);

CREATE INDEX idx_favoritos_usuario_id ON favoritos(usuario_id);
CREATE INDEX idx_favoritos_servico_id ON favoritos(servico_id);
CREATE INDEX idx_favoritos_data_favoritado ON favoritos(data_favoritado);

CREATE INDEX idx_servicos_categoria_tipo ON servicos(categoria_id, tipo, ativo);
CREATE INDEX idx_servicos_usuario_ativo ON servicos(usuario_id, ativo);
CREATE INDEX idx_avaliacoes_usuario_nota ON avaliacoes(usuario_avaliado_id, nota);
CREATE INDEX idx_contratos_status_data ON contratos(status, data_criacao);

-- Gerenciamento de Usuários e Permissões (sintaxe do PG)
CREATE USER summit_app WITH PASSWORD '12345';

GRANT CONNECT ON DATABASE devhub_db TO summit_app;
GRANT USAGE ON SCHEMA public TO summit_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO summit_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO summit_app;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO summit_app;

-- Garante permissões futuras para tabelas/sequências/funções que você criar
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO summit_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO summit_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO summit_app;


-- Comentários (sintaxe do PG)
COMMENT ON TABLE usuarios IS 'Tabela principal de usuários do sistema, incluindo freelancers e empresas';
COMMENT ON TABLE categorias IS 'Categorias de serviços e produtos';
COMMENT ON TABLE servicos IS 'Serviços e produtos oferecidos pelos usuários';
COMMENT ON TABLE avaliacoes IS 'Avaliações dos serviços prestados';
COMMENT ON TABLE mensagens IS 'Sistema de mensagens entre usuários';
COMMENT ON TABLE contratos IS 'Contratos e pedidos de serviços';
COMMENT ON TABLE favoritos IS 'Serviços favoritados pelos usuários';