# Sprint 1 - Configuração Inicial

**Período:** Semana 1  
**Foco:** Setup do ambiente de desenvolvimento

## Tarefas

- [x] Criar repositório Git (GitHub) com README documentando o projeto
- [x] Configurar projeto Next.js com TypeScript e App Router
- [x] Instalar e configurar TailwindCSS + shadcn/ui para componentes
- [x] Configurar Fastify como servidor backend separado (pasta `/api`)
- [x] Criar endpoint de teste `GET /` retornando status do servidor
- [x] Definir estrutura de pastas do frontend e backend
- [x] Configurar scripts no `package.json` para rodar front e back simultaneamente
- [x] Testar ambiente local: front (localhost:3000) e API (localhost:3333)
- [x] Criar `.env.example` com variáveis necessárias

## Estrutura de Pastas

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
    /http/controllers   → Controllers
    /lib                → Bibliotecas
    /repositories       → Repositórios
    /use-cases          → Casos de uso
    /utils              → Utilitários
    app.ts              → Configuração do Fastify
    server.ts           → Entry point
```

## Critérios de Conclusão

- [x] Front e back rodando localmente sem erros
- [x] Endpoint de health check respondendo

---

## Resumo do que foi feito

- Repositório criado no GitHub: `contos-de-festa`
- Next.js 16.1.6 com TypeScript, TailwindCSS v4 e App Router
- shadcn/ui configurado com tema Neutral
- Fastify configurado com CORS e estrutura SOLID
- Frontend em `http://localhost:3000`, Backend em `http://localhost:3333`
- Scripts com `concurrently` para rodar front e back juntos
- Dependências: next, react, tailwindcss, shadcn/ui, fastify, @fastify/cors, @fastify/jwt, @fastify/cookie, tsx, zod, dotenv
