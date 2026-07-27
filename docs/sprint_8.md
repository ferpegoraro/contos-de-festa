# Sprint 8 - Refino & Qualidade ✅ Concluído

> Itens adiados de propósito: token CSRF dedicado (mitigado por SameSite=Lax + CORS + cookie httpOnly) e `KitForm` com react-hook-form (items dinâmicos — Sprint 9). WatchedList documentado como **não aplicar** por ora.

**Foco:** Resolver dívidas técnicas pequenas que apareceram após a Sprint 5, padronizar consumo de API no frontend e fortalecer a base de testes/CI.

> **Importante:** nenhum dos itens aqui é bloqueador do MVP. São melhorias incrementais para deixar o código mais robusto antes de adicionar novas features (cursos, calendário, blog).

## Backend — Refino arquitetural

### Consistência de tipos do `Entity.id`

- [x] Decidir e padronizar como o `id` é exposto pela `Entity` — **Opção A** (mappers Prisma passam `new UniqueEntityID(record.id)`).
- [x] Atualizar todos os mappers em `api/src/repositories/prisma/mappers/*` para a opção escolhida.
- [x] Ajustar use cases que comparam `entity.id` com strings — todos usam `entity.id.toString() !== id`.
- [x] Garantir que a suíte continua passando após a refatoração.

### `KitItem` como Value Object ✅

- [x] `KitItem` agora estende `ValueObject` (`api/src/core/entities/value-object.ts`):
  - Itens não têm mais `id` exposto no domínio (nem na API/frontend).
  - Comparação por valor (`name + quantity`) via `equals()`.
  - Repositório de Kit segue sendo a única porta de entrada.
- [x] Atualizados `api/src/entities/kit-item.ts`, `KitItemMapper` (→ `toValueObject`), repositório in-memory, tipo `KitItem` do frontend e specs (`kit-item.spec.ts`).

### Padrão WatchedList — quando (não) aplicar

> **Contexto:** padrão clássico de DDD (Vaughn Vernon / material da Rocketseat) para gerenciar coleções de entidades filhas dentro de um aggregate, rastreando automaticamente itens adicionados, removidos e mantidos. Útil quando o aggregate é editado em lote e a persistência precisa fazer apenas os deltas (`createMany` nos novos, `deleteMany` nos removidos) preservando os IDs dos que não mudaram.

**Pré-requisitos para usar (todos precisam ser verdade):**

1. Existe um aggregate pai com uma coleção de entidades filhas.
2. As filhas têm **ID estável** e tabela própria.
3. A coleção é editada **em lote** (carrega o aggregate, muta a lista, salva tudo junto).
4. Importa preservar os IDs entre updates (ex.: outras tabelas referenciam, ou histórico depende deles).

Faltou algum pré-requisito → **não usa**, escolhe outra abordagem (JSONB, value object embutido, ou repositório dedicado com use cases granulares).

**Decisão atual no projeto:**

- ❌ **`KitImage`** — não aplicar. Já tem repositório próprio (`kit-images-repository.ts`) e use cases granulares (`upload`, `delete`, `reorder`). Cada operação é atômica e envolve I/O externo (Cloudinary). Forçar WatchedList aqui adiciona indireção sem ganho.
- ❌ **`KitItem` (hoje)** — não aplicar. Items são simples (`{ name, quantity }`), não têm referências externas e o "deletar tudo e recriar" no update é aceitável. O caminho coerente agora é o item acima ("`KitItem` como Value Object").
- ⚠️ **Revisitar se:** items passarem a ter referências de fora (FKs apontando), histórico de mudanças virar requisito, ou aparecer outra coleção filha (ex.: `KitAddon`, `KitVariant`) editada em batch com IDs estáveis.

**Tarefas (caso o gatilho dispare no futuro):**

- [ ] Criar `api/src/core/entities/watched-list.ts` com a classe abstrata genérica (`add`, `remove`, `update`, `getNewItems`, `getRemovedItems`, `getItems`).
- [ ] Trocar `images: KitImage[]` / `items: KitItem[]` na entity afetada por `WatchedList<T>`.
- [ ] Ajustar o repositório Prisma do aggregate para persistir só os deltas no `update`.
- [ ] Atualizar use cases que mutam a coleção para usar a API da WatchedList em vez de array nativo.

### Composition Root

- [x] Avaliar cachear repositórios nos `factories/*` — implementado em `api/src/use-cases/factories/repositories.ts` com singleton lazy + `setContainerOverrides`/`resetContainer` para testes.

## Backend — Testes & CI

> Setup de Vitest + repositórios in-memory + suíte de use cases foi adicionado fora da Sprint 5. Esta seção é o complemento.

