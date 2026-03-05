# 🚀 QUICK START GUIDE - EXECUTAR O BANCO DE DADOS

## ⚡ COMEÇAR EM 5 MINUTOS

### Pré-requisitos
- ✅ MySQL 5.7+ ou 8.0 instalado
- ✅ Desktop MySQL Workbench (ou similar)
- ✅ 2GB de espaço em disco
- ✅ Acesso a root ou usuário admin

---

## 📋 PASSO 1: Criar Banco de Dados

### Via MySQL Command Line
```bash
# Conectar ao MySQL
mysql -u root -p

# Criar banco
CREATE DATABASE marketplace_softwares CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Usar o banco
USE marketplace_softwares;
```

### Via MySQL Workbench
1. Conectar ao servidor MySQL
2. Clique direito em "Schemas"
3. "Create Schema..."
4. Nome: `marketplace_softwares`
5. Charset: `utf8mb4`
6. Collation: `utf8mb4_unicode_ci`

---

## 📄 PASSO 2: Executar Arquivos SQL

### Opção A: Via Command Line (Rápido)
```bash
# Terminal/PowerShell
mysql -u root -p marketplace_softwares < Tabelas_BD.sql
mysql -u root -p marketplace_softwares < Tabelas_BD_Parte2.sql
mysql -u root -p marketplace_softwares < Tabelas_BD_Parte3_SaaS.sql

# Ou com um script único
cat Tabelas_BD.sql Tabelas_BD_Parte2.sql Tabelas_BD_Parte3_SaaS.sql | mysql -u root -p marketplace_softwares
```

### Opção B: Via MySQL Workbench (Visual)
1. Abrir MySQL Workbench
2. File → Open SQL Script
3. Selecionar `Tabelas_BD.sql`
4. Execute (⚡ icon)
5. Repetir para Parte2 e Parte3

### Opção C: Via DBeaver (Popular)
1. Abrir DBeaver
2. Conectar ao MySQL
3. File → Open SQL Script
4. Selecionar arquivo
5. Execute (Ctrl+Enter)

---

## ✅ PASSO 3: Validar Criação

### Verificar Tabelas
```sql
-- Ver todas tabelas criadas
SHOW TABLES;

-- Contar tabelas (deve ser 142)
SELECT COUNT(*) as total_tabelas FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'marketplace_softwares';

-- Ver algumas tabelas principais
SHOW TABLES LIKE 'usuarios%';
SHOW TABLES LIKE 'softwares%';
SHOW TABLES LIKE 'saas_%';
```

### Verificar Estrutura
```sql
-- Estrutura da tabela USUARIOS
DESC usuarios;

-- Ver foreign keys
SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'marketplace_softwares'
LIMIT 20;

-- Ver índices
SHOW INDEX FROM usuarios;
```

### Validar Dados de Exemplo
```sql
-- Ver dados de exemplo inseridos
SELECT COUNT(*) as usuario_count FROM usuarios;
SELECT COUNT(*) as software_count FROM softwares;
SELECT * FROM usuarios LIMIT 5;
```

---

## 🔧 PASSO 4: Configurar Acesso

### Criar Usuário para App (Segurança)
```sql
-- Criar usuário
CREATE USER 'app_marketplace'@'localhost' IDENTIFIED BY 'senha_segura_123!';

-- Conceder permissões
GRANT ALL PRIVILEGES ON marketplace_softwares.* TO 'app_marketplace'@'localhost';
FLUSH PRIVILEGES;

-- Ou para acesso remoto:
CREATE USER 'app_marketplace'@'%' IDENTIFIED BY 'senha_segura_123!';
GRANT ALL PRIVILEGES ON marketplace_softwares.* TO 'app_marketplace'@'%';
FLUSH PRIVILEGES;
```

### Testar Conexão
```bash
mysql -u app_marketplace -p -h localhost -D marketplace_softwares -e "SELECT COUNT(*) as tabelas FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'marketplace_softwares';"
```

---

## 🧪 PASSO 5: Testar Fluxos Principais

