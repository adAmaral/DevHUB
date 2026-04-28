# DevHub477 Web (Next.js 14 + App Router + JavaScript)

Projeto preparado para deploy na Vercel com App Router, APIs server-side e telas legadas preservadas.

## ✅ Status atual

- Base migrada para **JavaScript/JSX** (sem TypeScript no código-fonte).
- Rotas do App Router organizadas em `app/`.
- APIs de autenticação, marketplace e checkout em `app/api/*`.
- Contexto de carrinho client-side com persistência em localStorage.
- HTMLs legados preservados em `pages/`.
- Exemplo de marketplace em HTML/CSS/JS puro em `public/marketplace-refactor/`.

## Estrutura

```bash
.
├── app/                             # App Router (páginas e APIs)
├── components/                      # Componentes reutilizáveis
├── contexts/                        # Context API (carrinho)
├── lib/                             # Utilitários (auth, prisma, stripe, etc.)
├── pages/                           # HTMLs originais preservados
├── prisma/                          # Schema e client Prisma
├── public/assets/                   # Assets estáticos
├── public/marketplace-refactor/      # Exemplo HTML/CSS/JS puro
├── package.json
├── vercel.json
└── README.md
```

## Scripts

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Start em produção
npm run lint         # Lint do Next
npm run check:no-ts  # Verifica se restou arquivo TypeScript
```

> `postinstall` executa `prisma generate` automaticamente.

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse: `http://localhost:3000`

## Deploy na Vercel

### 1) Requisitos

- Node **20.x** (definido em `package.json -> engines`).
- Banco de dados configurado para Prisma (URL válida em `DATABASE_URL`).

### 2) Variáveis de ambiente recomendadas

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- `RESEND_API_KEY` (opcional para e-mail de confirmação)
- `ORDER_FROM_EMAIL` (opcional para e-mail de confirmação)

### 3) Passos

1. Faça push para o GitHub.
2. Importe o repositório na Vercel.
3. Framework detectado automaticamente: **Next.js**.
4. Configure as variáveis de ambiente no painel da Vercel.
5. Deploy.

## Checklist de migração para JavaScript

- [x] Sem `.ts`, `.tsx` ou `.d.ts` no projeto de runtime.
- [x] Dependências TypeScript removidas.
- [x] App Router e APIs em `.js/.jsx`.
- [x] Projeto pronto para build/deploy na Vercel com Node 20.x.