- [x] Adicionar testes E2E para os controllers Fastify (com `app.inject()`):
  - [x] `POST /auth/login` retorna 200 + token + cookie httpOnly
  - [x] Rotas admin retornam 401 sem JWT e 403 sem role ADMIN
  - [x] `POST /kits` com `kitTypeId` inexistente → 404
  - [x] `POST /kit-types` com slug duplicado → 409
- [x] Adicionar testes de integração com banco real para os `Prisma*Repository` — schema Postgres efêmero por execução (`api/vitest.integration.config.ts` + `api/src/test/setup-integration.ts` + `prisma-repositories.int-spec.ts`, 12 testes). Roda com `npm run test:integration` (requer `npm run docker:up`).
- [x] Configurar GitHub Actions com test + typecheck (front e back) + lint em cada PR/push — job `integration` com Postgres service adicionado ao CI.
- [x] (Opcional) Adicionar `husky` + `lint-staged` — pre-commit roda `eslint --fix` nos arquivos staged.

## Frontend — Padrão de consumo da API

Hoje as páginas misturam render + `fetch` + estados de loading/erro. Antes da Sprint 6 crescer, vale padronizar.

- [x] **SWR** adotado nos hooks `src/hooks/api/*`.
- [x] Hooks tipados (`useKits(filters)`, `useKitBySlug(slug)`, `useCategories()`, `useKitTypes()`).
- [x] `src/lib/api/client.ts` centralizado, usando cookie httpOnly via `credentials: 'include'`.
- [x] Páginas públicas (`/kits`, `/kits/[slug]`, `/categorias`) consomem só hooks SWR.
- [x] Mutations admin (`createKit`, `updateKit`, etc.) revalidam automaticamente via `mutate()`.

## Frontend — Robustez

- [x] Adicionar `Error Boundary` (`src/app/error.tsx` + `src/app/admin/error.tsx`).
- [x] Padronizar componentes de loading: `CategoryGridSkeleton` (público) e `TableSkeleton` (tabelas do admin: kits, categorias e tipos) substituíram os spinners centrais.
- [x] **Sonner** instalado e Toaster registrado no root layout.
- [x] **react-hook-form + Zod** em `CategoryForm` e `KitTypeForm` (KitForm fica para sprint 9 — items dinâmicos).
- [x] `ConfirmDialog` substituiu `window.confirm` em `categories`, `kit-types`, `kits` e `image-upload` via hook `useConfirm()`.

## Auth — Migrar de localStorage para cookie httpOnly

> Hoje o JWT é guardado no `localStorage` (vulnerável a XSS). Para produção é recomendado migrar para cookie `httpOnly` + proteção CSRF.

- [x] Backend emite JWT como cookie `httpOnly`, `Secure` (em prod), `SameSite=Lax` no `/auth/login`.
- [x] `verifyJwt` lê de cookie OU header (`@fastify/jwt` configurado com `cookie.cookieName: "contos_token"`).
- [x] `POST /auth/logout` limpa o cookie.
- [ ] Token CSRF dedicado — não implementado (proteção atual: SameSite=Lax + CORS restrito + cookie httpOnly). Adicionar token CSRF em sprint futura se necessário.
- [x] Frontend removeu `getStoredToken/setStoredToken`; usa `credentials: "include"`.
- [x] `AuthContext` consulta `/auth/me` no boot; `login()/logout()` apenas atualizam estado local.
- [x] Testes E2E cobrem cookie httpOnly, login/logout e verificação de role.

## Documentação

- [x] `README.md` atualizado com setup, estrutura de pastas, criar primeiro admin via curl, comandos de teste/lint.
- [x] Diagrama de camadas (Mermaid) incluído no README.

## Critérios de Conclusão

- [x] `entity.id` tem tipo consistente entre runtime e TypeScript em todos os lugares.
- [x] Suíte de testes verde no CI a cada push (unit + e2e + integração com Postgres).
- [x] Frontend consome API só via hooks tipados — sem `fetch` solto em página.
- [x] JWT em cookie `httpOnly`; `localStorage` deixa de armazenar token (CSRF mitigado por SameSite=Lax + CORS; token dedicado adiado).
- [x] Toda confirmação de exclusão usa `ConfirmDialog` (zero `window.confirm`).
- [x] README explica como rodar e como contribuir.

## Arquivos esperados

| Arquivo                                        | Ação     |
| ---------------------------------------------- | -------- |
| `api/src/repositories/prisma/mappers/*`        | Refatorado |
| `api/src/core/entities/entity.ts`              | Refatorado (se opção B) |
| `api/src/entities/kit-item.ts`                 | Refatorado |
| `api/src/use-cases/factories/*`                | Singletons cacheados |
| `api/src/http/**/*.e2e-spec.ts`                | Criado   |
| `.github/workflows/ci.yml`                     | Criado   |
| `src/hooks/api/*`                              | Criado   |
| `src/lib/api/client.ts`                        | Criado   |
| `src/app/(public)/**`                          | Migrado para hooks |
| `README.md`                                    | Atualizado |
