# DEVHUB

Marketplace SaaS em **React + Vite**, com foco em arquitetura pronta para integração com backend REST/MySQL.

## Visão geral

O DEVHUB é uma aplicação frontend para descoberta, avaliação e compra de software/SaaS.

Principais objetivos da base atual:
- código limpo e modular;
- navegação SPA com React Router;
- checkout/carrinho com estado global;
- SEO técnico por página;
- estrutura preparada para API real (`/api/*`).

## Stack

- **React 18**
- **Vite 5**
- **React Router DOM 6**
- **React Helmet Async** (SEO)

## Estrutura do projeto

```bash
.
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── checkout/
│   │   ├── EmptyState.jsx
│   │   ├── ErrorState.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── LoadingState.jsx
│   │   ├── MarketplaceFilters.jsx
│   │   └── ProductCard.jsx
│   ├── context/
│   │   └── CartContext.jsx
│   ├── data/
│   │   └── products.js
│   ├── layouts/
│   │   └── BaseLayout.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── MarketplacePage.jsx
│   │   ├── ProductPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── FavoritesPage.jsx
│   │   ├── CategoriesPage.jsx
│   │   ├── TermsPage.jsx
│   │   ├── PrivacyPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── seo/
│   │   └── Seo.jsx
│   ├── services/
│   │   ├── productService.js
│   │   ├── cartService.js
│   │   └── checkoutService.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   ├── main.jsx
│   └── routes.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Rotas principais

- `/` Home
- `/mercado` Vitrine
- `/produto/:slug` Detalhe do produto
- `/carrinho` Carrinho
- `/checkout` Pagamento
- `/login` Login
- `/cadastro` Cadastro
- `/perfil` Perfil
- `/pedidos` Pedidos
- `/favoritos` Favoritos
- `/categorias` Categorias
- `/termos` Termos
- `/privacidade` Privacidade
- `/sobre` Sobre
- `/contato` Contato
- `/404` Não encontrada

## Fluxo de carrinho e checkout

### CartContext (`src/context/CartContext.jsx`)
Centraliza:
- itens do carrinho;
- subtotal, desconto e total;
- quantidade total;
- estados de loading/erro;
- ações `loadCart`, `addToCart`, `removeFromCart`, `applyCoupon`.

### Services

#### `src/services/productService.js`
- `fetchProducts(params)`
- `fetchProductBySlug(slug)`

#### `src/services/cartService.js`
- `fetchCart()`
- `addCartItem(payload)`
- `removeCartItem(itemId)`
- `applyCoupon(code)`

#### `src/services/checkoutService.js`
- `createCheckout(payload)`
- `finalizeOrder(payload)`

> Observação: a UI está pronta para backend real. Em ausência de API, telas usam estados de erro/vazio em vez de conteúdo fictício.

## SEO técnico

- Metatags base em `index.html`;
- metadados por rota com `Seo.jsx` + `react-helmet-async`;
- `robots.txt` ativo;
- `sitemap.xml` com rotas principais.

## Padrões de UI/UX adotados

- um `h1` por página principal;
- feedback claro para loading/erro/empty/sucesso;
- checkout com validação básica de cartão;
- design responsivo (desktop e mobile);
- identidade visual consistente em `src/styles/global.css`.

## Requisitos

- Node.js 18+
- npm 9+

## Como rodar localmente

```bash
npm install
npm run dev
```

A aplicação sobe por padrão em:
- `http://localhost:5173`

## Build de produção

```bash
npm run build
npm run preview
```

## Integração esperada de API

Endpoints esperados hoje pela camada de serviços:

### Produtos
- `GET /api/products`
- `GET /api/products/:slug`

### Carrinho
- `GET /api/cart`
- `POST /api/cart/items`
- `DELETE /api/cart/items/:itemId`
- `POST /api/cart/coupon`

### Checkout
- `POST /api/checkout/create`
- `POST /api/checkout/finalize`

## Checklist rápido de qualidade

- [x] Rotas críticas com páginas reais
- [x] Sem dependência de HTML legado
- [x] Carrinho centralizado em contexto
- [x] Serviços desacoplados da UI
- [x] SEO por página
- [x] Sitemap e robots
- [x] Estados de loading/erro/empty

## Próximos passos sugeridos

1. Adicionar autenticação real (JWT/session);
2. adicionar testes (unitário + integração);
3. implementar paginação backend no marketplace;
4. registrar telemetria de erro (Sentry, por exemplo);
5. criar CI para lint/build/test automático.

---

Se quiser, na próxima etapa eu também posso entregar:
- documentação de contrato de API (OpenAPI/Swagger);
- guia de padrões de componentes;
- estratégia de versionamento e release.
