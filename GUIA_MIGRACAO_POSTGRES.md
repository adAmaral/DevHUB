# Guia de Migração: Supabase para PostgreSQL Local com Docker

Este guia detalha os passos necessários para migrar seu banco de dados do Supabase para uma instância local do PostgreSQL usando Docker, e como configurar seu projeto `DevHUB` para se conectar a ele.

## 1. Pré-requisitos

Certifique-se de ter os seguintes softwares instalados em sua máquina:

*   **Docker e Docker Compose**: Essenciais para rodar o PostgreSQL em um contêiner. Você pode baixá-los em [docker.com](https://www.docker.com/get-started/).
*   **Node.js e npm/yarn**: Para rodar o backend do seu projeto.

## 2. Configuração do PostgreSQL Local com Docker

Você já possui um arquivo `docker-compose.yml` configurado para o PostgreSQL. Este arquivo define um serviço de banco de dados PostgreSQL que será executado em um contêiner Docker.

### 2.1. Arquivo `docker-compose.yml`

O arquivo `docker-compose.yml` está localizado na raiz do seu projeto `DevHUB` e tem o seguinte conteúdo:

```yaml
version: '3.8'

services:
  db:
    image: postgres:13
    restart: always
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASS}
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
      # - ./init.sql:/docker-entrypoint-initdb.d/init.sql # Descomente se tiver um script SQL inicial para rodar

volumes:
  db_data:
```

### 2.2. Variáveis de Ambiente

Para que o `docker-compose` e seu aplicativo se conectem ao banco de dados, você precisará definir as variáveis de ambiente. Crie um arquivo `.env` na raiz do seu projeto `DevHUB` (no mesmo nível do `docker-compose.yml`) com o seguinte conteúdo:

```dotenv
DB_NAME=devhub_db
DB_USER=devhub_user
DB_PASS=devhub_password
DB_HOST=localhost
DB_PORT=5432
```

**Importante**: Você pode escolher outros valores para `DB_NAME`, `DB_USER` e `DB_PASS`, mas certifique-se de que sejam consistentes entre o `.env` e a configuração do seu aplicativo.

### 2.3. Iniciando o Contêiner PostgreSQL

Abra o terminal na raiz do seu projeto `DevHUB` e execute o seguinte comando para iniciar o serviço PostgreSQL:

```bash
docker-compose up -d
```

Este comando fará o download da imagem do PostgreSQL (se ainda não tiver), criará e iniciará o contêiner em segundo plano (`-d`).

Você pode verificar o status do contêiner com:

```bash
docker-compose ps
```

## 3. Configurando o Projeto `DevHUB` para PostgreSQL

Seu projeto `DevHUB` utiliza `sequelize` para a conexão com o banco de dados. Atualmente, a configuração em `backend/src/utils/db.js` está definida para `mysql`.

### 3.1. Atualizando `backend/src/utils/db.js`

Você precisará alterar o dialeto de `mysql` para `postgres` e adicionar a porta, pois o `sequelize` espera a porta para PostgreSQL.

**Antes:**

```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    }
);

module.exports = sequelize;
```

**Depois:**

```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT, // Adicione esta linha
        dialect: 'postgres', // Altere para 'postgres'
        logging: false,
    }
);

module.exports = sequelize;
```

### 3.2. Instalando o Driver PostgreSQL para Sequelize

Como você está migrando para PostgreSQL, precisará instalar o driver `pg` e `pg-hstore` para o Sequelize. Navegue até a pasta `DVHB` e execute:

```bash
cd /home/ubuntu/DevHUB/DVHB
npm install pg pg-hstore
# ou
yarn add pg pg-hstore
```

### 3.3. Aplicando o Esquema do Banco de Dados

Seu repositório contém arquivos SQL para PostgreSQL em `DVHB/DB/Tabelas_DB_postgres_tables.sql`. Você precisará aplicar este esquema ao seu banco de dados local.

Você pode fazer isso de algumas maneiras:

#### Opção 1: Usando `psql` (Recomendado)

Com o contêiner PostgreSQL rodando, você pode usar o cliente `psql` para se conectar e executar o script SQL. Abra um novo terminal e execute:

```bash
# Navegue até a pasta onde o docker-compose.yml está
cd /home/ubuntu/DevHUB

# Conecte-se ao banco de dados usando o contêiner Docker
docker-compose exec db psql -U ${DB_USER} -d ${DB_NAME} -f ./DVHB/DB/Tabelas_DB_postgres_tables.sql
```

Substitua `${DB_USER}` e `${DB_NAME}` pelos valores que você definiu no seu arquivo `.env`.

#### Opção 2: Usando um script de inicialização no Docker Compose

Você pode automatizar a execução do script SQL descomentando a linha ` - ./init.sql:/docker-entrypoint-initdb.d/init.sql` no seu `docker-compose.yml` e movendo ou copiando seu `Tabelas_DB_postgres_tables.sql` para `init.sql` na raiz do projeto. No entanto, esta opção só funciona na primeira vez que o contêiner é criado ou se o volume `db_data` for removido.

## 4. Executando o Backend

Após configurar o banco de dados e atualizar o projeto, você pode iniciar o backend. Navegue até a pasta `DVHB` e execute:

```bash
cd /home/ubuntu/DevHUB/DVHB
npm start
# ou
npm run dev # se você tiver nodemon instalado
```

Se tudo estiver configurado corretamente, seu backend deverá se conectar ao PostgreSQL local sem problemas.

## 5. Migração de Dados (Opcional)

Se você tiver dados existentes no Supabase que deseja migrar para o seu PostgreSQL local, o processo geralmente envolve:

1.  **Exportar dados do Supabase**: O Supabase geralmente oferece ferramentas para exportar seus dados (por exemplo, via `pg_dump` ou através da interface web).
2.  **Importar dados para o PostgreSQL local**: Use o comando `psql` ou ferramentas como `pg_restore` para importar os dados exportados para o seu banco de dados local.

Este processo pode variar dependendo da quantidade e complexidade dos seus dados. Consulte a documentação do Supabase para obter instruções detalhadas sobre a exportação de dados.

---

**Autor:** Manus AI
**Data:** 29 de Junho de 2026