### Fluxo 1: Criar Usuario e Comprar Software
```sql
-- 1. Usuário compra software
INSERT INTO usuarios (email, nome, tipo_usuario, status_usuario)
VALUES ('cliente@example.com', 'João Silva', 'cliente', 'ativo');

-- 2. Ver o usuário criado
SELECT * FROM usuarios WHERE email = 'cliente@example.com';

-- 3. Adicionar endereço
INSERT INTO endercos (usuario_id, tipo_endereco, rua, numero, cidade, estado, cep)
VALUES (LAST_INSERT_ID(), 'cobranca', 'Rua A', 123, 'São Paulo', 'SP', '01234567');

-- 4. Criar pedido
INSERT INTO pedidos (usuario_id, total_pedido, status_pedido, data_criacao)
VALUES (1, 99.90, 'completado', NOW());

-- 5. Ver pedidos
SELECT u.nome, p.total_pedido, p.status_pedido 
FROM pedidos p 
JOIN usuarios u ON p.usuario_id = u.id;
```

### Fluxo 2: Fornecedor Publica Software
```sql
-- 1. Criar fornecedor
INSERT INTO fornecedores (nome_empresa, email_contato, status_fornecedor)
VALUES ('Tech Company', 'contato@techcompany.com', 'ativo');

-- 2. Criar software
INSERT INTO softwares (fornecedor_id, nome_software, descricao, preco_base, status_software)
VALUES (1, 'Meu App', 'Descrição do app', 99.90, 'publicado');

-- 3. Ver software criado
SELECT f.nome_empresa, s.nome_software, s.preco_base
FROM softwares s
JOIN fornecedores f ON s.fornecedor_id = f.id;
```

### Fluxo 3: SaaS - Criar Instância
```sql
-- 1. Criar licença SaaS
INSERT INTO licencas (usuario_id, software_id, tipo_licenca, status_licenca)
VALUES (1, 1, 'saas_cloud', 'ativa');

-- 2. Provisionar instância
INSERT INTO saas_instancia_usuario (licenca_id, software_id, usuario_id, status_instancia)
VALUES (LAST_INSERT_ID(), 1, 1, 'ativa');

-- 3. Ver instância
SELECT u.nome, s.nome_software, siu.status_instancia, siu.url_acesso
FROM saas_instancia_usuario siu
JOIN usuarios u ON siu.usuario_id = u.id
JOIN softwares s ON siu.software_id = s.id;
```

---

## 🔍 PASSO 6: Queries Úteis para Testing

### Dashboard Summary
```sql
-- Dashboard geral
SELECT
  (SELECT COUNT(*) FROM usuarios) as total_usuarios,
  (SELECT COUNT(*) FROM softwares) as total_softwares,
  (SELECT COUNT(*) FROM pedidos) as total_pedidos,
  (SELECT COUNT(*) FROM licencas) as total_licencas,
  (SELECT COUNT(*) FROM saas_instancia_usuario) as total_saas_instancias,
  (SELECT SUM(total_pedido) FROM pedidos) as receita_total;
```

### Softwares Mais Vendidos
```sql
SELECT
  s.nome_software,
  f.nome_empresa as fornecedor,
  COUNT(DISTINCT p.id) as total_vendas,
  SUM(vs.valor_venda) as receita_total
FROM softwares s
LEFT JOIN fornecedores f ON s.fornecedor_id = f.id
LEFT JOIN vendas_software vs ON s.id = vs.software_id
LEFT JOIN pedidos p ON vs.pedido_id = p.id
GROUP BY s.id
ORDER BY total_vendas DESC
LIMIT 10;
```

### Usuários Mais Ativos
```sql
SELECT
  u.nome,
  u.email,
  COUNT(DISTINCT l.id) as softwares_comprados,
  COUNT(DISTINCT a.id) as avaliacoes_deixadas,
  COUNT(DISTINCT p.id) as pedidos_realizados
FROM usuarios u
LEFT JOIN licencas l ON u.id = l.usuario_id
LEFT JOIN avaliacoes a ON u.id = a.usuario_id
LEFT JOIN pedidos p ON u.id = p.usuario_id
GROUP BY u.id
ORDER BY softwares_comprados DESC
LIMIT 10;
```

### Instâncias SaaS Ativas
```sql
SELECT
  u.nome as usuario,
  s.nome_software as software,
  siu.status_instancia as status,
  siu.url_acesso as url,
  sc.storage_gb as storage_limite,
  scu.storage_gb_usado as storage_usado
FROM saas_instancia_usuario siu
JOIN usuarios u ON siu.usuario_id = u.id
JOIN softwares s ON siu.software_id = s.id
LEFT JOIN saas_limites_plano sc ON siu.licenca_id = sc.licenca_id
LEFT JOIN saas_consumo_usuario scu ON siu.id = scu.instancia_id
WHERE siu.status_instancia = 'ativa'
ORDER BY siu.data_criacao DESC;
```

