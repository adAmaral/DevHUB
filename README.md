# DevHUB | Marketplace de Software e SaaS

## Nome do Projeto

**DevHUB**

## Nome dos Integrantes

*   Adriel Amaral Alegrette
*   Eduardo Rubel
*   Gustavo Bau

## Descrição Resumida do Sistema

O DevHUB é um marketplace abrangente projetado para facilitar a descoberta, compra e gestão de softwares e serviços SaaS (Software as a Service). Ele conecta desenvolvedores e fornecedores de software com empresas e usuários finais, oferecendo uma plataforma robusta para listar, vender e adquirir soluções tecnológicas. O sistema inclui funcionalidades para autenticação de usuários, gestão de produtos, carrinho de compras, processos de checkout, e diversas ferramentas administrativas e de suporte.

## Tecnologias Utilizadas

O projeto DevHUB é construído com uma arquitetura de backend e frontend separadas, utilizando as seguintes tecnologias:

### Backend

*   **Node.js**: Ambiente de execução JavaScript.
*   **Express.js**: Framework web para Node.js, utilizado para construir a API RESTful.
*   **Sequelize**: ORM (Object-Relational Mapper) para Node.js, facilitando a interação com o banco de dados.
*   **MySQL**: Sistema de gerenciamento de banco de dados relacional (pode ser substituído por PostgreSQL).
*   **bcrypt**: Biblioteca para hash de senhas.
*   **jsonwebtoken (JWT)**: Para autenticação baseada em tokens.
*   **cors**: Middleware para habilitar o Cross-Origin Resource Sharing.
*   **dotenv**: Para carregar variáveis de ambiente de um arquivo `.env`.

### Frontend

*   **React**: Biblioteca JavaScript para construção de interfaces de usuário.
*   **Vite**: Ferramenta de build frontend que oferece uma experiência de desenvolvimento rápida.
*   **JavaScript (ES6+)**: Linguagem de programação principal.
*   **HTML5/CSS3**: Estrutura e estilização da interface.
*   **React Router DOM**: Para roteamento de componentes no frontend.

## Instruções para Execução

Para rodar o projeto DevHUB localmente, siga os passos abaixo. Você precisará de **dois terminais** abertos simultaneamente: um para o backend e outro para o frontend.

### Pré-requisitos

Certifique-se de ter os seguintes softwares instalados em sua máquina:

*   **Node.js** (versão 18 ou superior) e **npm** (ou **Yarn**).
*   **MySQL Workbench** (ou outro cliente MySQL) para gerenciar o banco de dados, ou **Docker** e **Docker Compose** se optar por PostgreSQL local.
*   **Git** para clonar o repositório.

### 1. Clonar o Repositório

```bash
git clone https://github.com/adAmaral/DevHUB.git
cd DevHUB
```

### 2. Configuração do Banco de Dados (MySQL)

1.  **Crie um banco de dados MySQL** vazio (ex: `devhub_db`) no seu MySQL Workbench ou via linha de comando.
2.  **Execute os scripts SQL** localizados em `DVHB/DB/` para criar as tabelas. Comece por `Tabelas_DB.sql`, `Tabelas_DB_Parte2_C.sql`, `Tabelas_DB_Parte3_SaaS.sql` e, se necessário, `Tabelas_DB_postgres_tables.sql` (se estiver usando PostgreSQL).
3.  **Crie um arquivo `.env`** na pasta `DVHB` (na raiz do projeto, junto com `package.json`) com as suas credenciais do banco de dados e chaves secretas. Exemplo:

    ```dotenv
    DB_NAME=devhub_db
    DB_USER=root
    DB_PASS=sua_senha_mysql
    DB_HOST=localhost
    DB_PORT=3306
    JWT_SECRET=sua_chave_secreta_jwt_aqui
    JWT_EXPIRES_IN=1h
    ```

    *Certifique-se de que `DB_HOST` e `DB_PORT` correspondam à sua configuração MySQL local.*

### 3. Rodar o Backend (API)

1.  Navegue até a pasta `DVHB` no seu terminal:
    ```bash
    cd DVHB
    ```
2.  Instale as dependências do backend:
    ```bash
    npm install
    # ou yarn install
    ```
3.  Inicie o servidor backend:
    ```bash
    npm start
    # ou npm run dev (se tiver nodemon instalado para desenvolvimento)
    ```
    O backend estará rodando em `http://localhost:3000`.

### 4. Rodar o Frontend (Interface do Usuário)

1.  Abra um **novo terminal** e navegue até a pasta `DVHB/frontend`:
    ```bash
    cd DVHB/frontend
    ```
2.  Instale as dependências do frontend:
    ```bash
    npm install
    # ou yarn install
    ```
3.  Inicie o servidor de desenvolvimento do frontend:
    ```bash
    npm run dev
    ```
    O frontend geralmente será iniciado em `http://localhost:5173` (ou outra porta disponível). Abra esta URL no seu navegador.

    *O frontend está configurado para se comunicar com o backend via proxy em `/api` para `http://localhost:3000`.*

## Funcionalidades Implementadas

O DevHUB oferece as seguintes funcionalidades principais:

*   **Autenticação de Usuários**: Registro, Login e Logout de usuários.
*   **Gestão de Produtos**: Criação, edição e listagem de softwares/SaaS pelos fornecedores.
*   **Marketplace**: Visualização e busca de produtos disponíveis.
*   **Carrinho de Compras**: Adição, remoção e gestão de itens no carrinho.
*   **Checkout e Pagamento**: Processo de finalização de compra.
*   **Perfis de Usuários**: Visualização e edição de informações de perfil.
*   **Avaliações e Comentários**: Sistema para usuários avaliarem produtos.
*   **Suporte ao Cliente**: Sistema de tickets de suporte.
*   **Gestão de Cupons**: Aplicação de cupons de desconto.
*   **Wishlist/Favoritos**: Lista de desejos para produtos.
*   **Auditoria de Software**: Registro de atividades relacionadas a softwares.
*   **Denúncias**: Funcionalidade para reportar conteúdo ou usuários.
*   **Gestão de Endereços**: Cadastro e seleção de endereços de entrega/cobrança.
*   **Gestão de Fornecedores**: Cadastro e administração de fornecedores.
*   **Integração Git**: (Potencialmente) Funcionalidades relacionadas à integração com repositórios Git.

## Participação dos integrantes

* **Adriel** - Backend
* **Eduardo** - Banco de Dados
* **Gustavo** - Frontend/Documentações

## Link do Vídeo de Demonstração
https://www.youtube.com/watch?v=eHB1SXB9Zbo