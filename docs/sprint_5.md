# Sprint 5 - Backend (Auth, API, Upload) ✅ Concluído

**Foco:** CMS simples para a proprietária cadastrar kits com fotos

> **Importante:** Não é controle de estoque. O backend serve apenas para: autenticação admin, CRUD de kits/categorias/tipos e upload de imagens. Preço, disponibilidade e pagamento são tratados via WhatsApp.

## Arquitetura DDD / Clean Architecture

Camadas (de dentro pra fora):

1. **Entities** (`api/src/entities`) — modelos de domínio puros (TypeScript)
2. **Use Cases** (`api/src/use-cases`) — regras de negócio dependendo só de interfaces de repositório
3. **Repositories** (`api/src/repositories`) — interfaces + implementação Prisma (`prisma/`)
4. **Controllers** (`api/src/http/controllers`) — rotas Fastify, validação Zod, mapeamento de erros
5. **Factories** (`api/src/use-cases/factories`) — wireup das dependências para os controllers

Suporte:
- `api/src/lib/prisma.ts` — instância singleton do Prisma Client
- `api/src/lib/cloudinary.ts` — `CloudinaryService` implementando `CloudinaryProvider`
- `api/src/http/middlewares` — `verifyJwt`, `verifyAdmin`
- `api/src/env/index.ts` — validação de env com Zod
- `api/src/utils/slugify.ts` — slug normalizado com remoção de acentos
- `api/src/use-cases/errors` — erros de domínio tipados (mapeados para HTTP status nos controllers)

## Tarefas

### Entities

- [x] `User` — id, name, email, passwordHash, role
- [x] `KitType` — id, name, slug
- [x] `Category` — id, name, slug, description, icon
- [x] `Kit` — id, name, slug, description, shortDescription, price, kitTypeId, categoryId, featured
- [x] `KitImage` — id, kitId, url, publicId, alt, order, isPrimary
- [x] `KitItem` — id, kitId, name, quantity

### Use Cases

**Auth:**
- [x] `RegisterUseCase` — registro com `ADMIN_REGISTRATION_KEY`
- [x] `AuthenticateUseCase` — valida credenciais (JWT é gerado no controller)

**Kit Types:**
- [x] `CreateKitTypeUseCase`
- [x] `ListKitTypesUseCase`
- [x] `UpdateKitTypeUseCase`
- [x] `DeleteKitTypeUseCase`

**Categories:**
- [x] `CreateCategoryUseCase`
- [x] `ListCategoriesUseCase`
- [x] `UpdateCategoryUseCase`
- [x] `DeleteCategoryUseCase`

**Kits:**
- [x] `CreateKitUseCase`
- [x] `ListKitsUseCase` — filtros por tipo, categoria, featured e busca textual
- [x] `GetKitBySlugUseCase`
- [x] `UpdateKitUseCase`
- [x] `DeleteKitUseCase` — remove imagens do Cloudinary em cascata

**Images:**
- [x] `UploadKitImageUseCase` — Cloudinary, controla `isPrimary` automaticamente
- [x] `DeleteKitImageUseCase` — remove no Cloudinary
- [x] `ReorderKitImagesUseCase`

### Controllers (Rotas Fastify)

**Auth:**
- [x] `POST /auth/register`
- [x] `POST /auth/login`
- [x] `GET /auth/me` (admin) — perfil do usuário logado

**Kit Types:**
- [x] `GET /kit-types` (público)
- [x] `POST /kit-types` (admin)
- [x] `PUT /kit-types/:id` (admin)
- [x] `DELETE /kit-types/:id` (admin)

**Categories:**
- [x] `GET /categories` (público)
- [x] `POST /categories` (admin)
- [x] `PUT /categories/:id` (admin)
- [x] `DELETE /categories/:id` (admin)

**Kits:**
- [x] `GET /kits` (público, com filtros `?type=&category=&search=&featured=`)
- [x] `GET /kits/:slug` (público)
- [x] `POST /kits` (admin)
- [x] `PUT /kits/:id` (admin)
- [x] `DELETE /kits/:id` (admin)

**Images:**
- [x] `POST /kits/:id/images` (admin) — `multipart/form-data`, máx 5MB, jpeg/png/webp/avif
- [x] `DELETE /kits/:id/images/:imageId` (admin)
- [x] `PUT /kits/:id/images/reorder` (admin)