---

## 🛠️ PASSO 7: Backup & Restore

### Fazer Backup
```bash
# Backup completo
mysqldump -u root -p marketplace_softwares > backup_marketplace.sql

# Backup com compressão
mysqldump -u root -p marketplace_softwares | gzip > backup_marketplace.sql.gz

# Backup específico
mysqldump -u root -p marketplace_softwares usuarios softwares pedidos > backup_essencial.sql
```

### Restaurar Backup
```bash
# Restaurar
mysql -u root -p marketplace_softwares < backup_marketplace.sql

# Restaurar comprimido
gunzip < backup_marketplace.sql.gz | mysql -u root -p marketplace_softwares
```

---

## 📊 PASSO 8: Ver Performance

### Listar Índices
```sql
-- Índices existentes
SELECT * FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'marketplace_softwares'
AND INDEX_NAME != 'PRIMARY'
ORDER BY TABLE_NAME, INDEX_NAME;
```

### Status da Conexão
```sql
-- Conexões ativas
SHOW PROCESSLIST;

-- Variáveis importantes
SHOW VARIABLES LIKE 'max_connections';
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
SHOW VARIABLES LIKE 'query_cache_%';
```

### Tamanho do Banco
```sql
-- Tamanho total
SELECT
  table_schema,
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
FROM information_schema.TABLES
WHERE table_schema = 'marketplace_softwares'
GROUP BY table_schema;

-- Tamanho por tabela
SELECT
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE table_schema = 'marketplace_softwares'
ORDER BY size_mb DESC;
```

---

## 🚨 TROUBLESHOOTING

### Erro: "Table doesn't exist"
```bash
# Verificar se banco foi criado
SHOW DATABASES;

# Re-executar arquivos SQL em ordem:
1. Tabelas_BD.sql
2. Tabelas_BD_Parte2.sql
3. Tabelas_BD_Parte3_SaaS.sql
```

### Erro: "Foreign key constraint fails"
```sql
-- Verificar integridade
SET FOREIGN_KEY_CHECKS=0;
-- (executar dados)
SET FOREIGN_KEY_CHECKS=1;
```

### Erro: "Out of memory"
```sql
-- Aumentar memoria
SET SESSION innodb_buffer_pool_size = 512M;

-- Ou no my.cnf:
[mysqld]
innodb_buffer_pool_size = 512M
max_connections = 1000
```

### Banco muito lento
```sql
-- Reconstruir índices
OPTIMIZE TABLE usuarios;
OPTIMIZE TABLE softwares;

-- Ou
REPAIR TABLE usuarios;
ANALYZE TABLE usuarios;
```

---

## 📱 PRÓXIMOS PASSOS

### Opção 1: Conectar com Aplicação
```javascript
// Node.js example
const mysql = require('mysql2/promise');

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'app_marketplace',
  password: 'senha_segura_123!',
  database: 'marketplace_softwares'
});

const [rows] = await connection.query('SELECT COUNT(*) as total FROM usuarios');
console.log('Total de usuários:', rows[0].total);
```

### Opção 2: Visualizar no DBeaver/Workbench
- Conectar ao banco
- Explorar tabelas e dados
- Criar queries personalizadas
- Exportar relatórios

### Opção 3: Implementar APIs
- Usar Checklist_Implementacao.md
- Criar endpoints conforme fases
- Seguir 120+ endpoints listados

### Opção 4: Deploy em Cloud
- AWS RDS MySQL
- Google Cloud SQL
- Azure Database MySQL
- DigitalOcean Managed Database

---

## 📞 CONTATO & SUPORTE

**Documentação**: Veja `Documentacao_Banco_Completo.md`  
**Implementação**: Veja `Checklist_Implementacao.md`  
**Visão Geral**: Veja `Resumo_Final.md`  
**Índice**: Veja `Indice_Executivo.md`

---

**🎉 Seu banco de dados está pronto para produção!**

*Tempo total de setup: ~5-10 minutos*
