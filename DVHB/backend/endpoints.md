### Users (`/api/users`)

**Base URL:** `/api/users`

#### POST `/api/users` – Criar usuário

- **Body (exemplo):**
```json
{
  "nome": "João",
  "email": "joao@example.com",
  "senha": "senha123",
  "cpf": "12345678900",
  "telefone": "11999999999",
  "foto_perfil": "https://exemplo.com/avatar.png"
}
```
- **Respostas:**
  - `201 Created` – usuário criado.
  - `400/500` – erro de validação/servidor.

#### GET `/api/users` – Listar usuários

- **Respostas:**
  - `200 OK` – array de usuários.

---

### Products (`/api/products`)

**Base URL:** `/api/products`

#### GET `/api/products` – Listar produtos

- `200 OK` – array de produtos.

#### GET `/api/products/:id` – Buscar produto por ID

- `200 OK` – produto.
- `404 Not Found` – não encontrado.

#### POST `/api/products` – Criar produto

- **Body (exemplo):**
```json
{
  "nome": "Mouse Gamer",
  "categoria": "perifericos",
  "preco": 199.9,
  "preco_original": 249.9,
  "estoque": 50,
  "imagem_principal": "https://exemplo.com/mouse.png",
  "rating": 4.5,
  "quantidade_avaliacoes": 10
}
```
- `201 Created` – produto criado.

#### PUT `/api/products/:id` – Atualizar produto

- `200 OK` – produto atualizado.
- `404 Not Found`.

#### DELETE `/api/products/:id` – Remover produto

- `204 No Content`.
- `404 Not Found`.

---

### Endereços (`/api/enderecos`)

**Base URL:** `/api/enderecos`

#### GET `/api/enderecos` – Listar endereços

- **Query opcional:**
  - `?usuario_id=1`
- **Respostas:**
  - `200 OK` – array de endereços.

#### GET `/api/enderecos/:id` – Buscar endereço por ID

- `200 OK`.
- `404 Not Found`.

#### POST `/api/enderecos` – Criar endereço

- **Body (exemplo):**
```json
{
  "usuario_id": 1,
  "tipo": "residencial",
  "endereco": "Rua X",
  "numero": "123",
  "complemento": "Apto 10",
  "bairro": "Centro",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01000000",
  "principal": true
}
```
- `201 Created`.

#### PUT `/api/enderecos/:id` – Atualizar endereço

- `200 OK`.
- `404 Not Found`.

#### DELETE `/api/enderecos/:id` – Remover endereço

- `204 No Content`.
- `404 Not Found`.

---

### Carrinho (`/api/carrinho`)

**Base URL:** `/api/carrinho`

#### GET `/api/carrinho/:usuario_id` – Itens do carrinho de um usuário

- `200 OK` – array de itens:
```json
[
  {
    "id": 1,
    "usuario_id": 1,
    "produto_id": 10,
    "quantidade": 2,
    "preco_unitario": 199.9
  }
]
```

#### POST `/api/carrinho` – Adicionar item ao carrinho

- **Body (exemplo):**
```json
{
  "usuario_id": 1,
  "produto_id": 10,
  "quantidade": 2,
  "preco_unitario": 199.9
}
```
- `201 Created`.

#### PUT `/api/carrinho/:id` – Atualizar item do carrinho

- `200 OK` – item atualizado.
- `404 Not Found`.

#### DELETE `/api/carrinho/:id` – Remover item do carrinho

- `200 OK` – mensagem de sucesso.
- `404 Not Found`.

---

### Pedidos (`/api/pedidos`)

**Base URL:** `/api/pedidos`

#### GET `/api/pedidos` – Listar pedidos

- **Query opcional:**
  - `?usuario_id=1`
- `200 OK` – array de pedidos.

#### GET `/api/pedidos/:id` – Buscar pedido por ID

- `200 OK`.
- `404 Not Found`.

#### POST `/api/pedidos` – Criar pedido a partir do carrinho

- **Body (exemplo mínimo):**
```json
{
  "usuario_id": 1,
  "endereco_entrega_id": 2,
  "metodo_pagamento_id": 3,
  "cumpom_id": 1
}
```
- **Comportamento esperado:**
  - Lê itens do carrinho (`usuario_id`).
  - Calcula `subtotal`, aplica cupom (`cumpom_id`), define `desconto` e `total`.
  - Valida se o `metodo_pagamento_id` é do mesmo `usuario_id`.
  - Cria `pedido` e `itens_pedido`.
  - Limpa o carrinho.
- **Respostas:**
  - `201 Created` – pedido criado.
  - `400 Bad Request` – carrinho vazio, cupom inválido, método de pagamento inválido etc.

#### DELETE `/api/pedidos/:id` – Remover pedido (opcional)

- `204 No Content`.
- `404 Not Found`.

---

### Itens do Pedido (`/api/itenspedido`)

**Base URL:** `/api/itenspedido`

#### GET `/api/itenspedido/:pedido_id` – Listar itens de um pedido

- `200 OK` – array de itens.

#### POST `/api/itenspedido` – Criar item de pedido (opcional/manual)

- **Body (exemplo):**
```json
{
  "pedido_id": 1,
  "produto_id": 10,
  "quantidade": 2,
  "Preco_unitario": 199.9,
  "subtotal": 399.8
}
```
- `201 Created`.

---

### Métodos de Pagamento (`/api/paymethods`)

**Base URL:** `/api/paymethods`

#### GET `/api/paymethods` – Listar métodos de pagamento

- **Query opcional:**
  - `?usuario_id=1`
- `200 OK` – array de métodos.

#### GET `/api/paymethods/:id` – Buscar método de pagamento por ID

- `200 OK`.
- `404 Not Found`.

#### POST `/api/paymethods` – Criar método de pagamento

- **Body (exemplo PIX):**
```json
{
  "usuario_id": 1,
  "tipo": "pix",
  "chave_pix": "email@example.com",
  "padrao": true
}
```

- **Body (exemplo cartão):**
```json
{
  "usuario_id": 1,
  "tipo": "cartao_credito",
  "titular": "João da Silva",
  "numero_mascado": "**** **** **** 1234",
  "mes_validade": 12,
  "ano_validade": 2030,
  "padrao": true
}
```

- `201 Created`.

#### PUT `/api/paymethods/:id` – Atualizar método

- `200 OK`.
- `404 Not Found`.

#### DELETE `/api/paymethods/:id` – Remover método

- `204 No Content`.
- `404 Not Found`.

---

### Cupons (`/api/cupons`)

**Base URL:** `/api/cupons`

#### GET `/api/cupons` – Listar cupons

- **Query opcional:**
  - `?usuario_id=1`
- `200 OK` – array de cupons.

#### POST `/api/cupons` – Criar cupom

- **Body (exemplo):**
```json
{
  "codigo": "BLACK10",
  "descricao": "10% de desconto na Black Friday",
  "tipo": "percentual",
  "valor": 10,
  "minimo_compra": 100,
  "quantitade_total": 100,
  "usuario_id": null,
  "data_inicio": "2026-11-20T00:00:00.000Z",
  "data_fim": "2026-11-30T23:59:59.000Z",
  "ativo": true
}
```
- `201 Created`.