### Banco de Dados

- [x] `docker-compose.yml` com PostgreSQL 16
- [x] `api/prisma/schema.prisma` (User, KitType, Category, Kit, KitImage, KitItem)
- [x] Repositórios Prisma implementando as interfaces
- [x] Integração Cloudinary com `upload_stream`

### Middlewares e Plugins

- [x] `@fastify/jwt` — `verifyJwt` valida o Bearer token
- [x] `verifyAdmin` — bloqueia se `role !== "ADMIN"`
- [x] `@fastify/multipart` — limite de 5MB
- [x] `setErrorHandler` global — converte `ZodError` em 400 e mascara 500

## Como rodar (próximo passo prático)

```bash
# 1. Subir o Postgres
npm run db:up

# 2. Configurar .env (copiar do .env.example)
cp .env.example .env
# Preencher JWT_SECRET, ADMIN_REGISTRATION_KEY e Cloudinary

# 3. Rodar a primeira migration
npm run prisma:migrate -- --name init

# 4. Subir API + frontend
npm run dev
```

## Testes (adicionado pós-Sprint)

Suíte unitária com **Vitest + repositórios in-memory** seguindo o padrão DDD do projeto. Cobre 100% dos use cases e roda em ~870 ms.

- [x] `api/vitest.config.ts` — escopo `api/src/**/*.spec.ts`, exclusão de infra
- [x] Repositórios in-memory em `api/src/repositories/in-memory/*`
- [x] `FakeCloudinaryProvider` em `api/src/test/fakes/`
- [x] `makeKitContext` em `api/src/test/factories/`
- [x] Specs co-localizados (`*.spec.ts`) em todos os use cases (auth, kit-types, categories, kits, images) + `slugify`
- [x] Scripts `npm test`, `npm run test:watch`, `npm run test:coverage` no `package.json`

> Testes E2E dos controllers e testes de integração com banco real estão planejados para a **Sprint 8 — Refino & Qualidade**.

## Critérios de Conclusão

- [x] Entities e use cases criados e desacoplados (testáveis)
- [x] API REST completa com validação Zod e mapeamento de erros
- [x] Auth JWT funcionando (`/auth/login` retorna token)
- [x] Upload de imagens via Cloudinary com `isPrimary`/`order`
- [x] Schema Prisma com todas as tabelas e relacionamentos em cascade
- [x] Suíte unitária Vitest cobrindo 100% dos use cases

## Arquivos Criados/Modificados

| Arquivo                                                  | Ação     |
| -------------------------------------------------------- | -------- |
| `api/prisma/schema.prisma`                               | Criado   |
| `docker-compose.yml`                                     | Criado   |
| `api/src/env/index.ts`                                   | Criado   |
| `api/src/lib/prisma.ts`                                  | Criado   |
| `api/src/lib/cloudinary.ts`                              | Criado   |
| `api/src/utils/slugify.ts`                               | Criado   |
| `api/src/entities/*`                                     | Criado   |
| `api/src/repositories/*-repository.ts`                   | Criado   |
| `api/src/repositories/prisma/*`                          | Criado   |
| `api/src/use-cases/{auth,kit-types,categories,kits,images}/*` | Criado |
| `api/src/use-cases/errors/*`                             | Criado   |
| `api/src/use-cases/factories/*`                          | Criado   |
| `api/src/http/middlewares/{verify-jwt,verify-admin}.ts`  | Criado   |
| `api/src/http/controllers/**/*`                          | Criado   |
| `api/src/@types/fastify-jwt.d.ts`                        | Criado   |
| `api/src/app.ts`                                         | Reescrito |
| `api/src/server.ts`                                      | Reescrito |
| `api/tsconfig.json`                                      | Atualizado (`types: ["node"]`) |
| `package.json`                                           | Scripts `prisma:*`, `db:up/down`, `test*` |
| `.env.example`                                           | `ADMIN_REGISTRATION_KEY`, Cloudinary, NEXT_PUBLIC_WHATSAPP_NUMBER |
| `api/vitest.config.ts`                                   | Criado (pós-sprint) |
| `api/src/repositories/in-memory/*`                       | Criado (pós-sprint) |
| `api/src/test/{fakes,factories}/*`                       | Criado (pós-sprint) |
| `api/src/**/*.spec.ts`                                   | Criado (pós-sprint) |
