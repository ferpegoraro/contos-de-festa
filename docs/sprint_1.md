# Sprint 1 - Configuração Inicial

**Período:** 22 a 28 de fevereiro  
**Foco:** Setup do ambiente de desenvolvimento

## Tarefas

- [x] Criar repositório Git (GitHub) com README documentando o projeto
- [ ] Configurar projeto Next.js com TypeScript e App Router
- [ ] Instalar e configurar TailwindCSS + shadcn/ui para componentes
- [ ] Configurar Fastify como servidor backend separado (pasta `/api` ou `/server`)
- [ ] Criar endpoint de teste `GET /api/health` retornando status do servidor
- [ ] Definir estrutura de pastas:
  ```
  /src
    /app          → Páginas Next.js
    /components   → Componentes React
    /lib          → Utilitários
  /server
    /routes       → Rotas Fastify
    /plugins      → Plugins Fastify
    /schemas      → Validações
  ```
- [ ] Configurar scripts no `package.json` para rodar front e back simultaneamente
- [ ] Testar ambiente local: front (localhost:3000) e API (localhost:3001)
- [ ] Criar `.env.example` com variáveis necessárias

## Critérios de Conclusão

- [ ] Front e back rodando localmente sem erros
- [ ] Endpoint de health check respondendo
