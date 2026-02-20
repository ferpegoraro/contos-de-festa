# Sprint 1 - Configuração Inicial

**Período:** 22 a 28 de fevereiro  
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
