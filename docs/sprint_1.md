# Sprint 1 - Configuração Inicial

**Período:** Semana 1
**Foco:** Setup do ambiente de desenvolvimento

## Tarefas

- [x] Criar repositório Git (GitHub) com README documentando o projeto
- [x] Configurar projeto Next.js com TypeScript e App Router
- [x] Instalar e configurar TailwindCSS + shadcn/ui para componentes
- [x] Configurar Fastify como servidor backend separado (pasta `/api`)
- [x] Criar endpoint de teste `GET` retornando status do servidor
- [x] Definir estrutura de pastas:
  ```
  /src                    ← Frontend Next.js
    /app                  → Páginas
    /components           → Componentes React
    /lib                  → Utilitários
    /hooks                → Custom hooks
    /contexts             → React Contexts
    /types                → TypeScript types
  /api                    ← Backend Fastify (SOLID)
    /src
      /env                → Variáveis de ambiente
      /http
        /controllers      → Controllers
      /lib                → Bibliotecas
      /repositories       → Repositórios (acesso a dados)
      /use-cases          → Casos de uso (regras de negócio)
      /utils              → Utilitários
      app.ts              → Configuração do Fastify
      server.ts           → Entry point
    tsconfig.json         → Config TypeScript
  ```
- [x] Configurar scripts no `package.json` para rodar front e back simultaneamente
- [x] Testar ambiente local: front (localhost:3000) e API (localhost:3333)
- [x] Criar `.env.example` com variáveis necessárias

## Critérios de Conclusão

- [x] Front e back rodando localmente sem erros
- [x] Endpoint de health check respondendo

---

## Resumo do que foi feito

### Repositório e Projeto

- Criado repositório no GitHub: `contos-de-festa`
- Projeto Next.js 16.1.6 com TypeScript, TailwindCSS v4 e App Router

### Frontend (pasta `/src`)

- Configurado shadcn/ui com tema Neutral
- Criada função utilitária `cn()` em `/src/lib/utils.ts`
- Estrutura de pastas preparada: `app`, `components`, `lib`, `hooks`, `contexts`, `types`

### Backend (pasta `/api`)

- Fastify configurado com CORS
- Estrutura SOLID baseada no projeto GymPass:
  - `/api/src/env` → Variáveis de ambiente
  - `/api/src/http/controllers` → Controllers
  - `/api/src/lib` → Bibliotecas
  - `/api/src/repositories` → Repositórios
  - `/api/src/use-cases` → Casos de uso
  - `/api/src/utils` → Utilitários
- Entry point: `server.ts` + `app.ts`
- Endpoint `GET /` retornando `{ status: "ok" }`

### Scripts configurados

```json
"dev": "concurrently \"npm run dev:front\" \"npm run dev:back\"",
"dev:front": "next dev --port 3000",
"dev:back": "tsx watch api/src/server.ts"
```

### Dependências instaladas

- **Frontend:** next, react, tailwindcss, shadcn/ui (clsx, class-variance-authority, tailwind-merge)
- **Backend:** fastify, @fastify/cors, @fastify/jwt, @fastify/cookie, tsx, concurrently, zod, dotenv

### Ambiente

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3333`
- Arquivo `.env.example` criado com variáveis necessárias
