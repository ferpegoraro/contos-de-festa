# Sprint 1 - Configuração Inicial ✅

**Foco:** Setup do ambiente de desenvolvimento e estrutura do projeto

## Tarefas

### Repositório e Projeto

- [x] Criar repositório Git no GitHub (`contos-de-festas`)
- [x] Inicializar projeto Next.js 16.1.6 com TypeScript e App Router
- [x] Configurar `lang="pt-BR"` no HTML root

### Estilização e UI

- [x] Instalar e configurar TailwindCSS v4 com `@tailwindcss/postcss`
- [x] Instalar shadcn/ui (tema Neutral) + dependências (`clsx`, `tailwind-merge`, `class-variance-authority`, `radix-ui`)
- [x] Criar utilitário `cn()` em `src/lib/utils.ts` para merge de classes
- [x] Instalar `tw-animate-css` para animações
- [x] Instalar `lucide-react` para ícones
- [x] Instalar `framer-motion` para animações avançadas

### Backend (Fastify)

- [x] Configurar Fastify v5 como servidor backend separado (`/api`)
- [x] Registrar `@fastify/cors` com origin configurável via `FRONTEND_URL`
- [x] Instalar `@fastify/jwt` e `@fastify/cookie` (preparação para auth futura)
- [x] Criar endpoint health check `GET /` retornando `{ status: "ok" }`
- [x] Entry point `server.ts` escutando em `0.0.0.0:3333`
- [x] Instalar `zod` para validação de dados

### Estrutura de Pastas

- [x] Definir e criar estrutura de pastas do frontend e backend

```
/src                        ← Frontend Next.js
  /app                      → Páginas (App Router)
    layout.tsx              → Layout root
    page.tsx                → Página inicial
    globals.css             → Estilos globais
  /components
    /layout                 → Header, Footer, ConditionalFooter
    /shared                 → Componentes reutilizáveis (WhatsAppFab)
  /constants                → Configurações centralizadas
  /lib                      → Utilitários (cn)
  /hooks                    → Custom hooks (futuro)
  /contexts                 → React Contexts (futuro)
  /types                    → TypeScript types (futuro)

/api                        ← Backend Fastify (SOLID)
  /src
    app.ts                  → Configuração do Fastify + CORS
    server.ts               → Entry point do servidor
    /env                    → Variáveis de ambiente (futuro)
    /http/controllers       → Controllers (futuro)
    /repositories           → Repositórios (futuro)
    /use-cases              → Casos de uso (futuro)
```

### Scripts e Ambiente

- [x] Instalar `concurrently` para rodar front e back simultaneamente
- [x] Instalar `tsx` para executar TypeScript no backend
- [x] Configurar scripts no `package.json`:
  - `dev` → roda front e back juntos via `concurrently`
  - `dev:front` → `next dev --port 3000`
  - `dev:back` → `tsx watch api/src/server.ts`
  - `build` → `next build`
  - `start` → `next start`
  - `lint` → `eslint`
- [x] Criar `.env.example` com variáveis necessárias
- [x] Configurar `babel-plugin-react-compiler` (React 19)

## Critérios de Conclusão

- [x] Frontend rodando em `http://localhost:3000` sem erros
- [x] Backend rodando em `http://localhost:3333` sem erros
- [x] Endpoint health check `GET /` respondendo `{ status: "ok" }`
- [x] Comando `npm run dev` inicia ambos simultaneamente

## Resumo Técnico

| Dependência                  | Versão   | Propósito                      |
| ---------------------------- | -------- | ------------------------------ |
| next                         | 16.1.6   | Framework frontend             |
| react / react-dom            | 19.2.3   | UI library                     |
| typescript                   | ^5       | Tipagem estática               |
| tailwindcss                  | ^4       | Estilização utility-first      |
| shadcn                       | ^3.8.5   | Componentes UI                 |
| radix-ui                     | ^1.4.3   | Primitivos de acessibilidade   |
| class-variance-authority     | ^0.7.1   | Variantes de componentes       |
| clsx + tailwind-merge        | —        | Merge de classes CSS            |
| lucide-react                 | ^0.575.0 | Biblioteca de ícones           |
| framer-motion                | ^12.36.0 | Animações                      |
| fastify                      | ^5.7.4   | Framework backend              |
| @fastify/cors                | ^11.2.0  | CORS                           |
| @fastify/jwt                 | ^10.0.0  | Autenticação JWT (futuro)      |
| @fastify/cookie              | ^11.0.2  | Cookies (futuro)               |
| zod                          | ^4.3.6   | Validação de schemas           |
| dotenv                       | ^17.3.1  | Variáveis de ambiente          |
| concurrently                 | ^9.2.1   | Scripts paralelos              |
| tsx                          | ^4.21.0  | Execução TypeScript (backend)  |
| tw-animate-css               | ^1.4.0   | Animações CSS                  |
| babel-plugin-react-compiler  | 1.0.0    | React Compiler                 |
