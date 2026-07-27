# Sprint 7 - Integração + Hardening + Deploy 🟡 Falta apenas o deploy

**Foco:** Conectar o site público à API, fechar buracos de segurança que bloqueiam produção e colocar o site no ar.

> **Status:** todo o código está pronto. Restam apenas as etapas de **deploy** (Vercel + Railway/Render), que serão feitas em conjunto, e o teste em celular físico.

## Tarefas

### Integração

- [x] Conectar catálogo público (`/kits`) com API
- [x] Conectar seções da landing page (kits em destaque, categorias) com API
- [x] Testar fluxo completo: admin cria kit → aparece no catálogo público (testado via API em 03/06/2026: register → login → cria categoria/tipo/kit com itens → kit visível em `GET /kits` público e em `/kits/:slug`)

### Hardening de Segurança (bloqueadores de produção)

> Estes itens **devem entrar antes do deploy**. Sem eles o serviço fica exposto a ataques triviais.

- [x] **Rate limit no `/auth/login` e `/auth/register`** — instalar `@fastify/rate-limit`, limitar a ~10 req/min por IP nessas rotas. Sem isso, força bruta passa.
- [x] **Política de senha mínima mais forte** no `RegisterUseCase` e no schema do controller (≥10 chars + ao menos 1 número, por exemplo). Hoje só exige 8 chars.
- [x] **Logging estruturado** — habilitar pino com nível por env (`logger: { level: 'info' }` em prod, `'debug'` em dev) e correlation id por request. Fastify já tem pino embutido, só não está configurado.
- [x] **Validação dos envs do frontend** com Zod (espelhando `api/src/env/index.ts`) em `src/lib/env.ts`. Hoje o backend valida, o frontend não.
- [x] **CORS restrito por ambiente** — `origin` aceita string única em dev (`localhost:3000`) e a URL pública em prod (`FRONTEND_URL`). Confirmar que está usando `env.FRONTEND_URL` e não `*`.
- [x] **Headers de segurança** — registrar `@fastify/helmet` com defaults (CSP, HSTS, X-Frame-Options).
- [x] **Mensagem genérica em `/auth/login` falho** — hoje retorna "Credenciais inválidas." (já bom). Confirmar que **não vaza** se o email existe.

### Deploy Frontend (Vercel) — ⏳ a fazer em conjunto

- [ ] Criar projeto na Vercel
- [ ] Configurar variáveis de ambiente
- [ ] Configurar domínio personalizado (se tiver)
- [x] Testar build de produção (`next build` passa — 15 rotas geradas)

> Preparação de código concluída: proxy `/api` opcional (`API_PROXY_TARGET`), `npm run start:back`, `npm run prisma:deploy`. Passo a passo completo em [deploy.md](./deploy.md).

### Deploy Backend (Railway ou Render) — ⏳ a fazer em conjunto

- [ ] Criar projeto no serviço escolhido
- [ ] Configurar PostgreSQL em produção
- [ ] Configurar variáveis de ambiente
- [ ] Rodar migrations em produção
- [ ] Criar primeiro admin

### Polimento

- [x] Loading states em botões e páginas
- [x] Mensagens de erro amigáveis
- [x] SEO: meta tags, Open Graph, título por página
- [x] Favicon e ícones — gerados a partir da logo (`src/app/favicon.ico`, `icon.png`, `apple-icon.png`)
- [x] Página 404 personalizada
- [ ] Testar em mobile (iOS e Android) — ⏳ fazer no celular após o deploy

### Documentação

- [x] README atualizado (feito na Sprint 8)
- [x] Guia simples para a proprietária usar o painel — `docs/guia_admin.md`

## Critérios de Conclusão

- [ ] Site acessível via URL pública — ⏳ depende do deploy
- [ ] API respondendo em produção — ⏳ depende do deploy
- [x] Admin consegue gerenciar kits e fotos (validado localmente)
- [x] Catálogo público com WhatsApp funcionando (número real configurado)
- [x] Site bonito em desktop e mobile (responsivo; falta só validar em aparelho físico)
- [x] `/auth/login` com rate limit e logs estruturados
- [x] Helmet ativo, CORS restrito ao domínio público
